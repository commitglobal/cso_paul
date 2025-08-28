from typing import Dict

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, JsonResponse
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.decorators.cache import cache_control, never_cache

from tools.utils.serializers import inertia_enhanced


@cache_control(private=True)
@login_required(login_url=reverse_lazy("users:login"))
@inertia_enhanced("dashboard/home")
def home(request: HttpRequest) -> Dict:
    """
    Main app dashboard
    """

    return {"ok": True}


@never_cache
def health(request: HttpRequest) -> JsonResponse:
    """
    Health check endpoint
    """
    response_data = {
        "status": "ok",
        "timestamp": timezone.now().isoformat(),
        "version": settings.VERSION,
        "revision": settings.REVISION,
    }

    # Show detailed information only to authenticated staff members
    if request.user.is_authenticated:
        response_data["user_id"] = request.user.pk

    return JsonResponse(
        response_data,
        status=200,
        content_type="application/json",
    )
