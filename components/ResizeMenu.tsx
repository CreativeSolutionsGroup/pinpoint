import { Box, IconButton, Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from "@radix-ui/react-tooltip";

export default function ResizeMenu({
  onResize,
  currentSize,
}: {
  onResize: (size: number) => void;
  currentSize: number;
}) {
  return (
    <Box>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              onClick={() =>
                onResize(currentSize - 1 >= 1 ? currentSize - 1 : currentSize)
              }
              sx={{ color: "black" }}
            >
              <RemoveCircleIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent>
            <Paper className="p-1">Decrease Size</Paper>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              onClick={() =>
                onResize(currentSize + 1 <= 5 ? currentSize + 1 : currentSize)
              }
              sx={{ color: "black" }}
            >
              <AddCircleIcon />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent>
            <Paper className="p-1">Increase Size</Paper>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Box>
  );
}
