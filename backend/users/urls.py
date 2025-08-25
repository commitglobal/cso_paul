from django.urls import path
from django.views.generic import RedirectView

import users.views.auth
import users.views.ngohub
import users.views.team.listing
import users.views.team.user_activity_log
import users.views.team.user_info
import users.views.team.user_permissions
import users.views.team.user_remove
import users.views.team.user_role

app_name = "users"
urlpatterns = [
    path("login/", users.views.auth.login_choice, name="login"),
    path("login/email/", users.views.auth.email_login, name="login-by-email"),
    path("login/ngohub/", users.views.auth.ngohub_login, name="login-by-ngohub"),
    path("logout/", users.views.auth.logout, name="logout"),
    path("team/", users.views.team.listing.manage_team, name="manage-team"),
    path(
        "team/<int:user_id>/info/",
        users.views.team.user_info.manage_user_info,
        name="manage-user-info",
    ),
    path(
        "team/<int:user_id>/role/",
        users.views.team.user_role.manage_user_role,
        name="manage-user-role",
    ),
    path(
        "team/<int:user_id>/permissions/",
        users.views.team.user_permissions.manage_user_permissions,
        name="manage-user-permissions",
    ),
    path(
        "team/<int:user_id>/activity-log/",
        users.views.team.user_activity_log.manage_user_activity_log,
        name="manage-user-activity-log",
    ),
    path(
        "team/<int:user_id>/remove/",
        users.views.team.user_remove.remove_user,
        name="remove-user",
    ),
    path("team/<int:user_id>/", RedirectView.as_view(pattern_name="users:manage-user-info"), name="manage-user"),
    path("team/ngohub-refresh/", users.views.ngohub.sync_from_ngohub, name="ngohub-refresh"),
]
