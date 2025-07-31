from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management import call_command
from django.test import Client, TestCase
from django.urls import reverse_lazy
from inertia import InertiaResponse

User = get_user_model()


endpoints = [
    reverse_lazy("users:manage-team"),
]


class BasePropertiesSuperAdminTests(TestCase):
    def setUp(self):
        call_command("seed_groups")

        self.user = User.objects.create_user(email="test@example.com", password="test_pass")

        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN)
        self.user.groups.add(super_admin_group)

        self.client = Client()
        self.client.login(email="test@example.com", password="test_pass")

    def test_base_page_properties(self):
        for endpoint in endpoints:
            with self.subTest(endpoint=endpoint):
                response: InertiaResponse = self.client.get(endpoint)

                self.assertEqual(response.status_code, 200)

                self.assertIn("title", response.props)
                self.assertIn("description", response.props)
                self.assertIn("breadcrumbs", response.props)
