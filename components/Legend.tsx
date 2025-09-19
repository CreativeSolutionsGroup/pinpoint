"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect } from "react";
import { DraggableEvent } from "react-draggable";
import { FlexibleIcon } from "@/types/IconTypes";
import categories from "./Categories";
import LegendItem from "./LegendItem";

// Updated interface with flexible icon type
interface LegendProps {
  isGettingStarted: boolean;
  onDrop: (event: DraggableEvent, icon: FlexibleIcon, label: string) => void;
}

const Legend: React.FC<LegendProps> = ({ isGettingStarted, onDrop }) => {
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);

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

  return (
    <div
      id="icon-legend-panel"
      className={`bg-white text-black p-5 flex flex-col w-72 rounded-xl border bg-card text-card-foreground shadow ${
        isMobile &&
        "absolute left-0 transform -translate-x-full hover:translate-x-0"
      } transition-transform duration-700 ease-in-out`}
    >
      <h2 className="text-lg font-bold mb-4">ICONS</h2>
      <Accordion type="single" collapsible className="w-full">
        {categories.map(
          (category) =>
            (category.value !== "getting-started" ||
              (category.value === "getting-started" && isGettingStarted)) && (
              <AccordionItem key={category.value} value={category.value}>
                <AccordionTrigger>{category.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 gap-2">
                    {category.items.map((item, index) => (
                      <LegendItem
                        key={`${category.value}-${item.label}-${index}`}
                        icon={item.icon}
                        label={item.label}
                        onDrop={onDrop}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
        )}
      </Accordion>
    </div>
  );
};

export default Legend;
