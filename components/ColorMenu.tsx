"use client";
import { Paper } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function ColorMenu(props: {
  fixedPos?: boolean;
  x: number;
  y: number;
  currentColor: string;
  changeColor: (colorSelected: string) => void;
}) {
  const [customColor, setCustomColor] = useState(props.currentColor);
  const [sliderPosition, setSliderPosition] = useState(0);
  const gradientRef = useRef<HTMLDivElement>(null);

  const hexValues = [
    "#FFFFFF",
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#9400D3",
    "#000000",
  ];

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

  useEffect(() => {
    const initialPosition = findClosestColorPosition(props.currentColor);
    setSliderPosition(initialPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentColor]);

  function onColorClick(color: string) {
    props.changeColor(color);
    setCustomColor(color);
  }

  // Update the color based on the gradient position
  const handleGradientUpdate = (x: number, width: number) => {
    const position = (x / width) * (hexValues.length - 1);
    const index = Math.floor(position);
    const remainder = position - index;

    if (index < hexValues.length - 1) {
      const color1 = hexToRgb(hexValues[index]);
      const color2 = hexToRgb(hexValues[index + 1]);

      if (color1 && color2) {
        const r = Math.round(color1.r + remainder * (color2.r - color1.r));
        const g = Math.round(color1.g + remainder * (color2.g - color1.g));
        const b = Math.round(color1.b + remainder * (color2.b - color1.b));

        const newColor = rgbToHex(r, g, b);
        setCustomColor(newColor);
        props.changeColor(newColor);
      }
    }
  };

  // Helper function to find the closest color position in the gradient
  const findClosestColorPosition = (targetColor: string) => {
    const targetRgb = hexToRgb(targetColor);
    if (!targetRgb) return 0;

    let closestDistance = Infinity;
    let closestIndex = 0;

    hexValues.forEach((hexColor, index) => {
      const currentRgb = hexToRgb(hexColor);
      if (currentRgb) {
        const distance = Math.sqrt(
          Math.pow(targetRgb.r - currentRgb.r, 2) +
            Math.pow(targetRgb.g - currentRgb.g, 2) +
            Math.pow(targetRgb.b - currentRgb.b, 2)
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    return (closestIndex / (hexValues.length - 1)) * 100;
  };

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

  // Create gradient background style using hex colors
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
      onClick={() => onColorClick(color)}
    ></div>
  ));

  return (
    <Paper className="z-10 bg-white rounded-md">
      <div className="flex flex-col gap-2 w-52">
        {/* Gradient color picker */}
        <div className="px-2 py-1">
          <div
            ref={gradientRef}
            className="w-full h-8 rounded cursor-pointer relative"
            style={renderGradient()}
            onMouseDown={(e) => {
              const rect = gradientRef.current?.getBoundingClientRect();
              if (rect) {
                const x = Math.max(
                  0,
                  Math.min(e.clientX - rect.left, rect.width)
                );
                setSliderPosition((x / rect.width) * 100);
                handleGradientUpdate(x, rect.width);
              }
            }}
          >
            <div
              className="absolute top-0 bottom-0 w-1 bg-black rounded-full cursor-pointer"
              style={{
                left: `calc(${sliderPosition}% - 2px)`,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                const handleDrag = (moveEvent: MouseEvent) => {
                  const rect = gradientRef.current?.getBoundingClientRect();
                  if (rect) {
                    const x = Math.max(
                      0,
                      Math.min(moveEvent.clientX - rect.left, rect.width)
                    );
                    setSliderPosition((x / rect.width) * 100);
                    handleGradientUpdate(x, rect.width);
                  }
                };

                const handleDragEnd = () => {
                  document.removeEventListener("mousemove", handleDrag);
                  document.removeEventListener("mouseup", handleDragEnd);
                };

                document.addEventListener("mousemove", handleDrag);
                document.addEventListener("mouseup", handleDragEnd);
              }}
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
                if (/^#([A-Fa-f0-9]{0,3}){1,2}$/.test(value)) {
                  setCustomColor(value);
                  props.changeColor(value);
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
