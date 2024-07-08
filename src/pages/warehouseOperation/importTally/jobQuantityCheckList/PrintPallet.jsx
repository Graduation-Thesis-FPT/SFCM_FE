import { Button } from "@/components/common/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { Printer } from "lucide-react";

export function PrintPallet() {
  return (
    <div>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Printer className="size-4 hover:cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>In mã pallet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
