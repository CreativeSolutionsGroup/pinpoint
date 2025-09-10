"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePageTransitionExit } from "@/components/EventPageTransitionWrapper";
import { useState } from "react";

export default function BackToEventSelectButton() {
  const router = useRouter();
  const exit = usePageTransitionExit();
  const [disabled, setDisabled] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={() => {
        setDisabled(true);
        exit(() => router.push("/home"));
      }}
    >
      Back to Event Select
    </Button>
  );
}
