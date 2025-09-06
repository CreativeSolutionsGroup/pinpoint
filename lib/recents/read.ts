import { prisma } from "../api/db";

export async function getRecents(email: string) {
  const recents = await prisma.recents.findMany({
    where: { user: { email } },
    orderBy: { lastUsed: "desc" },
    include: {
      location: {
        include: {
          events: { include: { event: { select: { id: true, name: true } } } },
        },
      },
    },
  });
  const displayRecents = recents.map((recent) => ({
    eventName: recent.location.events[0]?.event.name || "Unknown Event",
    eventId: recent.location.events[0]?.event.id || "",
    locationName: recent.location.name,
    locationId: recent.location.id,
  }));
  return displayRecents;
}
