from typing import List

from pydantic import BaseModel


class FilterItem(BaseModel):
    value: str
    label: str


class FilterField(BaseModel):
    label: str
    value: str

    kind: str
    items: List[FilterItem]
