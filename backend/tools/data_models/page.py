from typing import Optional, Union

from django.http import HttpResponse
from pydantic import BaseModel


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
