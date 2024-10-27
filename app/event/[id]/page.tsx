import React from "react";
import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";
import { ReactFlow, Controls, MiniMap } from "@xyflow/react";
import Legend from "@components/Legend";
import "@xyflow/react/dist/style.css";


export default async function EventMainPage({
  params,
}: {
  params: { id: string };
}) {
  const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
  ];
  const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];


  const event = await prisma.event.findFirst({
    where: {
      id: params.id,
    },
  });


  if (!event) {
    redirect("/home?error=Event not found");
  }


  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges}>
        <Controls position="bottom-right" />
        <MiniMap position="bottom-left" pannable zoomable />
        <Legend />
      </ReactFlow>
    </div>
  );
}
