from typing import Optional

from pydantic import BaseModel

from paul.views.data_model import BasePageProps


class Tab(BaseModel):
    value: str
    label: str


class UserPageProps(BasePageProps):
    tabs: tuple[Tab, ...]
    baseUrl: str

    currentTab: str
    tabTitle: str

    errors: Optional[dict[str, dict[str, list[str]]]] = []
