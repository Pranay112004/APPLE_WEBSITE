import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "md", className = "" }) => {
  return (
    <div className={`loading-spinner loading-spinner-${size} ${className}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
