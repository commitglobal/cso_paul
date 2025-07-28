from datetime import timedelta

from django.urls import reverse_lazy

from paul.settings.environment import env


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

AUTH_USER_MODEL = "users.User"


EMAIL_VERIFICATION_EXPIRY_TIME = timedelta(hours=env.int("EMAIL_VERIFICATION_EXPIRY_HOURS"))
TWO_FACTOR_AUTH_EXPIRY_TIME = timedelta(hours=env.int("EMAIL_2FA_EXPIRY_HOURS"))
PASSWORD_RESET_EXPIRY_TIME = timedelta(hours=env.int("EMAIL_PASSWORD_RESET_EXPIRY_HOURS"))

MAX_RESET_ATTEMPTS = 5
MAX_LOGIN_ATTEMPTS = 5

LOGIN_URL = reverse_lazy("users:login")
