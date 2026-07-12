import * as React from "react";

import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-12 w-full cursor-pointer appearance-none rounded-lg border border-ink/15 bg-surface bg-[length:1rem] bg-[right_0.85rem_center] bg-no-repeat px-4 py-2 pr-10 font-sans text-body text-ink shadow-sm transition-[box-shadow,border-color] focus-visible:border-accent focus-visible:outline-none focus-visible:shadow-[var(--shadow-input-focus)] disabled:cursor-not-allowed disabled:opacity-40",
          "bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27none%27 stroke=%27%238a847a%27 stroke-width=%271.6%27%3E%3Cpath d=%27M6 8l4 4 4-4%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

export { Select };
