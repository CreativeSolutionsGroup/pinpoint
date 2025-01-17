import { Box, Button, Card, Chip } from "@mui/material";

export default function ColorMenu(mouseState: {x?: number, y?: number}) {

  const mainStyle = 'fixed left-[' + mouseState.x + 'px] top-[' + mouseState.y + 'px] z-10 bg-white shadow-md rounded-md';
  return (
  <Card className={mainStyle}>
    <Button><Box className="rounded-full bg-red-500"></Box></Button>
    <Button><Chip className="w-8 h-8" /></Button>
    <Button><Chip className="w-8 h-8" /></Button>
    <Button><Chip className="w-8 h-8" /></Button>
  </Card>
   );
}