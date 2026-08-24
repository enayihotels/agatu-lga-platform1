import { useQuery } from "@tanstack/react-query";

import { listUpcomingEvents } from "@/api/events";
import EventCard from "@/components/EventCard";

export default function EventsPage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: listUpcomingEvents,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-agatu-earth-900">Events</h1>

      {isLoading && (
        <p className="mt-4 text-sm text-agatu-earth-500">Loading...</p>
      )}
      {!isLoading && (!events || events.length === 0) && (
        <p className="mt-4 text-sm text-agatu-earth-500">
          No upcoming events right now.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {events?.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}
