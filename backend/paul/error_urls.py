from django.urls import path

from .views import errors

app_name = "error"
urlpatterns = [
    path("app-missing", errors.ngohub_app_missing_view, name="ngohub-app-missing"),
    path("user-invalid", errors.ngohub_user_invalid_view, name="ngohub-user-invalid"),
]
