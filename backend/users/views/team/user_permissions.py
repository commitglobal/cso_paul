from typing import Tuple

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia

from tools.data_models.page import Breadcrumb, serialize_page_props_decorator
from tools.data_models.table import DataTable, TableHeader
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


class UserPermissionsPageProps(UserPageProps):
    table: DataTable


@login_required
@cache_control(private=True)
@inertia("users/team-user/permissions")
@serialize_page_props_decorator
def manage_user_permissions(__: HttpRequest, user_id: int) -> UserPermissionsPageProps:
    """
    Redirect to manage_user view for user permissions
    """
    user = get_user(user_id=user_id)

    breadcrumbs: Tuple[Breadcrumb, ...] = get_breadcrumbs(
        user,
        append_breadcrumbs=(
            Breadcrumb(
                label=str(_("Permissions")), url=reverse("users:manage-user-permissions", kwargs={"user_id": user_id})
            ),
        ),
    )

    table: DataTable = DataTable(
        totalItems=100,
        totalPages=10,
        header=[
            TableHeader(header=str(_("Entity")), accessorKey="entity"),
            TableHeader(header=str(_("Type")), accessorKey="entity_type"),
            TableHeader(header=str(_("Permission")), accessorKey="permission"),
        ],
        items=[],
    )

    return UserPermissionsPageProps(
        title=get_title(user),
        description=get_description(),
        breadcrumbs=breadcrumbs,
        tabs=PAGE_TABS_TUPLE,
        baseUrl=get_base_url(user),
        currentTab=PAGE_TABS["permissions"].value,
        tabTitle=PAGE_TABS["permissions"].label,
        table=table,
        errors=None,
    )
