from tools.constants.time import HOUR, MINUTE

from .base import DEBUG
from .environment import env

# Cache timeouts
CACHE_TIMEOUT_SMALL = 2 * MINUTE
CACHE_TIMEOUT_STANDARD = 15 * MINUTE
CACHE_TIMEOUT_LARGE = 2 * HOUR

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
