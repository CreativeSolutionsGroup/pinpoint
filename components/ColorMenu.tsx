"use client";
import { Button, Paper, Box, IconButton } from "@mui/material";

export default function ColorMenu(props: {
  fixedPos?: boolean;
  x: number;
  y: number;
  changeColor: (colorSelected: string) => void;
}) {
  const colorArray = [
    // Cool colors (blues, purples)
    "#6C8EAD",
    "#add8e6",
    "#9370db",
    "#800080",
    // Neutral colors
    "#ffffff",
    "#000000",
    // Warm colors (yellows, oranges, reds)
    "#ffd700",
    "#FF8C42",
    "#FF3C38",
    "#A23E48",
  ];

  function onColorClick(color: string) {
    props.changeColor(color);
  }

  const buttons = colorArray.map((label, index) => (
    <IconButton
      key={index}
      onClick={() => onColorClick(label)}
      className="w-8 h-8 rounded-full shadow-lg"
      sx={{
        backgroundColor: label,
        mx: "0.25rem",
        border: "1px solid #ddd",
        ":hover": { backgroundColor: label, opacity: 0.8 },
      }}
    ></IconButton>
  ));

  return (
    <Box
      className={"z-10 bg-white rounded-md"}
      style={{ left: props.x + 25, top: props.y + 25 }}
    >
      {buttons}
    </Box>
  );
}
