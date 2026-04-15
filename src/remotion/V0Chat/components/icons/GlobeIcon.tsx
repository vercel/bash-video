import React from "react";

export const GlobeIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 13,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 14.5c1.657 0 3-2.91 3-6.5S9.657 1.5 8 1.5 5 4.41 5 8s1.343 6.5 3 6.5ZM8 16c2.485 0 4.5-3.582 4.5-8S10.485 0 8 0 3.5 3.582 3.5 8 5.515 16 8 16Z"
      fill={color}
    />
    <path d="M1.5 8h13" stroke={color} strokeWidth="1.5" />
  </svg>
);
