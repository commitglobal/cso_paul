from typing import Optional

from pydantic import BaseModel

from tools.data_models.page import BasePageProps


class Tab(BaseModel):
    value: str
    label: str


class UserPageProps(BasePageProps):
    tabs: tuple[Tab, ...]
    baseUrl: str

    currentTab: str
    tabTitle: str

    errors: Optional[dict[str, dict[str, list[str]]]] = []


class RoleChoicesModel(BaseModel):
    value: str
    label: str
    disabled: bool = False
    description: str = ""
