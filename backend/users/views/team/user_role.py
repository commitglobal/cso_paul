import json
from typing import Any, Dict, List, Tuple, Union

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponseRedirect
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia
from pydantic import BaseModel

from paul.common.serializers import serialize_form_errors
from paul.views.data_model import Breadcrumb, serialize_page_props_decorator
from users.forms import ChangeRoleForm
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


class RoleChoicesModel(BaseModel):
    value: str
    label: str
    disabled: bool = False
    description: str = ""


class UserRolePageProps(UserPageProps):
    roles: list[RoleChoicesModel]
    userRole: str


def _change_user_role(request: HttpRequest, user: User) -> Union[Dict[str, Any], User]:
    props: Dict[str, Any] = {"userRole": user.main_role}

    if user == request.user:
        error_message = _("You cannot change your own role.")
        props["errors"] = {"role": serialize_form_errors({"main_role": [error_message]})}
        messages.error(request, error_message)
        return props

    if user.has_perm("users.change_role"):
        error_message = _("You don't have the permission to change this user's role.")
        props["errors"] = {"role": serialize_form_errors({"main_role": [error_message]})}
        messages.error(request, error_message)
        return props

    form = ChangeRoleForm(json.loads(request.body), instance=user)
    if not form.is_valid():
        props["errors"] = {"role": serialize_form_errors(form.errors)}
        return props

    user = form.save()
    user.refresh_groups_after_main_role_update()
    user.refresh_from_db()

    return user


@login_required
@cache_control(private=True)
@inertia("users/team-user/role")
@serialize_page_props_decorator
def manage_user_role(request: HttpRequest, user_id: int) -> Union[UserRolePageProps, HttpResponseRedirect]:
    """
    Redirect to manage_user view for user role
    """
    user: User = get_user(user_id=user_id)

    errors = {}
    if request.method == "POST":
        result = _change_user_role(request=request, user=user)

        if isinstance(result, dict) and "errors" in result:
            errors.update(result["errors"])
        else:
            user: User = result

    user_role = user.main_role

    main_role_is_unassignable = not settings.USER_GROUPS.get(user_role)["is_assignable_by_ngo_user"]

    roles: List[RoleChoicesModel] = []
    for role in settings.USER_GROUPS:
        is_role_disabled = not settings.USER_GROUPS[role]["is_assignable_by_ngo_user"]
        role_description = settings.USER_GROUPS[role].get("description", "")

        if main_role_is_unassignable:
            is_role_disabled = role != user_role
            role_description = _("This user can't be assigned to any other role.") + " " + role_description

        roles.append(
            RoleChoicesModel(
                value=role,
                label=str(settings.USER_GROUPS[role]["label"]),
                disabled=is_role_disabled,
                description=str(role_description),
            )
        )

    breadcrumbs: Tuple[Breadcrumb, ...] = get_breadcrumbs(
        user,
        append_breadcrumbs=(
            Breadcrumb(
                label=str(_("Activity Log")), url=reverse("users:manage-user-activity-log", kwargs={"user_id": user_id})
            ),
        ),
    )

    return UserRolePageProps(
        title=get_title(user),
        description=get_description(),
        breadcrumbs=breadcrumbs,
        tabs=PAGE_TABS_TUPLE,
        baseUrl=get_base_url(user),
        currentTab=PAGE_TABS["role"].value,
        tabTitle=PAGE_TABS["role"].label,
        userRole=user_role,
        roles=roles,
        errors=errors,
    )
