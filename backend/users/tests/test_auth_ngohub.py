from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings
from django.urls import reverse
from inertia import InertiaResponse

User = get_user_model()


class AuthNgohubLoginViewsTests(TestCase):
    def setUp(self):
        self.client = Client()


@override_settings(ENABLE_NGOHUB_AUTH=True)
class AuthNgohubLoginEnabledViewsTests(AuthNgohubLoginViewsTests):
    def test_ngohub_login_enabled(self):
        response: InertiaResponse = self.client.get(reverse("users:login"))
        self.assertTrue(response.props.get("endpoints", {}).get("is_ngohub_auth_enabled"))

    def test_ngohub_login_get(self):
        response: InertiaResponse = self.client.get(reverse("users:login-by-ngohub"))
        self.assertEqual(response.status_code, 200)

    def test_ngohub_login_handles_next_url(self):
        next_url = reverse("users:manage-team")
        response: InertiaResponse = self.client.get(f"{reverse('users:login-by-ngohub')}?next={next_url}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("next_url", response.props)
        self.assertEqual(response.props["next_url"], next_url)

    def test_ngohub_login_handles_invalid_next_url(self):
        next_url = "https://invalid.example.com"
        response: InertiaResponse = self.client.get(f"{reverse('users:login-by-ngohub')}?next={next_url}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("next_url", response.props)
        self.assertEqual(response.props["next_url"], reverse("dashboard:home"))


@override_settings(ENABLE_NGOHUB_AUTH=False)
class AuthNgohubLoginDisabledViewsTests(AuthNgohubLoginViewsTests):
    def test_ngohub_login_disabled(self):
        response: InertiaResponse = self.client.get(reverse("users:login"))
        self.assertFalse(response.props.get("endpoints", {}).get("is_ngohub_auth_enabled"))

    def test_ngohub_login_get(self):
        response: InertiaResponse = self.client.get(reverse("users:login-by-ngohub"))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, reverse("users:login"))
