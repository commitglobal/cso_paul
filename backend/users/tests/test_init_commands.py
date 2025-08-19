from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.core.management import call_command
from django.test import TestCase, override_settings


class SeedGroupsCommandTestCase(TestCase):
    """
    Test case for the seed_groups management command.
    This test case verifies that the command creates groups and assigns permissions correctly.
    1. It checks if the groups are created as expected.
    2. It verifies that the permissions are assigned to the groups.
    3. It ensures that the command handles existing groups without errors.
    4. It checks that the command can be run multiple times without duplicating groups.
    """

    def setUp(self):
        self.UserModel = get_user_model()
        self.log_prefix = "ERROR:users.management.commands.seed_groups:"

    def test_seed_groups_command(self):
        """
        Test the seed_groups command to ensure it creates groups and assigns permissions correctly.
        """
        initial_group_count = len(settings.USER_GROUPS)
        call_command("seed_groups")

        # Check if the groups were created
        for group_name in settings.USER_GROUPS.keys():
            self.assertTrue(
                Group.objects.filter(name=group_name).exists(),
                msg=f"Group '{group_name}' was not created.",
            )

        # Check if the correct number of groups was created
        self.assertEqual(Group.objects.count(), initial_group_count)

    @override_settings(
        USER_GROUPS=settings.USER_GROUPS
        | {
            "test_group_w_everything": {
                "permissions": "*",
                "order": 1000,
                "label": "Test Group",
                "is_superuser": True,
                "is_staff": False,
            },
            "test_group_w_some": {
                "permissions": ["users.view_user", "users.change_user"],
                "order": 2000,
                "label": "Test Group",
                "is_superuser": False,
                "is_staff": False,
            },
        }
    )
    def test_seed_groups_creates_correct_permissions(self):
        """
        Test that the seed_groups command creates the correct permissions for each group.
        """
        call_command("seed_groups")

        for group_name, group_data in settings.USER_GROUPS.items():
            group = Group.objects.get(name=group_name)
            expected_permissions = group_data.get("permissions", [])

            if expected_permissions == "*":
                # If permissions are set to "*", the group should have all permissions
                self.assertEqual(
                    group.permissions.count(),
                    Permission.objects.count(),
                    msg=f"Group '{group_name}' should have all permissions.",
                )
            else:
                for perm in expected_permissions:
                    perm_codename = perm.split(".")[1]
                    self.assertTrue(
                        group.permissions.filter(codename=perm_codename).exists(),
                        msg=f"Permission '{perm}' not found in group '{group_name}'.",
                    )

    def test_seed_groups_handles_existing_groups(self):
        """
        Test that the seed_groups command does not create duplicate groups if they already exist.
        """
        call_command("seed_groups")
        initial_group_count = Group.objects.count()

        # Run the command again
        call_command("seed_groups")

        # Ensure the group count remains the same
        self.assertEqual(
            Group.objects.count(),
            initial_group_count,
            msg="Groups were duplicated after running the command again.",
        )
        for group in settings.USER_GROUPS.keys():
            self.assertEqual(
                Group.objects.filter(name=group).count(),
                1,
                msg=f"Group '{group}' was duplicated.",
            )

    @override_settings(
        USER_GROUPS={
            "test_group": {
                "permissions": "*",
                "order": 600,
                "label": "Test Group",
                "is_superuser": True,
                "is_staff": False,
            }
        }
    )
    def test_seed_groups_handles_star_permissions(self):
        """
        Test that the seed_groups command correctly handles groups with '*' permissions.
        """
        call_command("seed_groups")

        test_group = Group.objects.get(name="test_group")
        self.assertEqual(
            test_group.permissions.count(),
            Permission.objects.count(),
            msg="Test group should have all permissions assigned.",
        )

        # Ensure the group is created with the correct attributes
        self.assertEqual(test_group.name, "test_group")
        self.assertTrue(test_group.permissions.count() > 0, msg="Test group should have permissions assigned.")

    @override_settings(
        USER_GROUPS={
            "test_group_bad_perm": {
                "permissions": ["view_user"],
                "order": 600,
                "label": "Test Group",
                "is_superuser": True,
                "is_staff": False,
            }
        }
    )
    def test_seed_groups_logs_permissions_invalid(self):
        """
        Test that the seed_groups command handles invalid permissions gracefully.
        """
        with self.assertLogs("users.management.commands.seed_groups", level="ERROR") as log:
            call_command("seed_groups")

        bad_permission = settings.USER_GROUPS["test_group_bad_perm"]["permissions"][0]
        # Check if the error for non-existent permission is logged
        self.assertIn(
            f"{self.log_prefix}Permission '{bad_permission}' has incorrect naming format. "
            "Expected format: '<app_label>.<permission_label>'.",
            log.output,
            msg="Expected log message for invalid permission format not found.",
        )

    @override_settings(
        USER_GROUPS={
            "test_group_bad_perm": {
                "permissions": ["perm.non_existent_permission"],
                "order": 600,
                "label": "Test Group",
                "is_superuser": True,
                "is_staff": False,
            }
        }
    )
    def test_seed_groups_logs_permissions_not_found(self):
        """
        Test that the seed_groups command handles invalid permissions gracefully.
        """
        with self.assertLogs("users.management.commands.seed_groups", level="ERROR") as log:
            call_command("seed_groups")

        # Check if the error for non-existent permission is logged
        self.assertIn(
            f"{self.log_prefix}Permission 'perm.non_existent_permission' does not exist.",
            log.output,
            msg="Expected log message for non-existent permission not found.",
        )

    @override_settings(
        USER_GROUPS={
            "test_group_bad_perm": {
                "permissions": ["view_user", "perm.non_existent_permission", "users.change_user"],
                "order": 600,
                "label": "Test Group",
                "is_superuser": True,
                "is_staff": False,
            }
        }
    )
    def test_seed_groups_handles_invalid_permissions(self):
        """
        Test that the seed_groups command handles invalid permissions gracefully.
        """
        with self.assertLogs("users.management.commands.seed_groups", level="ERROR"):
            call_command("seed_groups")

        group = Group.objects.get(name="test_group_bad_perm")

        # Check if the group has the valid permissions
        self.assertTrue(
            group.permissions.filter(codename="change_user").exists(),
            "Group 'test_group_bad_perm' should have 'change_user' permission.",
        )
        # Check that the invalid permissions were not added
        self.assertFalse(
            group.permissions.filter(codename="view_user").exists(),
            "Group 'test_group_bad_perm' should not have 'view_user' permission.",
        )

        self.assertFalse(
            group.permissions.filter(codename="non_existent_permission").exists(),
            "Group 'test_group_bad_perm' should not have 'non_existent_permission' permission.",
        )


class SeedSuperuserCommandTestCase(TestCase):
    def setUp(self):
        self.UserModel = get_user_model()

    def test_seed_superuser_command(self):
        """
        Test the seed_superuser command to ensure it creates a superuser with the correct attributes.
        """
        call_command("seed_groups")

        call_command("seed_superuser")

        # Check if the superuser was created
        superuser = self.UserModel.objects.get(email=settings.DJANGO_ADMIN_EMAIL)
        self.assertTrue(superuser.is_superuser, "Superuser should be created with is_superuser=True.")
        self.assertTrue(superuser.is_staff, "Superuser should be created with is_staff=True.")
        self.assertEqual(superuser.first_name, "User", "Superuser first name should be 'User'.")
        self.assertEqual(superuser.last_name, "Super", "Superuser last name should be 'Super'.")

        # Check if the user is in the correct group
        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME)
        self.assertIn(
            super_admin_group,
            superuser.groups.all(),
            "Superuser should be assigned to the Super Admin group.",
        )

    def test_seed_superuser_command_handles_existing_superuser(self):
        """
        Test that the seed_superuser command does not create a duplicate superuser if one already exists.
        """
        call_command("seed_groups")

        # Run the command the first time to create the superuser
        call_command("seed_superuser")

        self.assertEqual(
            self.UserModel.objects.filter(email=settings.DJANGO_ADMIN_EMAIL).count(),
            1,
            "A single Superuser should be created on the first run.",
        )

        # Run the command again
        call_command("seed_superuser")

        # Ensure the superuser count remains the same
        self.assertEqual(
            self.UserModel.objects.filter(email=settings.DJANGO_ADMIN_EMAIL).count(),
            1,
            "Superuser should not be duplicated on subsequent runs.",
        )

    def test_seed_superuser_handles_superuser_created_before_groups(self):
        """
        Test that the seed_superuser command can handle cases where the superuser is created before groups.
        """
        # Create the superuser first
        call_command("seed_superuser")

        # The superuser exists but has no groups assigned yet
        superuser = self.UserModel.objects.get(email=settings.DJANGO_ADMIN_EMAIL)
        self.assertEqual(
            superuser.groups.count(),
            0,
            msg="Superuser should not have any groups assigned before running seed_groups.",
        )

        # Now run the seed_groups command
        call_command("seed_groups")

        superuser = self.UserModel.objects.get(email=settings.DJANGO_ADMIN_EMAIL)
        self.assertEqual(
            superuser.groups.count(),
            0,
            msg="Superuser should still not have any groups assigned after running seed_groups.",
        )

        # Run again after seeding groups
        call_command("seed_superuser")

        # Check if the superuser is still in the correct group
        superuser = self.UserModel.objects.get(email=settings.DJANGO_ADMIN_EMAIL)
        self.assertEqual(
            superuser.groups.count(),
            1,
            msg="Superuser should have groups assigned after running seed_groups.",
        )
