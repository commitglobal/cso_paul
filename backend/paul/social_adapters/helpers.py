import logging
from typing import Dict, Optional

from allauth.core.exceptions import ImmediateHttpResponse
from allauth.socialaccount.models import SocialLogin
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.shortcuts import redirect
from django.urls import reverse
from ngohub import NGOHub
from ngohub.exceptions import HubHTTPException
from ngohub.models.user import UserProfile

from users.models import User

logger = logging.getLogger(__name__)

UserModel = get_user_model()


def _check_ngohub_user_has_app(user_token: str, user_email: str) -> bool:
    """
    Check if the user has an active application in NGO Hub.
    This is used to verify that the user is allowed to access the application.
    """
    ngohub: NGOHub = NGOHub(settings.NGOHUB_API_HOST)

    try:
        user_applications = ngohub.get_user_organization_applications(ngo_token=user_token)
    except HubHTTPException as e:
        logger.error(
            f"User {user_email} could not be found in NGO Hub. "
            f"Please check the configuration. Exception raised from error {e}."
        )
        return False

    for app in user_applications:
        if app.id == settings.NGOHUB_APP_ID and app.status == "active" and app.ngo_status == "active":
            return True

    return False


def _check_ngo_user_has_app_permissions(sociallogin: SocialLogin) -> None:
    user_token: str = sociallogin.token.token

    if not _check_ngohub_user_has_app(user_token=user_token, user_email=sociallogin.user.email):
        raise ImmediateHttpResponse(redirect(reverse("error-app-missing")))


def _set_user_properties(*, user: User, user_profile: UserProfile, commit: bool = True) -> None:
    changes_made: bool = False
    if not user.first_name:
        user.first_name = user_profile.name
        changes_made = commit

    if user.last_name:
        user.last_name = ""
        changes_made = commit

    if not user.ngohub_id:
        user.ngohub_id = user_profile.id
        user.is_ngohub_user = True
        changes_made = commit

    if changes_made:
        user.save()


def _get_ngohub_user_profile(user: User, user_token: str) -> UserProfile:
    ngohub: NGOHub = NGOHub(settings.NGOHUB_API_HOST)

    try:
        user_profile: Optional[UserProfile] = ngohub.get_profile(user_token)
    except HubHTTPException:
        logger.error(f"User {user.email} could not be found in NGO Hub. Please check the configuration.")

        raise ImmediateHttpResponse(redirect(reverse("error-app-missing")))

    return user_profile


def _get_local_role(ngohub_role: str) -> str:
    """
    Convert the NGO Hub role to the local role.
    """

    if ngohub_role not in settings.DEFAULT_NGOHUB_ROLE_TO_PAUL_ROLE:
        logger.error(f"Unknown NGO Hub role: {ngohub_role}. Defaulting to NGO member.")
        ngohub_role = settings.NGOHUB_ROLE_NGO_MEMBER

    return settings.DEFAULT_NGOHUB_ROLE_TO_PAUL_ROLE[ngohub_role]


def _get_local_role_properties(local_role: str) -> Dict:
    """
    Get the properties of the local role.
    """
    return settings.USER_GROUPS[local_role]


def _update_user_with_role(*, user: User, ngohub_role: str, commit: bool = True) -> UserModel:
    """
    Update the user with the given role.
    """

    local_role: str = _get_local_role(ngohub_role)
    user_role_properties: Dict = _get_local_role_properties(local_role)

    should_update: bool = False

    if user.is_staff != user_role_properties["is_staff"]:
        user.is_staff = user_role_properties["is_staff"]
        should_update = commit

    if user.is_superuser != user_role_properties["is_superuser"]:
        user.is_superuser = user_role_properties["is_superuser"]
        should_update = commit

    if should_update or user.pk is None:
        # If the user is new or any of the properties have changed, save the user.
        user.save()

    user.groups.add(Group.objects.get(name=local_role))
    user.update_main_role(commit=commit)

    return user


def _check_user_is_superadmin(user_profile: UserProfile):
    """
    Check if the user is a superadmin in NGO Hub.
    If the user is a superadmin, they are allowed to access all applications.
    """
    if user_profile.role == settings.NGOHUB_ROLE_SUPER_ADMIN:
        return True

    return False


def user_create_or_update(sociallogin: SocialLogin) -> UserModel:
    """
    Create a new user in NGO Hub and return the UserModel instance.
    This function is called when a new user logs in for the first time.
    """
    user: User = sociallogin.user
    user_profile: UserProfile = _get_ngohub_user_profile(user, user_token=sociallogin.token.token)

    if not _check_user_is_superadmin(user_profile):
        _check_ngo_user_has_app_permissions(sociallogin)

    _set_user_properties(user=user, user_profile=user_profile)

    user_ngohub_role: str = user_profile.role
    _update_user_with_role(user=user, ngohub_role=user_ngohub_role)

    return user
