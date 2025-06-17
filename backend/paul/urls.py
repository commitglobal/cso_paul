from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("users/", include("users.urls")),
    path("data/", include("datastore.urls")),
    path("", include("dashboard.urls")),
]
