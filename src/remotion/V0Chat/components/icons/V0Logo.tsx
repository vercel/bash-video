import React from "react";

export const V0Logo: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="8" fill="#171717" />
    <path
      d="M14.24 13.5L19.37 25.42C19.56 25.86 19.78 26 20.1 26C20.42 26 20.64 25.86 20.83 25.42L25.96 13.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const V0LogoSmall: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#171717" />
    <path
      d="M14.24 13.5L19.37 25.42C19.56 25.86 19.78 26 20.1 26C20.42 26 20.64 25.86 20.83 25.42L25.96 13.5"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
