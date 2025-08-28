import logging
from typing import Any, Dict, List, Union

from django.contrib.messages import get_messages
from django.forms.utils import ErrorDict, ErrorList
from django.http import HttpRequest, HttpResponse
from inertia import inertia as inertia_decorator

from tools.data_models.page import BasePageProps

logger = logging.getLogger(__name__)


def _serialize_errors(errors: Union[str, List, ErrorList]) -> List:
    """
    Serializes an error list into a list of strings. This is useful when dealing with lazy strings.

    Args:
        errors (List | ErrorList): The error list to serialize.

    Returns:
        List: A list of strings representing the error list.
    """
    if isinstance(errors, str):
        raise ValueError("Errors must be a list or error list.")

    return list([str(error) for error in errors])


def serialize_form_errors(form_errors: Union[Dict, ErrorDict]) -> Dict:
    """
    Serializes form errors into a dictionary format suitable for being parsed by pydantic.

    Args:
        form_errors (Dict | ErrorDict): The form errors to serialize.

    Returns:
        Dict: A dictionary representation of the form errors.
    """
    return {field: _serialize_errors(errors) for field, errors in form_errors.items()}


def _extract_messages(request: HttpRequest) -> List[Dict]:
    """
    Extract flash messages from the session storage
    """
    messages = []
    for message in get_messages(request):
        messages.append(
            {
                "message": message.message,
                "level_tag": message.level_tag,
            }
        )
    return messages


def _serialize_page_props(page_props: Union[Dict, BasePageProps]) -> Dict[str, Any]:
    if isinstance(page_props, Dict):
        logger.warning(
            "Returning the page props as a dictionary is deprecated. "
            "Please return a BasePageProps model so that we can better ensure type safety"
        )
        serialized_props: Dict = page_props
    else:
        serialized_props: Dict = page_props.model_dump()

    return serialized_props


def inertia_enhanced(component):
    def wrapper(func):
        @inertia_decorator(component)
        def inner(request: HttpRequest, *args, **kwargs):
            page_props: Union[Dict, BasePageProps, HttpResponse] = func(request, *args, **kwargs)

            if isinstance(page_props, HttpResponse):
                return page_props

            serialized_props: Dict = _serialize_page_props(page_props)

            flash_messages: List[Dict]
            if flash_messages := _extract_messages(request):
                serialized_props["flashMessages"] = flash_messages

            return serialized_props

        return inner

    return wrapper
