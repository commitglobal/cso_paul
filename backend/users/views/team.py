import json
import logging
from typing import Dict, List

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.core.paginator import Page
from django.http import Http404, HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import InertiaResponse, inertia
from inertia import render as inertia_render
from paul.common.sort_parser import parse_order_parameter
from paul.display import format_dates as display_dates
from paul.display.build_url import build_ngohub_url
from paul.views.filtering import FilterField, FilterItem, Filters, filter_qs
from paul.views.pagination import paginate_queryset
from paul.views.search import search

from users.forms import AddTeamUserForm
from users.models import RoleChoices, User

logger = logging.getLogger(__name__)


def _serialize_users(users_page: Page[User], user_id: int) -> List[Dict]:
    return [
        {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "is_current_user": user.id == user_id,
            "role": RoleChoices(user.main_role).label,
            "added_since": display_dates.short_date(user.date_joined),
            "last_activity": display_dates.short_datetime(user.last_login),
        }
        for user in users_page
    ]


def _get_filter_options() -> Filters:
    role_options = FilterField(
        kind="combobox",
        items=[FilterItem(value=key, label=str(label)) for key, label in settings.USER_GROUPS_CHOICES],
    )

    added_since_options = FilterField(
        kind="calendar",
        items=[],
    )

    last_activity_options = FilterField(
        kind="calendar",
        items=[],
    )

    return Filters(
        role=role_options,
        added_since=added_since_options,
        added_since__lte=added_since_options,
        added_since__gte=added_since_options,
        last_activity=last_activity_options,
        last_activity__lte=last_activity_options,
        last_activity__gte=last_activity_options,
    )


def _request_users(request):
    search_query = request.GET.get(settings.QUERY_PARAMS["SEARCH"], "").strip()
    page_number = int(request.GET.get(settings.QUERY_PARAMS["PAGE"], 1))
    page_size = request.GET.get(settings.QUERY_PARAMS["PAGE_SIZE"], 10)
    sort = request.GET.get(settings.QUERY_PARAMS["SORT"], None)

    users_qs = User.objects.all()

    field_mapping = {
        "user": ["first_name", "last_name", "email"],
        "role": "main_role",
        "added_since": "date_joined",
        "last_activity": "last_login",
    }
    parsed_parameters = parse_order_parameter(sort, field_mapping)
    users_qs = users_qs.order_by(*parsed_parameters)

    if search_query:
        users_qs = search(
            query=search_query,
            queryset=users_qs,
            language_code=request.LANGUAGE_CODE,
            search_fields=["first_name", "last_name", "email"],
        )

    filters = _get_filter_options()
    users_qs = filter_qs(field_mapping, filters, request, users_qs)

    users_page, paginator, pagination = paginate_queryset(
        queryset=users_qs,
        page_number=page_number,
        page_size=page_size,
        page_serializer=_serialize_users,
        serializer_kwargs={"user_id": request.user.id},
    )

    data = {
        "users": users_page,
        "search_query": search_query,
        "pagination": pagination.model_dump(),
        "filters": filters.model_dump(mode="json"),
    }

    return data


@login_required
@cache_control(private=True)
@inertia("users/team/index")
def manage_team(request: HttpRequest) -> InertiaResponse:
    """
    Manage the user team
    """
    subtitle_text = _(
        "This is the list of users in your organization who have access to Paul. "
        "You can change access options from NGO Hub"
    )
    subtitle_cta_text = _("(Manage access)")
    subtitle_cta_url = build_ngohub_url()
    subtitle = f"""{subtitle_text}
        <a href="{subtitle_cta_url}" target="_blank" rel="noopener noreferrer">
            {subtitle_cta_text}
        </a>"""

    has_add_permission = request.user.has_perm("users.add_user")

    page_props = {
        "title": _("Team members"),
        "description": subtitle,
        "breadcrumbs": [
            {"label": _("Team"), "url": reverse("users:manage-team")},
        ],
        "permissions": {
            "team_add_user": has_add_permission,
        },
        "role_choices": RoleChoices.label_value_choices(),
        "is_ngohub_auth_enabled": settings.ENABLE_NGOHUB_AUTH,
        "is_email_auth_enabled": settings.ENABLE_EMAIL_AUTH,
    }

    if request.method == "POST":
        if not has_add_permission:
            raise PermissionDenied()

        form = AddTeamUserForm(json.loads(request.body))
        if not form.is_valid():
            page_props.update(
                {
                    "errors": {"team": form.errors},
                }
            )
        else:
            form.save()

    page_props.update(_request_users(request))

    return inertia_render(
        request,
        "users/team/index",
        props=page_props,
    )


@login_required
@cache_control(private=True)
@inertia("users/team-user/index")
def manage_user(request: HttpRequest, user_id: str) -> InertiaResponse:
    """
    Manage a specific user in the team
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise Http404(_("User not found."))

    if not user:
        raise PermissionDenied(_("User not found."))

    if request.method == "POST":
        if not request.user.has_perm("users.change_user"):
            raise PermissionDenied()

        form = AddTeamUserForm(json.loads(request.body), instance=user)
        if not form.is_valid():
            return inertia(
                request,
                "users/team/index",
                props={
                    "errors": {"team": form.errors},
                },
            )
        else:
            form.save()

    return inertia_render(
        request,
        "users/team/manage_user",
        props={
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "role": RoleChoices(user.main_role).label,
            },
        },
    )
