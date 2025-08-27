from django.contrib.messages import constants

__all__ = (
    "add_message",
    "get_messages",
    "info",
    "success",
    "warning",
    "error",
    "InertiaMessageFailure",
)


class InertiaMessageFailure(Exception):
    pass


def add_message(request, level, message, extra_tags="", fail_silently=False):
    """
    Attempt to add a message to the request using the 'messages' app.
    """
    try:
        messages = request._messages
    except AttributeError:
        if not hasattr(request, "META"):
            raise TypeError(
                "add_message() argument must be an HttpRequest object, not '%s'." % request.__class__.__name__
            )
        if not fail_silently:
            raise InertiaMessageFailure(
                "You cannot add messages without installing django.contrib.messages.middleware.MessageMiddleware"
            )
    else:
        return messages.add(level, message, extra_tags)


def get_messages(request):
    """
    Return the message storage on the request if it exists, otherwise return
    an empty list.
    """
    return getattr(request, "_messages", [])


def info(request, message, extra_tags="", fail_silently=False):
    """Add a message with the ``INFO`` level."""
    add_message(
        request,
        constants.INFO,
        message,
        extra_tags=extra_tags,
        fail_silently=fail_silently,
    )


def success(request, message, extra_tags="", fail_silently=False):
    """Add a message with the ``SUCCESS`` level."""
    add_message(
        request,
        constants.SUCCESS,
        message,
        extra_tags=extra_tags,
        fail_silently=fail_silently,
    )


def warning(request, message, extra_tags="", fail_silently=False):
    """Add a message with the ``WARNING`` level."""
    add_message(
        request,
        constants.WARNING,
        message,
        extra_tags=extra_tags,
        fail_silently=fail_silently,
    )


def error(request, message, extra_tags="", fail_silently=False):
    """Add a message with the ``ERROR`` level."""
    add_message(
        request,
        constants.ERROR,
        message,
        extra_tags=extra_tags,
        fail_silently=fail_silently,
    )
