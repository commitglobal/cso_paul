from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.decorators.cache import cache_control, never_cache
from inertia import render as inertia_render, InertiaResponse


@cache_control(private=True)
@login_required(login_url=reverse_lazy("users:login"))
def home(request: HttpRequest) -> InertiaResponse:
    """
    Main app dashboard
    """

    return inertia_render(
        request,
        "dashboard/home",
        props={"ok": True},
    )


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
