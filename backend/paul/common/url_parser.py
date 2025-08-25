from django.http import HttpRequest
from django.urls import reverse_lazy
from django.utils.http import url_has_allowed_host_and_scheme


def make_url_safe(
    *,
    request: HttpRequest,
    url: str,
    default_next: str = reverse_lazy("dashboard:home"),
) -> str:
    """
    Make sure that the destination of next_url is on an allowed host
    """
    if url_has_allowed_host_and_scheme(
        url=url,
        allowed_hosts=request.get_host(),
        require_https=request.is_secure(),
    ):
        return url

    return default_next
