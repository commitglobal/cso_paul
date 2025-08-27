from django.test import SimpleTestCase

from tools.tests.configuration import FakeQS
from tools.utils.pagination import paginate_queryset


def usernames_serializer(page_obj, **kwargs):
    return [obj["username"] for obj in page_obj]


class TestPagination(SimpleTestCase):
    def setUp(self):
        self.items = [{"id": i, "username": f"user{i}"} for i in range(1, 8)]
        self.qs = FakeQS(self.items)

    def test_paginate_regular_pages(self):
        page_list, paginator, pagination = paginate_queryset(self.qs, page_number=2, page_size=3)
        self.assertEqual([u["username"] for u in page_list], ["user4", "user5", "user6"])  # default list
        self.assertEqual(pagination.current_page, 2)
        self.assertTrue(pagination.has_next)
        self.assertTrue(pagination.has_previous)
        self.assertEqual(pagination.num_pages, 3)
        self.assertEqual(pagination.next_page_number, 3)
        self.assertEqual(pagination.previous_page_number, 1)
        self.assertEqual(pagination.per_page, 3)
        self.assertEqual(pagination.total_items, 7)

    def test_paginate_with_serializer(self):
        page_list, _p, pagination = paginate_queryset(
            self.qs, page_number=1, page_size=2, page_serializer=usernames_serializer
        )
        self.assertEqual(page_list, ["user1", "user2"])  # serialized
        self.assertEqual(pagination.current_page, 1)

    def test_page_all_size(self):
        page_list, _p, pagination = paginate_queryset(self.qs, page_number=1, page_size="all")  # type: ignore[arg-type]
        self.assertEqual(len(page_list), 7)
        self.assertEqual(pagination.num_pages, 1)
        self.assertFalse(pagination.has_next)
        self.assertFalse(pagination.has_previous)
        self.assertEqual(pagination.per_page, 7)

    def test_invalid_page_numbers(self):
        # non-integer falls back to page 1
        page_list, _p, pagination = paginate_queryset(self.qs, page_number="x", page_size=3)  # type: ignore[arg-type]
        self.assertEqual([u["username"] for u in page_list], ["user1", "user2", "user3"])  # default list
        self.assertEqual(pagination.current_page, 1)
        # too big falls back to last page
        page_list, _p, pagination = paginate_queryset(self.qs, page_number=99, page_size=3)
        self.assertEqual([u["username"] for u in page_list], ["user7"])  # default list
        self.assertEqual(pagination.current_page, 3)
