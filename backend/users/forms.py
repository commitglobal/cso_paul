from django import forms

from users.common import normalize_email


class LoginForm(forms.Form):
    email = forms.EmailField(required=True)
    password = forms.CharField(widget=forms.PasswordInput(), required=True, max_length=150)
    remember = forms.BooleanField(required=False)

    def clean_email(self):
        return normalize_email(self.cleaned_data.get("email", ""))
