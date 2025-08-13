from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import Client, TestCase

User = get_user_model()


class HealthViewTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_health_endpoint(self):
        response = self.client.get("/health/")
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding="utf8"),
            {
                "status": "ok",
                "version": settings.VERSION,
                "revision": settings.REVISION,
                # Some data will vary and it's not worth checking
                "timestamp": response.json().get("timestamp"),
            },
        )

    def test_health_endpoint_authenticated(self):
        user_password = "test_pass"
        user = User.objects.create_user(email="test@example.com", password=user_password)
        self.client.login(email=user.email, password=user_password)

        response = self.client.get("/health/")
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding="utf8"),
            {
                "status": "ok",
                "version": settings.VERSION,
                "revision": settings.REVISION,
                "user_id": user.pk,
                # Some data will vary and it's not worth checking
                "timestamp": response.json().get("timestamp"),
            },
        )
