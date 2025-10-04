import {
  BaseEdge,
  EdgeProps,
  getStraightPath,
  EdgeLabelRenderer,
  useReactFlow,
} from "@xyflow/react";
import { CustomEdge } from "@/types/CustomEdge";
import { useState, useCallback, useRef } from "react";
import EdgeSettings from "./EdgeSettings";
import { useParams } from "next/navigation";

export function ConnectorEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<CustomEdge>) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const { setEdges, deleteElements } = useReactFlow();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout>();

  const params = useParams<{ mode: string }>();
  const isEditable = params.mode === "edit";

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id === id) {
            return {
              ...edge,
              data: {
                ...edge.data,
                label: newValue,
              },
            };
          }
          return edge;
        })
      );
    },
    [id, setEdges]
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      if (timeoutId.current) clearTimeout(timeoutId.current);

      timeoutId.current = setTimeout(() => {
        setEdges((edges) =>
          edges.map((edge) => {
            if (edge.id === id) {
              return {
                ...edge,
                data: {
                  ...edge.data,
                  notes: newValue,
                },
              };
            }
            return edge;
          })
        );
      }, 200);
    },
    [id, setEdges]
  );

  const handleWidthChange = useCallback(
    (width: number) => {
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id === id) {
            return {
              ...edge,
              data: {
                ...edge.data,
                width,
              },
            };
          }
          return edge;
        })
      );
    },
    [id, setEdges]
  );

  const colorChange = useCallback(
    (colorSelected: string) => {
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id === id) {
            return {
              ...edge,
              data: {
                ...edge.data,
                color: colorSelected,
              },
            };
          }
          return edge;
        })
      );
    },
    [id, setEdges]
  );

  const handleDelete = useCallback(() => {
    deleteElements({ edges: [{ id }] });
    setIsOpen(false);
  }, [id, deleteElements]);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: data?.color || "#57B9FF",
          strokeWidth: data?.width || 1.5,
          cursor: "pointer",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
            zIndex: 10,
          }}
          className="nodrag nopan"
        >
          <EdgeSettings
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isEditable={isEditable}
            id={id}
            data={data}
            handleLabelChange={handleLabelChange}
            handleNotesChange={handleNotesChange}
            handleWidthChange={handleWidthChange}
            handleDelete={handleDelete}
            colorChange={colorChange}
          />
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: data?.color || "#57B9FF",
              border: "2px solid white",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: "white",
              fontWeight: "bold",
            }}
            className="nodrag"
          >
            {data?.label?.charAt(0) || "•"}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}