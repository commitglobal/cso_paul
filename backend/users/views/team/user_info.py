from typing import Tuple

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia
from pydantic import BaseModel

from paul.display import format_dates as display_dates
from paul.views.data_model import Breadcrumb, serialize_page_props_decorator
from users.views.team.data_model import UserPageProps
from users.views.team.user import (
    PAGE_TABS,
    PAGE_TABS_TUPLE,
    get_base_url,
    get_breadcrumbs,
    get_description,
    get_title,
    get_user,
)


class UserProperty(BaseModel):
    label: str
    value: str


class UserInfoPageProps(UserPageProps):
    props: tuple[UserProperty, ...]


@login_required
@cache_control(private=True)
@inertia("users/team-user/info")
@serialize_page_props_decorator
def manage_user_info(__: HttpRequest, user_id: int) -> UserInfoPageProps:
    """
    Redirect to manage_user view for user info
    """
    user = get_user(user_id=user_id)

    breadcrumbs: Tuple[Breadcrumb, ...] = get_breadcrumbs(
        user,
        append_breadcrumbs=(
            Breadcrumb(label=str(_("Info")), url=reverse("users:manage-user-info", kwargs={"user_id": user_id})),
        ),
    )

    user_properties: Tuple[UserProperty, ...] = (
        UserProperty(
            label=str(_("Name")),
            value=f"{user.first_name} {user.last_name}" if user.last_name else user.first_name,
        ),
        UserProperty(
            label=str(_("Email")),
            value=user.email,
        ),
        UserProperty(
            label=str(_("Phone")),
            value="user.phone",
        ),
        UserProperty(
            label=str(_("Last Activity")),
            value=display_dates.short_datetime(user.last_login),
        ),
        UserProperty(
            label=str(_("Added Since")),
            value=display_dates.short_date(user.date_joined),
        ),
    )

    return UserInfoPageProps(
        title=get_title(user),
        description=get_description(),
        breadcrumbs=breadcrumbs,
        tabs=PAGE_TABS_TUPLE,
        baseUrl=get_base_url(user),
        currentTab=PAGE_TABS["info"].value,
        tabTitle=PAGE_TABS["info"].label,
        props=user_properties,
    )
