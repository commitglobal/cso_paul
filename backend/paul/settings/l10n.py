import os

from .environment import BASE_DIR, env

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = env("LANGUAGE_CODE")

TIME_ZONE = env("TIME_ZONE")

LOCALE_PATHS = (os.path.join(BASE_DIR, "locale"),)
