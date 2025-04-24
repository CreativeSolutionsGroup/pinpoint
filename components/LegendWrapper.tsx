"use client";

import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { DraggableEvent } from "react-draggable";
import { icons } from "lucide-react";
import { GetAllCategories } from "@/lib/api/read/GetAllCategories";
import Legend from "./Legend";

function LegendWrapper({
  isGettingStarted,
  onDrop,
}: {
  isGettingStarted: boolean;
  onDrop: (event: DraggableEvent, icon: LucideIcon, label: string) => void;
}) {
  type Category = {
    id: string;
    title: string;
    value: string;
    items: {
      icon: LucideIcon;
      label: string;
    }[];
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const dbCategories = await GetAllCategories();
        if (dbCategories) {
          const formattedCategories = dbCategories.map((category) => {
            const value = category.name.toLowerCase().replace(/\s+/g, "-");
            return {
              id: category.id,
              title: category.name,
              value: value,
              items: category.icons.map((icon) => {
                return {
                  icon: icons[icon.name as keyof typeof icons],
                  label: icon.customName || icon.name,
                };
              }),
            };
          });

          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="p-5 text-sm">Loading icons...</div>;
  }

  return (
    <Legend
      isGettingStarted={isGettingStarted}
      onDrop={onDrop}
      categories={categories}
    />
  );
}

export default LegendWrapper;
