"use client";
import React from "react";
import { useReactFlow, getNodesBounds, getViewportForBounds } from "@xyflow/react";
import { toPng } from "html-to-image";
import { IconButton } from "@mui/material";
import { Printer } from "lucide-react";

const PrintButton = () => {
  const { getNodes } = useReactFlow();

  const waitForMap = () => new Promise<void>((resolve) => {
    const start = Date.now();
    const tick = () => {
      const img = document.querySelector<HTMLImageElement>('img[alt="map"]');
      if (img && img.complete && img.naturalWidth) return resolve();
      if (Date.now() - start > 2500) return resolve();
      setTimeout(tick, 80);
    };
    tick();
  });

  const openPrint = (dataUrl: string, w: number, h: number) => {
    const win = window.open("", `print-${Date.now()}`);
    if (!win) {
      const a = document.createElement("a");
      a.href = dataUrl; a.target = "_blank"; a.rel = "noopener"; a.click();
      return;
    }
    const orientation = w > h ? "landscape" : "portrait";
    win.document.write(`<!doctype html><html><head><meta charset='utf-8'/><title>Print Map</title><style>@page{size:${orientation};margin:0;}html,body{margin:0;}body{display:flex;align-items:center;justify-content:center;height:100vh;}img{max-width:100%;max-height:100%;}</style></head><body><img src='${dataUrl}' alt='Map'/><script>window.onload=()=>setTimeout(()=>print(),80);onafterprint=()=>close();<\/script></body></html>`);
    win.document.close();
  };

  const onClick = async () => {
    const nodes = getNodes();
    const mapNode = nodes.find(n => n.id === "map");
    const bounds = mapNode ? getNodesBounds([mapNode]) : getNodesBounds(nodes);
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    const viewport = getViewportForBounds(bounds, width, height, 0, 2, 0);
    const el = document.querySelector<HTMLElement>(".react-flow__viewport");
    if (!el) return;
    await waitForMap();
    const dataUrl = await toPng(el, {
      backgroundColor: "#1a365d",
      width,
      height,
      style: {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
      },
      cacheBust: true
    });
    openPrint(dataUrl, width, height);
  };

  return (
    <IconButton style={{ color: "black" }} onClick={onClick} aria-label="Print map">
      <Printer />
    </IconButton>
  );
};

export default PrintButton;