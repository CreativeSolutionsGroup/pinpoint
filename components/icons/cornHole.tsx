
import React from 'react';

interface CheckIconProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
  color?: string;
}

const CornHole: React.FC<CheckIconProps> = ({ 
  className, 
  style, 
  size = 24, 
  color = "currentColor" 
}: CheckIconProps) => {
  return (
    <svg
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg" 
    height="24px" 
    viewBox="0 -960 960 960" 
    width={size} 
    fill={color}
    >
      <path d="M80-160v-640h800v640H80Zm80-80h640v-480H160v480Zm0 0v-480 480Z"/>
      <circle cx="610" cy="-500" r="80" fill={color}/>
    </svg>
  );
};

// Set displayName for consistent icon mapping
CornHole.displayName = 'CornHole';

export default CornHole;