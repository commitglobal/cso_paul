from typing import Optional

from pydantic import BaseModel


class TableHeader(BaseModel):
    label: str
    value: str
    sortable: bool = False
    sort_key: Optional[str] = None


class DataTable(BaseModel):
    totalItems: int
    totalPages: int
    header: list[TableHeader]
    items: list[dict[str, str]]


class Breadcrumb(BaseModel):
    label: str
    url: Optional[str] = None


class BasePageProps(BaseModel):
    title: str
    description: str
    breadcrumbs: tuple[Breadcrumb, ...]


def serialize_page_props_decorator(func):
    def wrapper(*args, **kwargs):
        page_props: BasePageProps = func(*args, **kwargs)
        return page_props.model_dump()

    return wrapper
