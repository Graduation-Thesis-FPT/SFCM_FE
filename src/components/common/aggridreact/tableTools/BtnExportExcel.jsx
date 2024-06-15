import { Button } from "@/components/common/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { Loader2, Upload } from "lucide-react";

export function BtnExportExcel({ gridRef, isLoading, ...props }) {
  const handleExportExcel = () => {
    console.log(gridRef.current.api.getDataAsCsv());
  };
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleExportExcel}
            disabled={isLoading}
            size="tool"
            variant="none-border"
            {...props}
          >
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
