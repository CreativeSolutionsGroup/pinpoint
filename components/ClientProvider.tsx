
import { ThemeProvider } from "@emotion/react";
import { themeOptions } from "@/theme";


export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={themeOptions}>
      <div>
        {children}
      </div>
    </ThemeProvider>
  );
}