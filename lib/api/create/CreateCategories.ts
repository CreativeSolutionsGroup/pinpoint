"use server";

import { prisma } from "../db";

interface IconItem {
  iconName: string;
  label: string;
}

interface CategoryData {
  title: string;
  value: string;
  items: IconItem[];
}

export async function SeedCategoriesAndIcons() {
  const categories: CategoryData[] = [
    {
      title: "Outdoor Equipment",
      value: "outdoor-equipment",
      items: [
        { iconName: "TrafficCone", label: "Cone" },
        { iconName: "Signpost", label: "A-Frame" },
      ],
    },
    {
      title: "Indoor Equipment",
      value: "indoor-equipment",
      items: [
        { iconName: "Trash2", label: "Trash Cans" },
        { iconName: "Recycle", label: "Recycling" },
        { iconName: "Fence", label: "Stanchions" },
        { iconName: "Armchair", label: "Chairs" },
        { iconName: "Theater", label: "Stage Items" },
      ],
    },
    {
      title: "Tech",
      value: "tech",
      items: [
        { iconName: "Radio", label: "Soundboard" },
        { iconName: "Speaker", label: "Speakers" },
        { iconName: "Lightbulb", label: "Lights" },
        { iconName: "Tv", label: "TVs" },
      ],
    },
    {
      title: "Getting Started",
      value: "getting-started",
      items: [
        { iconName: "Tent", label: "Tents" },
        { iconName: "Flag", label: "Flags" },
      ],
    },
    {
      title: "Campus XMas",
      value: "campus-xmas",
      items: [
        { iconName: "TreePine", label: "Christmas Tree" },
        { iconName: "Gift", label: "Present" },
      ],
    },
    {
      title: "Yard Games",
      value: "yard-games",
      items: [
        { iconName: "Gamepad2", label: "Cornhole" },
        { iconName: "Gamepad2", label: "Spikeball" },
        { iconName: "Gamepad2", label: "Ping Pong" },
        { iconName: "Gamepad2", label: "9-Square" },
        { iconName: "Gamepad2", label: "Can-Jam" },
      ],
    },
    {
      title: "Rental Equipment",
      value: "rental-equipment",
      items: [
        { iconName: "Coffee", label: "Coffee Cart" },
        { iconName: "Truck", label: "Food Trucks" },
        { iconName: "Table", label: "6ft Table" },
        { iconName: "Table", label: "Bistro Table" },
        { iconName: "Pickaxe", label: "Round Table" },
      ],
    },
  ];

  const results = [];

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.title,
      },
    });

    for (const item of category.items) {
      const createdIcon = await prisma.icon.create({
        data: {
          name: item.iconName,
          customName: item.label,
          categoryId: createdCategory.id,
        },
      });
      
      results.push(createdIcon);
    }
  }
  
  return results;
}

export async function CreateCategory(name: string) {
  return await prisma.category.create({
    data: {
      name,
    },
  });
}

export async function CreateIcon(name: string, customName: string, categoryId: string) {
  return await prisma.icon.create({
    data: {
      name,
      customName,
      categoryId,
    },
  });
}