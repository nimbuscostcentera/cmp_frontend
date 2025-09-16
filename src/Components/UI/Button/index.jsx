import React from "react";
import { Button } from "@mui/material";

export default function ButtonField({
  children,
  variant = "contained", // contained | outlined | text
  color = "primary",      // primary | secondary | error | success | etc.
  size = "medium",        // small | medium | large
  fullWidth = true,
  startIcon,
  endIcon,
  onClick,
  ...props
}) {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      {...props}
      sx={{
        borderRadius: "8px",
        textTransform: "none", // removes all caps
        fontWeight: 600,
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        },
      }}
    >
      {children}
    </Button>
  );
}
