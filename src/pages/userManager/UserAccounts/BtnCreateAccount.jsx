import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader, Loader2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BtnCreateAccount({ ...props }) {
  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="blue" {...props}>
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Thêm tài khoản</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
