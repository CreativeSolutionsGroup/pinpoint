import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";
import EventFlow from "@/components/EventFlow";
import { getServerSession } from "next-auth";

type EventPageParams = {
  mode: "view" | "edit";
  eventId: string;
  locationId?: Array<string>;
};

export default async function EventPage({
  params,
}: {
  params: Promise<EventPageParams>;
}) {
  const p = await params;
  const session = await getServerSession();

  // find user if we got one
  const authUser = await prisma.authorizedUser.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  // redirect if we didn't find user
  if (!authUser) {
    redirect("/signin");
  }

  const canEditContent = ["EDITOR", "ADMIN"].includes(authUser.role);

  // trying to access edit mode without permission? => you shall not pass (redirect to view only)
  // this should probably be done in middleware instead
  if (p.mode === "edit" && !canEditContent) {
    redirect(
      `/event/view/${p.eventId}${
        p.locationId?.[0] ? `/${p.locationId[0]}` : ""
      }`
    );
  }

  const event = await prisma.event.findFirst({
    where: {
      id: p.eventId,
    },
    include: {
      locations: {
        include: {
          location: true,
        },
        orderBy: { locationId: "asc" },
      },
    },
  });

  if (!event) {
    redirect("/home?error=Event not found");
  }

  if (event.locations.length === 0) {
    redirect(`/home?error=Event has no locations`);
  }

  // append the url with the location slug of locations[0] if none is present
  if (!p.locationId?.[0]) {
    redirect(`/event/${p.mode}/${p.eventId}/${event.locations[0].locationId}`);
  }

  // so now we know this event exists and has a location,
  // this user exists, and we can tell eventFlow if the user can edit or not
  return (
    <EventFlow
      event={event}
      location={p.locationId?.[0] ?? event.locations[0].locationId}
      isEditable={p.mode === "edit" && canEditContent}
    />
  );
}
