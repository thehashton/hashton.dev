import { SocialBrandIcon } from "@/components/social/social-brand-icon";
import { socialBrandForChannelKey } from "@/lib/social-platforms";
import { cn } from "@/lib/utils";

export function DashboardChannelIcon({
  channelKey,
  label,
  className,
}: {
  channelKey: string;
  label: string;
  className?: string;
}) {
  const brand = socialBrandForChannelKey(channelKey);

  if (!brand) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-ink/40 text-base font-semibold uppercase leading-none text-ink",
          className,
        )}
      >
        {label.slice(0, 1)}
      </span>
    );
  }

  return (
    <SocialBrandIcon
      brand={brand}
      className={cn("size-5 text-ink", className)}
    />
  );
}
