"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LucideIcon,
  PlusCircle,
  MinusCircle,
  Pencil,
  CircleCheck,
  CircleX,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { DraggableEvent } from "react-draggable";
import LegendItem from "./LegendItem";
import CustomIconCreator from "./CustomIconCreator";
import { DeleteIcons } from "@/lib/api/delete/DeleteIcons";

// Updated interface with generics
interface LegendProps {
  isGettingStarted: boolean;
  onDrop: (event: DraggableEvent, icon: LucideIcon, label: string) => void;
  onIconsChange: (refresh: boolean) => void;
  categories: {
    id: string;
    title: string;
    value: string;
    items: {
      id: string;
      icon: LucideIcon;
      label: string;
    }[];
  }[];
}

const Legend: React.FC<LegendProps> = ({
  isGettingStarted,
  onDrop,
  onIconsChange,
  categories,
}) => {
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);
  const [customIconDialogOpen, setCustomIconDialogOpen] = useState(false);
  const [iconsToDelete, setIconsToDelete] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState<"default" | "options" | "deletion">(
    "default"
  );

  // complicated (but only) way of effectively forcing the panel open
  // so mobile users see it before it hides. any interaction with the page
  // auto hides it. click on it to re open
  useEffect(() => {
    const panel = document.getElementById("icon-legend-panel");
    if (panel) {
      // Force panel open
      panel.classList.add("translate-x-0");

      const removeTranslate = () => {
        panel.classList.remove("translate-x-0");
        // Remove the event listeners after first interaction
        document.removeEventListener("touchstart", removeTranslate);
        document.removeEventListener("click", removeTranslate);
      };

      // Add listeners for both touch and click events
      document.addEventListener("touchstart", removeTranslate);
      document.addEventListener("click", removeTranslate);

      // Clean up listeners when component unmounts
      return () => {
        document.removeEventListener("touchstart", removeTranslate);
        document.removeEventListener("click", removeTranslate);
      };
    }
  }, []);

  useEffect(() => {
    if (!customIconDialogOpen && editMode !== "default") {
      setEditMode("default");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customIconDialogOpen]);

  const handleEditClick = () => {
    setEditMode("options");
  };

  const handleDeleteClick = () => {
    setEditMode("deletion");
  };

  const handleAddClick = () => {
    setCustomIconDialogOpen(true);
  };

  const handleConfirmDeletion = async () => {
    await DeleteIcons(Array.from(iconsToDelete));

    setIconsToDelete(new Set());
    setEditMode("default");
    onIconsChange(true); // Refresh the icons after deletion
  };

  const handleCancelDeletion = () => {
    setIconsToDelete(new Set());
    setEditMode("default");
  };

  const toggleIconForDeletion = (iconId: string) => {
    setIconsToDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(iconId)) {
        newSet.delete(iconId);
      } else {
        newSet.add(iconId);
      }
      return newSet;
    });
  };

  const isIconSelectedForDeletion = (iconId: string) => {
    return iconsToDelete.has(iconId);
  };

  const renderActionButtons = () => {
    switch (editMode) {
      case "default":
        return (
          <Pencil
            className="cursor-pointer hover:bg-gray-100 rounded-md p-1"
            onClick={handleEditClick}
            size={28}
          />
        );
      case "options":
        return (
          <>
            <MinusCircle
              className="cursor-pointer hover:bg-gray-100 rounded-md p-1"
              onClick={handleDeleteClick}
              size={30}
            />
            <PlusCircle
              className="cursor-pointer hover:bg-gray-100 rounded-md p-1"
              onClick={handleAddClick}
              size={30}
            />
          </>
        );
      case "deletion":
        return (
          <>
            <CircleX
              className="cursor-pointer hover:bg-gray-100 rounded-md p-1"
              onClick={handleCancelDeletion}
              size={30}
            />
            <CircleCheck
              className="cursor-pointer hover:bg-gray-100 rounded-md p-1"
              onClick={handleConfirmDeletion}
              size={30}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="icon-legend-panel"
      className={`bg-white text-black p-5 flex flex-col w-72 rounded-xl border bg-card text-card-foreground shadow ${
        isMobile &&
        "absolute left-0 transform -translate-x-full hover:translate-x-0"
      } transition-transform duration-700 ease-in-out`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">ICONS</h2>
        <div className="flex items-center gap-1">{renderActionButtons()}</div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {categories.map(
          (category) =>
            (category.value !== "getting-started" ||
              (category.value === "getting-started" && isGettingStarted)) && (
              <AccordionItem key={category.value} value={category.value}>
                <AccordionTrigger>{category.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 gap-2">
                    {category.items.map((item, index) => {
                      return (
                        <div key={index} className="relative">
                          {editMode === "deletion" && (
                            <div
                              className="absolute -top-2 -right-2 z-10 cursor-pointer"
                              onClick={() => toggleIconForDeletion(item.id)}
                            >
                              <MinusCircle
                                size={18}
                                className={`text-red-500 ${
                                  isIconSelectedForDeletion(item.id)
                                    ? "fill-red-500"
                                    : ""
                                }`}
                              />
                            </div>
                          )}
                          <LegendItem
                            icon={item.icon}
                            label={item.label}
                            onDrop={onDrop}
                            isSelected={isIconSelectedForDeletion(item.id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
        )}
      </Accordion>

      {/* Custom Icon Dialog */}
      <CustomIconCreator
        open={customIconDialogOpen}
        onOpenChange={setCustomIconDialogOpen}
        onIconsChange={onIconsChange}
        categories={categories}
      />
    </div>
  );
};

export default Legend;
