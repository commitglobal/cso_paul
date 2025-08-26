from typing import Callable

from django.conf import settings
from django.contrib.messages import get_messages
from django.http import HttpRequest, HttpResponse
from inertia import InertiaResponse, share

from users.models import User


def global_state(get_response: Callable[[HttpRequest], InertiaResponse]) -> Callable[[HttpRequest], HttpResponse]:
    """
    Properties made available to every request response
    """

    def _extract_messages(request: HttpRequest) -> list[dict]:
        """
        Extract flash messages from the session storage
        """
        messages = []
        for message in get_messages(request):
            messages.append(
                {
                    "message": message.message,
                    "level_tag": message.level_tag,
                }
            )
        return messages

    def _extract_language(request: HttpRequest) -> str:
        """
        Extract the current language setting by checking, in the following order:
            1. The user's language preference
            2. The request's LANGUAGE_CODE
            3. The default language setting
        """

        if request.user.is_authenticated and hasattr(request.user, "language"):
            return request.user.language

        if hasattr(request, "LANGUAGE_CODE"):
            return request.LANGUAGE_CODE

        return settings.LANGUAGE_CODE

    def middleware(request: HttpRequest) -> HttpResponse:
        """
        Inject some global data into each HttpResponse
        """
        share(
            request=request,
            # Computed properties:
            flashMessages=_extract_messages(request),
            language=_extract_language(request),
            # Lazily computed properties:
            isAuthenticated=lambda: request.user.is_authenticated,
            user=lambda: User.to_dict(request.user) if request.user.is_authenticated else None,
        )
        return get_response(request)

    return middleware
