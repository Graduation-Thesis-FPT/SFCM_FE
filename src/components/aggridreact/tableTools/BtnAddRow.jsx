import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

export function BtnAddRow({ onAddRow, ...props }) {
  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="tool" variant="none-border" onClick={onAddRow} {...props}>
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Thêm dòng mới</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
