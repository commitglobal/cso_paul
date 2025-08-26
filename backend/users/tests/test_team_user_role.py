import json

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management import call_command
from django.test import Client, TestCase
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from inertia import InertiaResponse

from users.models import User

UserModel = get_user_model()


class TeamUserRoleViewTests(TestCase):
    def setUp(self):
        call_command("seed_groups")
        self.admin_email = "test@example.com"
        self.user_email = "user@example.com"
        self.user_password = "test_pass"

        self.admin: User = UserModel.objects.create_user(
            email=self.admin_email,
            password=self.user_password,
            first_name="Admin",
            last_name="User",
        )

        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME)
        self.admin.groups.add(super_admin_group)
        self.admin.update_main_role()

        self.user: User = UserModel.objects.create_user(
            email=self.user_email,
            password=self.user_password,
            first_name="User",
            last_name="Test",
        )

        user_group = Group.objects.get(name=settings.USER_ROLE_NAME)
        self.user.groups.add(user_group)
        self.user.update_main_role()

        self.client = Client()

    def test_get_requires_login(self):
        response = self.client.get(reverse("users:manage-user-role", kwargs={"user_id": self.admin.id}))
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("users:login"), response.url)

    def test_get_authenticated_returns_role_props(self):
        self.client.login(email=self.admin_email, password=self.user_password)
        response: InertiaResponse = self.client.get(
            reverse("users:manage-user-role", kwargs={"user_id": self.admin.id}),
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("userRole", response.props)
        self.assertIn("roles", response.props)
        self.assertTrue(any(r["value"] == self.admin.main_role for r in response.props["roles"]))

    def test_post_valid_changes_role(self):
        target_groups = settings.USER_GROUPS_ASSIGNABLE
        self.assertGreater(len(target_groups), 0)

        self.client.login(email=self.admin_email, password=self.user_password)

        for new_role in target_groups:
            post_data = json.dumps({"main_role": new_role})
            response: InertiaResponse = self.client.post(
                reverse("users:manage-user-role", kwargs={"user_id": self.user.id}),
                data=post_data,
                content_type="application/json",
            )

            self.assertTrue(self.admin.has_perm("users.change_role"))

            self.assertEqual(response.status_code, 200)
            self.user.refresh_from_db()
            self.assertEqual(self.user.main_role, new_role)

    def test_post_own_role_error(self):
        target_groups = settings.USER_GROUPS_ASSIGNABLE
        self.assertGreater(len(target_groups), 0)

        self.client.login(email=self.admin_email, password=self.user_password)

        for new_role in target_groups:
            post_data = json.dumps({"main_role": new_role})
            response: InertiaResponse = self.client.post(
                reverse("users:manage-user-role", kwargs={"user_id": self.admin.id}),
                data=post_data,
                content_type="application/json",
            )

            self.assertEqual(response.status_code, 200)

            self.assertIn("errors", response.props)
            self.assertIn("role", response.props["errors"])
            self.assertIn("main_role", response.props["errors"]["role"])
            self.assertEqual(response.props["errors"]["role"]["main_role"], [_("You cannot change your own role.")])

            self.admin.refresh_from_db()
            self.assertNotEqual(self.admin.main_role, new_role)
            self.assertEqual(self.admin.main_role, settings.SUPER_ADMIN_ROLE_NAME)

    def test_post_user_error(self):
        target_groups = settings.USER_GROUPS_ASSIGNABLE
        self.assertGreater(len(target_groups), 0)

        self.client.login(email=self.user_email, password=self.user_password)

        for new_role in target_groups:
            post_data = json.dumps({"main_role": new_role})
            response: InertiaResponse = self.client.post(
                reverse("users:manage-user-role", kwargs={"user_id": self.admin.id}),
                data=post_data,
                content_type="application/json",
            )

            self.assertEqual(response.status_code, 200)

            self.assertIn("errors", response.props)
            self.assertIn("role", response.props["errors"])
            self.assertIn("main_role", response.props["errors"]["role"])
            self.assertEqual(
                response.props["errors"]["role"]["main_role"],
                [_("You don't have the permission to change this user's role.")],
            )

            self.assertFalse(self.user.has_perm("users.change_role"))

            self.admin.refresh_from_db()
            self.assertNotEqual(self.admin.main_role, new_role)
            self.assertEqual(self.admin.main_role, settings.SUPER_ADMIN_ROLE_NAME)

    def test_manage_user_role_post_invalid_returns_errors(self):
        self.client.login(email=self.admin_email, password=self.user_password)

        post_data = json.dumps({"main_role": "invalid_role"})
        response: InertiaResponse = self.client.post(
            reverse("users:manage-user-role", kwargs={"user_id": self.user.id}),
            data=post_data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("errors", response.props)
        self.assertIn("role", response.props["errors"])
        self.assertIn("main_role", response.props["errors"]["role"])
        self.assertEqual(len(response.props["errors"]["role"]["main_role"]), 1)
        self.assertIn("invalid_role", response.props["errors"]["role"]["main_role"][0])

    def test_manage_user_role_not_assignable_by_ngo_user(self):
        target_groups = settings.USER_GROUPS_UNASSIGNABLE
        self.assertGreater(len(target_groups), 0)

        self.client.login(email=self.admin_email, password=self.user_password)

        for role in target_groups:
            self.admin.set_main_role(role=role)
            self.admin.save()

            response: InertiaResponse = self.client.get(
                reverse("users:manage-user-role", kwargs={"user_id": self.admin.id}),
            )
            self.assertEqual(response.status_code, 200)

            enabled_roles = [r for r in response.props["roles"] if not r["disabled"]]
            self.assertEqual(len(enabled_roles), 1)

            enabled_role = enabled_roles[0]
            self.assertEqual(enabled_role["value"], role)
            self.assertIn("This user can't be assigned to any other role.", str(enabled_role["description"]))


class TeamUserRoleDialogTests(TestCase):
    def setUp(self):
        call_command("seed_groups")
        self.admin_email = "test@example.com"
        self.user_email = "user@example.com"
        self.user_password = "test_pass"

        self.admin: User = UserModel.objects.create_user(
            email=self.admin_email,
            password=self.user_password,
            first_name="Admin",
            last_name="User",
        )

        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME)
        self.admin.groups.add(super_admin_group)
        self.admin.update_main_role()

        self.user: User = UserModel.objects.create_user(
            email=self.user_email,
            password=self.user_password,
            first_name="User",
            last_name="Test",
        )

        user_group = Group.objects.get(name=settings.USER_ROLE_NAME)
        self.user.groups.add(user_group)
        self.user.update_main_role()

        self.client = Client()

    def test_post_with_next_url_redirects(self):
        next_url: str = reverse("users:manage-team")

        self.client.login(email=self.admin_email, password=self.user_password)

        target_groups = settings.USER_GROUPS_UNASSIGNABLE
        for new_role in target_groups:
            response: InertiaResponse = self.client.post(
                reverse("users:manage-user-role", kwargs={"user_id": self.user.id}, query={"next": next_url}),
                data={"main_role": new_role},
                content_type="application/json",
            )

            self.user.refresh_from_db()
            self.assertEqual(self.user.main_role, new_role)
            self.assertRedirects(response, next_url)
