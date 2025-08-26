from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, JsonResponse
from django.views.decorators.cache import cache_control
from django.views.decorators.http import require_GET

from users.models import User
from users.views.common import build_role_choices_for_user
from users.views.team.user import get_user


@login_required
@cache_control(private=True)
@require_GET
def get_user_roles(__: HttpRequest, user_id) -> JsonResponse:
    user: User = get_user(user_id=user_id)

    user_role: str = user.main_role
    main_role_is_unassignable: bool = not settings.USER_GROUPS.get(user_role)["is_assignable_by_ngo_user"]

    roles = build_role_choices_for_user(current_role=user_role, main_role_is_unassignable=main_role_is_unassignable)

    return JsonResponse({"roles": [role.model_dump() for role in roles]})
