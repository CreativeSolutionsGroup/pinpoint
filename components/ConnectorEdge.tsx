import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";
import { CustomEdge } from "@/types/CustomEdge";

export function ConnectorEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<CustomEdge>) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: data?.color || "#000000",
          strokeWidth: data?.width || 2,
        }}
      />
      {data?.label && (
        <text>
          <textPath href={`#${id}`} startOffset="50%">
            {data.label}
          </textPath>
        </text>
      )}
    </>
  );
}