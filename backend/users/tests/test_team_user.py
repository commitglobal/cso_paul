import json

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management import call_command
from django.test import Client, TestCase
from django.urls import reverse
from inertia import InertiaResponse

User = get_user_model()


class TeamUserInfoViewTests(TestCase):
    def setUp(self):
        call_command("seed_groups")
        self.user = User.objects.create_user(
            email="test@example.com", password="test_pass", first_name="Test", last_name="User"
        )

        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME)
        self.user.groups.add(super_admin_group)
        self.client = Client()

    def test_manage_user_info_requires_login(self):
        response = self.client.get(reverse("users:manage-user-info", kwargs={"user_id": self.user.id}))
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("users:login"), response.url)

    def test_manage_user_info_authenticated_returns_user_props(self):
        self.client.login(email="test@example.com", password="test_pass")
        response: InertiaResponse = self.client.get(
            reverse("users:manage-user-info", kwargs={"user_id": self.user.id}),
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("props", response.props)

        props = response.props["props"]
        name_prop = next((p for p in props if p["label"] == "Name"), None)
        email_prop = next((p for p in props if p["label"] == "Email"), None)

        self.assertIsNotNone(name_prop)
        self.assertEqual(name_prop["value"], f"{self.user.first_name} {self.user.last_name}")
        self.assertIsNotNone(email_prop)
        self.assertEqual(email_prop["value"], self.user.email)


class TeamUserRoleViewTests(TestCase):
    def setUp(self):
        call_command("seed_groups")
        self.user = User.objects.create_user(
            email="test@example.com", password="test_pass", first_name="Test", last_name="User"
        )
        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME)
        self.user.groups.add(super_admin_group)
        self.client = Client()

    def test_manage_user_role_requires_login(self):
        response = self.client.get(reverse("users:manage-user-role", kwargs={"user_id": self.user.id}))
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("users:login"), response.url)

    def test_manage_user_role_authenticated_returns_role_props(self):
        self.client.login(email="test@example.com", password="test_pass")
        response: InertiaResponse = self.client.get(
            reverse("users:manage-user-role", kwargs={"user_id": self.user.id}),
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("userRole", response.props)
        self.assertIn("roles", response.props)
        self.assertTrue(any(r["value"] == self.user.main_role for r in response.props["roles"]))

    def test_manage_user_role_post_valid_changes_role(self):
        self.client.login(email="test@example.com", password="test_pass")
        # Pick a role different from current
        available_roles = [
            role
            for role in settings.USER_GROUPS
            if role != self.user.main_role and settings.USER_GROUPS[role]["is_assignable_by_ngo_user"]
        ]

        for new_role in available_roles:
            post_data = json.dumps({"main_role": new_role})
            response: InertiaResponse = self.client.post(
                reverse("users:manage-user-role", kwargs={"user_id": self.user.id}),
                data=post_data,
                content_type="application/json",
            )

            self.assertEqual(response.status_code, 200)
            self.user.refresh_from_db()
            self.assertEqual(self.user.main_role, new_role)

    def test_manage_user_role_post_invalid_returns_errors(self):
        self.client.login(email="test@example.com", password="test_pass")

        post_data = json.dumps({"main_role": "invalid_role"})
        response: InertiaResponse = self.client.post(
            reverse("users:manage-user-role", kwargs={"user_id": self.user.id}),
            data=post_data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("errors", response.props)

    def test_manage_user_role_post_super_admin_forbidden(self):
        self.client.login(email="test@example.com", password="test_pass")
        self.user.main_role = settings.SUPER_ADMIN_ROLE_NAME
        self.user.save()

        post_data = json.dumps({"main_role": self.user.main_role})
        response: InertiaResponse = self.client.post(
            reverse("users:manage-user-role", kwargs={"user_id": self.user.id}),
            data=post_data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)

    def test_manage_user_role_not_assignable_by_ngo_user(self):
        self.client.login(email="test@example.com", password="test_pass")

        # Find a role that is not assignable by NGO user
        unassignable_roles = [
            r for r in settings.USER_GROUPS if not settings.USER_GROUPS[r]["is_assignable_by_ngo_user"]
        ]
        if not unassignable_roles:
            self.skipTest("No non-assignable roles available for test.")

        for role in unassignable_roles:
            self.user.main_role = role
            self.user.save()

            response: InertiaResponse = self.client.get(
                reverse("users:manage-user-role", kwargs={"user_id": self.user.id}),
            )
            self.assertEqual(response.status_code, 200)

            enabled_roles = [r for r in response.props["roles"] if not r["disabled"]]
            self.assertEqual(len(enabled_roles), 1)

            enabled_role = enabled_roles[0]
            self.assertEqual(enabled_role["value"], role)
            self.assertIn("This user can't be assigned to any other role.", str(enabled_role["description"]))
