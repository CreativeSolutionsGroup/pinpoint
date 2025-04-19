import { Box, IconButton, Tooltip } from "@mui/material";
import { CirclePlus, CircleMinus } from "lucide-react";

export default function ResizeMenu({
  onResize,
  currentSize,
}: {
  onResize: (size: number) => void;
  currentSize: number;
}) {
  return (
    <Box>
      <Tooltip title="Decrease Size">
        <IconButton
          onClick={() =>
            onResize(currentSize - 1 >= 1 ? currentSize - 1 : currentSize)
          }
          sx={{ color: "black" }}
        >
          <CircleMinus />
        </IconButton>
      </Tooltip>
      <Tooltip title="Increase Size">
        <IconButton
          onClick={() =>
            onResize(currentSize + 1 <= 5 ? currentSize + 1 : currentSize)
          }
          sx={{ color: "black" }}
        >
          <CirclePlus />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
