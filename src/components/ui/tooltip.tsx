"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[120] origin-bottom rounded-md border border-white/15 bg-strong px-2.5 py-1.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-on-strong uppercase shadow-lg",
        "transition-[opacity,transform] duration-200 ease-out will-change-transform",
        "data-[state=closed]:scale-95 data-[state=closed]:opacity-0",
        "data-[state=delayed-open]:scale-100 data-[state=delayed-open]:opacity-100",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
