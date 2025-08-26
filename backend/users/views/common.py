from typing import List

from django.conf import settings
from django.utils.translation import gettext_lazy as _

from users.views.team.data_model import RoleChoicesModel


def build_role_choices_for_user(current_role: str, main_role_is_unassignable: bool) -> List[RoleChoicesModel]:
    roles: List[RoleChoicesModel] = []
    for role in settings.USER_GROUPS:
        is_role_disabled = not settings.USER_GROUPS[role]["is_assignable_by_ngo_user"]
        role_description = settings.USER_GROUPS[role].get("description", "")

        if main_role_is_unassignable:
            is_role_disabled = role != current_role
            role_description = _("This user can't be assigned to any other role.") + " " + role_description

        roles.append(
            RoleChoicesModel(
                value=role,
                label=str(settings.USER_GROUPS[role]["label"]),
                disabled=is_role_disabled,
                description=str(role_description),
            )
        )

    return roles
