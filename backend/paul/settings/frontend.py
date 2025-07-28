# Django Vite config
import os
from typing import Any, Dict

from .environment import BASE_DIR, env
from utils.encoders import CustomJsonEncoder

# Where ViteJS assets are built
django_vite_assets_path = os.path.abspath(os.path.join(os.pardir, "frontend", "dist"))  # noqa
django_vite_sources_dir = os.path.abspath(os.path.join(os.pardir, "frontend", "src"))  # noqa

django_vite_dev_mode = env.bool("DJANGO_VITE_DEV_MODE")
django_vite_settings: Dict[str, Any] = {
    "dev_mode": django_vite_dev_mode,
    "manifest_path": os.path.join(django_vite_assets_path, ".vite", "manifest.json"),
}

# If we should use HMR or not
if django_vite_dev_mode:
    django_vite_settings["dev_server_port"] = env.int("DJANGO_VITE_DEV_SERVER_PORT")
    STATICFILES_DIRS = [django_vite_sources_dir]
else:
    STATICFILES_DIRS = [django_vite_assets_path]

STATICFILES_DIRS.append(os.path.abspath(os.path.join(BASE_DIR, "static_extras")))

DJANGO_VITE: Dict[str, Dict] = {
    "default": django_vite_settings,
}


# InertiaJS

INERTIA_JSON_ENCODER = CustomJsonEncoder

INERTIA_VERSION = "2.0"  # defaults to '1.0'
INERTIA_LAYOUT = "base.html"  # required and has no default
INERTIA_SSR_URL = env.str("INERTIA_SSR_URL", default="http://localhost:13714")
INERTIA_SSR_ENABLED = env.bool("INERTIA_SSR_ENABLED", default=django_vite_dev_mode)
