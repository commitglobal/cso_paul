from typing import Dict

from django.conf import settings
from django.http import HttpRequest


def main(_: HttpRequest) -> Dict[str, bool]:
    return {
        "language_code": settings.LANGUAGE_CODE,
    }
