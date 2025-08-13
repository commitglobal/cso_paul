from django.urls import path

from . import views

app_name = "dashboard"
urlpatterns = [
    path("health/", views.health, name="health"),
    path("", views.home, name="home"),
]
