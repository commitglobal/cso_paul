from typing import Any, Optional, Union

from django.http import HttpResponse
from pydantic import BaseModel


class TableHeader(BaseModel):
    header: str
    accessorKey: str
    enableSorting: bool = False


class DataTable(BaseModel):
    totalItems: int
    totalPages: int
    header: list[TableHeader]
    items: list[Any]


class Breadcrumb(BaseModel):
    label: str
    url: Optional[str] = None


class BasePageProps(BaseModel):
    title: str
    description: str
    breadcrumbs: tuple[Breadcrumb, ...]


def serialize_page_props_decorator(func):
    def wrapper(*args, **kwargs):
        page_props: Union[BasePageProps, HttpResponse] = func(*args, **kwargs)

        if isinstance(page_props, HttpResponse):
            return page_props

        return page_props.model_dump()

    return wrapper
