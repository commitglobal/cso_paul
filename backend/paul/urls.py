from django.conf import settings
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("users/", include("users.urls")),
    path("data/", include("datastore.urls")),
    path("allauth/", include("allauth.urls")),
    path("_allauth/", include("allauth.headless.urls")),
    path("", include("dashboard.urls")),
]

if settings.ENABLE_DJANGO_ADMIN:
    urlpatterns.append(
        path("django-admin/", admin.site.urls),
    )
