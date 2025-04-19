"use client";
import { Paper } from "@mui/material";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export default function ColorMenu(props: {
  fixedPos?: boolean;
  x: number;
  y: number;
  currentColor: string;
  changeColor: (colorSelected: string) => void;
}) {
  const [customColor, setCustomColor] = useState(props.currentColor);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [shouldSmoothAnimate, setShouldSmoothAnimate] = useState(false);
  const gradientRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const colorArray = [
    "#000000",
    "#6C8EAD",
    "#add8e6",
    "#9370db",
    "#800080",
    "#ffffff",
    "#ffd700",
    "#FF8C42",
    "#FF3C38",
    "#A23E48",
  ];

  const hexValues = useMemo(
    () => [
      "#A23E48",
      "#FF0000",
      "#FF7F00",
      "#FF8C42",
      "#FFFF00",
      "#ffffff",
      "#00FF00",
      "#add8e6",
      "#6C8EAD",
      "#0000FF",
      "#4B0082",
      "#800080",
      "#9370db",
      "#9400D3",
      "#000000",
    ],
    []
  );

  function onColorClick(color: string) {
    props.changeColor(color);
    setCustomColor(color);
  }

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Helper function to convert rgb to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  };

  // Find approximate position for a given color
  const findPositionForColor = useCallback(
    (color: string): number => {
      if (!gradientRef.current) return 0;

      const width = gradientRef.current.clientWidth;
      const targetRgb = hexToRgb(color);

      if (!targetRgb) return 0;

      // Simple algorithm to find closest matching position
      // This is approximate and could be improved for better accuracy
      let closestDistance = Infinity;
      let bestPosition = 0;

      // Check positions across the gradient
      const steps = 100;
      for (let i = 0; i <= steps; i++) {
        const position = (i / steps) * width;
        const gradientPosition = (position / width) * (hexValues.length - 1);
        const index = Math.floor(gradientPosition);
        const remainder = gradientPosition - index;

        if (index < hexValues.length - 1) {
          const color1 = hexToRgb(hexValues[index]);
          const color2 = hexToRgb(hexValues[index + 1]);

          if (color1 && color2) {
            const r = Math.round(color1.r + remainder * (color2.r - color1.r));
            const g = Math.round(color1.g + remainder * (color2.g - color1.g));
            const b = Math.round(color1.b + remainder * (color2.b - color1.b));

            // Calculate color distance (euclidean in RGB space)
            const distance = Math.sqrt(
              Math.pow(r - targetRgb.r, 2) +
                Math.pow(g - targetRgb.g, 2) +
                Math.pow(b - targetRgb.b, 2)
            );

            if (distance < closestDistance) {
              closestDistance = distance;
              bestPosition = position;
            }
          }
        }
      }

      return bestPosition;
    },
    [hexValues]
  );

  // Initialize slider position based on current color when component mounts
  useEffect(() => {
    if (gradientRef.current) {
      const position = findPositionForColor(props.currentColor);
      setSliderPosition(position);
    }
  }, [findPositionForColor, props.currentColor]);

  // Process color selection based on position in the gradient
  const processColorAtPosition = (position: number) => {
    if (!gradientRef.current) return;

    const width = gradientRef.current.clientWidth;
    const gradientPosition = (position / width) * (hexValues.length - 1);
    const index = Math.floor(gradientPosition);
    const remainder = gradientPosition - index;

    if (index < hexValues.length - 1) {
      const color1 = hexToRgb(hexValues[index]);
      const color2 = hexToRgb(hexValues[index + 1]);

      if (color1 && color2) {
        // Linear interpolation between colors
        const r = Math.round(color1.r + remainder * (color2.r - color1.r));
        const g = Math.round(color1.g + remainder * (color2.g - color1.g));
        const b = Math.round(color1.b + remainder * (color2.b - color1.b));

        const newColor = rgbToHex(r, g, b);
        setCustomColor(newColor);
        props.changeColor(newColor);
      }
    } else {
      const lastColor = hexValues[hexValues.length - 1];
      setCustomColor(lastColor);
      props.changeColor(lastColor);
    }
  };

  // Handle gradient clicks and start dragging
  const handleGradientMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return;

    // Start dragging
    isDraggingRef.current = true;

    // Get position of click within gradient
    const rect = gradientRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Immediately update slider position and color
    setShouldSmoothAnimate(true);
    setTimeout(() => {
      setShouldSmoothAnimate(false);
    }, 100);
    setSliderPosition(x);
    processColorAtPosition(x);

    // Add document-level event listeners for mouse movement and release
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Start dragging when clicking directly on the slider
  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the gradient click handler
    isDraggingRef.current = true;

    // Add document-level event listeners for mouse movement and release
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle mouse movement while dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !gradientRef.current) return;

    const rect = gradientRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;

    // Constrain within gradient bounds
    x = Math.max(0, Math.min(x, rect.width));

    // Update slider position and color
    setSliderPosition(x);
    processColorAtPosition(x);
  };

  // Handle mouse release to end dragging
  const handleMouseUp = () => {
    isDraggingRef.current = false;

    // Remove document-level event listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Create gradient background style
  const renderGradient = () => {
    return {
      background: `linear-gradient(to right, 
                    #FF0000, #FF7F00, #FFFF00, #00FF00, 
                    #0000FF, #4B0082, #9400D3)`,
    };
  };

  const buttons = colorArray.map((color, index) => (
    <div
      className="rounded-full m-1 border-2 border-gray min-h-8 min-w-8 p-0"
      style={{ backgroundColor: color }}
      key={index}
      onClick={() => {
        onColorClick(color);
        // Update slider position for the selected preset color
        const position = findPositionForColor(color);
        setSliderPosition(position);
      }}
    ></div>
  ));

  return (
    <Paper className="z-10 bg-white rounded-md">
      <div className="flex flex-col gap-2 w-52">
        {/* Gradient color picker with slider */}
        <div className="px-2 py-1">
          <div className="relative">
            <div
              ref={gradientRef}
              className="w-full h-8 rounded cursor-pointer"
              style={renderGradient()}
              onMouseDown={handleGradientMouseDown}
            />
            {/* Slider indicator */}
            <div
              className={`absolute top-0 w-2 h-8 bg-white border border-gray-800 rounded-sm cursor-grab active:cursor-grabbing ${
                shouldSmoothAnimate
                  ? "transition-all duration-100"
                  : "transition-none"
              }`}
              style={{
                left: `${sliderPosition}px`,
                transform: "translateX(-50%)",
                opacity: 0.7,
              }}
              onMouseDown={handleSliderMouseDown}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <div
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: customColor }}
            />
            <input
              type="text"
              id="customHexColor"
              className="border rounded px-2 py-1 text-xs w-24"
              value={customColor}
              onChange={(e) => {
                const value = e.target.value;

                // Only update the actual color if it's a valid hex color
                if (/^#([A-Fa-f0-9]{0,3}){1,2}$/.test(value)) {
                  setCustomColor(value);
                  props.changeColor(value);

                  // Update slider position for manually entered color
                  const position = findPositionForColor(value);
                  setSliderPosition(position);
                }
              }}
            />
          </div>
        </div>

        {/* Preset colors */}
        <div className="flex flex-wrap justify-center rounded-full">
          {buttons}
        </div>
      </div>
    </Paper>
  );
}
