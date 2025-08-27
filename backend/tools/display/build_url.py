from typing import List, Optional

from django.conf import settings


def build_ngohub_url(path_elements: Optional[List[str]] = None) -> str:
    """
    Build the URL for the NGO Hub.
    """
    path_elements: List[str] = path_elements or []

    base_url: str = settings.NGOHUB_APP_HOST
    path: str = "/".join(path_elements)

    return f"{base_url}/{path}"
