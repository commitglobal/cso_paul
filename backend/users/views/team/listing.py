import json
import logging
from typing import Dict, List, Tuple

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.core.paginator import Page
from django.http import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control

from tools.data_models.filtering import FilterField, FilterItem
from tools.display.url_build import build_ngohub_url
from tools.utils.filtering import build_filters_display, build_filters_mapping, filter_qs
from tools.utils.pagination import paginate_queryset
from tools.utils.search import search
from tools.utils.serializers import inertia_enhanced
from tools.utils.sort_parser import parse_order_parameter
from users.forms import AddTeamUserForm
from users.models import RoleChoices, User

logger = logging.getLogger(__name__)


def _serialize_users(users_page: Page[User], user_id: int) -> List[Dict]:
    users = []
    for user in users_page:
        new_user = user.to_json()
        new_user["isCurrentUser"] = bool(user.id == user_id)

        users.append(new_user)

    return users


def _get_filter_options() -> List[FilterField]:
    role_options = FilterField(
        label="roleLabel",
        value="main_role",
        kind="combobox",
        items=[FilterItem(value=key, label=str(label)) for key, label in settings.USER_GROUPS_CHOICES],
    )

    added_since_options = FilterField(
        label="addedSince",
        value="date_joined",
        kind="calendar",
        items=[],
    )

    last_activity_options = FilterField(
        label="lastActivity",
        value="last_login",
        kind="calendar",
        items=[],
    )

    return [role_options, added_since_options, last_activity_options]


def _request_users(request):
    search_query = request.GET.get(settings.QUERY_PARAMS["SEARCH"], "").strip()
    page_number = int(request.GET.get(settings.QUERY_PARAMS["PAGE"], 1))
    page_size = request.GET.get(settings.QUERY_PARAMS["PAGE_SIZE"], 10)
    sort = request.GET.get(settings.QUERY_PARAMS["SORT"], None)

    users_qs = User.objects.all()

    field_mapping = {
        "user": ["first_name", "last_name", "email"],
        "roleLabel": "main_role",
        "addedSince": "date_joined",
        "lastActivity": "last_login",
    }
    parsed_parameters: List[str] = parse_order_parameter(sort_parameter=sort, field_mapping=field_mapping)
    users_qs = users_qs.exclude(is_active=False).order_by(*parsed_parameters)

    if search_query:
        users_qs = search(
            query=search_query,
            queryset=users_qs,
            language_code=request.LANGUAGE_CODE,
            search_fields=["first_name", "last_name", "email"],
        )

    filters = _get_filter_options()
    users_qs = filter_qs(build_filters_mapping(filters), request, users_qs)

    users_page, paginator, pagination = paginate_queryset(
        queryset=users_qs,
        page_number=page_number,
        page_size=page_size,
        page_serializer=_serialize_users,
        serializer_kwargs={"user_id": request.user.id},
    )

    data = {
        "users": users_page,
        "search_query": search_query,
        "pagination": pagination.model_dump(),
        "filters": build_filters_display(filters),
    }

    return data


def _get_is_add_user_enabled(user: User) -> bool:
    if not settings.ENABLE_EMAIL_AUTH:
        return False

    return user.has_perm("users.add_user")


@login_required
@cache_control(private=True)
@inertia_enhanced("users/team/index")
def manage_team(request: HttpRequest) -> Dict:
    """
    Manage the user team
    """
    subtitle_text = _(
        "This is the list of users in your organization who have access to Paul. "
        "You can change access options from NGO Hub"
    )
    subtitle_cta_text = _("(Manage access)")
    subtitle_cta_url = build_ngohub_url()
    subtitle = f"""{subtitle_text}
        <a href="{subtitle_cta_url}" target="_blank" rel="noopener noreferrer">
            {subtitle_cta_text}
        </a>"""

    user = request.user

    add_user_enabled: bool = _get_is_add_user_enabled(user)
    assignable_roles: Tuple[str, ...] = tuple(
        choice for choice in RoleChoices.label_value_choices() if choice["value"] in settings.USER_GROUPS_ASSIGNABLE
    )

    page_props = {
        "title": _("Team members"),
        "description": subtitle,
        "breadcrumbs": [{"label": _("Team"), "url": reverse("users:manage-team")}],
        "role_choices": assignable_roles,
        "is_ngohub_auth_enabled": settings.ENABLE_NGOHUB_AUTH,
        "is_email_auth_enabled": settings.ENABLE_EMAIL_AUTH,
        "is_add_user_button_enabled": add_user_enabled,
    }

    if request.method == "POST":
        if not add_user_enabled:
            messages.error(request, _("You do not have permission to add users to the team."))
            raise PermissionDenied()

        form = AddTeamUserForm(json.loads(request.body))
        if not form.is_valid():
            page_props.update({"errors": {"team": form.errors}})
            messages.error(request, _("There was an error adding the user to the team."))
        else:
            user: User = form.save()
            messages.success(request, _("User %(user_name)s added successfully.") % {"user_name": user.name})

    page_props.update(_request_users(request))

    return page_props
