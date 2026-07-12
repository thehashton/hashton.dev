import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Dashboard / app button system
 * - accent: primary CTA (create, save, submit)
 * - default: strong filled secondary
 * - outline: secondary actions (cancel, filter, export)
 * - ghost: tertiary / compact inline actions
 * - destructive: dangerous outline trigger (delete)
 * - destructiveSolid: confirm destructive action in dialogs
 */
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-sans font-semibold tracking-tight transition-[background-color,box-shadow,border-color,color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-strong text-on-strong shadow-sm hover:bg-strong/90 hover:shadow-md",
        accent:
          "border border-transparent bg-accent text-accent-foreground shadow-sm hover:bg-accent-600 hover:shadow-md",
        outline:
          "border border-ink/30 bg-transparent text-ink shadow-none hover:border-ink/45 hover:bg-ink/8",
        ghost: "border border-transparent bg-transparent text-ink shadow-none hover:bg-ink/10",
        destructive:
          "border border-danger/45 bg-transparent text-danger shadow-none hover:border-danger/70 hover:bg-danger/10",
        destructiveSolid:
          "border border-transparent bg-danger text-danger-foreground shadow-sm hover:opacity-90 hover:shadow-md",
      },
      size: {
        default: "min-h-12 px-5 py-3 text-base",
        sm: "min-h-11 px-4 py-2.5 text-base",
        lg: "min-h-14 min-w-[11.5rem] px-6 py-3.5 text-lg",
        icon: "size-11 min-h-11 shrink-0 px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
