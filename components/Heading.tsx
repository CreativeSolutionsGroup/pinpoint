import { Box } from "@mui/material";
import Image from "next/image";

export default function Heading() {
  return (
    <Box
      sx={{
        width: 1,
        height: 70,
      }}
      position="relative"
    >
      <Image
        fill
        src="/pinpoint-logo-color.png"
        alt="Project Dora"
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "contain" }}
        priority
      />
    </Box>
  );
}
