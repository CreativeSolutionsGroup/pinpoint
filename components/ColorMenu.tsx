"use client";
import React, { useState } from "react";
import { Paper } from "@mui/material";
import { Button } from "./ui/button";

export default function ColorMenu(props: {
  fixedPos?: boolean;
  x: number;
  y: number;
  currentColor: string;
  changeColor: (colorSelected: string) => void;
}) {
  const [customColor, setCustomColor] = useState(props.currentColor);
  const mainStyle = `z-10 bg-white shadow-md rounded-md p-2`;
  
  // Using hex color codes instead of color names
  const colorArray = [
    "#FFFFFF", // white
    "#FFEB3B", // yellow
    "#FF9800", // orange
    "#9C27B0", // purple
    "#03A9F4", // sky
    "#0D47A1", // navy
    "#F44336", // red
    "#4CAF50", // green
  ];

  function onColorClick(color: string) {
    props.changeColor(color);
    setCustomColor(color);
  }

  // Handle gradient click to select custom color
  const handleGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Calculate position of click within the gradient
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Create hex colors directly along the spectrum
    const hexValues = [
      "#FF0000", // red
      "#FF7F00", // orange
      "#FFFF00", // yellow
      "#00FF00", // green
      "#0000FF", // blue
      "#4B0082", // indigo
      "#9400D3"  // violet
    ];
    
    // Calculate position in the spectrum
    const position = (x / width) * (hexValues.length - 1);
    const index = Math.floor(position);
    const remainder = position - index;
    
    // Interpolate between adjacent hex colors
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
      setCustomColor(hexValues[hexValues.length - 1]);
      props.changeColor(hexValues[hexValues.length - 1]);
    }
  };

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Helper function to convert rgb to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
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
    <Button 
      className="rounded-full m-1 border-2 border-gray h-8 w-8 p-0"
      style={{ backgroundColor: color }}
      key={index} 
      onClick={() => onColorClick(color)}
    />
  ));

  return (
    <Paper className={`${mainStyle}`}>
      <div className="flex flex-col gap-2 w-48">
        {/* Gradient color picker */}
        <div className="mb-1">
          <div 
            className="w-full h-8 rounded cursor-pointer" 
            style={renderGradient()}
            onClick={handleGradientClick}
          />
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
                }
              }}
            />
          </div>
        </div>
        
        {/* Preset colors */}
        <div className="flex flex-wrap justify-center">
          {buttons}
        </div>
      </div>
    </Paper>
  );
}