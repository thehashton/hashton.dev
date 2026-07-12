"use client";

import { useTransition, type ComponentProps } from "react";
import { toast } from "sonner";

import type { ActionResult } from "@/lib/action-result";
import { cn } from "@/lib/utils";

type ActionFormProps = Omit<ComponentProps<"form">, "action"> & {
  action: (formData: FormData) => Promise<ActionResult | void>;
  success: string;
  errorFallback?: string;
};

export function ActionForm({
  action,
  success,
  errorFallback = "Something went wrong. Try again.",
  className,
  children,
  ...props
}: ActionFormProps) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      {...props}
      className={cn(className)}
      data-pending={pending ? "true" : undefined}
      action={(formData) => {
        startTransition(async () => {
          try {
            const result = await action(formData);
            if (result && "error" in result && result.error) {
              toast.error(result.error);
              return;
            }
            toast.success(success);
          } catch {
            toast.error(errorFallback);
          }
        });
      }}
    >
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
