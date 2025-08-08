import logging
from typing import Dict, List, Union

from django.db.models import QuerySet
from django.http import HttpRequest
from pydantic import BaseModel, RootModel

logger = logging.getLogger(__name__)


class FilterItem(BaseModel):
    value: str
    label: str


class FilterField(BaseModel):
    kind: str
    items: List[FilterItem]


class Filters(RootModel[Dict[str, FilterField]]):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)


def filter_qs(
    field_mapping: Dict[str, Union[str, List[str]]],
    filters: Filters,
    request: HttpRequest,
    qs: QuerySet,
) -> QuerySet:
    for request_param in request.GET.keys():
        filter_key: str = request_param
        filter_operator: str = ""

        if "__" in request_param:
            filter_key, filter_operator = request_param.split("__", 1)

        if not filter_key or filter_key not in filters.root:
            continue

        filter_value = request.GET.get(request_param, None)
        if not filter_value:
            continue

        mapped_value = field_mapping.get(filter_key)
        if not mapped_value:
            logger.warning("Invalid filter key '%s' provided in request", filter_key)
            continue

        if filter_operator:
            filter_parameters = {f"{mapped_value}__{filter_operator}": filter_value}
        else:
            field_name: str = mapped_value[0] if isinstance(mapped_value, list) else mapped_value
            filter_parameters = {f"{field_name}__in": filter_value.split(",")}

        qs = qs.filter(**filter_parameters)

    return qs
