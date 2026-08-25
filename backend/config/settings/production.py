from pathlib import Path

from .base import *  # noqa: F401,F403
from .base import BASE_DIR, env

DEBUG = False

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 7
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (  # noqa: F405
    "rest_framework.renderers.JSONRenderer",
)

# Render sets RENDER_EXTERNAL_HOSTNAME automatically for web services
render_host = env("RENDER_EXTERNAL_HOSTNAME", default=None)
if render_host:
    ALLOWED_HOSTS.append(render_host)  # noqa: F405

# Media files live on Render's Persistent Disk in production, mounted
# at the path set by MEDIA_ROOT_OVERRIDE (see render.yaml). Falls back
# to the base.py default (local mediafiles/ folder) if unset, so this
# settings module still works fine without a disk attached, e.g. during
# a build step that doesn't have the disk mounted yet.
media_root_override = env("MEDIA_ROOT_OVERRIDE", default=None)
if media_root_override:
    MEDIA_ROOT = Path(media_root_override)  # noqa: F405
