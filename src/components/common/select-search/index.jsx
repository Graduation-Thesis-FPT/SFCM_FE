import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/common/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/ui/popover";
import { CheckIcon, ChevronsUpDown } from "lucide-react";

export function SelectSearch({
  data = [],
  labelSelect = "Chọn",
  labelSearch = "Tìm kiếm",
  className,
  onSelect
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (!data.length) {
      setValue("");
      return;
    }
  }, [data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-w-[200px] justify-between text-14 font-normal focus-visible:ring-1 focus-visible:ring-offset-0",
            className
          )}
        >
          {value ? (
            data.find(item => item.value === value)?.label
          ) : (
            <span className="text-muted-foreground">{labelSelect}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
        <Command
          filter={(value, search) => {
            const sanitizedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            const searchRegex = new RegExp(sanitizedSearch, "i");
            const platformLabel = data.find(data => data.value === value)?.label || "";
            return searchRegex.test(platformLabel) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={labelSearch} className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm có dữ liệu</CommandEmpty>
            <CommandGroup>
              {data.map(item => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={currentValue => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onSelect(currentValue === value ? "" : currentValue);
                  }}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
