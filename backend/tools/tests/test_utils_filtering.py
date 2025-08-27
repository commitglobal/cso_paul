from datetime import datetime, timedelta, timezone

from django.test import RequestFactory, SimpleTestCase

from tools.data_models.filtering import FilterField, FilterItem
from tools.tests.configuration import FakeQS
from tools.utils.filtering import build_filters_display, build_filters_mapping, filter_qs


class TestFiltering(SimpleTestCase):
    def setUp(self):
        now = datetime.now(tz=timezone.utc)
        self.items = [
            {"id": 1, "username": "alice", "date_joined": (now - timedelta(days=3)).isoformat()},
            {"id": 2, "username": "bob", "date_joined": (now - timedelta(days=2)).isoformat()},
            {"id": 3, "username": "carol", "date_joined": (now - timedelta(days=1)).isoformat()},
        ]
        self.qs = FakeQS(self.items)
        self.factory = RequestFactory()

    def test_build_filters_display(self):
        fields = [
            FilterField(
                label="User",
                value="username",
                kind="combobox",
                items=[FilterItem(value="alice", label="Alice"), FilterItem(value="bob", label="Bob")],
            ),
            FilterField(label="Joined", value="date_joined", kind="calendar", items=[]),
        ]
        display = build_filters_display(fields)
        self.assertEqual(display["User"]["kind"], "combobox")
        self.assertEqual(
            display["User"]["items"], [{"value": "alice", "label": "Alice"}, {"value": "bob", "label": "Bob"}]
        )
        self.assertEqual(display["Joined"]["kind"], "calendar")

    def test_build_filters_mapping(self):
        fields = [
            FilterField(label="User", value="username", kind="combobox", items=[]),
            FilterField(label="Joined", value="date_joined", kind="calendar", items=[]),
        ]
        mapping = build_filters_mapping(fields)
        self.assertEqual(mapping["User"], "username")
        self.assertEqual(mapping["Joined__lte"], "date_joined__lte")
        self.assertEqual(mapping["Joined__gte"], "date_joined__gte")

    def test_filter_qs_single_value(self):
        filters = {"User": "username"}
        request = self.factory.get("/", {"User": "alice"})
        result = filter_qs(filters, request, self.qs)
        self.assertEqual([i["username"] for i in result.items], ["alice"])

    def test_filter_qs_multiple_values_in(self):
        filters = {"User": "username"}
        request = self.factory.get("/", {"User": "alice,bob"})
        result = filter_qs(filters, request, self.qs)
        self.assertEqual([i["username"] for i in result.items], ["alice", "bob"])

    def test_filter_qs_ignores_unknown_and_empty(self):
        filters = {"User": "username"}
        request = self.factory.get("/", {"User": "", "Unknown": "value"})
        result = filter_qs(filters, request, self.qs)
        self.assertEqual([i["username"] for i in result.items], ["alice", "bob", "carol"])

    def test_filter_qs_calendar_range(self):
        filters = {"Joined__gte": "date_joined__gte", "Joined__lte": "date_joined__lte"}
        gte = self.items[1]["date_joined"]  # bob's join date
        lte = self.items[2]["date_joined"]  # carol's join date
        request = self.factory.get("/", {"Joined__gte": gte, "Joined__lte": lte})
        result = filter_qs(filters, request, self.qs)
        self.assertEqual([i["username"] for i in result.items], ["bob", "carol"])
