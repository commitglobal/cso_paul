from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

User = get_user_model()


class TestUserGetRolesApi(TestCase):
    def setUp(self):
        super().setUp()

        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    def test_get_roles_success(self):
        response = self.client.get(reverse("api:get-user-roles", kwargs={"user_id": self.user.pk}))
        self.assertEqual(response.status_code, 200)
        self.assertIn("roles", response.json())
        self.assertIsInstance(response.json()["roles"], list)

    def test_get_roles_unauthenticated_redirect_to_login(self):
        self.client.logout()

        api_url = reverse("api:get-user-roles", kwargs={"user_id": self.user.pk})
        response = self.client.get(api_url)
        self.assertRedirects(response, f"{reverse('users:login')}?next={api_url}")
