"use client";

import { muiTheme } from "@/theme";
import { ThemeProvider } from "@emotion/react";
import { SessionProvider } from "next-auth/react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={muiTheme}>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
