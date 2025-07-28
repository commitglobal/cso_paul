import os
from copy import deepcopy

from .base import IS_CONTAINERIZED
from .environment import BASE_DIR, env
from .installed_apps import USE_AZURE

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
public_static_location = "static"
public_media_location = "media"
private_media_location = "media"

STATIC_URL = f"{public_static_location}/"
MEDIA_URL = f"{public_media_location}/"

STATIC_ROOT = os.path.abspath(os.path.join(BASE_DIR, "static"))
MEDIA_ROOT = os.path.abspath(os.path.join(BASE_DIR, "media"))

media_storage = "django.core.files.storage.FileSystemStorage"
static_storage = "whitenoise.storage.CompressedStaticFilesStorage"

default_storage_options = {}
public_storage_options = {}

if env.bool("USE_S3"):
    media_storage = "storages.backends.s3boto3.S3Boto3Storage"
    static_storage = "storages.backends.s3boto3.S3StaticStorage"

    # https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html
    default_storage_options = {
        "bucket_name": (env.str("AWS_S3_STORAGE_DEFAULT_BUCKET_NAME")),
        "default_acl": (env.str("AWS_S3_DEFAULT_ACL")),
        "region_name": env.str("AWS_S3_REGION_NAME") or env.str("AWS_REGION_NAME"),
        "object_parameters": {"CacheControl": "max-age=86400"},
        "file_overwrite": False,
    }

    if aws_session_profile := env.str("AWS_S3_SESSION_PROFILE", default=None):
        default_storage_options["session_profile"] = aws_session_profile
    elif aws_access_key := env.str("AWS_ACCESS_KEY_ID", default=None):
        default_storage_options["access_key"] = aws_access_key
        default_storage_options["secret_key"] = env.str("AWS_SECRET_ACCESS_KEY")

    if default_prefix := env.str("AWS_S3_DEFAULT_PREFIX", default=None):
        default_storage_options["location"] = default_prefix

    if custom_domain := env.str("AWS_S3_DEFAULT_CUSTOM_DOMAIN", default=None):
        public_storage_options["custom_domain"] = custom_domain

    public_storage_options = deepcopy(default_storage_options)
    if public_acl := env.str("AWS_S3_PUBLIC_ACL"):
        public_storage_options["default_acl"] = public_acl
    if public_bucket_name := env.str("AWS_S3_STORAGE_PUBLIC_BUCKET_NAME"):
        public_storage_options["bucket_name"] = public_bucket_name
    if public_prefix := env.str("AWS_S3_PUBLIC_PREFIX", default=None):
        public_storage_options["location"] = public_prefix
    if custom_domain := (
        env.str("AWS_S3_CUSTOM_DOMAIN", default=None) or env.str("AWS_S3_PUBLIC_CUSTOM_DOMAIN", default=None)
    ):
        public_storage_options["custom_domain"] = custom_domain
elif USE_AZURE:
    media_storage = "storages.backends.azure_storage.AzureStorage"
    static_storage = "storages.backends.azure_storage.AzureStorage"

    # https://django-storages.readthedocs.io/en/latest/backends/azure.html
    if azure_connection_string := env("AZURE_CONNECTION_STRING", default=None):
        default_storage_options["connection_string"] = azure_connection_string
    else:
        default_storage_options["account_name"] = env("AZURE_ACCOUNT_NAME")
        default_storage_options["account_key"] = env("AZURE_ACCOUNT_KEY")

    default_storage_options["azure_container"] = env("AZURE_CONTAINER")

    azure_custom_domain = f"{env('AZURE_ACCOUNT_NAME')}.blob.core.windows.net"
    default_storage_options["custom_domain"] = azure_custom_domain

    # azure public media settings
    MEDIA_URL = f"https://{azure_custom_domain}/{public_media_location}/"

STORAGES = {
    "default": {
        "BACKEND": media_storage,
        "LOCATION": private_media_location,
        "OPTIONS": default_storage_options,
    },
    "public": {
        "BACKEND": media_storage,
        "LOCATION": public_media_location,
        "OPTIONS": public_storage_options,
    },
    "staticfiles": {
        "BACKEND": static_storage,
        "LOCATION": public_static_location,
        "OPTIONS": public_storage_options,
    },
}

# Maximum request size excluding the uploaded files
DATA_UPLOAD_MAX_MEMORY_SIZE = env.int("DATA_UPLOAD_MAX_MEMORY_SIZE")

# Maximum single file size for uploaded files
MAX_DOCUMENT_SIZE = env.int("MAX_DOCUMENT_SIZE")


if IS_CONTAINERIZED:
    # Where ViteJS assets are built
    STATIC_ROOT = os.path.abspath(os.path.join(os.sep, "var", "www", "paul", "backend", "static"))
    MEDIA_ROOT = os.path.abspath(os.path.join(os.sep, "var", "www", "paul", "backend", "media"))
