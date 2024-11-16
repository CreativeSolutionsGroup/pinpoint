import "@xyflow/react/dist/style.css";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define the node type
export type CustomNode = {
  id: string;
  type?: string;
  data: { label: string,  imageURL : string};
  position: { x: number; y: number; z: number };
  draggable: boolean;
  deletable: boolean;
  parentId?: string;
  extent?: "parent";
};


export const CustomImageNode = ({ data }: CustomNode) => {
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

        img.src = src;
      });
    };

    getImageDimensions(data.imageURL)
      .then((dims) => {
        setDimensions(dims);
      })
      .catch((error) =>
        console.error("Error loading image dimensions:", error)
      );
  }, []);

  return (
    <div
      style={{
        // MAINTAIN CONSISTENT IMAGE DIMENSIONS
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <Image
        src={data.imageURL}
        alt="Map Image"
        fill
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
};
