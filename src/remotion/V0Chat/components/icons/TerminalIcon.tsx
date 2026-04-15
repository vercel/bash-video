import React from "react";

export const TerminalIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
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
      d="M0 3.2A2.2 2.2 0 0 1 2.2 1h11.6A2.2 2.2 0 0 1 16 3.2v9.6A2.2 2.2 0 0 1 13.8 15H2.2A2.2 2.2 0 0 1 0 12.8V3.2Zm2.2-.7a.7.7 0 0 0-.7.7v9.6c0 .387.313.7.7.7h11.6a.7.7 0 0 0 .7-.7V3.2a.7.7 0 0 0-.7-.7H2.2Z"
      fill={color}
    />
    <path
      d="M3.47 5.47a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 0 1-1.06-1.06L4.94 8 3.47 6.53a.75.75 0 0 1 0-1.06ZM8.25 10.25a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z"
      fill={color}
    />
  </svg>
);
