import { cn } from "@/lib/utils";
import React from "react";
import { Separator } from "@/components/ui/separator";

export function Section({ children, className }) {
  return <div className={cn("h-full flex flex-col", className)}>{children}</div>;
}

Section.Header = ({ title, children, className }) => {
  return (
    <>
      {title && (
        <div className={cn("flex items-center justify-between px-6", className)}>
          <div className="py-[14px] text-lg font-bold text-gray-900">{title}</div>
          {children}
        </div>
      )}
      {!title && <div className={cn("px-6 py-[14px]", className)}>{children}</div>}
      <Separator />
    </>
  );
};

Section.Content = ({ children, className }) => {
  return <div className={cn("flex-1 px-6 pt-[25px]", className)}>{children}</div>;
};
