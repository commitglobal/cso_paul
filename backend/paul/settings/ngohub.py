from .environment import env

# NGO Hub URLS

NGOHUB_APP_HOST = env.str("NGOHUB_APP_HOST", default="https://app.ngohub.ro")
NGOHUB_API_HOST = env.str("NGOHUB_API_HOST", default="https://api.ngohub.ro")
