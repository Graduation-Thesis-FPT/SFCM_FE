import { Button } from "@/components/common/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { Download, Loader2 } from "lucide-react";

export function BtnImportExcel({ isLoading, ...props }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button disabled={isLoading} size="tool" variant="none-border" {...props}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Nhập Excel</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
