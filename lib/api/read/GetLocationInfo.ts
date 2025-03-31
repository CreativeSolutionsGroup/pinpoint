"use server";

import { prisma } from "../db";

export async function GetLocationInfo(locationId: string) {
  const locationInfo = await prisma.location.findUnique({
    where: {
      id: locationId,
    },
  })

  if (!locationInfo) {
    return null;
  }

  return locationInfo;
}