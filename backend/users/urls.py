from django.urls import path

import users.views.auth
import users.views.team

app_name = "users"
urlpatterns = [
    path("login/", users.views.auth.login_choice, name="login"),
    path("login/email/", users.views.auth.email_login, name="login-by-email"),
    path("login/ngohub/", users.views.auth.ngohub_login, name="login-by-ngohub"),
    path("logout/", users.views.auth.logout, name="logout"),
    path("team/", users.views.team.manage_team, name="manage-team"),
]
