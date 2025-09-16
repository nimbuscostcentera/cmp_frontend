import React from "react";
import { TextField, InputAdornment } from "@mui/material";

export default function InputBox({
  label,
  required = false,
  defaultValue = "",
  variant = "outlined", // outlined | filled | standard
  error = "",
  helperText = "",
  icon, // optional start adornment
  ...props
}) {
  return (
    <TextField
      label={label}
      required={required}
      defaultValue={defaultValue}
      variant={variant}
      error={!!error}
      helperText={error || helperText}
      fullWidth
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : null,
      }}
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
          "& fieldset": { borderColor: "#d1d5db" },
          "&:hover fieldset": { borderColor: "#3b82f6" },
          "&.Mui-focused fieldset": { borderColor: "#2563eb" },
        },
      }}
    />
  );
}
