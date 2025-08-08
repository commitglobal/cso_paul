import json

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management import call_command
from django.test import Client, TestCase
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from faker import Faker
from inertia import InertiaResponse

User = get_user_model()


class TeamViewsTests(TestCase):
    def setUp(self):
        call_command("seed_groups")

        self.user = User.objects.create_user(email="test@example.com", password="test_pass")

        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME)
        self.user.groups.add(super_admin_group)

        self.client = Client()

    def test_manage_team_requires_login(self):
        response: InertiaResponse = self.client.get(reverse("users:manage-team"))

        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("users:login"), response.url)

    def test_manage_team_authenticated_can_see_users_prop(self):
        num_users = 5

        self.client.login(email="test@example.com", password="test_pass")
        call_command("generate_mock_users", count=num_users)

        response: InertiaResponse = self.client.get(reverse("users:manage-team"))

        self.assertEqual(response.status_code, 200)

        self.assertIn("users", response.props)
        self.assertEqual(len(response.props["users"]), num_users + 1)

    def test_manage_team_authenticated_can_see_search_query(self):
        num_users = 5

        self.client.login(email="test@example.com", password="test_pass")
        call_command("generate_mock_users", count=num_users)

        response: InertiaResponse = self.client.get(reverse("users:manage-team"), {"search": "test"})

        self.assertEqual(response.status_code, 200)

        self.assertIn("search_query", response.props)
        self.assertEqual(response.props["search_query"], "test")

    def test_manage_team_authenticated_can_see_pagination_props(self):
        num_users = 10

        self.client.login(email="test@example.com", password="test_pass")
        call_command("generate_mock_users", count=num_users)

        current_page = 2
        page_size = 5

        response: InertiaResponse = self.client.get(
            reverse("users:manage-team"), {"page": current_page, "page_size": page_size}
        )

        self.assertEqual(response.status_code, 200)

        self.assertIn("pagination", response.props)
        self.assertEqual(response.props["pagination"]["current_page"], current_page)
        self.assertEqual(response.props["pagination"]["per_page"], page_size)
        self.assertEqual(response.props["pagination"]["num_pages"], (num_users + 1) // page_size + 1)
        self.assertEqual(response.props["pagination"]["total_items"], num_users + 1)


class TeamAddMemberTests(TestCase):
    def setUp(self):
        call_command("seed_groups")

        self.user = User.objects.create_user(email="test@example.com", password="test_pass")

        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME)
        self.user.groups.add(super_admin_group)

        self.client = Client()

        fake = Faker()
        self.new_user_email = fake.email()
        self.new_user_f_name = fake.first_name()
        self.new_user_l_name = fake.last_name()

    def test_add_member_requires_login(self):
        response: InertiaResponse = self.client.post(reverse("users:manage-team"), data={})
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("users:login"), response.url)

    def test_add_member_authenticated_can_add_user(self):
        self.client.login(email="test@example.com", password="test_pass")
        new_user_data = {
            "email": self.new_user_email,
            "first_name": self.new_user_f_name,
            "last_name": self.new_user_l_name,
        }
        response: InertiaResponse = self.client.post(
            reverse("users:manage-team"), data=json.dumps(new_user_data), content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

    def test_add_member_invalid_email(self):
        self.client.login(email="test@example.com", password="test_pass")
        new_user_data = {
            "first_name": self.new_user_f_name,
            "last_name": self.new_user_l_name,
        }
        response: InertiaResponse = self.client.post(
            reverse("users:manage-team"), data=json.dumps(new_user_data), content_type="application/json"
        )

        self.assertIn("errors", response.props)
        self.assertIn("team", response.props["errors"])
        self.assertIn("email", response.props["errors"]["team"])
        self.assertEqual(response.props["errors"]["team"]["email"], [_("This field is required.")])

    def test_add_member_existing_user(self):
        self.client.login(email="test@example.com", password="test_pass")
        new_user_data = {
            "email": "test@example.com",
            "first_name": self.new_user_f_name,
            "last_name": self.new_user_l_name,
        }
        response: InertiaResponse = self.client.post(
            reverse("users:manage-team"), data=json.dumps(new_user_data), content_type="application/json"
        )

        self.assertIn("errors", response.props)
        self.assertIn("team", response.props["errors"])
        self.assertIn("email", response.props["errors"]["team"])
        self.assertEqual(response.props["errors"]["team"]["email"], [_("User with this email already exists.")])
