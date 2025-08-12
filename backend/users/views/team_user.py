import json
from typing import Any, Dict

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import Http404, HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import InertiaResponse, inertia
from inertia import render as inertia_render
from paul.display import format_dates as display_dates
from paul.display.build_url import build_ngohub_url

from users.forms import ChangeRoleForm
from users.models import RoleChoices, User

PAGE_TABS = {
    "info": {
        "label": _("Info"),
        "value": "info",
    },
    "role": {
        "label": _("User Role"),
        "value": "role",
    },
    "permissions": {
        "label": _("Permissions"),
        "value": "permissions",
    },
    "activity-log": {
        "label": _("Activity Log"),
        "value": "activity-log",
    },
}


def _get_requested_user(user_id: str) -> User:
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise Http404(_("User not found."))

    if not user:
        raise PermissionDenied(_("User not found."))

    return user


def _get_base_page_props(user: User) -> Dict:
    subtitle_text = _("This user has access to Paul. You can change access options from NGO Hub")
    subtitle_cta_text = _("(Manage access)")
    subtitle_cta_url = build_ngohub_url()
    subtitle = f"""{subtitle_text}
        <a href="{subtitle_cta_url}" target="_blank" rel="noopener noreferrer">
            {subtitle_cta_text}
        </a>"""

    user_name: str = user.first_name
    if user.last_name:
        user_name = f"{user_name} {user.last_name}"

    tabs = [
        PAGE_TABS["info"],
        PAGE_TABS["role"],
        PAGE_TABS["permissions"],
        PAGE_TABS["activity-log"],
    ]

    page_props = {
        "title": _("User: %s") % user_name,
        "description": subtitle,
        "baseUrl": reverse("users:manage-user", kwargs={"user_id": user.id}),
        "breadcrumbs": [
            {"label": _("Team"), "url": reverse("users:manage-team")},
            {"label": user_name},
        ],
        "tabs": tabs,
    }

    return page_props


@login_required
@cache_control(private=True)
@inertia("users/team-user/info")
def manage_user_info(request: HttpRequest, user_id: str) -> InertiaResponse:
    """
    Redirect to manage_user view for user info
    """
    user = _get_requested_user(user_id=user_id)
    page_props: Dict[str, Any] = {
        **PAGE_TABS["info"],
        "props": [
            {
                "label": _("Name"),
                "value": f"{user.first_name} {user.last_name}" if user.last_name else user.first_name,
            },
            {
                "label": _("Email"),
                "value": user.email,
            },
            {
                "label": _("Phone"),
                "value": "user.phone",
            },
            {
                "label": _("Last Activity"),
                "value": display_dates.short_datetime(user.last_login),
            },
            {
                "label": _("Added Since"),
                "value": display_dates.short_date(user.date_joined),
            },
        ],
    }

    page_props.update(_get_base_page_props(user=user))
    page_props["breadcrumbs"].append(
        {
            "label": PAGE_TABS["info"]["label"],
            "url": reverse("users:manage-user-info", kwargs={"user_id": user_id}),
        }
    )

    return inertia_render(
        request,
        "users/team-user/info",
        props=page_props,
    )


@login_required
@cache_control(private=True)
@inertia("users/team-user/role")
def manage_user_role(request: HttpRequest, user_id: str) -> InertiaResponse:
    """
    Redirect to manage_user view for user role
    """
    user = _get_requested_user(user_id=user_id)
    if request.method == "POST":
        if user.main_role in (RoleChoices.SUPER_ADMIN, RoleChoices.SUPPORT_ADMIN):
            raise PermissionDenied(_("You cannot change the role of this user."))

        form = ChangeRoleForm(json.loads(request.body), instance=user)
        if not form.is_valid():
            return inertia_render(
                request,
                "users/team-user/role",
                props={
                    **PAGE_TABS["role"],
                    "errors": form.errors,
                },
            )
        user = form.save()
        user.refresh_groups_after_main_role_update()

    roles = []
    for role in settings.USER_GROUPS:
        roles.append(
            {
                "value": role,
                "label": settings.USER_GROUPS[role]["label"],
                "disabled": not settings.USER_GROUPS[role]["is_assignable_by_ngo_user"],
                "description": settings.USER_GROUPS[role].get("description", ""),
            }
        )

    if not settings.USER_GROUPS.get(user.main_role)["is_assignable_by_ngo_user"]:
        for role in roles:
            if role["value"] != user.main_role:
                role["disabled"] = True
            else:
                role["disabled"] = False
                role["description"] = (_("This user can't be assigned to any other role."), " ", role["description"])

    page_props: Dict[str, Any] = {
        **PAGE_TABS["role"],
        "userRole": user.main_role,
        "roles": roles,
    }

    page_props.update(_get_base_page_props(user=user))
    page_props["breadcrumbs"].append(
        {
            "label": PAGE_TABS["role"]["label"],
            "url": reverse("users:manage-user-role", kwargs={"user_id": user_id}),
        }
    )

    return inertia_render(
        request,
        "users/team-user/role",
        props=page_props,
    )


@login_required
@cache_control(private=True)
@inertia("users/team-user/permissions")
def manage_user_permissions(request: HttpRequest, user_id: str) -> InertiaResponse:
    """
    Redirect to manage_user view for user permissions
    """
    user = _get_requested_user(user_id=user_id)
    page_props: Dict[str, Any] = {
        **PAGE_TABS["permissions"],
        "table": {
            "totalItems": 100,
            "totalPages": 10,
            "header": [
                {
                    "label": _("Entity"),
                    "value": "entity",
                },
                {
                    "label": _("Type"),
                    "value": "entity_type",
                },
                {
                    "label": _("Permission"),
                    "value": "permission",
                },
            ],
            "items": [],
        },
    }

    page_props.update(_get_base_page_props(user=user))
    page_props["breadcrumbs"].append(
        {
            "label": PAGE_TABS["permissions"]["label"],
            "url": reverse("users:manage-user-permissions", kwargs={"user_id": user_id}),
        }
    )

    return inertia_render(
        request,
        "users/team-user/permissions",
        props=page_props,
    )


@login_required
@cache_control(private=True)
@inertia("users/team-user/activity-log")
def manage_user_activity_log(request: HttpRequest, user_id: str) -> InertiaResponse:
    """
    Redirect to manage_user view for user activity log
    """
    user = _get_requested_user(user_id=user_id)
    page_props: Dict[str, Any] = {
        **PAGE_TABS["activity-log"],
        "table": {
            "totalItems": 100,
            "totalPages": 10,
            "header": [
                {
                    "label": _("Action"),
                    "value": "action",
                },
                {
                    "label": _("Date"),
                    "value": "date",
                },
            ],
            "items": [],
        },
    }

    page_props.update(_get_base_page_props(user=user))
    page_props["breadcrumbs"].append(
        {
            "label": PAGE_TABS["activity-log"]["label"],
            "url": reverse("users:manage-user-activity-log", kwargs={"user_id": user_id}),
        }
    )

    return inertia_render(
        request,
        "users/team-user/activity-log",
        props=page_props,
    )
