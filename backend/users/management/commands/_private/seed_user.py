import logging

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class CommonCreateUserCommand(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            type=str,
            help="Username of the superuser (default: email)",
            required=False,
        )
        parser.add_argument(
            "--first_name",
            type=str,
            help="First name of the superuser",
            required=False,
        )
        parser.add_argument(
            "--last_name",
            type=str,
            help="Last name of the superuser",
            required=False,
        )

    @classmethod
    def _create_user(
        cls,
        admin_email: str,
        password: str,
        is_superuser: bool,
        is_staff: bool,
        username: str = None,
        first_name: str = "Admin",
        last_name: str = "Admin",
    ):
        if not password:
            raise ValueError("Password is required. Please set the proper variables.")

        user_model = get_user_model()

        if user_model.objects.filter(email=admin_email).exists():
            logger.warning(f"Super admin with email {admin_email} already exists")
            return user_model.objects.get(email=admin_email)

        user = user_model(
            email=admin_email,
            username=username or admin_email,
            first_name=first_name,
            last_name=last_name,
            is_active=True,
            is_superuser=is_superuser,
            is_staff=is_staff,
        )
        user.set_password(password)

        user.save()

        logger.info(f"Super admin created successfully with email {admin_email}")

        return user
