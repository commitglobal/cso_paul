from django.urls import path

from users.views import api as users_api

app_name = "users"
urlpatterns = [
    path("users/<int:user_id>/roles", users_api.get_user_roles, name="get-user-roles"),
]
