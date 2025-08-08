from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("users/", include("users.urls")),
    path("data/", include("datastore.urls")),
    path("allauth/", include("allauth.urls")),
    path("_allauth/", include("allauth.headless.urls")),
    path("", include("dashboard.urls")),
]
