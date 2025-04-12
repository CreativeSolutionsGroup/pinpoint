import { CustomNode } from "@/types/CustomNode";
import { NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Image from "next/image";
import { useEffect, useState } from "react";

export function CustomImageNode ({ data }: NodeProps<CustomNode>) {
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

  useEffect(() => {
    const getImageDimensions = (
      src: string
    ): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img: HTMLImageElement = document.createElement("img");

        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        };

        img.onerror = (error) => {
          reject(new Error(`Failed to load image: ${error}`));
        };

        img.src = src ?? "/maps/campus.png";
      });
    };

    getImageDimensions(data.imageURL!)
      .then((dims) => {
        setDimensions(dims);
      })
      .catch((error) =>
        console.error("Error loading image dimensions:", error)
      );
  }, [data]);

  return (
    <div
      style={{
        // MAINTAIN CONSISTENT IMAGE DIMENSIONS
        width: dimensions.width,
        height: dimensions.height,
        position: "relative",
        border: "12px solid black",
      }}
    >
      <Image
        src={data.imageURL ?? "/maps/campus.png"}
        alt={data.label}
        fill
        sizes={`${dimensions.width}px`}
        style={{
          objectFit: "cover",
        }}
        priority
      />
    </div>
  );
};
