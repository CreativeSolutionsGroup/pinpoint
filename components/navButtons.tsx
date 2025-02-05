import { IconButton } from "@mui/material";
import { HomeIcon } from "lucide-react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Panel } from "@xyflow/react";
import { useRouter } from "next/navigation";

export default function NavButtons() {
    const router = useRouter();

  return (
    <Panel className="bg-white" position="top-right">
      <IconButton onClick={() => {
        router.back();
      }}>
        <ArrowBackIcon />
      </IconButton>
      <IconButton onClick={() => {
        router.push("/home")
      }}>
        <HomeIcon />
      </IconButton>
    </Panel>
  );
}
