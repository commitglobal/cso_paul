from django import forms
from django.conf import settings
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from users.common import normalize_email
from users.models import RoleChoices, User


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

    def save(self, commit=True):
        user = super().save(commit=False)

        user_group_name = self.cleaned_data.get("role", "")
        try:
            user_group = Group.objects.get(name=user_group_name)
        except Group.DoesNotExist:
            user_group = None
            self.main_role = RoleChoices.USER
        else:
            user.main_role = RoleChoices(user_group_name)

        if commit:
            user.save()
            self.save_m2m()
            if user_group:
                user_group.user_set.add(user)

        return user


class ChangeRoleForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["main_role"]
