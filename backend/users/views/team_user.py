from typing import Dict

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

from users.models import User


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
        {
            "label": _("Info"),
            "value": "info",
        },
        {
            "label": _("Permissions"),
            "value": "permissions",
        },
        {
            "label": _("Activity Log"),
            "value": "activity-log",
        },
    ]

    page_props = {
        "title": user_name,
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
    page_props = {
        "value": "info",
        "label": _("User Details"),
        "props": [
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
        {"label": _("Info"), "url": reverse("users:manage-user-info", kwargs={"user_id": user_id})}
    )

    return inertia_render(
        request,
        "users/team-user/info",
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
    page_props = {
        "value": "permissions",
        "label": _("Permissions"),
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
        {"label": _("Permissions"), "url": reverse("users:manage-user-permissions", kwargs={"user_id": user_id})}
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
    page_props = {
        "value": "activity-log",
        "label": _("Activity Log"),
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
        {"label": _("Activity Log"), "url": reverse("users:manage-user-activity-log", kwargs={"user_id": user_id})}
    )

    return inertia_render(
        request,
        "users/team-user/activity-log",
        props=page_props,
    )
