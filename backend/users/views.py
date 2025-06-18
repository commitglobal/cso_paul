import json
from typing import Any, Dict

from django.shortcuts import redirect
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia, render as inertia_render

from users.forms import LoginForm


@cache_control(private=False)
@inertia("Users/Login/Choice")
def login_choice(request: HttpRequest) -> Dict[str, Any]:
    """
    Screen for choosing the preferred login method
    """

    return {
        "endpoints": {
            "ngohub": True,
            "ngohub_url": reverse("users:login-by-ngohub"),
            "email": True,
            "email_url": reverse("users:login-by-email"),
        }
    }


@cache_control(private=True)
@inertia("Users/Login/Email")
def email_login(request: HttpRequest) -> Dict[str, Any] | HttpResponseRedirect:
    """
    Login by using the email and password
    """

    # Redirect already authenticated users to their dashboard
    if request.user.is_authenticated:
        return redirect(reverse("dashboard:home"))

    login_failed = False
    form = LoginForm(json.loads(request.body))
    if not form.is_valid():
        login_failed = True
    else:
        email = form.cleaned_data.get("email")
        login_user = auth.authenticate(email=email, password=form.cleaned_data.get("password"))
        if login_user is None:
            login_failed = True
            failed_login_message = _("The identification data could not be confirmed")
            form.add_error("email", failed_login_message)
            form.add_error("password", failed_login_message)

    if login_failed:
        return inertia_render(
            request,
            "Users/Login/Email",
            props={
                "errors": {"login": form.errors},
                # "re_captcha_key": settings.RECAPTCHA_PUBLIC_KEY,
            },
        )

    return {"ok": True}


@cache_control(private=True)
@inertia("Users/Login/Ngohub")
def ngohub_login(request: HttpRequest) -> Dict[str, Any]:
    """
    Login by using NGO Hub
    """

    raise NotImplementedError("NGO Hub authentication is not implemented yet")
