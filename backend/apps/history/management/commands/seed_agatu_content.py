from django.core.management.base import BaseCommand

from apps.history.models import CultureEntry, HistoricalEvent, Leader


class Command(BaseCommand):
    help = (
        "Seeds real Agatu LGA content: the current Executive Chairman, "
        "the LGA's founding history, and two culture entries -- sourced "
        "from research provided by the site owner. Safe to re-run; "
        "skips entries that already exist by title/name."
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
        self.stdout.write(
            self.style.SUCCESS(f"Leader: {leader.full_name} ({'created' if created else 'already existed'})")
        )

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
        self.stdout.write(
            self.style.SUCCESS(f"Event: {event.title} ({'created' if created else 'already existed'})")
        )

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
        self.stdout.write(
            self.style.SUCCESS(f"Culture: {name_meaning.title} ({'created' if created else 'already existed'})")
        )

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
        self.stdout.write(
            self.style.SUCCESS(f"Culture: {ochagatu.title} ({'created' if created else 'already existed'})")
        )

        self.stdout.write(self.style.SUCCESS("Done."))
