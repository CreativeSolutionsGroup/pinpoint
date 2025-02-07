import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";
import EventFlow from "@/components/EventFlow";

export default async function EventMainPage({
  params,
}: {
  params: Promise<{ eventId: string; locationId?: Array<string> }>;
}) {
  const p = await params;

  const event = await prisma.event.findFirst({
    where: {
      id: p.eventId,
    },
    include: {
      locations: {
        include: {
          location: true,
        }
      }
    },
  });

  if (!event) {
    redirect("/home?error=Event not found");
  }

  if (event.locations.length === 0) {
    redirect(`/home?error=Event has no locations`);
  }

  return (
    <EventFlow
      event={event}
      location={p.locationId?.[0] ?? event.locations[0].locationId}
    />
  );
}
