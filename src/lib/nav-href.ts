import { sectionNav } from "@/lib/nav";

export type SectionNavId = (typeof sectionNav)[number]["id"];

/** On `/`, use in-page anchors; elsewhere use dedicated routes (no `#`). */
export function sectionHref(pathname: string, id: SectionNavId): string {
  if (pathname === "/") {
    return `/#${id}`;
  }

  switch (id) {
    case "home":
      return "/";
    case "about":
      return "/about";
    case "work":
      return "/work";
    case "products":
      return "/#products";
    case "contact":
      return "/contact";
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function logoHref(pathname: string): string {
  return pathname === "/" ? "/#home" : "/";
}

export function contactHref(pathname: string): string {
  return sectionHref(pathname, "contact");
}
