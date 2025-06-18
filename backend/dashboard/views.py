# Create your views here.
from typing import Any, Dict

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.decorators.cache import cache_control, never_cache
from inertia import inertia


@cache_control(private=True)
@login_required(login_url=reverse_lazy("users:login"))
@inertia("Dashboard/Home")
def home(request: HttpRequest) -> Dict[str, Any]:
    """
    Main app dashboard
    """

    return {}


@cache_control(private=False)
@inertia("Dashboard/TestMenu")
def test_menu(request: HttpRequest) -> Dict[str, Any]:
    """
    TODO: Remove this test page once the menu is implemented
    """
    return {"ok": True}


@never_cache
def health(request: HttpRequest) -> HttpResponse:
    """
    Health check endpoint
    """
    normal_response_text = f"OK - {timezone.now()}"

    # Show detailed information only to authenticated staff members
    if request.user.is_authenticated and (
        request.user.is_staff
        or request.user.is_superuser
        or request.user.is_admin_member
        or request.user.is_superadmin_member
    ):
        return HttpResponse(
            f"{normal_response_text} [user #{request.user.pk}] [{settings.VERSION} {settings.REVISION}]"
        )

    return HttpResponse(normal_response_text)
