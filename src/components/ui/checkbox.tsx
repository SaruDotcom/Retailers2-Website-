import * as React from "react";
import MuiCheckbox, { type CheckboxProps } from "@mui/material/Checkbox";

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>((props, ref) => <MuiCheckbox ref={ref} size="small" {...props} />);
Checkbox.displayName = "Checkbox";

export { Checkbox };
