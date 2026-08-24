from django.core.management.base import BaseCommand

from apps.wards.models import Ward

# Source: INEC ward list for Agatu LGA, Benue State (10 wards, HQ at Obagaji).
# Descriptions are intentionally left blank/minimal here â€” fill these in
# via the admin as you gather accurate local detail. Do not treat the
# placeholder text as verified fact.
AGATU_WARDS = [
    {"name": "Egba", "is_lga_headquarters": False},
    {"name": "Enungba", "is_lga_headquarters": False},
    {"name": "Obagaji", "is_lga_headquarters": True, "headquarters_town": "Obagaji"},
    {"name": "Odugbeho", "is_lga_headquarters": False},
    {"name": "Ogbaulu", "is_lga_headquarters": False},
    {"name": "Ogwule Ogbaulu", "is_lga_headquarters": False},
    {"name": "Ogwule-Kaduna", "is_lga_headquarters": False},
    {"name": "Okokolo", "is_lga_headquarters": False},
    {"name": "Oshigbudu", "is_lga_headquarters": False},
    {"name": "Usha", "is_lga_headquarters": False},
]


class Command(BaseCommand):
    help = "Seed the 10 official INEC wards of Agatu LGA. Safe to re-run (get_or_create)."

    def handle(self, *args, **options):
        created_count = 0
        for ward_data in AGATU_WARDS:
            ward, created = Ward.objects.get_or_create(
                name=ward_data["name"],
                defaults={
                    "is_lga_headquarters": ward_data.get("is_lga_headquarters", False),
                    "headquarters_town": ward_data.get("headquarters_town", ""),
                },
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created ward: {ward.name}"))
            else:
                self.stdout.write(f"Already exists: {ward.name}")

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. {created_count} new ward(s) created, "
            f"{len(AGATU_WARDS) - created_count} already existed."
        ))
