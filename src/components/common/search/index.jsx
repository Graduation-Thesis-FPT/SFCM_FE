import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export const SearchInput = forwardRef(
  (
    { className, handleSearch, title = "Tìm kiếm", placeHolderText = "Nhập từ khoá...", ...props },
    ref
  ) => {
    const inputRef = useRef(null);
    return (
      <div className={cn("flex flex-col", className)}>
        <Label>{title}</Label>
        <div className="relative flex">
          <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeHolderText}
            {...props}
            className="mr-4 h-[36px] max-w-80 min-w-20 pl-8 text-xs font-normal text-black"
          />
          <Button
            className="h-[36px] text-xs"
            onClick={() => {
              handleSearch(inputRef.current.value);
            }}
          >
            Tìm kiếm
            <Search className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    );
  }
);
