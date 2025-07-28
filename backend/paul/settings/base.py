import hashlib
import os

from .environment import env

# Helper files
VERSION_FILE = "/var/www/paul/.version"

SECRET_KEY = env("SECRET_KEY")
SECRET_KEY_HASH = hashlib.blake2s(SECRET_KEY.encode()).hexdigest()

DEBUG = env.bool("DEBUG")
ENVIRONMENT = env.str("ENVIRONMENT", "production")

# Application definition
ROOT_URLCONF = "paul.urls"

WSGI_APPLICATION = "paul.wsgi.application"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "inertia.middleware.InertiaMiddleware",
    "auditlog.middleware.AuditlogMiddleware",
    # paul middlewares:
    "users.middleware.global_state",
]


# Cookies
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE")
SESSION_COOKIE_AGE = env.int("SESSION_EXPIRY_IDLE_SECONDS")  # This also expires the actual session data (from db)
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


# Security settings

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

CSRF_HEADER_NAME = "HTTP_X_XSRF_TOKEN"
CSRF_COOKIE_NAME = "XSRF-TOKEN"

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS")
CORS_ALLOW_ALL_ORIGINS = env.bool("CORS_ALLOW_ALL_ORIGINS")


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
