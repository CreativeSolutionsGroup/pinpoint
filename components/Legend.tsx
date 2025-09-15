"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { DraggableEvent } from "react-draggable";
import categories from "./Categories";
import LegendItem from "./LegendItem";

// Updated interface with generics
interface LegendProps {
  isGettingStarted: boolean;
  onDrop: (event: DraggableEvent, icon: LucideIcon, label: string) => void;
}

const Legend: React.FC<LegendProps> = ({ isGettingStarted, onDrop }) => {
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);
  const [mobileOpen, setMobileOpen] = useState(false);

  // complicated (but only) way of effectively forcing the panel open
  // so mobile users see it before it hides. any interaction with the page
  // auto hides it. click on it to re open
  useEffect(() => {
    // Only run the forced-open nudges on non-mobile where the panel is visible
    if (isMobile) return;

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
  }, [isMobile]);

  // Desktop / large screens: show inline panel
  if (!isMobile) {
    return (
      <div
        id="icon-legend-panel"
        className={`bg-white text-black p-5 flex flex-col w-72 rounded-xl border bg-card text-card-foreground shadow transition-transform duration-700 ease-in-out`}
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
  }

  // Mobile: show hamburger that opens a slide-over
  return (
    <>
      <IconButton
        onClick={() => setMobileOpen(true)}
        className="!p-2"
        aria-label="Open icons legend"
      >
        <MenuIcon />
      </IconButton>

      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-72 bg-white p-4 shadow-lg overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">ICONS</h2>
              <IconButton onClick={() => setMobileOpen(false)}>
                <CloseIcon />
              </IconButton>
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
        </div>
      )}
    </>
  );
};

export default Legend;
