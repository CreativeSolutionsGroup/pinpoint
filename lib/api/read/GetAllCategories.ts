"use server";

import { prisma } from "../db";

export async function GetAllCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      icons: {
        select: {
          id: true,
          name: true,
          customName: true,
        }
      }
    }
  });

  if (!categories) {
    return null;
  }

  return categories;
}