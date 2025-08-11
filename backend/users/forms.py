from django import forms
from django.conf import settings

from users.common import normalize_email
from users.models import User
from django.utils.translation import gettext_lazy as _


class LoginForm(forms.Form):
    email = forms.EmailField(required=True)
    password = forms.CharField(widget=forms.PasswordInput(), required=True, max_length=150)
    remember = forms.BooleanField(required=False)

    def clean_email(self):
        return normalize_email(self.cleaned_data.get("email", ""))


class AddTeamUserForm(forms.ModelForm):
    role = forms.ChoiceField(
        choices=settings.USER_GROUPS_CHOICES,
        required=True,
        label="Role",
        help_text="Select the role for the new team member.",
    )

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name"]

    def clean(self):
        cleaned_data = super().clean()

        return cleaned_data

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(_("User with this email already exists."))

        return email
