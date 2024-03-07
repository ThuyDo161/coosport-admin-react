import { Box } from "@mui/material";
import React from "react";
import Color from "./Color";
import Size from "./Size";

const ColorAndSize = () => {
  return (
    <div>
      <Color />
      <Box height={10} />
      <Size />
    </div>
  );
};

export default ColorAndSize;
