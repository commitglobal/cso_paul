from .base import ENABLE_NGOHUB_AUTH
from .environment import env

# AWS Cognito settings
AWS_COGNITO_USER_POOL_ID = env.str("AWS_COGNITO_USER_POOL_ID")
AWS_COGNITO_REGION = env.str("AWS_COGNITO_REGION")

# Django Allauth Social Login adapter
SOCIALACCOUNT_ADAPTER = "paul.social_adapters.receivers.UserOrgAdapter"

# Django Allauth allow only social logins
ACCOUNT_EMAIL_VERIFICATION = "none"

SOCIALACCOUNT_ENABLED = ENABLE_NGOHUB_AUTH

# Django Allauth settings
if SOCIALACCOUNT_ENABLED:
    SOCIALACCOUNT_PROVIDERS = {
        "amazon_cognito": {
            "DOMAIN": "https://" + env.str("AWS_COGNITO_DOMAIN"),
            "EMAIL_AUTHENTICATION": (env.bool("AWS_COGNITO_EMAIL_AUTHENTICATION")),
            "VERIFIED_EMAIL": (env.bool("AWS_COGNITO_VERIFIED_EMAIL")),
            "APPS": [
                {
                    "client_id": (env.str("AWS_COGNITO_CLIENT_ID")),
                    "secret": (env.str("AWS_COGNITO_CLIENT_SECRET")),
                },
            ],
        }
    }

# Headless Allauth settings
HEADLESS_ONLY = True
HEADLESS_FRONTEND_URLS = {
    "account_confirm_email": "/account/verify-email/{key}",
    "account_reset_password": "/account/password/reset",
    "account_reset_password_from_key": "/account/password/reset/key/{key}",
    "socialaccount_login_error": "/account/provider/callback",
}
