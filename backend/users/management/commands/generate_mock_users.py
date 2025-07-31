from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from faker import Faker


class Command(BaseCommand):
    help = "Generate mock users using Faker"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=10, help="Number of mock users to create (default: 10)")

    def handle(self, *args, **options):
        User = get_user_model()
        fake = Faker()
        count = options["count"]

        for _ in range(count):
            email = fake.unique.email()

            if not User.objects.filter(email=email).exists():
                # noinspection PyArgumentList
                User.objects.create_user(
                    first_name=fake.first_name(),
                    last_name=fake.last_name(),
                    email=email,
                    password=email,
                )

        self.stdout.write(self.style.SUCCESS(f"Successfully created {count} mock users."))
