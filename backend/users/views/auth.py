import json
from typing import Any, Dict, Union

from django.conf import settings
from django.contrib import auth, messages
from django.http import Http404, HttpRequest, HttpResponse
from django.middleware.csrf import get_token
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control

from tools.data_models.common_types import RedirectionResponse
from tools.utils.serializers import inertia_enhanced
from tools.utils.url_parser import make_url_safe
from users.forms import LoginForm


def _login_endpoints():
    """
    Returns the currently available login endpoints
    """
    return {
        "is_ngohub_auth_enabled": settings.ENABLE_NGOHUB_AUTH,
        "ngohub_url": reverse("users:login-by-ngohub"),
        "is_email_auth_enabled": settings.ENABLE_EMAIL_AUTH,
        "email_url": reverse("users:login-by-email"),
    }


@cache_control(private=False)
@inertia_enhanced("users/auth/login-choice")
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
@inertia_enhanced("users/auth/email-login")
def email_login(request: HttpRequest) -> Union[Dict, RedirectionResponse]:
    """
    Login by using the email and password
    """

    if not settings.ENABLE_EMAIL_AUTH:
        return redirect(reverse("users:login"))

    # Redirect already authenticated users to their dashboard
    if request.user.is_authenticated:
        return redirect(reverse("dashboard:home"))

    if request.method == "GET":
        next_url = request.GET.get("next", "")
        return {
            "endpoints": _login_endpoints(),
            "next_url": next_url,
            # "re_captcha_key": settings.RECAPTCHA_PUBLIC_KEY,
        }

    login_user = None

    data = json.loads(request.body)
    next_url = data.get("next", "")

    failed_login_message = _("The identification data could not be confirmed")

    form = LoginForm(data)
    if form.is_valid():
        email = form.cleaned_data.get("email")
        login_user = auth.authenticate(email=email, password=form.cleaned_data.get("password"))
        if login_user is None:
            form.add_error("email", failed_login_message)
            form.add_error("password", failed_login_message)

    remember: bool = form.cleaned_data.get("remember", False)

    if not login_user:
        messages.error(request, failed_login_message)
        return {
            "errors": {"login": form.errors},
            "next_url": next_url,
            # "re_captcha_key": settings.RECAPTCHA_PUBLIC_KEY,
        }
    else:
        auth.login(request, login_user)
        if remember:
            request.session.set_expiry(settings.SESSION_COOKIE_AGE_EXTENDED)
        else:
            request.session.set_expiry(0)

    if next_url:
        return redirect(make_url_safe(request=request, url=next_url))
    else:
        return redirect(reverse("dashboard:home"))


@cache_control(private=True)
def logout(request: HttpRequest) -> HttpResponse:
    """
    Endpoint for authenticated users to POST a logout request

    The redirect destination is different for staff URLs than for applicants URL
    """

    if request.method == "POST":
        messages.success(request, _("You have been logged out."))
        auth.logout(request)
        return redirect("/")

    raise Http404(_("This page does not exist for GET requests"))


@cache_control(private=True)
@inertia_enhanced("users/auth/ngohub-login")
def ngohub_login(request: HttpRequest) -> Union[Dict, RedirectionResponse]:
    """
    Login by using NGO Hub.

    Provide the frontend bridge page with Headless API properties so it can
    initiate the provider redirect itself (synchronous POST) and include the
    correct CSRF token. This keeps the frontend in control as requested.
    """

    if not settings.ENABLE_NGOHUB_AUTH:
        return redirect(reverse("users:login"))

    # Determine the desired post-auth frontend destination
    next_url = request.GET.get("next") or ""
    if next_url:
        next_url = make_url_safe(request=request, url=next_url)
    else:
        next_url = reverse("dashboard:home")

    # Headless API requires an absolute callback_url back to the frontend
    callback_url = request.build_absolute_uri(next_url)

    csrf_token = get_token(request)

    redirect_endpoint = reverse("headless:browser:socialaccount:redirect_to_provider")

    return {
        "redirect_endpoint": redirect_endpoint,
        "provider": "amazon_cognito",
        "process": "login",
        "callback_url": callback_url,
        "csrf_token": csrf_token,
        "next_url": next_url,
    }
