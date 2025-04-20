"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define types for our context
type RotationDegree = 0 | 90 | 180 | 270;

interface RotationContextType {
  rotation: RotationDegree;
  isMobile: boolean;
  rotateLeft: () => void;
  rotateRight: () => void;
  resetRotation: () => void;
}

// Create the context
const RotationContext = createContext<RotationContextType | undefined>(
  undefined
);

// Props for our provider component
interface RotationProviderProps {
  children: ReactNode;
}

export const RotationProvider: React.FC<RotationProviderProps> = ({
  children,
}) => {
  const [rotation, setRotation] = useState<RotationDegree>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check for mobile device
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const checkMobile = () => {
        const isMobileDevice = /Mobi|Android/i.test(navigator?.userAgent);
        setIsMobile(isMobileDevice);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const rotateLeft = () => {
    setRotation((prev) => {
      const newRotation = (prev + 270) % 360;
      return newRotation as RotationDegree;
    });
  };

  const rotateRight = () => {
    setRotation((prev) => {
      const newRotation = (prev + 90) % 360;
      return newRotation as RotationDegree;
    });
  };

  const resetRotation = () => {
    setRotation(0);
  };

  // Apply rotation styles based on current rotation value
  const getRotationStyles = () => {
    if (!isMobile || rotation === 0) {
      return {};
    }

    switch (rotation) {
      case 90:
        return {
          transform: "rotate(90deg)",
          transformOrigin: "bottom left",
          position: "absolute",
          top: "-100vw",
          height: "100vw",
          width: "100vh",
        };
      case 270:
        return {
          transform: "rotate(270deg)",
          transformOrigin: "top right",
          position: "absolute",
          left: "-100vh",
          height: "100vw",
          width: "100vh",
        };
      case 180:
        return {
          transform: "rotate(180deg)",
          height: "100vh",
          width: "100vw",
          position: "absolute",
        };
      default:
        return {};
    }
  };

  // Context value
  const contextValue: RotationContextType = {
    rotation,
    isMobile,
    rotateLeft,
    rotateRight,
    resetRotation,
  };

  return (
    <RotationContext.Provider value={contextValue}>
      <div style={getRotationStyles()}>{children}</div>
      {/* Move controls outside the rotated container */}
      {isMobile && <RotationControls />}
    </RotationContext.Provider>
  );
};

// Hook to use the rotation context
export const useRotation = (): RotationContextType => {
  const context = useContext(RotationContext);
  if (context === undefined) {
    throw new Error("useRotation must be used within a RotationProvider");
  }
  return context;
};

// Rotation controls component
const RotationControls: React.FC = () => {
  const { rotateLeft, rotateRight } = useRotation();

  // New style for the unobtrusive control box
  const controlsContainerStyle = {
    position: "fixed",
    bottom: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "0.5rem 0.75rem",
    background: "rgba(50, 50, 50, 0.6)",
    borderRadius: "1.25rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    backdropFilter: "blur(4px)",
  };

  const buttonStyle = {
    width: "2rem",
    height: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    cursor: "pointer",
    color: "rgba(255, 255, 255, 0.9)",
    transition: "background 0.2s",
  };

  return (
    <div style={controlsContainerStyle as React.CSSProperties}>
      <button
        style={buttonStyle as React.CSSProperties}
        onClick={rotateLeft}
        aria-label="Rotate left"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"></path>
        </svg>
      </button>

      <button
        style={buttonStyle as React.CSSProperties}
        onClick={rotateRight}
        aria-label="Rotate right"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"></path>
        </svg>
      </button>
    </div>
  );
};