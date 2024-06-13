import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Upload } from "lucide-react";

export function BtnExportExcel({ isLoading, ...props }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button disabled={isLoading} size="tool" variant="none-border" {...props}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Xuất Excel</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
