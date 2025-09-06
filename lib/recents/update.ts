import { prisma } from "../api/db";

export async function updateRecents(
  email: string,
  locationId: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const currentRecents = await tx.recents.findMany({
      where: { user: { email } },
      orderBy: { lastUsed: "desc" },
    });

    const existingRecent = currentRecents.find(
      (recent) => recent.locationId === locationId
    );

    if (existingRecent) {
      await tx.recents.update({
        where: { id: existingRecent.id },
        data: { lastUsed: new Date() },
      });
    } else {
      const locationExists = await tx.location.findUnique({
        where: { id: locationId },
      });

      if (!locationExists) {
        return;
      }

      await tx.recents.create({
        data: {
          user: { connect: { email } },
          location: { connect: { id: locationId } },
          lastUsed: new Date(),
        },
      });
      if (currentRecents.length >= 5) {
        const oldestRecent = currentRecents[currentRecents.length - 1];
        await tx.recents.delete({
          where: { id: oldestRecent.id },
        });
      }
    }
  });
}
