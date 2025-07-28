from typing import Dict, List

from django.contrib.auth.decorators import login_required
from django.core.paginator import Page
from django.http import HttpRequest, JsonResponse
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from django.views.decorators.http import require_GET
from inertia import InertiaResponse, inertia
from inertia import render as inertia_render

from paul.constants.query_params import PAGE, PAGE_SIZE, SEARCH
from paul.display import format_dates as display_dates
from paul.display.build_url import build_ngohub_url
from paul.views.pagination import paginate_queryset
from paul.views.search import search
from users.models import User


def _serialize_users(users_page: Page[User], user_id: int) -> List[Dict]:
    return [
        {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "is_current_user": user.id == user_id,
            "role": "Not implemented",
            "added_since": display_dates.short_date(user.date_joined),
            "last_activity": display_dates.short_datetime(user.date_joined),
        }
        for user in users_page
    ]


def _request_users(request):
    search_query = request.GET.get(SEARCH, "").strip()
    page_number = int(request.GET.get(PAGE, 1))
    page_size = request.GET.get(PAGE_SIZE, 10)

    users_qs = User.objects.all()
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

    return_props = {
        "title": _("Team members"),
        "description": subtitle,
        "breadcrumbs": [
            {"label": _("Team"), "url": reverse("users:manage-team")},
        ],
    }
    return_props.update(_request_users(request))

    return inertia_render(
        request,
        "users/team/index",
        props=return_props,
    )
