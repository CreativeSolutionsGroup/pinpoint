import AblyClientProvider from "@/components/AblyProvider";
import ClientProvider from "@/components/ClientProvider";
import { RotationProvider } from "@/components/RotationProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import localFont from "next/font/local";
import Head from "next/head";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AblyClientProvider>
          <AppRouterCacheProvider>
            <RotationProvider>
              <ClientProvider>{children}</ClientProvider>
            </RotationProvider>
          </AppRouterCacheProvider>
        </AblyClientProvider>
      </body>
    </html>
  );
}
