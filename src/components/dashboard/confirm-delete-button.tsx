"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ActionResult } from "@/lib/action-result";

type ConfirmDeleteButtonProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  triggerLabel?: string;
  success?: string;
  onConfirm: (formData: FormData) => Promise<ActionResult | void>;
  formData?: Record<string, string>;
};

export function ConfirmDeleteButton({
  title,
  description,
  confirmLabel = "Delete",
  triggerLabel = "Delete",
  success = "Deleted.",
  onConfirm,
  formData = {},
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 aria-hidden />
        {triggerLabel}
      </Button>

      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm" disabled={pending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructiveSolid"
            size="sm"
            disabled={pending}
            onClick={() => {
              const data = new FormData();
              for (const [key, value] of Object.entries(formData)) {
                data.set(key, value);
              }
              startTransition(async () => {
                try {
                  const result = await onConfirm(data);
                  if (result && "error" in result && result.error) {
                    toast.error(result.error);
                    return;
                  }
                  toast.success(success);
                  setOpen(false);
                } catch (error) {
                  const digest =
                    typeof error === "object" && error && "digest" in error
                      ? String((error as { digest?: string }).digest)
                      : "";
                  if (digest.startsWith("NEXT_REDIRECT")) {
                    throw error;
                  }
                  toast.error("Something went wrong. Try again.");
                }
              });
            }}
          >
            <Trash2 aria-hidden />
            {pending ? "Deleting…" : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
