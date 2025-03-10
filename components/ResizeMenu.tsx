import { Box, IconButton } from "@mui/material";
import { MinusIcon, PlusIcon } from "lucide-react";

export default function ResizeMenu({
  onResize,
  currentSize,
}: {
  onResize: (size: number) => void;
  currentSize: number;
}) {
  return (
    <Box>
      <IconButton
        onClick={() =>
          onResize(currentSize + 1 <= 5 ? currentSize + 1 : currentSize)
        }
      >
        <Box style={{borderRadius: '50%', border: '2px solid gray', padding: '3px' }}>
          <PlusIcon/>
        </Box>
      </IconButton>
      <IconButton
        onClick={() =>
          onResize(currentSize - 1 >= 1 ? currentSize - 1 : currentSize)
        }
      >
        <Box style={{borderRadius: '50%', border: '2px solid gray', padding: '3px'}}>
         <MinusIcon/>
        </Box>
      </IconButton>
    </Box>
  );
}
