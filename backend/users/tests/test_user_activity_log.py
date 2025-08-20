from auditlog.models import LogEntry
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from django.core.management import call_command
from django.test import Client, TestCase
from django.urls import reverse
from inertia import InertiaResponse

User = get_user_model()


class UserActivityLogViewTests(TestCase):
    def setUp(self):
        call_command("seed_groups")

        self.user_email = "test_activity@example.com"
        self.user_pass = "test_pass"

        self.user = User.objects.create_user(
            email=self.user_email, password=self.user_pass, first_name="Log", last_name="User"
        )

        super_admin_group = Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME)
        self.user.groups.add(super_admin_group)
        self.client = Client()

        self.activity_log_url = "users:manage-user-activity-log"
        self.test_user_activity_log_url = reverse(self.activity_log_url, kwargs={"user_id": self.user.id})

    def _create_log_entry(self, action, actor=None, obj=None):
        obj = obj or self.user

        return LogEntry.objects.create(
            actor=actor or self.user,
            action=action,
            content_type=(ContentType.objects.get_for_model(obj)),
            object_pk=str(obj.pk),
            object_repr=str(obj),
            changes="{}",
        )

    def test_activity_log_requires_login(self):
        response: InertiaResponse = self.client.get(self.test_user_activity_log_url)
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("users:login"), response.url)

    def test_activity_log_authenticated_shows_user_logs(self):
        self.client.login(email=self.user_email, password=self.user_pass)

        # Create log entries for this user
        self._create_log_entry(LogEntry.Action.CREATE)
        self._create_log_entry(LogEntry.Action.UPDATE)

        # Create a log entry for another user (should not appear)
        other_user = User.objects.create_user(email="other@example.com", password="other_pass")
        self._create_log_entry(LogEntry.Action.DELETE, actor=other_user)

        response: InertiaResponse = self.client.get(self.test_user_activity_log_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("table", response.props)

        items = response.props["table"]["items"]
        self.assertEqual(len(items), 2)

        actions = [item["action"].lower() for item in items]
        self.assertIn("create", actions)
        self.assertIn("update", actions)
        self.assertNotIn("delete", actions)

    def test_activity_log_pagination_and_sorting(self):
        self.client.login(email=self.user_email, password=self.user_pass)

        # Create multiple log entries
        for _ in range(15):
            self._create_log_entry(LogEntry.Action.ACCESS)

        paginated_url = f"{self.test_user_activity_log_url}?{settings.QUERY_PARAMS['PAGE_SIZE']}=5"
        response: InertiaResponse = self.client.get(paginated_url)
        self.assertEqual(response.status_code, 200)

        items = response.props["table"]["items"]
        self.assertEqual(len(items), 5)

        # Test sorting by date ascending
        response_asc = self.client.get(f"{self.test_user_activity_log_url}?{settings.QUERY_PARAMS['SORT']}=date")
        self.assertEqual(response_asc.status_code, 200)

        # Should not error and should return items
        self.assertTrue(len(response_asc.props["table"]["items"]) > 0)

    def test_activity_log_does_not_leak_other_user_logs(self):
        self.client.login(email=self.user_email, password=self.user_pass)

        # Create a log entry for another user
        other_user = User.objects.create_user(email="other2@example.com", password="other_pass2")
        self._create_log_entry(LogEntry.Action.CREATE, actor=other_user, obj=other_user)

        response: InertiaResponse = self.client.get(self.test_user_activity_log_url)
        items = response.props["table"]["items"]
        self.assertEqual(len(items), 0)

        other_user_url: str = reverse(self.activity_log_url, kwargs={"user_id": other_user.id})
        response: InertiaResponse = self.client.get(other_user_url)
        items = response.props["table"]["items"]
        self.assertEqual(len(items), 1)
