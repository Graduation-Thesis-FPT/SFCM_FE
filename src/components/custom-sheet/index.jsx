/* <CustomSheet open={...} onOpenChange={...} title="...>
<CustomSheet.Content title="...">
...Content here...
</CustomSheet.Content>
<CustomSheet.Footer>
...Footer here...
</CustomSheet.Footer>
</CustomSheet> */

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X } from "lucide-react";

export function CustomSheet({ children, className, onOpenChange, title, ...props }) {
  return (
    <Sheet className={cn("", className)} onOpenChange={onOpenChange} {...props}>
      <SheetContent hiddenIconClose={true} className="sm:max-w-1/2 flex w-1/2 flex-col gap-0 p-0">
        <span>
          <div className="flex items-center justify-between p-6">
            <div className="text-xl font-bold text-gray-900">{title}</div>
            <X className="size-4 cursor-pointer hover:opacity-80" onClick={onOpenChange} />
          </div>
          <Separator className="bg-gray-400" />
        </span>
        {children}
      </SheetContent>
    </Sheet>
  );
}

CustomSheet.Content = ({ children, className, title }) => {
  return (
    <span className={cn("h-full px-6 pt-6", className)}>
      {title && <div className="mb-4 text-lg font-medium text-gray-900">{title}</div>}
      {children}
    </span>
  );
};

CustomSheet.Footer = ({ children, className }) => {
  return (
    <span>
      <Separator className="bg-gray-200" />
      <span className={cn("flex justify-end p-6", className)}>{children}</span>
    </span>
  );
};
