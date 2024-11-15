import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";
import EventFlow from "@/components/EventFlow";

export default async function EventMainPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!event) {
    redirect("/home?error=Event not found");
  }

  return <EventFlow event={event} />;
}