from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialLogin
from allauth.socialaccount.signals import pre_social_login, social_account_added, social_account_updated
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.http import HttpRequest

from .helpers import user_create_or_update

UserModel = get_user_model()


@receiver(pre_social_login)
def handle_pre_social_login(sociallogin: SocialLogin, **kwargs) -> None:
    """
    Handler for the pre-social-login signal, which is sent before the login is actually processed.

    We must make sure that the User is active and has the correct permissions.
    """

    user = sociallogin.user

    if not user:
        return None

    user_create_or_update(sociallogin=sociallogin)

    return None


@receiver(social_account_added)
def handle_new_login(sociallogin: SocialLogin, **kwargs) -> None:
    """
    Handler for the social-account-added signal, which is sent for the initial login of a new User.

    We must create a User, an Organization and schedule its data update from NGO Hub.
    """

    user_create_or_update(sociallogin=sociallogin)


@receiver(social_account_updated)
def handle_existing_login(sociallogin: SocialLogin, **kwargs) -> None:
    """
    Handler for the social-account-update signal, which is sent for all logins after the initial login.

    We already have a User, but we must be sure that the User also has
    an Organization and schedule its data update from NGO Hub.
    """

    user_create_or_update(sociallogin=sociallogin)


class UserOrgAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request: HttpRequest, sociallogin: SocialLogin, form=None) -> UserModel:
        """
        If a user with the same email already exists, it will be updated with the new data.
        """

        # Change this to the external/cognito ID
        user_email: str = sociallogin.user.email
        if UserModel.objects.filter(email=user_email).exists():
            user: UserModel = UserModel.objects.get(email=user_email)
        else:
            user: UserModel = super().save_user(request, sociallogin, form)

        user.save()

        user_create_or_update(sociallogin=sociallogin)

        return user
