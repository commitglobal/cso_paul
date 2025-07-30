from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse
from inertia import InertiaResponse

User = get_user_model()


class AuthViewsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(email="test@example.com", password="test_pass")

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

    def test_email_login_post_valid(self):
        response: InertiaResponse = self.client.post(
            reverse("users:login-by-email"),
            data={"email": "test@example.com", "password": "test_pass", "remember": True},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 302)

    def test_logout_post(self):
        self.client.login(email="test@example.com", password="test_pass")
        response: InertiaResponse = self.client.post(reverse("users:logout"))
        self.assertEqual(response.status_code, 302)

    def test_logout_get_raises_404(self):
        self.client.login(email="test@example.com", password="test_pass")
        response: InertiaResponse = self.client.get(reverse("users:logout"))
        self.assertEqual(response.status_code, 404)

    def test_ngohub_login_not_implemented(self):
        with self.assertRaises(NotImplementedError):
            self.client.get(reverse("users:login-by-ngohub"))
