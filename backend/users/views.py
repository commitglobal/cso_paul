import json
from typing import Any, Dict

from django.shortcuts import redirect
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpRequest, Http404, HttpResponse
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia, render as inertia_render

from users.forms import LoginForm


@cache_control(private=False)
@inertia("Users/Login/LoginChoice")
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

    if request.method == "GET":
        return inertia_render(
            request,
            "Users/Login/Email",
            props={},
        )

    login_user = None
    form = LoginForm(json.loads(request.body))
    if form.is_valid():
        email = form.cleaned_data.get("email")
        login_user = auth.authenticate(email=email, password=form.cleaned_data.get("password"))
        if login_user is None:
            failed_login_message = _("The identification data could not be confirmed")
            form.add_error("email", failed_login_message)
            form.add_error("password", failed_login_message)

    remember: bool = form.cleaned_data.get("remember", False)

    if not login_user:
        return inertia_render(
            request,
            "Users/Login/Email",
            props={
                "errors": {"login": form.errors},
                # "re_captcha_key": settings.RECAPTCHA_PUBLIC_KEY,
            },
        )
    else:
        auth.login(request, login_user)
        if not remember:
            request.session.set_expiry(0)

    return redirect(reverse("dashboard:home"))


def logout(request: HttpRequest, is_staff_url: bool = False) -> HttpResponse:
    """
    Endpoint for authenticated users to POST a logout request

    The redirect destination is different for staff URLs than for applicants URL
    """

    if request.method == "POST":
        auth.logout(request)
        return redirect("/")

    raise Http404(_("This page does not exist for GET requests"))


@cache_control(private=True)
@inertia("Users/Login/Ngohub")
def ngohub_login(request: HttpRequest) -> Dict[str, Any]:
    """
    Login by using NGO Hub
    """

    raise NotImplementedError("NGO Hub authentication is not implemented yet")
