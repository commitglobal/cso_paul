from django import forms

from users.common import normalize_email
from users.models import User


class LoginForm(forms.Form):
    email = forms.EmailField(required=True)
    password = forms.CharField(widget=forms.PasswordInput(), required=True, max_length=150)
    remember = forms.BooleanField(required=False)

    def clean_email(self):
        return normalize_email(self.cleaned_data.get("email", ""))


class AddTeamUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["email", "first_name", "last_name"]

    def clean_email(self):
        email = self.cleaned_data.get("email")
        print("Validating the email input")
        if User.objects.filter(email=email).exists():
            print(f"Email {email} already exists in db")
            raise forms.ValidationError("User with this email already exists.")

        return email
