import { cn } from "@/lib/utils";

export function SectionLabel({
  id,
  label,
  className,
}: {
  id?: string;
  label: string;
  className?: string;
}) {
  return (
    <p
      id={id}
      className={cn(
        "mb-6 inline-flex items-center rounded-full border border-ink/15 bg-muted px-3 py-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-secondary",
        className,
      )}
    >
      {label}
    </p>
  );
}
