// EventMainPage.tsx
import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";
import EventFlow from "./EventFlow";  // Adjust the import path as needed

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