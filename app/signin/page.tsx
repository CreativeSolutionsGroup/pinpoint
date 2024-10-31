"use client";
import { Stack, Button } from "@mui/material";
import { signIn } from "next-auth/react";
import MicrosoftIcon from "@/components/MicrosoftIcon";

export default function SignIn() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ mx: "auto", height: "85vh" }}
    >
      <Button onClick={() => signIn("azure-ad", { callbackUrl: "/" })}>
        <MicrosoftIcon />
      </Button>
    </Stack>
  );
}
