import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";
import EventFlow from "@/components/EventFlow";

export default async function EventMainPage({
  params,
}: {
  params: { eventId: string; locationId?: string };
}) {
  const event = await prisma.event.findFirst({
    where: {
      id: params.eventId,
    },
    include: {
      locations: true,
    },
  });

  if (!event) {
    redirect("/home?error=Event not found");
  }

  if (event.locations.length === 0) {
    redirect(`/home?error=Event has no locations`);
  }

  return <EventFlow event={event} location={params.locationId} />;
}
