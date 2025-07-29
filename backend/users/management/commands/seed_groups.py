import logging
from typing import Dict, List, Set, Union

from django.conf import settings
from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    logger = logging.getLogger(__name__)
    _permissions_cache: Dict[str, int] = {}

    def handle(self, *args, **kwargs):
        group_names: Set[str] = set(settings.USER_GROUPS.keys())

        self.logger.info(f"Creating {len(group_names)} groups: {', '.join(group_names)}.")

        for group_name, group_data in settings.USER_GROUPS.items():
            group: Group = self._create_group(group_name)

            group_permission_names: Union[str, List[str]] = group_data.get("permissions", [])
            self._assign_group_permissions(group, group_permission_names)

    def _create_group(self, group_name: str) -> Group:
        users_group: Group
        created: bool
        users_group, created = Group.objects.get_or_create(name=group_name)

        log_suffix = "was created" if created else "already exists"
        self.logger.info(f"Group '{group_name}' {log_suffix}.")

        return users_group

    def _assign_group_permissions(self, group: Group, permissions_names: Union[str, List[str]]) -> None:
        if permissions_names == "*":
            permissions_ids: List[int] = list(Permission.objects.values_list("id", flat=True))
        else:
            permissions_ids: List[int] = self._permission_names_to_ids(permissions_names)

        group.permissions.clear()
        group.permissions.set(permissions_ids)

        self.logger.info(f"Group '{group.name}' permissions assigned.")

    def _permission_names_to_ids(self, group_permissions: List[str]) -> List[int]:
        permission_ids: List[int] = []

        for permission_name in group_permissions:
            if permission_name not in self._permissions_cache:
                try:
                    app_label, permission_label = permission_name.split(".", 1)
                except ValueError:
                    self.logger.error(
                        f"Permission '{permission_name}' has incorrect naming format."
                        " "
                        "Expected format: '<app_label>.<permission_label>'."
                    )
                    continue

                try:
                    permission = Permission.objects.get(content_type__app_label=app_label, codename=permission_label)
                except Permission.DoesNotExist:
                    self.logger.error(f"Permission '{permission_name}' does not exist.")
                    continue
                else:
                    self._permissions_cache[permission_name] = permission.pk

            permission_ids.append(self._permissions_cache[permission_name])

        return permission_ids
