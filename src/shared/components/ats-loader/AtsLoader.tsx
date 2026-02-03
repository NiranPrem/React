import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const AtsLoader = () => {
  return (
    <div style={overlayStyle}>
      <ProgressSpinner
        style={{
          width: "60px",
          height: "60px",
          backgroundColor: "transparent", // ensures container is transparent
        }}
        strokeWidth="4"
        animationDuration="0.8s"
        aria-label="Loading"
        className="transparent-spinner"
      />
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 11000,
};

// ✅ Add this CSS to remove white fill inside spinner
const style = document.createElement("style");
style.innerHTML = `
  .transparent-spinner .p-progress-spinner-svg {
    background: transparent !important;
  }
  .transparent-spinner .p-progress-spinner-circle {
    fill: transparent !important; /* removes the inner white circle */
  }
`;
document.head.appendChild(style);

export default AtsLoader;
