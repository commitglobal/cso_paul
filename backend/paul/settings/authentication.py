from datetime import timedelta
from typing import List

from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

from .base import ENABLE_EMAIL_AUTH, ENABLE_NGOHUB_AUTH
from .environment import env

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Authentication settings
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth
AUTHENTICATION_BACKENDS = []

if ENABLE_EMAIL_AUTH:
    AUTHENTICATION_BACKENDS.append("django.contrib.auth.backends.ModelBackend")

if ENABLE_NGOHUB_AUTH:
    AUTHENTICATION_BACKENDS.append("allauth.account.auth_backends.AuthenticationBackend")

if not AUTHENTICATION_BACKENDS:
    raise ValueError("At least one authentication backend must be enabled: NGO Hub or Email Auth.")

AUTH_USER_MODEL = "users.User"
LOGIN_URL = reverse_lazy("users:login")
LOGOUT_REDIRECT_URL = reverse_lazy("users:login")


# Groups and Permissions
USER_ROLE_NAME = "user"
MANAGER_ROLE_NAME = "manager"
NORMAL_ADMIN_ROLE_NAME = "admin"
SUPER_ADMIN_ROLE_NAME = "super admin"

# support admin is a special role that has access to support-related features
SUPPORT_ADMIN_ROLE_NAME = "support admin"

user_permissions = [
    "users.view_user",
    "auth.view_group",
]

manager_permissions = [] + user_permissions

admin_permissions = [
    "users.add_user",
    "users.change_user",
    "users.delete_user",
] + manager_permissions

support_admin_permissions = [
    "users.view_user",
    "auth.view_group",
]

super_admin_permissions = admin_permissions


# Define user groups with their respective permissions and roles
USER_GROUPS = {
    USER_ROLE_NAME: {
        "order": 500,
        "label": _("User"),
        "description": _("Can access basic features of Paul."),
        "is_superuser": False,
        "is_staff": False,
        "is_assignable_by_ngo_user": True,
        "permissions": user_permissions,
    },
    MANAGER_ROLE_NAME: {
        "order": 400,
        "label": _("Manager"),
        "description": _("Same as a User, but also manage permissions to its projects."),
        "is_superuser": False,
        "is_staff": False,
        "is_assignable_by_ngo_user": True,
        "permissions": manager_permissions,
    },
    NORMAL_ADMIN_ROLE_NAME: {
        "order": 300,
        "label": _("Admin"),
        "description": _("Same as an Admin, but also manages users."),
        "is_superuser": False,
        "is_staff": False,
        "is_assignable_by_ngo_user": True,
        "permissions": admin_permissions,
    },
    SUPER_ADMIN_ROLE_NAME: {
        "order": 100,
        "label": _("Super Admin"),
        "description": _("Is the exact same as an admin, but it's the admin of NGO Hub."),
        "is_superuser": True,
        "is_staff": False,
        "is_assignable_by_ngo_user": False,
        "permissions": super_admin_permissions,
    },
    SUPPORT_ADMIN_ROLE_NAME: {
        "order": 200,
        "label": _("Support Admin"),
        "description": _("Can access support-related features."),
        "is_superuser": False,
        "is_staff": True,
        "is_assignable_by_ngo_user": False,
        "permissions": super_admin_permissions,
    },
}

USER_GROUPS_ORDERING: List[str] = [key for key, item in sorted(USER_GROUPS.items(), key=lambda x: x[1]["order"])]
USER_GROUPS_CHOICES = [(key, item["label"]) for key, item in USER_GROUPS.items()]

# Expiration times and limits for various authentication-related actions
EMAIL_VERIFICATION_EXPIRY_TIME = timedelta(hours=env.int("EMAIL_VERIFICATION_EXPIRY_HOURS"))
TWO_FACTOR_AUTH_EXPIRY_TIME = timedelta(hours=env.int("EMAIL_2FA_EXPIRY_HOURS"))
PASSWORD_RESET_EXPIRY_TIME = timedelta(hours=env.int("EMAIL_PASSWORD_RESET_EXPIRY_HOURS"))

MAX_RESET_ATTEMPTS = 5
MAX_LOGIN_ATTEMPTS = 5
