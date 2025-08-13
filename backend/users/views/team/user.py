from typing import Tuple

from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from paul.display.build_url import build_ngohub_url
from paul.views.data_model import Breadcrumb
from users.models import User
from users.views.team.data_model import Tab

PAGE_TABS = {
    "info": Tab(value="info", label=str(_("Info"))),
    "role": Tab(value="role", label=str(_("User Role"))),
    "permissions": Tab(value="permissions", label=str(_("Permissions"))),
    "activity-log": Tab(value="activity-log", label=str(_("Activity Log"))),
}

PAGE_TABS_TUPLE: Tuple[Tab, ...] = tuple(tab for tab in PAGE_TABS.values())


def get_user(user_id: int) -> User:
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


def get_breadcrumbs(user, *, append_breadcrumbs: Tuple[Breadcrumb, ...]) -> Tuple[Breadcrumb, ...]:
    default_breadcrumbs: Tuple[Breadcrumb, ...] = tuple(
        (
            Breadcrumb(label=str(_("Team")), url=reverse("users:manage-team")),
            Breadcrumb(label=get_user_name(user), url=""),
        )
    )
    return default_breadcrumbs + append_breadcrumbs


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
