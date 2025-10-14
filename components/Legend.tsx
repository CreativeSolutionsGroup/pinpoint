"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  // Handle opening/closing with animation
  const openMobileMenu = () => {
    setMobileVisible(true);
    // Small delay to ensure the element is rendered before animating
    setTimeout(() => setMobileOpen(true), 10);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    // Wait for animation to complete before hiding
    setTimeout(() => setMobileVisible(false), 300);
  };

  // complicated (but only) way of effectively forcing the panel open
  // so mobile users see it before it hides. any interaction with the page
  // auto hides it. click on it to re open
  useEffect(() => {
    // Always call the hook, but only run forced-open logic if not mobile
    if (!isMobile) {
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
    }
  }, [isMobile]);

  // Hide sidebar button when mobile icons menu is open
  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.getElementsByClassName("sidebar-button")[0]?.classList.add("hidden");
    } else if (isMobile) {
      document.getElementsByClassName("sidebar-button")[0]?.classList.remove("hidden");
    }
  }, [isMobile, mobileOpen]);

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

  return (
    <>
      <Button
        onClick={openMobileMenu}
        className="w-min fixed top-12 left-[0.5rem]"
        aria-label="Open icons legend"
        variant="outline"
      >
        <MenuIcon />
      </Button>

      {mobileVisible && (
        <div className="fixed inset-0 z-100">
          <div
            className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeMobileMenu}
          />
          <div className={`fixed left-0 top-0 h-full w-72 bg-white p-4 shadow-lg transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`} style={{ overflow: 'visible' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">ICONS</h2>
              <IconButton onClick={closeMobileMenu}>
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
