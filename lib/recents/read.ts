import { prisma } from "../api/db";

export async function getRecents(email: string) {
  const recents = await prisma.recents.findMany({
    where: { user: { email } },
    orderBy: { lastUsed: "desc" },
    include: {
      location: true,
      event: true,
    },
  });
  const displayRecents = recents.map((recent) => ({
    eventName: recent.event.name || "Unknown Event",
    eventId: recent.event.id || "",
    locationName: recent.location.name,
    locationId: recent.location.id,
  }));
  return displayRecents;
}
