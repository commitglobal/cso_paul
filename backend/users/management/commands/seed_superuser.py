import logging

from django.conf import settings
from django.contrib.auth.models import Group

from ._private.seed_user import CommonCreateUserCommand

logger = logging.getLogger(__name__)


class Command(CommonCreateUserCommand):
    help = "Command to create a superuser"

    def _set_user_groups(self, user):
        """
        Set the user groups for the superuser.
        """
        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN)
        if not super_admin_group:
            logger.error(f"Group '{settings.SUPER_ADMIN}' does not exist.")
            return

        user.groups.clear()
        user.groups.set([super_admin_group.pk])
        user.update_main_role()

    def handle(self, *args, **kwargs):
        kwargs["last_name"] = "Super"
        kwargs["first_name"] = "User"

        user = self._create_user(
            admin_email=settings.DJANGO_ADMIN_EMAIL,
            password=settings.DJANGO_ADMIN_PASSWORD,
            is_superuser=True,
            is_staff=True,
            first_name=kwargs.get("first_name", ""),
            last_name=kwargs.get("last_name", ""),
        )
        logger.info("Super admin created successfully")

        self._set_user_groups(user)
        logger.info("Super admin groups set successfully")

        return 0
