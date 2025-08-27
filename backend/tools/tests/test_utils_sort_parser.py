from django.test import SimpleTestCase

from tools.utils.sort_parser import parse_order_parameter


class TestSortParser(SimpleTestCase):
    def setUp(self):
        self.mapping = {
            "username": "username",
            "name": ["last_name", "first_name"],
        }

    def test_default_when_empty(self):
        self.assertEqual(parse_order_parameter(sort_parameter="", field_mapping=self.mapping), ["pk"])  # default
        self.assertEqual(
            parse_order_parameter(sort_parameter=None, field_mapping=self.mapping, default_sort_option="id"),  # type: ignore[arg-type]
            ["id"],
        )

    def test_field_only_string_mapping(self):
        self.assertEqual(
            parse_order_parameter(sort_parameter="username", field_mapping=self.mapping), ["username"]
        )  # asc implied

    def test_with_direction_string_mapping(self):
        self.assertEqual(
            parse_order_parameter(sort_parameter="username,asc", field_mapping=self.mapping), ["username"]
        )  # asc
        self.assertEqual(
            parse_order_parameter(sort_parameter="username,desc", field_mapping=self.mapping), ["-username"]
        )  # desc

    def test_with_direction_list_mapping(self):
        # desc should apply to all mapped fields
        self.assertEqual(
            parse_order_parameter(sort_parameter="name,desc", field_mapping=self.mapping),
            ["-last_name", "-first_name"],
        )
        # asc should apply no prefix
        self.assertEqual(
            parse_order_parameter(sort_parameter="name,asc", field_mapping=self.mapping),
            ["last_name", "first_name"],
        )

    def test_invalid_direction(self):
        self.assertEqual(
            parse_order_parameter(sort_parameter="username,up", field_mapping=self.mapping, default_sort_option="id"),
            ["id"],
        )

    def test_invalid_field(self):
        self.assertEqual(
            parse_order_parameter(sort_parameter="email,asc", field_mapping=self.mapping, default_sort_option="id"),
            ["id"],
        )

    def test_empty_field(self):
        self.assertEqual(
            parse_order_parameter(sort_parameter=",asc", field_mapping=self.mapping, default_sort_option="id"),
            ["id"],
        )
