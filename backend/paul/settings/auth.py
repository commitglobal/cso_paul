from datetime import timedelta
from typing import List

from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

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
AUTH_USER_MODEL = "users.User"
LOGIN_URL = reverse_lazy("users:login")
LOGOUT_REDIRECT_URL = reverse_lazy("users:login")


# Groups and Permissions
USER = "user"
MANAGER = "manager"
NORMAL_ADMIN = "admin"
SUPER_ADMIN = "super admin"

# support admin is a special role that has access to support-related features
SUPPORT_ADMIN = "support admin"

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
    USER: {
        "order": 500,
        "label": _("User"),
        "is_superuser": False,
        "is_staff": False,
        "permissions": user_permissions,
    },
    MANAGER: {
        "order": 400,
        "label": _("Manager"),
        "is_superuser": False,
        "is_staff": False,
        "permissions": manager_permissions,
    },
    NORMAL_ADMIN: {
        "order": 300,
        "label": _("Admin"),
        "is_superuser": False,
        "is_staff": False,
        "permissions": admin_permissions,
    },
    SUPER_ADMIN: {
        "order": 100,
        "label": _("Super Admin"),
        "is_superuser": True,
        "is_staff": False,
        "permissions": super_admin_permissions,
    },
    SUPPORT_ADMIN: {
        "order": 200,
        "label": _("Support Admin"),
        "is_superuser": False,
        "is_staff": True,
        "permissions": super_admin_permissions,
    },
}

USER_GROUPS_ORDERING: List[str] = [key for key, item in sorted(USER_GROUPS.items(), key=lambda x: x[1]["order"])]

# Expiration times and limits for various authentication-related actions
EMAIL_VERIFICATION_EXPIRY_TIME = timedelta(hours=env.int("EMAIL_VERIFICATION_EXPIRY_HOURS"))
TWO_FACTOR_AUTH_EXPIRY_TIME = timedelta(hours=env.int("EMAIL_2FA_EXPIRY_HOURS"))
PASSWORD_RESET_EXPIRY_TIME = timedelta(hours=env.int("EMAIL_PASSWORD_RESET_EXPIRY_HOURS"))

MAX_RESET_ATTEMPTS = 5
MAX_LOGIN_ATTEMPTS = 5
