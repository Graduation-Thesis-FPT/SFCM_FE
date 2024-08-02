import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/ui/button";
import { Calendar } from "@/components/common/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/ui/popover";
import { CalendarIcon } from "lucide-react";
import { vi } from "date-fns/locale";

export function DatePicker({ className, onSelected, date }) {
  return (
    <Popover>
      <PopoverTrigger asChild className="h-9">
        <Button
          id="date"
          variant="outline"
          className={cn(
            "min-w-44 line-clamp-1 flex gap-0.5 w-full items-center justify-center text-14 font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? (
            <p className="flex-1 text-14 line-clamp-1">{format(date, "LLL dd, y", { locale: vi })}</p>
          ) : (
            <p className="flex-1 text-14 line-clamp-1">Chọn ngày</p>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pointer-events-auto w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="single"
          selected={date}
          onSelect={onSelected}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}
