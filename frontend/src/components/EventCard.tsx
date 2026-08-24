import type { Event } from "@/schemas/event";

export default function EventCard({ event }: { event: Event }) {
  const startsAt = new Date(event.starts_at);

  return (
    <div className="rounded-lg border border-agatu-earth-200 bg-white p-4">
      <p className="text-xs font-medium uppercase text-agatu-river-600">
        {startsAt.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
        {" · "}
        {startsAt.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
      <h3 className="mt-1 font-semibold text-agatu-earth-900">{event.title}</h3>
      {event.location && (
        <p className="text-sm text-agatu-earth-600">{event.location}</p>
      )}
      {event.description && (
        <p className="mt-1 text-sm text-agatu-earth-700">{event.description}</p>
      )}
      <p className="mt-2 text-xs text-agatu-earth-500">
        {event.rsvp_count} {event.rsvp_count === 1 ? "person" : "people"} attending
        {event.ward_name && ` · ${event.ward_name}`}
      </p>
    </div>
  );
}
