import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        //custom
        blue: "text-white bg-blue-600 hover:bg-blue-600/80",
        green: "bg-green text-green-foreground hover:bg-green/80",
        red: "bg-red-500 text-white hover:bg-red-500/80",
        "blue-outline":
          "border border-blue bg-background hover:bg-blue text-blue hover:text-blue-foreground",
        "green-outline":
          "border border-green bg-background hover:bg-green text-green hover:text-green-foreground",
        "red-outline":
          "border border-red bg-background hover:bg-red text-red hover:text-red-foreground",
        "none-border": "hover:bg-white text-black"
      },
      size: {
        default: "h-[36px] px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        //custom
        tool: "w-[36px] h-[32px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };