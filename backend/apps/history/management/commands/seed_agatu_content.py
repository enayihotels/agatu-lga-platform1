import os

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.history.models import CultureEntry, HistoricalEvent, Leader
from apps.news.models import NewsFlash, NewsPost

SEED_ASSETS_DIR = os.path.join(settings.BASE_DIR, "seed_assets")


def _attach_image(instance, field_name, filename):
    """
    Attaches an image from backend/seed_assets/ to a model's image
    field, if that field is currently empty. Safe to call repeatedly --
    does nothing once an image is already set (e.g. the admin later
    replaced it with a better photo).
    """
    field = getattr(instance, field_name)
    if field:
        return False

    path = os.path.join(SEED_ASSETS_DIR, filename)
    if not os.path.exists(path):
        return False

    with open(path, "rb") as f:
        field.save(filename, File(f), save=True)
    return True


class Command(BaseCommand):
    help = (
        "Seeds real Agatu LGA content: the current Executive Chairman "
        "(with his real portrait), the LGA's founding history, two "
        "culture entries, and two news posts -- sourced from research "
        "provided by the site owner. Safe to re-run; skips entries that "
        "already exist by title/name and won't overwrite images that "
        "have already been set."
    )

    def handle(self, *args, **options):
        leader, created = Leader.objects.get_or_create(
            full_name="Hon. (Amb.) James Melvin Ejeh",
            defaults={
                "title": "Executive Chairman",
                "start_year": 2024,
                "end_year": None,
                "is_current": True,
                "biography": (
                    "Hon. (Amb.) James Melvin Ejeh is the Executive Chairman of "
                    "Agatu Local Government Council, elected in late 2024. He also "
                    "serves as Vice-Chairman/Deputy Chairman of the Association of "
                    "Local Governments of Nigeria (ALGON), Benue State Chapter."
                ),
                "achievements": (
                    "Implemented strict local security measures, including "
                    "revoking a 2017 grazing agreement granting access to Adapati "
                    "Island and ordering armed herders to vacate Agatu "
                    "communities. Leading resettlement efforts for displaced "
                    "communities and advocating for federal and state assistance "
                    "to rebuild infrastructure damaged by recurrent conflicts."
                ),
            },
        )
        photo_attached = _attach_image(leader, "portrait", "chairman.jpg")
        self.stdout.write(self.style.SUCCESS(
            f"Leader: {leader.full_name} "
            f"({'created' if created else 'already existed'}"
            f"{', portrait attached' if photo_attached else ''})"
        ))

        event, created = HistoricalEvent.objects.get_or_create(
            title="Agatu Local Government Area Created",
            defaults={
                "year": 1996,
                "month": 10,
                "summary": (
                    "Agatu Local Government Area was officially created in "
                    "October 1996 when it was carved out of the former Apa "
                    "Local Government Area, with its headquarters established "
                    "at Obagaji. It is now organized into 10 administrative "
                    "wards: Obagaji, Oshigbudu, Odugbeho, Okokolo, Egba, "
                    "Ogwule-Kaduna, Ogwule Ogbaulu, Ogbaulu, Enungba, and Usha."
                ),
            },
        )
        image_attached = _attach_image(event, "image", "map.webp")
        self.stdout.write(self.style.SUCCESS(
            f"Event: {event.title} "
            f"({'created' if created else 'already existed'}"
            f"{', map image attached' if image_attached else ''})"
        ))

        name_meaning, created = CultureEntry.objects.get_or_create(
            title="The Meaning of \"Agatu\"",
            defaults={
                "category": "folklore",
                "local_text": "",
                "english_meaning": (
                    "Oral tradition suggests the name \"Agatu\" translates to "
                    "\"gathered into hiding,\" pointing to historical migrations "
                    "and wars between the 15th and 17th centuries, when ancestral "
                    "groups sought refuge in the riverine terrain along the River "
                    "Benue."
                ),
                "context_notes": (
                    "The Agatu people are part of the broader Idoma-related "
                    "linguistic group, and traditionally relied on farming, "
                    "fishing, and hunting along the fertile floodplains of the "
                    "River Benue."
                ),
            },
        )
        image_attached = _attach_image(name_meaning, "image", "children.jpg")
        self.stdout.write(self.style.SUCCESS(
            f"Culture: {name_meaning.title} "
            f"({'created' if created else 'already existed'}"
            f"{', photo attached' if image_attached else ''})"
        ))

        ochagatu, created = CultureEntry.objects.get_or_create(
            title="The Och'Agatu",
            defaults={
                "category": "custom",
                "local_text": "Och'Agatu",
                "english_meaning": (
                    "The traditional stool of the Och'Agatu represents the "
                    "distinct chieftaincy and lineage of the Agatu people, "
                    "coordinating the local clans and heritage alongside the "
                    "broader Idoma traditional council structures."
                ),
                "context_notes": (
                    "Agatu falls under the broader cultural umbrella of the "
                    "Idoma Kingdom while maintaining its own distinct "
                    "traditional leadership."
                ),
            },
        )
        self.stdout.write(self.style.SUCCESS(
            f"Culture: {ochagatu.title} ({'created' if created else 'already existed'})"
        ))

        # --- News posts ---
        post1, created = NewsPost.objects.get_or_create(
            title="Council Chairman Orders Armed Herders Out of Agatu Communities",
            defaults={
                "excerpt": (
                    "In a decisive security move, the Agatu LG Council has "
                    "revoked a 2017 grazing agreement and ordered armed herders "
                    "to vacate local communities."
                ),
                "body": (
                    "The Executive Chairman, Hon. (Amb.) James Melvin Ejeh, has "
                    "implemented strict local security measures in response to "
                    "renewed attacks in Agatu Local Government Area. This "
                    "includes revoking a 2017 grazing agreement that had granted "
                    "access to Adapati Island, and directly ordering armed "
                    "herders to vacate Agatu communities.\n\n"
                    "The Council is also actively leading resettlement efforts "
                    "for displaced communities, and continues to advocate for "
                    "federal and state assistance to rebuild public "
                    "infrastructure damaged by recurrent conflicts."
                ),
                "is_published": True,
                "published_at": timezone.now(),
            },
        )
        self.stdout.write(self.style.SUCCESS(
            f"News: {post1.title} ({'created' if created else 'already existed'})"
        ))

        post2, created = NewsPost.objects.get_or_create(
            title="Agatu's Fadama Farmlands Power Benue's Status as the Food Basket of the Nation",
            defaults={
                "excerpt": (
                    "Agatu is responsible for over 80% of fish production "
                    "across Benue State's Zone C, and its fertile Fadama lands "
                    "yield massive commercial harvests of yams, rice, and more."
                ),
                "body": (
                    "Agatu Local Government Area sits directly along the Benue "
                    "River trough, giving it one of the longest river system "
                    "stretches in the state. It is responsible for over 80% of "
                    "all fish production across Benue State's Zone C, the "
                    "Idoma-majority southern region.\n\n"
                    "The seasonal flooding of the River Benue deposits rich "
                    "nutrients across low-lying terrain known as Fadama land, "
                    "supporting extensive dry-season irrigation and generating "
                    "massive commercial yields of yams, cassava, rice, maize, "
                    "soybeans, beniseed (sesame), and melon seeds.\n\n"
                    "Beyond farming, geological assessments of the Agatu "
                    "terrain have also mapped commercial-grade deposits of "
                    "limestone, gypsum, kaolin, and anhydride, along with "
                    "traces of natural gas and petroleum in the deeper "
                    "sedimentary layers of the river basin."
                ),
                "is_published": True,
                "published_at": timezone.now(),
            },
        )
        self.stdout.write(self.style.SUCCESS(
            f"News: {post2.title} ({'created' if created else 'already existed'})"
        ))

        flash, created = NewsFlash.objects.get_or_create(
            headline="Agatu: over 80% of Benue Zone C's fish production",
            defaults={"priority": 10},
        )
        self.stdout.write(self.style.SUCCESS(
            f"Flash: {flash.headline} ({'created' if created else 'already existed'})"
        ))

        self.stdout.write(self.style.SUCCESS("Done."))
