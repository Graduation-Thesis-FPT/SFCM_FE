import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/common/ui/button";

export function BtnSave({ isLoading, ...props }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button disabled={isLoading} size="tool" variant="none-border" {...props}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cập nhật thay đổi</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
