import * as React from "react";
import MuiChip from "@mui/material/Chip";

export interface BadgeProps
  extends React.ComponentProps<typeof MuiChip> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <MuiChip size="small" className={className} color={variant === "destructive" ? "error" : variant === "default" ? "primary" : "default"} variant={variant === "outline" ? "outlined" : "filled"} {...props} />;
}

export { Badge };
