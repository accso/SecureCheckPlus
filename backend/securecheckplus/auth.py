from django.conf import settings
from rest_framework.authentication import SessionAuthentication


class DevSessionAuthentication(SessionAuthentication):
    """Session authentication that skips CSRF enforcement in dev mode.

    In development, the webpack dev server proxy can cause CSRF token
    mismatches when the Origin header doesn't match CSRF_TRUSTED_ORIGINS.
    This class skips the CSRF check entirely when IS_DEV=True, while
    keeping full CSRF protection in production.
    """

    def enforce_csrf(self, request):
        if getattr(settings, "IS_DEV", False):
            return
        return super().enforce_csrf(request)
