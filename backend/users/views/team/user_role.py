import json
from typing import Any, Dict, Tuple, Union

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponseRedirect
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control

from tools.data_models.page import Breadcrumb
from tools.utils.serializers import inertia_enhanced, serialize_form_errors
from tools.utils.url_parser import make_url_safe
from users.forms import ChangeRoleForm
from users.models import RoleChoices
from users.views.common import build_role_choices_for_user
from users.views.team.data_model import RoleChoicesModel, UserPageProps
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

    if not request.user.has_perm("users.change_role"):
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
@inertia_enhanced("users/team-user/role")
def manage_user_role(request: HttpRequest, user_id: int) -> Union[UserRolePageProps, HttpResponseRedirect]:
    """
    Redirect to manage_user view for user role
    """

    current_page = reverse("users:manage-user-role", kwargs={"user_id": user_id})

    user: User = get_user(user_id=user_id)

    errors = {}
    if request.method == "POST":
        result = _change_user_role(request=request, user=user)

        if isinstance(result, dict) and "errors" in result:
            errors.update(result["errors"])
        else:
            user: User = result

        if request.GET.get("next"):
            next_url: str = make_url_safe(
                request=request,
                url=request.GET.get("next"),
                default_next=current_page,
            )
            if next_url != current_page:
                return HttpResponseRedirect(next_url)

    user_role = str(RoleChoices(user.main_role).value)

    main_role_is_unassignable = not settings.USER_GROUPS.get(user_role)["is_assignable_by_ngo_user"]

    roles = build_role_choices_for_user(current_role=user_role, main_role_is_unassignable=main_role_is_unassignable)

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
