import { cn } from "@/lib/utils";
import React from "react";
import { Separator } from "@/components/ui/separator";

export function Section({ children, className }) {
  return <div className={cn("", className)}>{children}</div>;
}

Section.Header = ({ title, children, className }) => {
  return (
    <>
      <div className={cn("flex items-center justify-between px-6", className)}>
        <div className="py-[14px] text-2xl font-bold text-gray-900">{title}</div>
        {children}
      </div>
      <Separator />
    </>
  );
};

Section.Content = ({ children, className }) => {
  return <div className={cn("px-6 pt-[10px]", className)}>{children}</div>;
};
