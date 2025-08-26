import logging
from typing import Dict, List, Union

from django.db.models import QuerySet
from django.http import HttpRequest
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class FilterItem(BaseModel):
    value: str
    label: str


class FilterField(BaseModel):
    label: str
    value: str

    kind: str
    items: List[FilterItem]


def build_filters_display(fields: List[FilterField]) -> Dict[str, Dict[str, Union[str, List[str]]]]:
    return {
        field.label: {
            "kind": field.kind,
            "items": [item.model_dump(mode="json") for item in field.items],
        }
        for field in fields
    }


def build_filters_mapping(fields: List[FilterField]) -> Dict[str, str]:
    be_fields: Dict[str, str] = {}
    for field in fields:
        if field.kind == "combobox":
            be_fields[field.label] = field.value
        elif field.kind == "calendar":
            be_fields[f"{field.label}__lte"] = f"{field.value}__lte"
            be_fields[f"{field.label}__gte"] = f"{field.value}__gte"

    return be_fields


def filter_qs(
    filters: Dict,
    request: HttpRequest,
    qs: QuerySet,
) -> QuerySet:
    for filter_key in request.GET.keys():
        if filter_key not in filters.keys():
            continue

        filter_value = request.GET.get(filter_key, None)
        if not filter_value:
            continue

        mapped_value = filters.get(filter_key)
        if not mapped_value:
            logger.warning("Invalid filter key '%s' provided in request", filter_key)
            continue

        if isinstance(filter_value, str) and "," in filter_value:
            filter_parameters = {f"{mapped_value}__in": (filter_value.split(","))}
        else:
            filter_parameters = {f"{mapped_value}": filter_value}

        qs = qs.filter(**filter_parameters)

    return qs
