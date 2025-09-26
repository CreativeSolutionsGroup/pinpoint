
import React from 'react';

interface CheckIconProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
  color?: string;
}

const aFrame: React.FC<CheckIconProps> = ({ 
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
    viewBox="1.0 3.0 4.5 4" 
    width={size} 
    fill={color}
    >
      <defs
     id="defs1" />
    <path
       d="M 2.791666,3.6426695 C 2.331628,6.3237571 2.320321,6.3320342 2.320321,6.3320342 L 3.770841,7.1197384 4.204323,4.2931145 Z"
       id="path1" />
    <path
       d="M 4.191436,4.3112298 4.959216,6.8663653 3.868167,6.3886058"
       id="path2" 
       fill="none"
       stroke={color}
       strokeWidth="0.2" />
    </svg>
  );
};

// Set displayName for consistent icon mapping
aFrame.displayName = 'aFrame';

export default aFrame;
