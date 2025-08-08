from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.test import Client, TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from inertia import InertiaResponse

User = get_user_model()


class AuthEmailLoginViewsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(email="test@example.com", password="test_pass")


@override_settings(ENABLE_EMAIL_AUTH=True)
class AuthEmailLoginEnabledTests(AuthEmailLoginViewsTests):
    def test_email_login_enabled(self):
        response: InertiaResponse = self.client.get(reverse("users:login"))
        self.assertTrue(response.props.get("endpoints", {}).get("is_email_auth_enabled"))

    def test_email_login_get(self):
        response: InertiaResponse = self.client.get(reverse("users:login-by-email"))
        self.assertEqual(response.status_code, 200)
        self.assertIn("endpoints", response.props)

    def test_email_login_post_invalid(self):
        response: InertiaResponse = self.client.post(
            reverse("users:login-by-email"),
            data={"email": "wrong@example.com", "password": "wrong", "remember": False},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("errors", response.props)

    def test_email_login_post_valid_default_redirect(self):
        response: InertiaResponse = self.client.post(
            reverse("users:login-by-email"),
            data={"email": "test@example.com", "password": "test_pass", "remember": True},
            content_type="application/json",
        )

        next_url = reverse("dashboard:home")

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, next_url)

    def test_email_login_post_valid(self):
        next_url = reverse("users:manage-team")
        response: InertiaResponse = self.client.post(
            reverse("users:login-by-email"),
            data={"email": "test@example.com", "password": "test_pass", "next": next_url, "remember": True},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, next_url)

        now = timezone.now().replace(second=0, microsecond=0)
        session_expiry = Session.objects.get(session_key=self.client.session.session_key).expire_date.replace(
            second=0, microsecond=0
        )

        self.assertEqual(session_expiry, now + timedelta(seconds=settings.SESSION_COOKIE_AGE_EXTENDED))

    def test_email_login_post_valid_no_remember(self):
        next_url = reverse("users:manage-team")
        response: InertiaResponse = self.client.post(
            reverse("users:login-by-email"),
            data={"email": "test@example.com", "password": "test_pass", "next": next_url, "remember": False},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, next_url)

        now = timezone.now().replace(second=0, microsecond=0)
        session_expiry = Session.objects.get(session_key=self.client.session.session_key).expire_date.replace(
            second=0, microsecond=0
        )

        self.assertEqual(session_expiry, now + timedelta(seconds=settings.SESSION_COOKIE_AGE))

    def test_logout_post(self):
        self.client.login(email="test@example.com", password="test_pass")
        response: InertiaResponse = self.client.post(reverse("users:logout"))
        self.assertEqual(response.status_code, 302)

    def test_logout_get_raises_404(self):
        self.client.login(email="test@example.com", password="test_pass")
        response: InertiaResponse = self.client.get(reverse("users:logout"))
        self.assertEqual(response.status_code, 404)

    def test_double_login_redirect(self):
        # Ensure that a user cannot log in twice without logging out
        self.client.login(email="test@example.com", password="test_pass")

        response: InertiaResponse = self.client.post(
            reverse("users:login-by-email"),
            data={"email": "wrong@example.com", "password": "wrong", "remember": False},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(reverse("dashboard:home"), response.url)


@override_settings(ENABLE_EMAIL_AUTH=False)
class AuthEmailLoginDisabledTests(AuthEmailLoginViewsTests):
    def test_email_login_disabled(self):
        response: InertiaResponse = self.client.get(reverse("users:login"))
        self.assertFalse(response.props.get("endpoints", {}).get("is_email_auth_enabled"))

    def test_email_login_disabled_redirects_to_login(self):
        response: InertiaResponse = self.client.get(reverse("users:login-by-email"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse("users:login"))

    def test_email_login_disabled_post_redirects_to_login(self):
        response: InertiaResponse = self.client.post(
            reverse("users:login-by-email"),
            data={"email": "test@example.com", "password": "test_pass", "remember": True},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse("users:login"))
