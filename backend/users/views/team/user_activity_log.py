from typing import Dict, List, Optional, Tuple

from auditlog.models import LogEntry
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.db.models import QuerySet
from django.http import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia
from pydantic import BaseModel

from paul.common.sort_parser import parse_order_parameter
from paul.views.data_model import Breadcrumb, DataTable, TableHeader, serialize_page_props_decorator
from paul.views.pagination import paginate_queryset
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

User = get_user_model()


class ActionItem(BaseModel):
    id: int
    userId: int
    action: str
    date: str


class UserActivityLogPageProps(UserPageProps):
    table: DataTable


def _serialize_log_entries(log_entries: QuerySet[LogEntry], user_id: int) -> List[ActionItem]:
    items: List[ActionItem] = [
        ActionItem(
            id=entry.pk,
            userId=user_id,
            action=str(
                LogEntry.Action.choices[entry.action][1]
                if entry.action
                in (
                    LogEntry.Action.CREATE,
                    LogEntry.Action.UPDATE,
                    LogEntry.Action.DELETE,
                    LogEntry.Action.ACCESS,
                )
                else "unknown_action!"
            ),
            date=entry.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        )
        for entry in log_entries
    ]

    return items


def _get_table_data(request: HttpRequest, user_id: int) -> DataTable:
    page_number: int = int(request.GET.get(settings.QUERY_PARAMS["PAGE"], 1))
    page_size: int = int(request.GET.get(settings.QUERY_PARAMS["PAGE_SIZE"], 10))
    sort: Optional[str] = request.GET.get(settings.QUERY_PARAMS["SORT"], None)

    field_mapping: Dict[str, str] = {
        "id": "pk",
        "user": "user__pk",
        "action": "action",
        "date": "timestamp",
    }
    parsed_sorting: List[str] = parse_order_parameter(
        sort_parameter=sort,
        field_mapping=field_mapping,
        default_sort_option="-timestamp",
    )

    action_items, paginator, pagination = paginate_queryset(
        queryset=LogEntry.objects.get_for_objects(User.objects.filter(pk=user_id)).order_by(*parsed_sorting),
        page_number=page_number,
        page_size=page_size,
        page_serializer=_serialize_log_entries,
        serializer_kwargs={"user_id": user_id},
    )

    table: DataTable = DataTable(
        totalItems=pagination.total_items,
        totalPages=pagination.num_pages,
        header=[
            TableHeader(header=str(_("ID")), accessorKey="id", enableSorting=True),
            TableHeader(header=str(_("User")), accessorKey="userId", enableSorting=True),
            TableHeader(header=str(_("Action")), accessorKey="action", enableSorting=True),
            TableHeader(header=str(_("Date")), accessorKey="date", enableSorting=True),
        ],
        items=action_items,
    )

    return table


@login_required
@cache_control(private=True)
@inertia("users/team-user/activity-log")
@serialize_page_props_decorator
def manage_user_activity_log(request: HttpRequest, user_id: int) -> UserActivityLogPageProps:
    """
    Redirect to manage_user view for user activity log
    """
    user: User = get_user(user_id=user_id)

    table: DataTable = _get_table_data(request=request, user_id=user_id)

    breadcrumbs: Tuple[Breadcrumb, ...] = get_breadcrumbs(
        user,
        append_breadcrumbs=(
            Breadcrumb(
                label=str(_("Activity Log")), url=reverse("users:manage-user-activity-log", kwargs={"user_id": user_id})
            ),
        ),
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
