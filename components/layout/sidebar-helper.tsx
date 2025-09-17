"use client";

import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { Button } from "../ui/button";

export default function SideBarHelper({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);

  return (
    <>
      <div
        className={`float-left h-screen ${
          isMobile ?
            open ? "w-screen" : "w-0"
            : open ? "max-w-64 min-w-64" : "w-16"
        } transition-all duration-300`}
      ></div>
      <div
        className={`absolute h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col ${
          isMobile ? 
            open ? "left-0 w-screen" : "left-[-100vw] w-screen"
            : open ? "left-0 w-64" : "left-[-12rem] w-64"
        }`}
      >
        <Button
          onClick={() => setOpen(!open)}
          className={`w-min m-1.5 cursor-pointer absolute top-0 z-20 ${
            isMobile ? 
              open ? "right-0" : "right-[-4rem]"
              : "right-0"
          }`}
          variant="outline"
        >
          <div className="relative h-4 w-4">
            <PanelRightOpen
              className={`absolute h-5 w-5 transition-opacity duration-500 ${
                open ? "opacity-100" : "opacity-0"
              }`}
            />
            <PanelRightClose
              className={`absolute h-5 w-5 transition-opacity duration-500 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        </Button>
        <div className="flex flex-col h-screen bg-background border-r border-border z-10">{children}</div>
      </div>
    </>
  );
}
