from typing import List, Optional

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, Group, UserManager
from django.db import models
from django.db.models import QuerySet
from django.db.models.functions import Lower
from django.forms.models import model_to_dict
from django.utils.translation import gettext as _


def get_highest_ranked_group(user_groups: QuerySet[Group]) -> Optional[str]:
    # Get the names of the user's groups
    user_group_names: List[str] = list(user_groups.values_list("name", flat=True))

    # Find the highest-ranked group
    ordered_group_names = (group_name for group_name in settings.USER_GROUPS_ORDERING if group_name in user_group_names)

    return next(ordered_group_names, None)


class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff"):
            raise ValueError(_("Superuser must have is_staff=True."))

        if extra_fields.get("is_superuser"):
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self._create_user(email, password, **extra_fields)


class RoleChoices(models.TextChoices):
    USER = settings.USER_ROLE_NAME, settings.USER_GROUPS[settings.USER_ROLE_NAME]["label"]
    MANAGER = settings.MANAGER_ROLE_NAME, settings.USER_GROUPS[settings.MANAGER_ROLE_NAME]["label"]
    NORMAL_ADMIN = settings.NORMAL_ADMIN_ROLE_NAME, settings.USER_GROUPS[settings.NORMAL_ADMIN_ROLE_NAME]["label"]
    SUPER_ADMIN = settings.SUPER_ADMIN_ROLE_NAME, settings.USER_GROUPS[settings.SUPER_ADMIN_ROLE_NAME]["label"]
    SUPPORT_ADMIN = settings.SUPPORT_ADMIN_ROLE_NAME, settings.USER_GROUPS[settings.SUPPORT_ADMIN_ROLE_NAME]["label"]


class User(AbstractUser):
    """
    The default Django user model, but change it to use the email address
    instead of the username
    """

    # We ignore the "username" field because the authentication
    # will be done by email + password
    username = models.CharField(
        blank=True,
        editable=True,
        help_text=_("We do not use this field"),
        max_length=150,
        null=True,
        unique=True,
        validators=[],
        verbose_name=_("username"),
    )
    email = models.EmailField(verbose_name=_("email address"), blank=False, null=False, unique=True)
    is_ngohub_user = models.BooleanField(default=False, editable=False)

    main_role = models.CharField(
        max_length=50,
        verbose_name=_("role"),
        choices=RoleChoices.choices,
        default=RoleChoices.USER,
    )

    # NGO Hub data
    ngohub_id = models.PositiveIntegerField(
        verbose_name=_("NGO Hub ID"),
        blank=True,
        null=True,
        db_index=True,
        unique=True,
        help_text=_("The ID of the user in NGO Hub, if applicable."),
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ["pk"]

        verbose_name = _("User")
        verbose_name_plural = _("Users")
        constraints = [
            models.UniqueConstraint(Lower("email"), name="email_unique"),
        ]

    def to_dict(self):
        return model_to_dict(self, exclude=("password", "is_superuser", "is_staff", "groups", "user_permissions"))

    def __str__(self):
        return self.email

    def update_main_role(self, *, commit: bool = True) -> None:
        """
        Update the user's role based on the highest-ranked group they belong to.
        If the user does not belong to any group, the role will be set to USER.
        """
        user_group = get_highest_ranked_group(self.groups.all())

        # set the role from RoleChoices based on the user_group
        if user_group:
            self.main_role = RoleChoices(user_group)
        else:
            self.main_role = RoleChoices.USER

        if commit:
            self.save(update_fields=["main_role"])
