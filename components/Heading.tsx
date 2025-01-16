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
        alt="Pinpoint"
        style={{ objectFit: "contain" }}
      />
    </Box>
  );
}
