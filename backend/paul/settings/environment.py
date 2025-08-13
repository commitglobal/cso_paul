import os
from pathlib import Path

import environ

from paul.constants.sizes import MEBIBYTE
from paul.constants.time import DAY, HOUR

# Build paths inside the project like this: BASE_DIR / 'subdir'.
root = Path(__file__).resolve().parent.parent.parent.parent
BASE_DIR = os.path.abspath(os.path.join(root, "backend"))

env_file_name = os.environ.get("ENV_FILE_NAME", ".env.local")
ENV_FILE_PATH = os.path.join(BASE_DIR, os.pardir, env_file_name)

env = environ.Env(
    # aws settings
    AWS_REGION_NAME=(str, ""),
    AWS_S3_CUSTOM_DOMAIN=(str, ""),
    AWS_S3_DEFAULT_ACL=(str, "private"),
    AWS_S3_DEFAULT_CUSTOM_DOMAIN=(str, ""),
    AWS_S3_DEFAULT_PREFIX=(str, ""),
    AWS_S3_PUBLIC_ACL=(str, "public-read"),
    AWS_S3_PUBLIC_CUSTOM_DOMAIN=(str, ""),
    AWS_S3_PUBLIC_PREFIX=(str, ""),
    AWS_S3_REGION_NAME=(str, ""),
    AWS_S3_STORAGE_DEFAULT_BUCKET_NAME=(str, ""),
    AWS_S3_STORAGE_PUBLIC_BUCKET_NAME=(str, ""),
    AWS_SES_CONFIGURATION_SET_NAME=(str, None),
    AWS_SES_INCLUDE_REPORTS=(bool, False),
    AWS_SES_REGION_NAME=(str, ""),
    USE_S3=(bool, False),
    # azure settings
    AZURE_ACCOUNT_KEY=(str, ""),
    AZURE_ACCOUNT_NAME=(str, ""),
    AZURE_CONTAINER=(str, "data"),
    USE_AZURE=(bool, False),
    # django settings
    ALLOWED_HOSTS=(list, ["*"]),
    CORS_ALLOW_ALL_ORIGINS=(bool, False),
    CORS_ALLOWED_ORIGINS=(list, []),
    DATA_UPLOAD_MAX_MEMORY_SIZE=(int, 3 * MEBIBYTE),
    DEBUG=(bool, False),
    DJANGO_VITE_DEV_MODE=(bool, False),
    DJANGO_VITE_DEV_SERVER_PORT=(int, 3000),
    ENABLE_CACHE=(bool, False),
    IS_CONTAINERIZED=(bool, False),
    LANGUAGE_CODE=(str, "ro"),
    LOGLEVEL=(str, "INFO"),
    MAX_DOCUMENT_SIZE=(int, 2 * MEBIBYTE),
    THROTTLE_IP_SIGNUPS_PER_HOUR=(int, 90),  # 0 = disabled
    SECRET_KEY=(str, "secret"),
    SESSION_COOKIE_SECURE=(bool, True),
    SESSION_EXPIRY_IDLE_SECONDS=(int, 4 * HOUR),
    SESSION_EXPIRY_EXTENDED_SECONDS=(int, 4 * DAY),
    TIME_ZONE=(str, "Europe/Bucharest"),
    # custom django settings
    ENABLE_DJANGO_ADMIN=(bool, False),
    # db settings
    DATABASE_ENGINE=(str, "sqlite3"),
    DATABASE_HOST=(str, "localhost"),
    DATABASE_NAME=(str, "default"),
    DATABASE_PASSWORD=(str, ""),
    DATABASE_PORT=(str, "3306"),
    DATABASE_USER=(str, "root"),
    # email settings
    CC_STATUS_EMAIL=(str, ""),
    DEFAULT_FROM_EMAIL=(str, "email@example.com"),
    DEFAULT_RECEIVE_EMAIL=(str, "email@example.com"),
    EMAIL_BACKEND=(str, "django.core.mail.backends.smtp.EmailBackend"),
    EMAIL_FAIL_SILENTLY=(bool, False),
    EMAIL_HOST_PASSWORD=(str, ""),
    EMAIL_HOST_USER=(str, ""),
    EMAIL_HOST=(str, ""),
    EMAIL_PORT=(str, ""),
    EMAIL_SEND_METHOD=(str, "async"),
    EMAIL_USE_TLS=(str, ""),
    NO_REPLY_EMAIL=(str, "noreply@example.com"),
    # background workers settings
    BACKGROUND_WORKERS_COUNT=(int, 1),
    # recaptcha settings
    RECAPTCHA_PRIVATE_KEY=(str, ""),
    RECAPTCHA_PUBLIC_KEY=(str, ""),
    RECAPTCHA_REQUIRED_SCORE=(float, 0.7),
    # sentry
    SENTRY_DSN=(str, ""),
    SENTRY_PROFILES_SAMPLE_RATE=(float, 0),
    SENTRY_TRACES_SAMPLE_RATE=(float, 0),
    # security expiration dates
    AUDITLOG_EXPIRY_DAYS=(int, 5 * 365),  # 5 years
    EMAIL_VERIFICATION_EXPIRY_HOURS=(int, 96),  # 4 days
    EMAIL_2FA_EXPIRY_HOURS=(int, 4),
    EMAIL_PASSWORD_RESET_EXPIRY_HOURS=(int, 4),
    # NGO settings
    NGOHUB_NGO_ID=(int, None),
    NGOHUB_APP_ID=(int, None),
    # NGO Hub settings
    NGOHUB_HOME_HOST=(str, "ngohub.ro"),
    NGOHUB_APP_HOST=(str, "app.ngohub.ro"),
    NGOHUB_API_HOST=(str, "api.ngohub.ro"),
    NGOHUB_API_ACCOUNT=(str, ""),
    NGOHUB_API_KEY=(str, ""),
    # Something cute about us
    SUPPORT_ORGANIZATION_NAME=(str, "Commit Global"),
    # Auth methods
    ENABLE_NGOHUB_AUTH=(bool, True),
    ENABLE_EMAIL_AUTH=(bool, True),
    # Cognito settings
    AWS_COGNITO_DOMAIN=(str, ""),
    AWS_COGNITO_CLIENT_ID=(str, ""),
    AWS_COGNITO_CLIENT_SECRET=(str, ""),
    AWS_COGNITO_USER_POOL_ID=(str, ""),
    AWS_COGNITO_REGION=(str, ""),
    AWS_COGNITO_EMAIL_AUTHENTICATION=(bool, True),
    AWS_COGNITO_VERIFIED_EMAIL=(bool, True),
)

environ.Env.read_env(ENV_FILE_PATH)
