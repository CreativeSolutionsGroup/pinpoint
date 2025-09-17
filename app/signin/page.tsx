"use client";
import { Stack, Button } from "@mui/material";
import { signIn } from "next-auth/react";
import MicrosoftIcon from "@/components/svg/MicrosoftIcon";

export default function SignIn() {
  const isStagingSignIn =
    process.env.NEXT_PUBLIC_DISABLE_AUTH_FOR_STAGING === "true";

  const stagingEmail =
    process.env.NEXT_PUBLIC_STAGING_FAKE_EMAIL || "staging@example.com";

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ mx: "auto", height: "85vh" }}
    >
      <Button onClick={() => signIn("azure-ad", { callbackUrl: "/" })}>
        <MicrosoftIcon />
      </Button>

      {isStagingSignIn && (
        <Button
          onClick={() =>
            signIn("credentials", {
              callbackUrl: "/home",
              email: stagingEmail,
            })
          }
          sx={{ mt: 2 }}
        >
          Sign in (staging)
        </Button>
      )}
    </Stack>
  );
}
