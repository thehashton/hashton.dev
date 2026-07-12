import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max = 100, ...props }, ref) => {
  const safeValue = value ?? 0;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={safeValue}
      max={max}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={safeValue}
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-ink/25", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 rounded-full bg-accent transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${100 - Math.min(100, (safeValue / max) * 100)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
