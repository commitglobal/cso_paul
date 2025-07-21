from typing import List

from django.conf import settings


def build_ngohub_url(path_elements: List[str] = None) -> str:
    """
    Build the URL for the NGO Hub.
    """
    path_elements = path_elements or []

    base_url = settings.NGOHUB_APP_HOST
    path = "/".join(path_elements)

    return f"{base_url}/{path}"
