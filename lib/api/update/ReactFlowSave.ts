"use server";

import { prisma } from "../db";
import * as Ably from "ably";

export default async function SaveState(
  eventId: string,
  locationId: string,
  state: string,
  clientId: string,
) {
  await prisma.eventToLocation.update({
    where: {
      eventId_locationId: {
        eventId,
        locationId,
      },
    },
    data: {
      state,
    },
  });

  const client = new Ably.Rest({
    key: process.env.ABLY_API_KEY,
  });

  const channel = client.channels.get("event-updates");
  await channel.publish(`subscribe`, {
    eventId,
    locationId,
    senderClientId: clientId,
  });
}
