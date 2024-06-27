/* <CustomSheet open={...} onOpenChange={...} title="...>
<CustomSheet.Content title="...">
...Content here...
</CustomSheet.Content>
<CustomSheet.Footer>
...Footer here...
</CustomSheet.Footer>
</CustomSheet> */

import { cn } from "@/lib/utils";
import { Separator } from "@/components/common/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/common/ui/sheet";
import { X } from "lucide-react";

export function CustomSheet({
  children,
  className,
  onOpenChange,
  title,
  form = { reset: () => {} },
  ...props
}) {
  return (
    <Sheet className={cn("", className)} onOpenChange={onOpenChange} {...props}>
      <SheetContent
        onInteractOutside={() => {
          onOpenChange();
          form.reset();
        }}
        hiddenIconClose={true}
        className="sm:max-w-1/2 flex h-full max-h-screen w-1/2 flex-col gap-0 p-0"
      >
        <SheetHeader>
          <SheetTitle>
            <span className="flex items-center justify-between px-6 py-4">
              <div className="text-20 font-bold text-blue-700">{title}</div>
              <X
                className="size-4 cursor-pointer hover:opacity-80"
                onClick={() => {
                  onOpenChange();
                  form.reset();
                }}
              />
            </span>
            <Separator className="bg-gray-400" />
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

CustomSheet.Content = ({ children, className, title }) => {
  return (
    <div className={cn("h-full flex-1 px-6 pt-4", className)}>
      {title && <p className="mb-4 text-gray-900">{title}</p>}
      {children}
    </div>
  );
};

CustomSheet.Footer = ({ children, className = "flex justify-end px-6 py-4" }) => {
  return (
    <div>
      <Separator className="bg-gray-200" />
      <div className={cn(className)}>{children}</div>
    </div>
  );
};
