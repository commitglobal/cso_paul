from .base import DEBUG
from .environment import env


# Cache timeouts
CACHE_TIMEOUT_SMALL = 60 * 2
CACHE_TIMEOUT_STANDARD = 60 * 15
CACHE_TIMEOUT_LARGE = 60 * 60 * 2

ENABLE_CACHE = env.bool("ENABLE_CACHE", default=not DEBUG)
if ENABLE_CACHE:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.db.DatabaseCache",
            "LOCATION": "paul_cache_default",
            "TIMEOUT": 600,  # default cache timeout in seconds
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.dummy.DummyCache",
        }
    }
