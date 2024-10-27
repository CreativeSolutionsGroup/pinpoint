import { prisma } from "@/lib/api/db";
import Legend from "@components/Legend";
import { Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { redirect } from "next/navigation";

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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black", // Switch with a theme color**
        backgroundImage: `url(/Campus.png)`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={false}
        fitView={true}
      >
        <Controls position="bottom-right" showZoom={false}/>
        <MiniMap position="bottom-left" />
        <Legend />
      </ReactFlow>
    </div>
  );
}
