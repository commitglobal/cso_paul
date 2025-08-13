from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import never_cache
from inertia import render as inertia_render


@never_cache
def custom_400_view(request: HttpRequest, exception: Exception = None) -> HttpResponse:
    """
    Custom view for 400 Bad Request
    """
    response = inertia_render(
        request,
        "errors/base-error",
        props={
            "code": "400",
            "title": _("Bad Request"),
            "message": str(exception) if exception else "",
        },
    )
    response.status_code = 400
    return response


@never_cache
def custom_403_view(request: HttpRequest, exception: Exception = None) -> HttpResponse:
    """
    Custom view for 403 Permission Denied
    """
    response = inertia_render(
        request,
        "errors/base-error",
        props={
            "code": "403",
            "title": _("Permission Denied"),
            "message": str(exception) if exception else "",
        },
    )
    response.status_code = 403
    return response


@never_cache
def custom_404_view(request: HttpRequest, exception: Exception = None) -> HttpResponse:
    """
    Custom view for 404 Page Not Found
    """
    response = inertia_render(
        request,
        "errors/base-error",
        props={
            "code": "404",
            "title": _("Page Not Found"),
            "message": "",
        },
    )
    response.status_code = 404
    return response


@never_cache
def custom_500_view(request: HttpRequest, exception: Exception = None) -> HttpResponse:
    """
    Custom view for 500 Server Error
    """
    response = inertia_render(
        request,
        "errors/base-error",
        props={
            "code": "500",
            "title": _("Server Error"),
            "message": "",
        },
    )
    response.status_code = 500
    return response


@never_cache
def ngohub_app_missing_view(request: HttpRequest, exception: Exception = None) -> HttpResponse:
    response = inertia_render(
        request,
        "errors/ngohub-app-missing",
    )

    response.status_code = 403
    return response


@never_cache
def ngohub_user_invalid_view(request: HttpRequest, exception: Exception = None) -> HttpResponse:
    response = inertia_render(
        request,
        "errors/ngohub-user-invalid",
    )

    response.status_code = 401
    return response
