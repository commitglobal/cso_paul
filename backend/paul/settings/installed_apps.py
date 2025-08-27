from .environment import env

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.messages",
    "django.contrib.sessions",
    "django.contrib.staticfiles",
    # Third party apps:
    "auditlog",
    "corsheaders",
    "django_q",
    "django_recaptcha",
    "django_vite",
    "inertia",
    "localflavor",
    "storages",
    # authentication
    "allauth",
    "allauth.account",
    "allauth.headless",
    "allauth.usersessions",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.amazon_cognito",
    # paul apps:
    "dashboard",
    "datastore",
    "inertia_django_utils",
    "users",
]


use_s3: bool = env.bool("USE_S3")
use_azure: bool = env.bool("USE_AZURE") and env("AZURE_ACCOUNT_NAME") and env("AZURE_ACCOUNT_KEY")

if not (use_s3 or use_azure):
    INSTALLED_APPS.append("whitenoise.runserver_nostatic")

aws_ses_include_reports = env.bool("AWS_SES_INCLUDE_REPORTS")

if aws_ses_include_reports:
    INSTALLED_APPS.append("django_ses")

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "inertia.middleware.InertiaMiddleware",
    "auditlog.middleware.AuditlogMiddleware",
    # paul middlewares:
    "users.middleware.global_state",
]
