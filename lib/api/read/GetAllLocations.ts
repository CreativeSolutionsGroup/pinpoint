"use server";

import { prisma } from "../db";

export async function GetAllLocations() {
  const locations = await prisma.location.findMany();

  if (!locations) {
    return null;
  }

  return locations;
}