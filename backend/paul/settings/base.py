import hashlib
import os

from .environment import env

# Authentication methods
ENABLE_NGOHUB_AUTH = env.bool("ENABLE_NGOHUB_AUTH")
ENABLE_EMAIL_AUTH = env.bool("ENABLE_EMAIL_AUTH")

if not (ENABLE_NGOHUB_AUTH or ENABLE_EMAIL_AUTH):
    raise ValueError("At least one authentication method must be enabled: NGO Hub or Normal Auth.")

# Helper files
VERSION_FILE = "/var/www/paul/.version"

SECRET_KEY = env("SECRET_KEY")
SECRET_KEY_HASH = hashlib.blake2s(SECRET_KEY.encode()).hexdigest()

DEBUG = env.bool("DEBUG")
ENVIRONMENT = env.str("ENVIRONMENT", "production")

# Application definition
ROOT_URLCONF = "paul.urls"

WSGI_APPLICATION = "paul.wsgi.application"

# Cookies
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE")
SESSION_COOKIE_AGE = env.int("SESSION_EXPIRY_IDLE_SECONDS")  # This also expires the actual session data (from db)
SESSION_COOKIE_AGE_EXTENDED = env.int("SESSION_EXPIRY_EXTENDED_SECONDS")
SESSION_SAVE_EVERY_REQUEST = True


# some settings will be different if it's not running in a container (e.g., locally, on a Mac)
IS_CONTAINERIZED = env.bool("IS_CONTAINERIZED")

VERSION = env.str("VERSION", "edge")
REVISION = env.str("REVISION", "develop")

if IS_CONTAINERIZED and VERSION == "edge" and REVISION == "develop":
    if os.path.exists(VERSION_FILE):
        with open(VERSION_FILE) as f:
            VERSION, REVISION = f.read().strip().split("+")
            REVISION = REVISION[:7]


# superuser/admin seed data

DJANGO_ADMIN_PASSWORD = env.str("DJANGO_ADMIN_PASSWORD", None)
DJANGO_ADMIN_EMAIL = env.str("DJANGO_ADMIN_EMAIL", None)

ENABLE_DJANGO_ADMIN = env.bool("ENABLE_DJANGO_ADMIN")

# Security settings

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

CSRF_HEADER_NAME = "HTTP_X_XSRF_TOKEN"
CSRF_COOKIE_NAME = "XSRF-TOKEN"

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS")
CORS_ALLOW_ALL_ORIGINS = env.bool("CORS_ALLOW_ALL_ORIGINS")


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Auditlog configuration

AUDITLOG_EXPIRY_DAYS = env.int("AUDITLOG_EXPIRY_DAYS")
AUDITLOG_INCLUDE_ALL_MODELS = True
AUDITLOG_EXCLUDE_TRACKING_FIELDS = (
    "created_at",
    "updated_at",
)
AUDITLOG_EXCLUDE_TRACKING_MODELS = (
    "auth.Group",
    "django_q",
    "sessions",
    "usersessions",
)
