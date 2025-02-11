"use client";
import { Button, Card, Chip, ChipPropsColorOverrides } from "@mui/material";

export default function ColorMenu(props: {
  x: number;
  y: number;
  changeColor: (colorSelected: string) => void;
}) {
  const mainStyle = `fixed z-10 bg-white shadow-md rounded-md`;
  const colorArray = [
    "lightblue",
    "navy",
    "purple",
    "yellow",
    "orange",
    "white",
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
    <Card
      className={mainStyle}
      style={{ left: props.x + 25, top: props.y + 25 }}
    >
      {buttons}
    </Card>
  );
}
