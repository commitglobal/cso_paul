import logging
from typing import List

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.utils.translation import gettext_lazy as _
from ngohub import NGOHub
from pycognito import Cognito

logger = logging.getLogger(__name__)
User = get_user_model()


def _authenticate_with_ngohub() -> str:
    u = Cognito(
        user_pool_id=settings.AWS_COGNITO_USER_POOL_ID,
        client_id=settings.AWS_COGNITO_CLIENT_ID,
        client_secret=settings.AWS_COGNITO_CLIENT_SECRET,
        username=settings.NGOHUB_API_ACCOUNT,
        user_pool_region=settings.AWS_COGNITO_REGION,
    )
    u.authenticate(password=settings.NGOHUB_API_KEY)

    return u.id_token


def admin_get_ngohub_users():
    ngohub: NGOHub = NGOHub(settings.NGOHUB_API_HOST)
    admin_token: str = _authenticate_with_ngohub()

    try:
        ngo_users = ngohub.get_raw_users(
            admin_token=admin_token,
            organization_id=settings.NGOHUB_NGO_ID,
        )
    except Exception as e:
        raise RuntimeError(f"Failed to fetch NGOHub users: {e}") from e

    for user_data in ngo_users["items"]:
        user_status: str = user_data.get("status")
        if user_status != "active":
            logger.debug(f"Skipping inactive user: {user_data.get('email')}")
            continue

        available_user_apps: List[int] = user_data.get("availableAppsIDs", [])
        if settings.NGOHUB_APP_ID not in available_user_apps:
            logger.debug(f"Skipping user {user_data.get('email')} because they do not have access to the app.")
            continue

        full_user_data = ngohub.get_user(
            admin_token=admin_token,
            user_id=user_data.get("id"),
        )

        user_id = full_user_data.id
        email = full_user_data.email

        if not User.objects.filter(ngohub_id=user_id).exists():
            new_user = User(
                ngohub_id=user_id,
                first_name=full_user_data.name,
                email=email,
            )
            new_user.save()

            group_name = settings.DEFAULT_NGOHUB_ROLE_TO_PAUL_ROLE.get(full_user_data.role, "user")
            new_user_group = Group.objects.get(name=group_name)
            new_user.groups.add(new_user_group)

            logger.info(f"Created new user in Django: {email}")
        else:
            logger.info(f"User already exists in Django: {email}")


@login_required
def sync_from_ngohub(request: HttpRequest) -> HttpResponse:
    if not request.user.groups.filter(name=settings.SUPPORT_ADMIN_ROLE_NAME).exists():
        return JsonResponse(
            {"error": _("You do not have permission to perform this action.")},
            status=403,
        )

    admin_get_ngohub_users()

    return JsonResponse(
        {"message": _("Users synced successfully from NGOHub.")},
        status=200,
    )
