import { useQuery } from "@tanstack/react-query";

import { listHistoricalEvents, listLeaders } from "@/api/history";
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-agatu-earth-900">
        History &amp; Leaders
      </h1>

      <section className="mt-6">
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

      <section className="mt-10">
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
              className="rounded-lg border border-agatu-earth-200 bg-white p-4"
            >
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
          ))}
        </div>
      </section>
    </div>
  );
}
