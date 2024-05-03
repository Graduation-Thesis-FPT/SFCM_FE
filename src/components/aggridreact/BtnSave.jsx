import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader, Loader2, Save } from "lucide-react";
import { Button } from "../ui/button";

export function BtnSave({ isLoading, ...props }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button disabled={isLoading} size="icon" variant="green-outline" {...props}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Lưu</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
