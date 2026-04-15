import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  FONT_SANS,
  SHIMMER_CYCLE_FRAMES,
  BORDER_ALPHA,
} from "../constants";

export const RichTaskBlock: React.FC<{
  icon: React.ReactNode;
  activeTitle: string;
  completeTitle: string;
  isActive: boolean;
  enterFrame: number;
  duration?: string;
  children?: React.ReactNode;
}> = ({
  icon,
  activeTitle,
  completeTitle,
  isActive,
  enterFrame,
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterFrame;

  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shimmer for active state
  const shimmerX = interpolate(
    frame % SHIMMER_CYCLE_FRAMES,
    [0, SHIMMER_CYCLE_FRAMES],
    [-100, 200],
  );

  const title = isActive ? activeTitle : completeTitle;

  return (
    <div
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        marginTop: 4,
      }}
    >
      {/* Header row: icon + title + duration */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 24,
        }}
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
            color: TEXT_TERTIARY,
            minWidth: 13,
            minHeight: 13,
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 13,
            lineHeight: "18px",
            color: TEXT_SECONDARY,
            display: "flex",
            alignItems: "center",
            gap: 8,
            ...(isActive
              ? {
                  backgroundImage: `linear-gradient(90deg, ${TEXT_SECONDARY} 0%, ${TEXT_TERTIARY} 40%, #ededed 50%, ${TEXT_TERTIARY} 60%, ${TEXT_SECONDARY} 100%)`,
                  backgroundSize: "200% 100%",
                  backgroundPositionX: `${shimmerX}%`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }
              : {}),
          }}
        >
          {title}
        </span>
        {duration && !isActive && (
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 13,
              color: TEXT_TERTIARY,
            }}
          >
            {duration}
          </span>
        )}
      </div>

      {/* Content with timeline line */}
      {children && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "13px 1fr",
            gap: 0,
            marginTop: 0,
          }}
        >
          {/* Timeline line */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            <div
              style={{
                width: 1,
                height: "100%",
                background: `linear-gradient(to bottom, ${BORDER_ALPHA} 0%, ${BORDER_ALPHA} 80%, transparent 100%)`,
              }}
            />
          </div>
          {/* Content area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingTop: 8,
              paddingLeft: 8,
              paddingBottom: 4,
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
