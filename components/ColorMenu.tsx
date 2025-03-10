"use client";
import { Button, Chip, ChipPropsColorOverrides, Paper } from "@mui/material";

export default function ColorMenu(props: {
  fixedPos?: boolean;
  x: number;
  y: number;
  changeColor: (colorSelected: string) => void;
}) {
  const mainStyle = `z-10 bg-white shadow-md rounded-md flex items-center`;
  const colorArray = [
    "white",
    "yellow",
    "orange",
    "purple",
    "lightblue",
    "navy",
  ];

  function onColorClick(color: string) {
    props.changeColor(color);
  }

  const buttons = colorArray.map((label , index) => (
    <Button key={index} onClick={() => onColorClick(label)}>
      <Chip
      className="w-8 h-8"
      color={label as keyof ChipPropsColorOverrides}
      sx={{ border: 2, borderColor: "grey.300" }}
      />
    </Button>
  ));

  return (
    <Paper
      className={'fixed' + mainStyle}
      style={{ left: props.x + 25, top: props.y + 25 }}
    >
      {buttons}
    </Paper>
  );
}
