from django.conf import settings
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("users/", include("users.urls")),
    path("data/", include("datastore.urls")),
    path("allauth/", include("allauth.urls")),
    path("_allauth/", include("allauth.headless.urls")),
    path("error/", include("paul.error_urls"), name="error"),
    path("", include("dashboard.urls")),
]

if settings.ENABLE_DJANGO_ADMIN:
    urlpatterns.append(
        path("django-admin/", admin.site.urls),
    )

handler400 = "paul.views.errors.custom_400_view"
handler403 = "paul.views.errors.custom_403_view"
handler404 = "paul.views.errors.custom_404_view"
handler500 = "paul.views.errors.custom_500_view"
