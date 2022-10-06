import React from "react";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function Semicircle({
  children,
  percentage,
  strokeColor,
}: {
  children: JSX.Element;
  percentage: number;
  strokeColor: string;
}) {
  return (
    <div>
      <CircularProgressbarWithChildren
        value={percentage}
        circleRatio={0.7}
        styles={{
          trail: {
            strokeLinecap: "round",
            transform: "rotate(-126deg)",
            transformOrigin: "center center",
          },
          path: {
            strokeLinecap: "round",
            transform: "rotate(-126deg)",
            transformOrigin: "center center",
            stroke: `rgba(${strokeColor}, ${percentage / 100})`,
          },
          text: {
            fill: "#ddd",
          },
        }}
        strokeWidth={10}
      >
        {children}
      </CircularProgressbarWithChildren>
    </div>
  );
}

export default Semicircle;
