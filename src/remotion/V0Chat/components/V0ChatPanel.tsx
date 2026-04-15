import React from "react";
import { BG_PRIMARY, BG_SECONDARY } from "../constants";

export const V0ChatPanel: React.FC<{
  messages: React.ReactNode;
  inputBar: React.ReactNode;
}> = ({ messages, inputBar }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BG_SECONDARY,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: BG_PRIMARY,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {messages}
        </div>

        {/* Input bar fixed at bottom */}
        {inputBar}
      </div>
    </div>
  );
};
