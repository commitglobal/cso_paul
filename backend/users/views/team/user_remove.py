from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponseRedirect
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_control
from inertia import inertia

from paul.common.url_parser import make_url_safe
from users.views.team.user import get_user

User = get_user_model()


@login_required
@cache_control(private=True)
@inertia("users/team/index")
def remove_user(request: HttpRequest, user_id: int) -> HttpResponseRedirect:
    """
    Redirect to manage_user view for user info
    """
    next_url: str = make_url_safe(
        request=request,
        url=request.GET.get("next"),
        default_next=reverse("users:manage-team"),
    )

    acting_user: User = request.user
    target_user: User = get_user(user_id=user_id)

    if not acting_user.has_perm("users.delete_user"):
        messages.error(request=request, message=_("You do not have permission to remove this user."))
        return redirect(next_url)

    if target_user.ngohub_id:
        messages.error(request=request, message=_("You cannot remove a user from NGOHub."))
        return redirect(next_url)

    target_user.is_active = False
    target_user.save()

    messages.info(request=request, message=_("User removed successfully."))

    return redirect(next_url)
