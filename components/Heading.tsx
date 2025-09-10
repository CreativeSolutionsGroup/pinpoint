import { Box } from "@mui/material";
import Image from "next/image";
import Logo from "../public/pinpoint-logo-color.png";

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
        src={Logo}
        alt="Pinpoint"
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "contain" }}
        priority
      />
    </Box>
  );
}
