from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management import call_command
from django.test import Client, TestCase
from django.urls import reverse
from inertia import InertiaResponse

User = get_user_model()


class TeamViewsTests(TestCase):
    def setUp(self):
        call_command("seed_groups")

        self.user = User.objects.create_user(email="test@example.com", password="test_pass")

        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN)
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
