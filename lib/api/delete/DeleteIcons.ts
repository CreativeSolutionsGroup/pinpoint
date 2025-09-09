"use server";

import { prisma } from "../db";

export async function DeleteIcons(idsArray: string[]) {
  if (idsArray.length === 0) return;

  await prisma.icon.deleteMany({
    where: {
      id: {
        in: idsArray,
      },
    },
  });
}
