import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const ProgressBar = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{color: "#7454fa"}}/>
    </div>
  );
};

export default ProgressBar;
