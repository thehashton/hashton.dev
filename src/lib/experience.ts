export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  /** Portfolio case study slug — links to /work/[slug] when set. */
  workSlug?: string;
  href?: string;
  /** Square mark shown in compact timelines (public path). */
  logo?: string;
  period: string;
  location: string;
  summary: string;
};

export const experience: ExperienceItem[] = [
  {
    id: "fen",
    role: "Lead Coach and Co-Founder",
    company: "Front End Now",
    workSlug: "front-end-now",
    logo: "/images/logos/front-end-now.png",
    period: "Mar 2023 — Present",
    location: "Remote",
    summary:
      "Structured programs and community around landing a first frontend role — curriculum, product, and ops for an education business.",
  },
  {
    id: "eo",
    role: "Lead Frontend Developer",
    company: "EO Charging",
    workSlug: "eo-charging",
    logo: "/images/logos/eo-charging.png",
    period: "Sep 2022 — May 2025",
    location: "Stowmarket, UK, remote",
    summary:
      "Lead frontend on the Depot Squad for EO Portal: analytical dashboards, customised maps, UI libraries, micro-frontend architecture. Partnered with product on UI/UX in Figma. Built in-house accessibility audit tooling for WCAG 2.1 AA monitoring.",
  },
  {
    id: "thrive",
    role: "Senior Product Engineer",
    company: "THRIVE LXP",
    workSlug: "thrive-lxp",
    logo: "/images/logos/thrive-lxp.png",
    period: "Jun 2020 — Sep 2022",
    location: "Nottingham, UK, remote",
    summary:
      "React, MUI, TypeScript product UI with a heavy focus on accessibility, design systems, testing, and UX. Owned the shared component library across apps; bespoke/MUI hybrid components. Accessibility audits and cross-team education.",
  },
  {
    id: "jh",
    role: "Mid Frontend Developer",
    company: "JH",
    href: "https://www.linkedin.com/company/jh",
    logo: "/images/logos/jh.png",
    period: "Mar 2018 — Jul 2020",
    location: "Nottingham, UK",
    summary:
      "Magento 1 & 2 storefronts, React PWAs, and WordPress builds — shipping production interfaces across ecommerce and marketing.",
  },
  {
    id: "roller",
    role: "Frontend Web Developer",
    company: "Roller Agency",
    href: "https://www.linkedin.com/company/roller-agency",
    logo: "/images/logos/roller-agency.png",
    period: "Apr 2017 — Mar 2018",
    location: "Nottingham, UK",
    summary:
      "Static sites, Angular/Firebase, Shopify, React/Ruby, WordPress, and Umbraco projects — broad stack exposure at agency pace.",
  },
  {
    id: "muscle",
    role: "Junior Frontend Developer",
    company: "Muscle Foods Ltd",
    href: "https://www.linkedin.com/company/muscle-foods-limited",
    logo: "/images/logos/muscle-foods.png",
    period: "Dec 2015 — Apr 2017",
    location: "Nottingham, UK",
    summary:
      "Landing pages, frontend apps in JS, and close collaboration with design on campaigns.",
  },
];
