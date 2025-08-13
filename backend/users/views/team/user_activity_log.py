from django.contrib.auth.decorators import login_required
from django.http import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia

from paul.views.data_model import Breadcrumb, DataTable, TableHeader, serialize_page_props_decorator
from users.views.team.user import (
    PAGE_TABS,
    UserPageProps,
    get_base_url,
    get_breadcrumbs,
    get_description,
    get_requested_user,
    get_tabs,
    get_title,
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
    user = get_requested_user(user_id=user_id)

    breadcrumbs = get_breadcrumbs(user)
    breadcrumbs.append(
        Breadcrumb(
            label=str(_("Activity Log")), url=reverse("users:manage-user-activity-log", kwargs={"user_id": user_id})
        )
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
        tabs=get_tabs(),
        baseUrl=get_base_url(user),
        currentTab=PAGE_TABS["activity-log"]["value"],
        tabTitle=str(PAGE_TABS["activity-log"]["label"]),
        table=table,
    )
