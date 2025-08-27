from typing import Dict, List, Union

from django.forms.utils import ErrorDict, ErrorList


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
