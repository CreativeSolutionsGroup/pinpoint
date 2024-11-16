import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";
import EventFlow from "./EventFlow";


export default async function EventMainPage({
  params,
}: {
  params: { eventId: string, locationId?: string };
}) {
  const event = await prisma.event.findFirst({
    where: {
      id: params.eventId,
    },
    include: { locations: true }
  });

  if (!event) {
    redirect("/home?error=Event not found");
  }

  return <EventFlow event={event} />;
}