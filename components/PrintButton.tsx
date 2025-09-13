"use client";

import React from 'react';
import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { IconButton } from '@mui/material';
import { Printer } from 'lucide-react';
 
function openPrintForImage(dataUrl: string, width: number, height: number) {
  // unique window name ensures a fresh window each click
  const printWindow = window.open('', `print-${Date.now()}`);
  if (!printWindow) {
    // Fallback: open the image in a new tab
    const a = document.createElement('a');
    a.href = dataUrl;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
    return;
  }

  const orientation = width > height ? 'landscape' : 'portrait';
  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Print Map</title>
      <style>
        @page { size: ${orientation}; margin: 0; }
        html, body { margin: 0; padding: 0; background: #fff; }
        .wrap { display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; }
        img { max-width: 100%; max-height: 100%; width: auto; height: auto; }
        @media print {
          html, body, .wrap { width: 100vw; height: 100vh; }
        }
      </style>
    </head>
    <body>
  <div class="wrap"><img id="mapImg" src="${dataUrl}" alt="Map" /></div>
      <script>
        (function(){
          var img = document.getElementById('mapImg');
          if (img && img.complete) {
            setTimeout(function(){ window.print(); }, 100);
          } else if (img) {
            img.onload = function(){ setTimeout(function(){ window.print(); }, 100); };
          } else {
            setTimeout(function(){ window.print(); }, 200);
          }
        })();
        window.onafterprint = function () { window.close(); };
      <\/script>
    </body>
  </html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
}
 
function PrintButton() {
  const { getNodes } = useReactFlow();
  // wait for the map image to be ready before taking a snapshot
  const waitForMapImageLoaded = async (timeoutMs = 3000): Promise<void> => {
    const start = Date.now();
    return new Promise((resolve) => {
      const tryResolve = () => {
        // Next.js Image with fill renders an <img>, alt is 'map'
        const img: HTMLImageElement | null = document.querySelector('img[alt="map"]');
        if (img && img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
        if (Date.now() - start > timeoutMs) {
          resolve(); // give up after timeout to avoid hanging
          return;
        }
        setTimeout(tryResolve, 100);
      };
      tryResolve();
    });
  };

  const onClick = async () => {
  // we calculate a transform for the nodes so that all nodes are visible
  // we then overwrite the transform of the `.react-flow__viewport` element
  // with the style option of the html-to-image library
  const allNodes = getNodes();
  const nodesBounds = getNodesBounds(allNodes);

  // derive export size from the map node (CustomImageNode with id 'map')
  const mapNode = allNodes.find((n) => n.id === 'map');
  const mapBounds = mapNode ? getNodesBounds([mapNode]) : nodesBounds;

  const imageWidth = Math.max(1, Math.round(mapBounds.width));
  const imageHeight = Math.max(1, Math.round(mapBounds.height));

  // Compute viewport to fit the map only (not all nodes)
  const viewport = getViewportForBounds(mapBounds, imageWidth, imageHeight, 0, 2, 0);

    const viewportEl = document.querySelector<HTMLElement>('.react-flow__viewport');
    if (!viewportEl) {
      return;
    }

  // ensure the current map image is loaded before snapshotting
  await waitForMapImageLoaded();

  const dataUrl = await toPng(viewportEl, {
      backgroundColor: '#1a365d',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    });

  openPrintForImage(dataUrl, imageWidth, imageHeight);
  };
 
  return (
    <IconButton style={{ color: "black" }} onClick={onClick}>
      <Printer />
    </IconButton>
  );
}
 
export default PrintButton;