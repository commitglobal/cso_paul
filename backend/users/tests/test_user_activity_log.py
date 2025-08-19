import datetime as dt
from typing import Dict, List, Set, Union

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management import call_command
from django.db.models import Field
from django.test import Client, TestCase
from django.urls import reverse
from inertia import InertiaResponse

User = get_user_model()


class UserActivityLogViewTests(TestCase):
    """Tests for the manage user activity log endpoint."""

    def setUp(self):  # noqa: D401 (simple setup)
        call_command("seed_groups")
        self.admin: User = User.objects.create_user(
            email="test@example.com", password="test_pass", first_name="Test", last_name="User"
        )
        self.admin.groups.add(Group.objects.get(name=settings.SUPER_ADMIN_ROLE_NAME))

        self.client: Client = Client()

    def _login_and_generate_updates(self):
        # Login triggers a last_login update which should appear in audit log
        self.client.login(email="test@example.com", password="test_pass")

        # Additional updates to create more audit log entries
        self.admin.first_name = "Test2"
        self.admin.save(update_fields=["first_name"])

        self.admin.last_name = "User2"
        self.admin.save(update_fields=["last_name"])

    def _extra_update_to_first_name(self):
        self.admin.first_name = "Test3"
        self.admin.save(update_fields=["first_name"])

    def _extract_field_changes(self, field_name: str, items: List[Dict]) -> List[str]:
        model_field: Field = self.admin._meta.get_field(field_name)
        verbose_label: str = str(model_field.verbose_name).lower()

        matched: List[str] = []
        for item in items:
            for change in item.get("changes", []):
                label: str = change.split(":", 1)[0].strip().lower().replace("_", " ")

                if label == verbose_label:
                    matched.append(change)

        return matched

    def test_manage_user_activity_log_requires_login(self):
        response: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id})
        )
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("users:login"), response.url)

    def test_activity_log_contains_last_login_serialized_without_none_prefix(self):
        self._login_and_generate_updates()

        response: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id})
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("table", response.props)

        table: Dict[str, Union[int, List[Dict]]] = response.props["table"]
        self.assertIn("items", table)

        items: List[Dict] = table["items"]
        self.assertGreaterEqual(len(items), 1)

        last_login_changes: List[str] = self._extract_field_changes(field_name="last_login", items=items)
        self.assertEqual(len(last_login_changes), 1, "Expected at least one log entry with last_login change")

        first_last_login_change: str = last_login_changes[0]
        modification_part: str = first_last_login_change.split(":", 1)[1].strip()
        self.assertNotIn(
            "->",
            modification_part,
            "Initial last_login change should not include '->' when initial value was None",
        )

        for entry in items:
            self.assertNotIn("create", entry["action"].lower())

    def test_activity_log_headers_present(self):
        self._login_and_generate_updates()
        response: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id})
        )
        self.assertEqual(response.status_code, 200)

        table: Dict[str, Union[int, List[Dict]]] = response.props["table"]
        headers: Set[str] = {h["accessorKey"] for h in table["header"]}
        self.assertSetEqual(headers, {"action", "content_type", "changes", "date"})

    def test_activity_log_sorting(self):
        self._login_and_generate_updates()
        # Ascending
        asc_response: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id}) + "?sort=date,asc"
        )
        self.assertEqual(asc_response.status_code, 200)

        asc_items: List[dict] = asc_response.props["table"]["items"]
        asc_dates: List[dt.datetime] = [dt.datetime.strptime(i["date"], "%Y-%m-%d %H:%M:%S") for i in asc_items]
        self.assertEqual(asc_dates, sorted(asc_dates))

        # Descending
        desc_response: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id}) + "?sort=date,desc"
        )
        self.assertEqual(desc_response.status_code, 200)
        desc_items: List[dict] = desc_response.props["table"]["items"]
        desc_dates = [dt.datetime.strptime(i["date"], "%Y-%m-%d %H:%M:%S") for i in desc_items]
        self.assertEqual(desc_dates, sorted(desc_dates, reverse=True))

    def test_activity_log_pagination(self):
        self._login_and_generate_updates()
        response_page_1: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id}) + "?page_size=1&page=1"
        )
        self.assertEqual(response_page_1.status_code, 200)
        table_1: Dict[str, Union[int, List[Dict]]] = response_page_1.props["table"]
        self.assertEqual(len(table_1["items"]), 1)

        total_items: int = table_1["totalItems"]
        total_pages: int = table_1["totalPages"]
        self.assertGreaterEqual(total_items, 3)  # login + 2 updates
        self.assertGreaterEqual(total_pages, 3)

        response_page_2: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id}) + "?page_size=1&page=2"
        )
        self.assertEqual(response_page_2.status_code, 200)

        table_2: Dict[str, Union[int, List[Dict]]] = response_page_2.props["table"]
        self.assertEqual(len(table_2["items"]), 1)

        # Items on different pages should not be identical (even if timestamps truncated to same second)
        self.assertNotEqual(
            table_1["items"][0],
            table_2["items"][0],
            "Expected different log entries on different pages",
        )

    def test_serialization_format_for_non_none_field_changes(self):
        self._login_and_generate_updates()
        self._extra_update_to_first_name()
        response: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id})
        )
        self.assertEqual(response.status_code, 200)
        items: List[dict] = response.props["table"]["items"]

        first_name_changes: List[str] = self._extract_field_changes(field_name="first_name", items=items)
        self.assertEqual(len(first_name_changes), 2, "Expected two first_name changes")

        # Accept either arrow format (old -> new) or comma-separated multi-value
        has_expected_format: bool = any(
            ("->" in c.split(":", 1)[1] or "," in c.split(":", 1)[1]) for c in first_name_changes
        )
        self.assertTrue(
            has_expected_format,
            "Expected serialized first_name change with 'old -> new' or comma-separated multi-value format",
        )

    def test_invalid_sort_falls_back_to_default_desc_date(self):
        self._login_and_generate_updates()
        # Get ordering with invalid sort
        invalid_sort_response: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id}) + "?sort=badfield,asc"
        )
        default_response: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id})
        )
        self.assertEqual(invalid_sort_response.status_code, 200)
        self.assertEqual(default_response.status_code, 200)

        invalid_dates: List[dt.datetime] = [
            dt.datetime.strptime(i["date"], "%Y-%m-%d %H:%M:%S") for i in invalid_sort_response.props["table"]["items"]
        ]
        default_dates: List[dt.datetime] = [
            dt.datetime.strptime(i["date"], "%Y-%m-%d %H:%M:%S") for i in default_response.props["table"]["items"]
        ]
        self.assertListEqual(invalid_dates, default_dates, "Invalid sort should fall back to default ordering")

    def test_actions_include_update(self):
        self._login_and_generate_updates()
        response: InertiaResponse = self.client.get(
            reverse("users:manage-user-activity-log", kwargs={"user_id": self.admin.id})
        )
        self.assertEqual(response.status_code, 200)

        actions: Set[str] = {item["action"].lower() for item in response.props["table"]["items"]}
        self.assertIn("update", actions)
