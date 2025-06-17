from typing import Any, Dict

from django.conf import settings
from django.http import HttpResponse, HttpRequest
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.cache import cache_control, never_cache
from inertia import inertia


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
def email_login(request: HttpRequest) -> Dict[str, Any]:
    """
    Login by using the email and password
    """

    return {"ok": True}


@cache_control(private=True)
@inertia("Users/Login/Ngohub")
def ngohub_login(request: HttpRequest) -> Dict[str, Any]:
    """
    Login by using NGO Hub
    """

    raise NotImplementedError("NGO Hub authentication is not implemented yet")

