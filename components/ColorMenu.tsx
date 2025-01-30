"use client";
import { Button, Card, Chip } from "@mui/material";

export default function ColorMenu(props: {x: number, y: number, changeColor: (colorSelected: string) => void}) {
  const mainStyle = `fixed z-10 bg-white shadow-md rounded-md`;

  function onColorClick(color: string) {
    props.changeColor(color);
  }

  const buttons = ['lightblue', 'navy', 'purple', 'yellow', 'orange', 'white'].map((label, index) => (
    <Button key={index} onClick={() => onColorClick(label)}><Chip className="w-8 h-8" color={label} sx={{border: 2, borderColor: 'grey.300'}} /></Button>
  )

  )

  return (
  <Card className={mainStyle} style={{left: props.x+25, top: props.y+25}}>
    {buttons}
  </Card>
   );
}


