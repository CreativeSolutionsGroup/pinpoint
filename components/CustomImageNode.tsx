import "@xyflow/react/dist/style.css";
import Image from "next/image";
import { useEffect, useState } from "react";

const imageURL = "/Campus.png";

export const CustomImageNode = () => {
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

    getImageDimensions(imageURL)
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
        position: "relative",
      }}
    >
      <Image
        src={imageURL}
        alt="Map Image"
        fill
        style={{
          objectFit: "cover",
        }}
        priority
      />
    </div>
  );
};
