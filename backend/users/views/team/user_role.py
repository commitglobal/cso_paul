import json
from typing import List

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia
from paul.views.data_model import Breadcrumb, serialize_page_props_decorator
from pydantic import BaseModel

from users.forms import ChangeRoleForm
from users.models import RoleChoices
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


class RoleChoicesModel(BaseModel):
    value: str
    label: str
    disabled: bool = False
    description: str = ""


class UserRolePageProps(UserPageProps):
    roles: list[RoleChoicesModel]
    userRole: str


@login_required
@cache_control(private=True)
@inertia("users/team-user/role")
@serialize_page_props_decorator
def manage_user_role(request: HttpRequest, user_id: int) -> UserRolePageProps:
    """
    Redirect to manage_user view for user role
    """
    user = get_requested_user(user_id=user_id)

    breadcrumbs = get_breadcrumbs(user)
    breadcrumbs.append(
        Breadcrumb(
            label=str(_("Activity Log")), url=reverse("users:manage-user-activity-log", kwargs={"user_id": user_id})
        )
    )

    errors = None
    if request.method == "POST":
        if user.main_role in (RoleChoices.SUPER_ADMIN, RoleChoices.SUPPORT_ADMIN):
            raise PermissionDenied(_("You cannot change the role of this user."))

        form = ChangeRoleForm(json.loads(request.body), instance=user)
        if not form.is_valid():
            errors = {"role": dict(form.errors)}
        else:
            user = form.save()
            user.refresh_groups_after_main_role_update()
            user.refresh_from_db()

    user_role = user.main_role

    main_role_is_unassignable = not settings.USER_GROUPS.get(user_role)["is_assignable_by_ngo_user"]

    roles: List[RoleChoicesModel] = []
    for role in settings.USER_GROUPS:
        is_role_disabled = not settings.USER_GROUPS[role]["is_assignable_by_ngo_user"]
        role_description = settings.USER_GROUPS[role].get("description", "")

        if main_role_is_unassignable:
            is_role_disabled = role != user_role
            role_description = (_("This user can't be assigned to any other role."), " ", role_description)

        roles.append(
            RoleChoicesModel(
                value=role,
                label=str(settings.USER_GROUPS[role]["label"]),
                disabled=is_role_disabled,
                description=str(role_description),
            )
        )

    return UserRolePageProps(
        title=get_title(user),
        description=get_description(),
        breadcrumbs=breadcrumbs,
        tabs=get_tabs(),
        baseUrl=get_base_url(user),
        currentTab=PAGE_TABS["role"]["value"],
        tabTitle=str(PAGE_TABS["role"]["label"]),
        userRole=user_role,
        roles=roles,
        errors=errors,
    )
