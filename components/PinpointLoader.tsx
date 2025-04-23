"use client";

import Heading from "@components/Heading";
import { useEffect, useState } from "react";

const PinpointLoader = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing maps...");

  useEffect(() => {
    // Loading phrases...
    const loadingPhrases = [
      "Initializing maps",
      "Loading terrain data",
      "Preparing navigation",
      "Calculating routes",
      "Syncing location data",
      "Rendering map tiles",
    ];

    // Fake loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });

      // Change loading text every now and then
      if (progress % 16 === 0) {
        const nextPhrase = `${
          loadingPhrases[Math.floor((progress / 16) % loadingPhrases.length)]
        }...`;
        setLoadingText(nextPhrase);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white"
      style={{
        zIndex: 9999, // Ensure highest z-index to overlay everything
      }}
    >
      <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 space-y-12">
        {/* Logo */}
        <div className="w-full flex justify-center">
          <Heading />
        </div>

        {/* Loading progress */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-[550]">{loadingText}</div>
            <span className="text-sm font-[550]">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(to right, #357ad2, #62d6ae)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinpointLoader;
