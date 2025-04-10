import { Box, IconButton, Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

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
          <RemoveCircleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Increase Size">
        <IconButton
          onClick={() =>
            onResize(currentSize + 1 <= 5 ? currentSize + 1 : currentSize)
          }
          sx={{ color: "black" }}
        >
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
