from typing import Dict, List, Union


def parse_order_parameter(sort: str, field_mapping: Dict[str, Union[List[str], str]]) -> List[str]:
    """
    Parse the sort parameter into a field and direction.

    Args:
        sort (str): The sort parameter in the format "field:direction".
        field_mapping (Dict[str, Union[List[str], str]]): A mapping of field names to their database equivalents.

    Returns:
        Tuple[str, str]: A tuple containing the field and direction.
    """
    if not sort:
        return []

    field, direction = sort.split(",")
    if not field:
        raise ValueError("Sort field cannot be empty")

    if direction and direction not in ("asc", "desc"):
        raise ValueError(f"Invalid sort direction: {direction}")

    sort_field = field_mapping[field]

    direction_prefix = "" if direction == "asc" else "-"

    if isinstance(sort_field, list):
        return [f"{direction_prefix}{f}" for f in sort_field]

    return [f"{direction_prefix}{sort_field}"]
