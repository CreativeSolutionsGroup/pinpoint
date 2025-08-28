"use client";

import { useEffect, useState, ReactNode } from "react";

export default function EventPageTransitionWrapper({ children }: { children: ReactNode }) {
  const [enter, setEnter] = useState(true);

  useEffect(() => {
    // allow initial render before triggering transition
    const id = requestAnimationFrame(() => setEnter(false));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`transform transition-transform duration-500 ease-out ${
        enter ? "translate-x-full" : "translate-x-0"
      }`}
    >
      {children}
    </div>
  );
}
