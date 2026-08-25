import { useQuery } from "@tanstack/react-query";

import { listHistoricalEvents, listLeaders } from "@/api/history";
import mapImage from "@/assets/hero/map.webp";
import LeaderCard from "@/components/LeaderCard";

export default function HistoryPage() {
  const { data: leaders, isLoading: leadersLoading } = useQuery({
    queryKey: ["leaders"],
    queryFn: listLeaders,
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["historical-events"],
    queryFn: listHistoricalEvents,
  });

  return (
    <div>
      <div className="relative h-64 w-full overflow-hidden bg-agatu-earth-900 sm:h-80">
        <img
          src={mapImage}
          alt="Map of Agatu Local Government Area"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-agatu-earth-900/40 px-4 text-center text-white">
          <h1 className="font-serif text-3xl font-extrabold sm:text-5xl">
            History &amp; Leaders
          </h1>
          <p className="mt-2 max-w-xl text-sm text-agatu-earth-100 sm:text-base">
            From a 15th-century refuge along the Benue River to a modern
            local government area of 10 wards.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <section className="animate-fade-up mb-10 rounded-lg border border-agatu-earth-200 bg-white p-6">
          <h2 className="mb-3 font-serif text-xl font-bold text-agatu-earth-900">
            Our Story
          </h2>
          <p className="text-agatu-earth-800">
            Oral tradition holds that the name &ldquo;Agatu&rdquo; means
            &ldquo;gathered into hiding&rdquo; &mdash; a reference to the
            migrations and wars of the 15th to 17th centuries, when
            ancestral groups sought refuge in the fertile riverine terrain
            along the River Benue. Part of the broader Idoma-related
            linguistic group, the Agatu people built a society of farmers,
            fishermen, and hunters along these defensive floodplains.
          </p>
          <p className="mt-3 text-agatu-earth-800">
            Under British colonial rule, Agatu was administered as a
            district within the old Otukpo division. Following Nigeria&apos;s
            state creations, the region became part of Benue State in 1976,
            and Agatu&apos;s status as a full local government area was
            finalized two decades later, in{" "}
            <strong>October 1996</strong>, when it was carved out of the
            former Apa Local Government Area, with headquarters
            established at Obagaji.
          </p>
          <p className="mt-3 text-agatu-earth-800">
            Today, Agatu&apos;s cultural identity remains tied to its
            traditional leadership, including the <strong>Och&apos;Agatu</strong>,
            who coordinates the local clans and heritage alongside the
            broader Idoma traditional council structures.
          </p>
        </section>

        <section className="animate-fade-up">
          <h2 className="mb-3 font-semibold text-agatu-earth-800">Leaders</h2>
          {leadersLoading && (
            <p className="text-sm text-agatu-earth-500">Loading...</p>
          )}
          {!leadersLoading && (!leaders || leaders.length === 0) && (
            <p className="text-sm text-agatu-earth-500">
              No leader profiles published yet.
            </p>
          )}
          <div className="flex flex-col gap-3">
            {leaders?.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
        </section>

        <section className="animate-fade-up mt-10">
          <h2 className="mb-3 font-semibold text-agatu-earth-800">
            Historical Timeline
          </h2>
          {eventsLoading && (
            <p className="text-sm text-agatu-earth-500">Loading...</p>
          )}
          {!eventsLoading && (!events || events.length === 0) && (
            <p className="text-sm text-agatu-earth-500">
              No historical events published yet.
            </p>
          )}
          <div className="flex flex-col gap-3">
            {events?.map((event) => (
              <div
                key={event.id}
                className="overflow-hidden rounded-lg border border-agatu-earth-200 bg-white"
              >
                {event.image && (
                  <img src={event.image} alt="" className="h-40 w-full object-cover" />
                )}
                <div className="p-4">
                  <p className="text-sm font-medium text-agatu-river-600">
                    {event.year}
                    {event.month && `-${String(event.month).padStart(2, "0")}`}
                  </p>
                  <h3 className="font-semibold text-agatu-earth-900">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-agatu-earth-700">
                    {event.summary}
                  </p>
                  {event.related_leader_name && (
                    <p className="mt-1 text-xs text-agatu-earth-500">
                      Related: {event.related_leader_name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
