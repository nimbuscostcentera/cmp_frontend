import React from "react";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";

export default function CheckBox({
  label,
  checked,
  onChange,
  error = "",
  helperText = "",
  ...props
}) {
  return (
    <div>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChange} {...props} />}
        label={label}
      />
      {(error || helperText) && (
        <FormHelperText error={!!error}>
          {error || helperText}
        </FormHelperText>
      )}
    </div>
  );
}
