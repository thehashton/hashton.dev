export const site = {
  name: "Harry Ashton",
  nickname: "Hashton",
  title: "Senior frontend engineer — contract & consulting",
  tagline:
    "Ex-lead frontend developer. I ship interfaces and design systems — on contract, as a consultant, or embedded as senior IC.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://hashton.vercel.app",
  location: "United Kingdom, remote",
  email: "hello@learnfrontendnow.com",
  links: {
    linkedin: "https://www.linkedin.com/in/harryfen/",
    github: "https://github.com/thehashton/",
    x: "https://x.com/TheHashton",
    youtube: "https://www.youtube.com/@LearnFrontendNow",
    tiktok: "https://www.tiktok.com/@thehashton",
    instagram: "https://www.instagram.com/thehashton/",
  },
  stats: {
    yearsExperience: "11+",
  },
} as const;
