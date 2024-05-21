import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";

export const SearchInput = forwardRef(({ className, handleSearch, ...props }, ref) => {
  const inputRef = useRef(null);
  return (
    <div className={cn("mb-[34px]", className)}>
      <div className="mb-2 text-xs font-medium">Tìm kiếm</div>
      <div className="relative flex">
        <Search className="absolute left-2.5 top-3.5 size-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Nhập từ khóa..."
          className="mr-4 h-12 w-[416px] pl-8 text-black"
        />
        <Button
          className="h-12"
          onClick={() => {
            handleSearch(inputRef.current.value);
          }}
        >
          Tìm kiếm
          <Search className="ml-2 size-5" />
        </Button>
      </div>
    </div>
  );
});
