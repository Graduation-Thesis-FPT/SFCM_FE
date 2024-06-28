import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/ui/button";
import { Calendar } from "@/components/common/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/ui/popover";
import { CalendarIcon } from "lucide-react";
import { vi } from "date-fns/locale";

export function DatePicker({ className, onSelected, date }) {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "LLL dd, y", { locale: vi }) : <span>Chọn ngày</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={date}
            onSelect={onSelected}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
