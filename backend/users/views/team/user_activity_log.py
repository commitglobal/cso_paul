from typing import Tuple

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia

from paul.views.data_model import Breadcrumb, DataTable, TableHeader, serialize_page_props_decorator
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


class UserActivityLogPageProps(UserPageProps):
    table: DataTable


@login_required
@cache_control(private=True)
@inertia("users/team-user/activity-log")
@serialize_page_props_decorator
def manage_user_activity_log(__: HttpRequest, user_id: int) -> UserActivityLogPageProps:
    """
    Redirect to manage_user view for user activity log
    """
    user = get_user(user_id=user_id)

    breadcrumbs: Tuple[Breadcrumb, ...] = get_breadcrumbs(
        user,
        append_breadcrumbs=(
            Breadcrumb(
                label=str(_("Activity Log")), url=reverse("users:manage-user-activity-log", kwargs={"user_id": user_id})
            ),
        ),
    )

    table: DataTable = DataTable(
        totalItems=100,
        totalPages=10,
        header=[
            TableHeader(label=str(_("Action")), value="action"),
            TableHeader(label=str(_("Date")), value="date"),
        ],
        items=[],
    )

    return UserActivityLogPageProps(
        title=get_title(user),
        description=get_description(),
        breadcrumbs=breadcrumbs,
        tabs=PAGE_TABS_TUPLE,
        baseUrl=get_base_url(user),
        currentTab=PAGE_TABS["activity-log"].value,
        tabTitle=PAGE_TABS["activity-log"].label,
        table=table,
        errors=None,
    )
