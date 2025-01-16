"use client";

import * as Ably from "ably";
import { AblyProvider } from "ably/react";


const client = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });

export default function AblyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AblyProvider client={client}>{children}</AblyProvider>;
}
