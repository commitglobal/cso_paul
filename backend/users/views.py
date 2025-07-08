import json
from typing import Any

from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, Http404, HttpResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.cache import cache_control
from inertia import inertia, render as inertia_render, InertiaResponse

from users.forms import LoginForm
from users.models import User
from utils.types import RedirectionResponse


def _login_endpoints():
    """
    Returns the currently available login endpoints
    """
    return {
        "ngohub": True,
        "ngohub_url": reverse("users:login-by-ngohub"),
        "email": True,
        "email_url": reverse("users:login-by-email"),
    }


def _make_next_url_safe(request, next_url):
    """
    Make sure that the destination of next_url is on an allowed host
    """
    if url_has_allowed_host_and_scheme(
        url=next_url,
        allowed_hosts=request.get_host(),
        require_https=request.is_secure(),
    ):
        return next_url
    else:
        return reverse("dashboard:home")


@cache_control(private=False)
@inertia("Users/Login/LoginChoice")
def login_choice(request: HttpRequest) -> dict[str, Any]:
    """
    Screen for choosing the preferred login method
    """

    next_url = request.GET.get("next", "")

    return {
        "endpoints": _login_endpoints(),
        "next_url": next_url,
    }


@cache_control(private=True)
def email_login(request: HttpRequest) -> RedirectionResponse | InertiaResponse:
    """
    Login by using the email and password
    """

    # Redirect already authenticated users to their dashboard
    if request.user.is_authenticated:
        return redirect(reverse("dashboard:home"))

    if request.method == "GET":
        next_url = request.GET.get("next", "")
        return inertia_render(
            request,
            "Users/Login/EmailLogin",
            props={
                "endpoints": _login_endpoints(),
                "next_url": next_url,
                # "re_captcha_key": settings.RECAPTCHA_PUBLIC_KEY,
            },
        )

    login_user = None

    data = json.loads(request.body)
    next_url = data.get("next", "")

    form = LoginForm(data)
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
            "Users/Login/EmailLogin",
            props={
                "errors": {"login": form.errors},
                "next_url": next_url,
                # "re_captcha_key": settings.RECAPTCHA_PUBLIC_KEY,
            },
        )
    else:
        auth.login(request, login_user)
        if not remember:
            request.session.set_expiry(0)

    if next_url:
        return redirect(_make_next_url_safe(request, next_url))
    else:
        return redirect(reverse("dashboard:home"))


@cache_control(private=True)
def logout(request: HttpRequest) -> HttpResponse:
    """
    Endpoint for authenticated users to POST a logout request

    The redirect destination is different for staff URLs than for applicants URL
    """

    if request.method == "POST":
        auth.logout(request)
        return redirect("/")

    raise Http404(_("This page does not exist for GET requests"))


@cache_control(private=True)
def ngohub_login(request: HttpRequest) -> InertiaResponse:
    """
    Login by using NGO Hub
    """

    raise NotImplementedError("NGO Hub authentication is not implemented yet")
    # return inertia_render(
    #     request,
    #     "Users/Login/NgohubLogin",
    #     props={},
    # )


@login_required
@cache_control(private=True)
def manage_team(request: HttpRequest) -> InertiaResponse:
    """
    Manage the user team
    """
    users = User.objects.all()

    return inertia_render(
        request,
        "Users/Team/Index",
        props={
            "users": [
                {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "date_joined": user.date_joined,
                    "last_login": user.last_login,  # TODO: replace with a last_activity timestamp
                }
                for user in users
            ]
        },
    )
