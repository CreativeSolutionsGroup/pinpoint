"use client";

import dynamic from "next/dynamic";
import * as Ably from "ably";

const client = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });

const DynamicAblyProvider = dynamic(
  () => import("ably/react").then((mod) => mod.AblyProvider),
  {
    ssr: false,
  }
);

export default function AblyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DynamicAblyProvider client={client}>{children}</DynamicAblyProvider>;
}
