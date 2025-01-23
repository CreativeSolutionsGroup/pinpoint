"use client";
import { Button, Card, Chip } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ColorMenu(mouseState: {x: number, y: number}) {
  const mainStyle = `fixed z-10 bg-white shadow-md rounded-md`;

  const router = useRouter();

  function onColorClick(color: string) {
    console.log("clicked");
    router.push(`?colorSelected=${color}`);
  }

  const buttons = ['lightblue', 'navy', 'purple', 'yellow', 'orange', 'white'].map((label, index) => (
    <Button key={index} onClick={() => onColorClick(label)}><Chip className="w-8 h-8" color={label} sx={{border: 2, borderColor: 'grey.300'}} /></Button>
  )

  )

  return (
  <Card className={mainStyle} style={{left: mouseState.x+25, top: mouseState.y+25}}>
    {buttons}
  </Card>
   );
}


