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
        self.admin_email = "test@example.com"
        self.user_password = "test_pass"
        self.user = User.objects.create_user(
            email=self.admin_email, password=self.user_password, first_name="Test", last_name="User"
        )

        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME)
        self.user.groups.add(super_admin_group)
        self.client = Client()

    def test_manage_user_info_requires_login(self):
        response = self.client.get(reverse("users:manage-user-info", kwargs={"user_id": self.user.id}))
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("users:login"), response.url)

    def test_manage_user_info_authenticated_returns_user_props(self):
        self.client.login(email=self.admin_email, password=self.user_password)
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
