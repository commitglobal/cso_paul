from typing import List, Optional

from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from pydantic import BaseModel

from paul.display.build_url import build_ngohub_url
from paul.views.data_model import BasePageProps, Breadcrumb
from users.models import User


class Tab(BaseModel):
    value: str
    label: str


class UserPageProps(BasePageProps):
    tabs: list[Tab]
    baseUrl: str

    currentTab: str
    tabTitle: str

    errors: Optional[dict[str, dict[str, list[str]]]] = []


PAGE_TABS = {
    "info": {
        "label": _("Info"),
        "value": "info",
    },
    "role": {
        "label": _("User Role"),
        "value": "role",
    },
    "permissions": {
        "label": _("Permissions"),
        "value": "permissions",
    },
    "activity-log": {
        "label": _("Activity Log"),
        "value": "activity-log",
    },
}


def get_requested_user(user_id: str) -> User:
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise Http404(_("User not found."))

    if not user:
        raise PermissionDenied(_("User not found."))

    return user


def get_user_name(user) -> str:
    user_name: str = user.first_name
    if user.last_name:
        user_name = f"{user_name} {user.last_name}"

    return user_name


def get_base_url(user) -> str:
    return reverse("users:manage-user", kwargs={"user_id": user.id})


def get_tabs() -> List[Tab]:
    return [Tab(value=tab["value"], label=str(tab["label"])) for tab in PAGE_TABS.values()]


def get_breadcrumbs(user) -> List[Breadcrumb]:
    return [
        Breadcrumb(label=str(_("Team")), url=reverse("users:manage-team")),
        Breadcrumb(label=get_user_name(user)),
    ]


def get_title(user) -> str:
    return _("User: %s") % get_user_name(user)


def get_description() -> str:
    subtitle_text = _("This user has access to Paul. You can change access options from NGO Hub")
    subtitle_cta_text = _("(Manage access)")
    subtitle_cta_url = build_ngohub_url()

    subtitle = f"""{subtitle_text}
    <a href="{subtitle_cta_url}" target="_blank" rel="noopener noreferrer">
        {subtitle_cta_text}
    </a>""".strip()

    return subtitle
