from django.urls import path

from . import views


app_name = "users"
urlpatterns = [
    path("login/", views.login_choice, name="login"),
    path("login/email/", views.email_login, name="login-by-email"),
    path("login/ngohub/", views.ngohub_login, name="login-by-ngohub"),
    path("logout/", views.logout, name="logout"),
    path("team/", views.manage_team, name="manage-team"),
]
