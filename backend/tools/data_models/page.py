from typing import Optional

from pydantic import BaseModel


class Breadcrumb(BaseModel):
    label: str
    url: Optional[str] = None


class BasePageProps(BaseModel):
    title: str
    description: str
    breadcrumbs: tuple[Breadcrumb, ...]
