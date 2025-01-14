"use client";

import { Button } from "@mui/material";
import {
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";
import { useState } from "react";

export default function LiveUpdateText() {
  return (
    <ChannelProvider channelName="get-started">
      <LiveUpdater />
    </ChannelProvider>
  );
}

function LiveUpdater() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably");
  });

  const { channel } = useChannel("get-started", "subscribe", (message) => {
    setMessages((prevMessages) => [...prevMessages, message.data]);
  });

  return (
    <div>
      <input value={inputText} onChange={(e) => setInputText(e.target.value)} />
      <Button onClick={() => channel.publish("subscribe", inputText)}>
        Send
      </Button>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
}
