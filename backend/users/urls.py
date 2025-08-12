from django.urls import path
from django.views.generic import RedirectView

import users.views.auth
import users.views.ngohub
import users.views.team
import users.views.team_user

app_name = "users"
urlpatterns = [
    path("login/", users.views.auth.login_choice, name="login"),
    path("login/email/", users.views.auth.email_login, name="login-by-email"),
    path("login/ngohub/", users.views.auth.ngohub_login, name="login-by-ngohub"),
    path("logout/", users.views.auth.logout, name="logout"),
    path("team/", users.views.team.manage_team, name="manage-team"),
    path(
        "team/<str:user_id>/info/",
        users.views.team_user.manage_user_info,
        name="manage-user-info",
    ),
    path(
        "team/<str:user_id>/role/",
        users.views.team_user.manage_user_role,
        name="manage-user-role",
    ),
    path(
        "team/<str:user_id>/permissions/",
        users.views.team_user.manage_user_permissions,
        name="manage-user-permissions",
    ),
    path(
        "team/<str:user_id>/activity-log/",
        users.views.team_user.manage_user_activity_log,
        name="manage-user-activity-log",
    ),
    path("team/<str:user_id>/", RedirectView.as_view(pattern_name="users:manage-user-info"), name="manage-user"),
    path("team/ngohub-refresh/", users.views.ngohub.sync_from_ngohub, name="ngohub-refresh"),
]
