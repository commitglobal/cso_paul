import logging
from typing import Dict, List, Union

logger = logging.getLogger(__name__)


def _log_and_return_default(error_message: str, default: str) -> str:
    """
    Log an error message and return a default value.
    Args:
        `error_message` (str): The error message to log.
        `default` (List[str]): The default value to return.

    Returns:
        List[str]: The default value.
    """
    logger.warning(f"SORT_PARSER: {error_message}")

    return default


def _map_field_to_db(field: str, field_mapping: Dict[str, Union[List[str], str]], default: str) -> str:
    try:
        return field_mapping[field]
    except KeyError:
        return _log_and_return_default(
            error_message=f"Field '{field}' not found in field mapping.",
            default=default,
        )


def parse_order_parameter(
    *, sort_parameter: str, field_mapping: Dict[str, Union[List[str], str]], default_sort_option: str = "pk"
) -> List[str]:
    """
    Parse the sort parameter into a field and direction.
    Args:
        `sort_parameter` (str): The sort parameter in the format "field,direction".
        `field_mapping` (Dict[str, Union[List[str], str]]): A mapping of field names to their database equivalents.
        `default_sort_option` (str): The default sort option if the sort_parameter is invalid or empty.

    Returns:
        List[str]: A list of fields with direction prefix applied.
    """
    if not sort_parameter:
        return [default_sort_option]

    parts: List[str] = sort_parameter.split(",")

    if 1 > len(parts) > 2:
        return [
            _log_and_return_default(
                error_message=f"Invalid sort parameter: {sort_parameter}. Expected format 'field,direction'.",
                default=default_sort_option,
            )
        ]

    if len(parts) == 1:
        # Sort ascending by the field if no direction is specified
        return [_map_field_to_db(parts[0], field_mapping, default_sort_option)]

    field, direction = parts
    if not field:
        return [
            _log_and_return_default(
                error_message="Sort field cannot be empty",
                default=default_sort_option,
            )
        ]

    if direction and direction not in ("asc", "desc"):
        return [
            _log_and_return_default(
                error_message=f"Invalid sort direction: {direction}",
                default=default_sort_option,
            )
        ]

    if field not in field_mapping:
        return [
            _log_and_return_default(
                error_message=f"Invalid sort field: {field}",
                default=default_sort_option,
            )
        ]

    direction_prefix: str = "" if direction == "asc" else "-"

    sort_field: str = _map_field_to_db(field, field_mapping, default_sort_option)

    if isinstance(sort_field, list):
        # If the field maps to multiple database fields, apply the direction to each
        return [f"{direction_prefix}{f}" for f in sort_field]

    return [f"{direction_prefix}{sort_field}"]
