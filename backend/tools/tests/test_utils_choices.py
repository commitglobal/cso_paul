from django.test import SimpleTestCase

from tools.utils.choices import CommonLabelValueChoices


class MockChoices(CommonLabelValueChoices):
    choices = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
    ]


class TestCommonLabelValueChoices(SimpleTestCase):
    def test_label_value_choices(self):
        expected = [
            {"label": "Draft", "value": "draft"},
            {"label": "Published", "value": "published"},
            {"label": "Archived", "value": "archived"},
        ]
        self.assertEqual(MockChoices.label_value_choices(), expected)

    def test_filtered_label_value_choices(self):
        expected = [
            {"label": "Draft", "value": "draft"},
            {"label": "Archived", "value": "archived"},
        ]
        self.assertEqual(MockChoices.filtered_label_value_choices({"draft", "archived"}), expected)
