from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase

User = get_user_model()


class GenerateMockUsersCommandTestCase(TestCase):
    def test_generate_mock_users_command_default_count(self):
        initial_count = User.objects.count()
        call_command("generate_mock_users")

        self.assertEqual(User.objects.count(), initial_count + 10)

    def test_generate_mock_users_command(self):
        initial_count = User.objects.count()
        call_command("generate_mock_users", count=5)

        self.assertEqual(User.objects.count(), initial_count + 5)
