import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/ui/button";
import { Calendar } from "@/components/common/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/ui/popover";
import { CalendarIcon } from "lucide-react";
import { vi } from "date-fns/locale";

export function DatePickerWithRangeInForm({ className, onSelected, date }) {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-72 justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <div className="line-clamp-1 flex-1 text-ellipsis">
                  {format(date.from, "LLL dd, y", { locale: vi })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: vi })}
                </div>
              ) : (
                <div className="line-clamp-1 flex-1 text-ellipsis">
                  {format(date.from, "LLL dd, y", { locale: vi })}
                </div>
              )
            ) : (
              <span>Chọn ngày</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelected}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
