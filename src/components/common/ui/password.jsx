import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useToggle } from "@/hooks/useToggle";

const Password = React.forwardRef(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useToggle();
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-14 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      <span
        onClick={() => {
          setShowPassword(!showPassword);
        }}
        className="absolute inset-y-0 end-0 mr-2 flex cursor-pointer items-center"
      >
        {showPassword ? (
          <Eye size={16} className="bg-white" />
        ) : (
          <EyeOff size={16} className="bg-white" />
        )}
      </span>
    </div>
  );
});
Password.displayName = "Password";

export { Password };
