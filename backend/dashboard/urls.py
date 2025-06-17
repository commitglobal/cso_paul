from django.urls import path

from . import views


app_name = "dashboard"
urlpatterns = [
    path("test-menu/", views.test_menu, name="test-menu"),
    path("health/", views.health, name="health"),
    path("", views.home, name="dashboard"),
]
