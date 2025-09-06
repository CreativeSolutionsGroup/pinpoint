"use client";

import { useEffect, useState, ReactNode, createContext, useContext } from "react";

type ExitFn = (after?: () => void) => void;
const ExitContext = createContext<ExitFn | null>(null);
export function usePageTransitionExit() {
  const ctx = useContext(ExitContext);
  if (!ctx) throw new Error("usePageTransitionExit must be used within EventPageTransitionWrapper");
  return ctx;
}

interface WrapperProps {
  children: ReactNode;
  entryDirection?: "left" | "right";
  exitDirection?: "left" | "right";
  durationMs?: number;
}

// Wrapper for components to create a slide animation to one side or the other.
export default function EventPageTransitionWrapper({
  children,
  entryDirection = "left",
  exitDirection = "right",
  durationMs = 500
}: WrapperProps) {
  const [enter, setEnter] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // allow initial render before triggering transition
    const id = requestAnimationFrame(() => setEnter(false));
    return () => cancelAnimationFrame(id);
  }, []);

  const triggerExit: ExitFn = (after) => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => after && after(), durationMs);
  };

  const entryClass = entryDirection === "right" ? "translate-x-[100vw]" : "-translate-x-[100vw]";
  const exitClass = exitDirection === "right" ? "translate-x-[100vw]" : "-translate-x-[100vw]";

  return (
    <ExitContext.Provider value={triggerExit}>
      <div
        className={`transform transition-transform ease duration-[${durationMs}ms] ${
          enter ? entryClass : exiting ? exitClass : "translate-x-0"
        } ${exiting ? "pointer-events-none" : ""}`}
      >
        {children}
      </div>
    </ExitContext.Provider>
  );
}
