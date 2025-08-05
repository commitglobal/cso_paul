import json
import logging
from typing import Dict, List

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.core.paginator import Page
from django.http import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import InertiaResponse, inertia
from inertia import render as inertia_render
from paul.common.sort_parser import parse_order_parameter
from paul.display import format_dates as display_dates
from paul.display.build_url import build_ngohub_url
from paul.views.pagination import paginate_queryset
from paul.views.search import search

from users.models import RoleChoices, User
from users.forms import AddTeamUserForm


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
        "user_count": users_qs.count(),
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

    return_props = {
        "title": _("Team members"),
        "description": subtitle,
        "breadcrumbs": [
            {"label": _("Team"), "url": reverse("users:manage-team")},
        ],
        "permissions": {
            "team_add_user": has_add_permission,
        },
    }

    if request.method == "POST":
        if not has_add_permission:
            raise PermissionDenied()

        print("POST new team user")
        form = AddTeamUserForm(json.loads(request.body))
        print("Checking if the form is valid")
        if not form.is_valid():
            print("The form is not valid")
            return_props.update(
                {
                    "errors": {"team": form.errors},
                }
            )
        else:
            print("The form is valid")
        print("Saving the form")
        form.save()

    return_props.update(_request_users(request))

    return inertia_render(
        request,
        "users/team/index",
        props=return_props,
    )
