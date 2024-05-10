import { cn } from "@/lib/utils";
import React from "react";

export function Section({ children, className }) {
  return <div className={cn("px-6 pt-3", className)}>{children}</div>;
}
