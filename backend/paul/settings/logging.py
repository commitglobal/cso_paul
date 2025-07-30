import logging

import sentry_sdk

from .base import ENVIRONMENT, REVISION, VERSION
from .environment import env

logger = logging.getLogger(__name__)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {
            "format": "[{asctime}] [{levelname}] {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": env.str("LOGLEVEL"),
    },
}


# Sentry
if sentry_dsn := env.str("SENTRY_DSN"):
    logger.info("Configuring Sentry")
    sentry_sdk.init(
        dsn=sentry_dsn,
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        traces_sample_rate=env.float("SENTRY_TRACES_SAMPLE_RATE"),
        # Set profiles_sample_rate to 1.0 to profile 100%
        # of sampled transactions.
        # We recommend adjusting this value in production.
        profiles_sample_rate=env.float("SENTRY_PROFILES_SAMPLE_RATE"),
        environment=ENVIRONMENT,
        release=f"paul@{VERSION}+{REVISION}",
    )


# Silenced system checks
SILENCED_SYSTEM_CHECKS = (
    "urls.W005",  # Ignore duplicate namespace warnings because we use the same namespace for both normal and staff URLs
)
