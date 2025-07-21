from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpRequest
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import InertiaResponse, inertia
from inertia import render as inertia_render

from paul.display import format_dates as display_dates
from paul.display.build_url import build_ngohub_url
from users.models import User


@login_required
@cache_control(private=True)
@inertia("users/team/index")
def manage_team(request: HttpRequest) -> InertiaResponse:
    """
    Manage the user team
    """
    users_qs = User.objects.all()
    page_number = request.GET.get("page", 1)
    paginator = Paginator(users_qs, 12)

    try:
        users_page = paginator.page(page_number)
    except PageNotAnInteger:
        users_page = paginator.page(1)
    except EmptyPage:
        users_page = paginator.page(paginator.num_pages)

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

    return inertia_render(
        request,
        "users/team/index",
        props={
            "title": _("Team members"),
            "description": subtitle,
            "user_count": users_qs.count(),
            "users": [
                {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "is_current_user": user.id == request.user.id,
                    "role": "Not implemented",
                    "added_since": display_dates.short_date(user.date_joined),
                    "last_activity": display_dates.short_datetime(user.date_joined),
                }
                for user in users_page
            ],
            "pagination": {
                "has_next": users_page.has_next(),
                "has_previous": users_page.has_previous(),
                "num_pages": paginator.num_pages,
                "current_page": users_page.number,
                "next_page_number": users_page.next_page_number() if users_page.has_next() else None,
                "previous_page_number": users_page.previous_page_number() if users_page.has_previous() else None,
                "total_items": paginator.count,
                "per_page": paginator.per_page,
            },
        },
    )
