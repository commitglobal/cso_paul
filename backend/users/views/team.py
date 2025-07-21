from django.contrib.auth.decorators import login_required
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
    users = User.objects.all()

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
                for user in users
            ],
        },
    )
