import type { SimpleIcon } from "simple-icons";
import {
  siGithub,
  siInstagram,
  siTiktok,
  siX,
  siYoutube,
} from "simple-icons";

import { site } from "@/lib/site";

/** LinkedIn uses the hand-tuned SVG in `brands.tsx` (simple-icons export naming varies). */
export type SocialBrand = SimpleIcon | "linkedin";

export type SocialPlatform = {
  id: string;
  label: string;
  href: string;
  brand: SocialBrand;
  /** Handle or identity shown in contact “Social grid” tooltips. */
  channelName: string;
};

export const socialPlatforms: SocialPlatform[] = [
  {
    id: "youtube",
    label: "YouTube",
    href: site.links.youtube,
    brand: siYoutube,
    channelName: "@iamhashton",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: site.links.tiktok,
    brand: siTiktok,
    channelName: "@thehashton",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: site.links.instagram,
    brand: siInstagram,
    channelName: "@thehashton",
  },
  { id: "x", label: "", href: site.links.x, brand: siX, channelName: "@thehashton" },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: site.links.linkedin,
    brand: "linkedin",
    channelName: "Harry Ashton",
  },
  {
    id: "github",
    label: "GitHub",
    href: site.links.github,
    brand: siGithub,
    channelName: "thehashton",
  },
];

/** Map dashboard `social_channels.key` values to brand icons. */
export function socialBrandForChannelKey(key: string): SocialBrand | null {
  const normalized = key.trim().toLowerCase();
  if (normalized === "twitter" || normalized === "x") return siX;
  const match = socialPlatforms.find((platform) => platform.id === normalized);
  return match?.brand ?? null;
}
