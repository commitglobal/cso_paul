from django.test import SimpleTestCase

from tools.tests.configuration import FakeQS
from tools.utils.search import search


class TestSearch(SimpleTestCase):
    def test_empty_query_returns_qs(self):
        qs = object()
        self.assertIs(search("", qs, language_code="en", search_fields=["name"]), qs)
        self.assertIs(search(None, qs, language_code="en", search_fields=["name"]), qs)  # type: ignore[arg-type]

    def test_non_empty_query_calls_annotate_and_filter(self):
        qs = FakeQS()
        result = search("alice", qs, language_code="en", search_fields=["username", "email"])
        self.assertIs(result, qs)
        self.assertTrue(qs.annotated)
        self.assertTrue(qs.filtered)
        # ensure filter was called with a 'search' keyword
        self.assertIn("search", qs.filter_kwargs)
