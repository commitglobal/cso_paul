from auditlog.middleware import AuditlogMiddleware
from auditlog.signals import accessed
from django.http import HttpRequest


def log_access(instance):
    """
    Helper function for triggering an access event for an object instance
    """
    accessed.send(instance.__class__, instance=instance)


def get_remote_addr(request: HttpRequest):
    return AuditlogMiddleware._get_remote_addr(request)
