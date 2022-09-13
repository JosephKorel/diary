import React from "react";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function Semicircle({
  children,
  percentage,
}: {
  children: JSX.Element;
  percentage: number;
}) {
  return (
    <div>
      <CircularProgressbarWithChildren
        value={percentage}
        circleRatio={0.7}
        styles={{
          trail: {
            strokeLinecap: "butt",
            transform: "rotate(-126deg)",
            transformOrigin: "center center",
          },
          path: {
            strokeLinecap: "butt",
            transform: "rotate(-126deg)",
            transformOrigin: "center center",
            stroke: "#000",
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
