"use client";

import { Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";

export default function Legend() {
  return (
    <Panel
      position="top-left"
      className={`bg-white text-black p-5 border-2 flex flex-col w-60`}
    >
      <h4>Legendary Legend</h4>
    </Panel>
  );
}
