import React from "react";

export const WrenchIcon: React.FC<{ size?: number; color?: string }> = ({
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
      d="M10.27 1.06a4.5 4.5 0 0 0-5.2 6.26L1.54 10.8a1.5 1.5 0 0 0-.04 2.12l1.58 1.58a1.5 1.5 0 0 0 2.12-.04l3.49-3.53a4.5 4.5 0 0 0 6.26-5.2l-2.38 2.38-1.41-.24-.24-1.41 2.38-2.38-.03-.02ZM6.2 3.2a3 3 0 0 1 3.94-.36L7.87 5.12l.44 2.57 2.57.44 2.27-2.27a3 3 0 0 1-3.47 3.54l-.36-.07-3.83 3.87a.01.01 0 0 1-.01 0L3.91 11.6a.01.01 0 0 1 0-.01l3.87-3.83-.07-.36A3 3 0 0 1 6.2 3.2Z"
      fill={color}
    />
  </svg>
);
