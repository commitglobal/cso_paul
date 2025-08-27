from django.test import RequestFactory, SimpleTestCase, override_settings
from django.urls import reverse

from tools.utils.url_parser import make_url_safe


@override_settings(ALLOWED_HOSTS=["testserver", "app.example.org", "secure.example.org"])  # allow custom hosts
class TestUrlParser(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_returns_url_if_allowed_same_host_http(self):
        request = self.factory.get("/", secure=False, HTTP_HOST="testserver")
        url = "http://testserver/some/path/?q=1"
        self.assertEqual(make_url_safe(request=request, url=url), url)

    def test_returns_default_if_external(self):
        request = self.factory.get("/", secure=False, HTTP_HOST="app.example.org")
        url = "https://evil.com/phishing"
        default = reverse("dashboard:home")
        self.assertEqual(make_url_safe(request=request, url=url, default_next=default), default)

    def test_https_requirement(self):
        # Secure request requires https in next url; http should fail and return default_next
        request = self.factory.get("/", secure=True, HTTP_HOST="secure.example.org")
        url = "http://secure.example.org/path"  # http, but request is secure => reject
        default = reverse("dashboard:home")
        self.assertEqual(make_url_safe(request=request, url=url, default_next=default), default)

        # With https, same host should pass
        url2 = "https://secure.example.org/path"
        self.assertEqual(make_url_safe(request=request, url=url2, default_next=default), url2)
