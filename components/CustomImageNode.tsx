import { CustomNode } from "@/types/CustomNode";
import { NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Image from "next/image";
import { useEffect, useState, memo } from "react";

// Cache for storing image dimensions
const imageDimensionsCache = new Map<
  string,
  { width: number; height: number }
>();

const CustomImageNodeComponent = ({ data }: NodeProps<CustomNode>) => {
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const imageUrl = data.imageURL ?? "/maps/campus.png";

  useEffect(() => {
    const getImageDimensions = (
      src: string
    ): Promise<{ width: number; height: number }> => {
      // Check if dimensions are already in cache
      if (imageDimensionsCache.has(src)) {
        return Promise.resolve(imageDimensionsCache.get(src)!);
      }

      return new Promise((resolve, reject) => {
        const img: HTMLImageElement = document.createElement("img");

        img.onload = () => {
          const dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };

          // Store dimensions in cache
          imageDimensionsCache.set(src, dimensions);
          resolve(dimensions);
        };

        img.onerror = (error) => {
          reject(new Error(`Failed to load image: ${error}`));
        };

        img.src = src;
      });
    };

    getImageDimensions(imageUrl)
      .then((dims) => {
        setDimensions(dims);
      })
      .catch((error) =>
        console.error("Error loading image dimensions:", error)
      );
  }, [imageUrl]);

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        position: "relative",
      }}
    >
      <Image
        src={imageUrl}
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

// Memoize the component to prevent unnecessary re-renders
export const CustomImageNode = memo(CustomImageNodeComponent);
