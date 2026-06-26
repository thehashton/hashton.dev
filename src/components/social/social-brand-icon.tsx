import type { SimpleIcon } from "simple-icons";

import { BrandIcon, brandOpticalClass, type BrandName } from "@/components/icons/brands";
import { cn } from "@/lib/utils";

import type { SocialBrand } from "@/lib/social-platforms";

type Props = {
  brand: SocialBrand;
  className?: string;
  title?: string;
};

function brandNameFromSocial(brand: SocialBrand): BrandName | null {
  if (brand === "linkedin") return "linkedin";
  const slug = (brand as SimpleIcon).slug as BrandName;
  if (slug in brandOpticalClass) return slug;
  return null;
}

export function SocialBrandIcon({ brand, className, title }: Props) {
  const name = brandNameFromSocial(brand);

  if (name) {
    return <BrandIcon name={name} size="md" className={className} title={title} />;
  }

  return (
    <span className={cn("inline-flex size-6 shrink-0 items-center justify-center", className)}>
      <svg
        className="block size-[1.35rem] origin-center"
        viewBox="0 0 24 24"
        role="img"
        aria-hidden={title ? undefined : true}
      >
        {title ? <title>{title}</title> : null}
        <path fill="currentColor" d={(brand as SimpleIcon).path} />
      </svg>
    </span>
  );
}
