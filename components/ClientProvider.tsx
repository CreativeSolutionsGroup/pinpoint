"use client";

import { muiTheme } from "@/theme";
import { ThemeProvider } from "@emotion/react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
