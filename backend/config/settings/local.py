from .base import *  # noqa: F401,F403
from .base import env

DEBUG = True

INSTALLED_APPS += ["django_extensions"]  # noqa: F405

# Relax auth for local browsing of the DRF browsable API
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (  # noqa: F405
    "rest_framework.renderers.JSONRenderer",
    "rest_framework.renderers.BrowsableAPIRenderer",
)
