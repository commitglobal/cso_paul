from datetime import datetime

from django.test import SimpleTestCase, override_settings

from tools.display.format_dates import short_date, short_datetime
from tools.display.url_build import build_ngohub_url


class TestBuildUrl(SimpleTestCase):
    @override_settings(NGOHUB_APP_HOST="https://app.example.org")
    def test_build_ngohub_url_with_elements(self):
        url = build_ngohub_url(["a", "b", "c"])  # type: ignore[arg-type]
        self.assertEqual(url, "https://app.example.org/a/b/c")

    @override_settings(NGOHUB_APP_HOST="https://app.example.org")
    def test_build_ngohub_url_without_elements(self):
        url = build_ngohub_url()
        self.assertEqual(url, "https://app.example.org/")


class TestFormatDates(SimpleTestCase):
    def test_short_date_formats(self):
        d = datetime(2024, 5, 9, 13, 47, 12)
        self.assertEqual(short_date(d), "09.05.2024")

    def test_short_date_none(self):
        self.assertEqual(short_date(None), "—")  # type: ignore[arg-type]

    def test_short_datetime_formats(self):
        d = datetime(2024, 5, 9, 3, 7, 12)
        self.assertEqual(short_datetime(d), "09.05.2024, 03:07")

    def test_short_datetime_none(self):
        self.assertEqual(short_datetime(None), "—")  # type: ignore[arg-type]
