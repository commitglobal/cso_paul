from django import forms
from django.test import SimpleTestCase

from tools.utils.serializers import _serialize_errors, serialize_form_errors


class SampleForm(forms.Form):
    name = forms.CharField()

    def clean_name(self):
        # Always raise a predictable, non-localized error message
        raise forms.ValidationError("bad name")


class TestSerializers(SimpleTestCase):
    def test_serialize_form_errors(self):
        form = SampleForm(data={"name": "ignored"})
        self.assertFalse(form.is_valid())
        data = serialize_form_errors(form.errors)
        self.assertEqual(data, {"name": ["bad name"]})

    def test__serialize_errors_rejects_str(self):
        with self.assertRaises(ValueError):
            _serialize_errors("oops")  # type: ignore[arg-type]
