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
    # paul apps:
    "dashboard",
    "datastore",
    "users",
]

USE_S3 = env.bool("USE_S3")
USE_AZURE = env.bool("USE_AZURE") and env("AZURE_ACCOUNT_NAME") and env("AZURE_ACCOUNT_KEY")

AWS_SES_INCLUDE_REPORTS = env.bool("AWS_SES_INCLUDE_REPORTS")

if not (USE_S3 or USE_AZURE):
    INSTALLED_APPS.append("whitenoise.runserver_nostatic")

if AWS_SES_INCLUDE_REPORTS:
    INSTALLED_APPS.append("django_ses")
