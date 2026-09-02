import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.nickname,
    url: site.url,
    jobTitle: site.title,
    email: site.email,
    sameAs: [
      site.links.linkedin,
      site.links.github,
      site.links.youtube,
      site.links.x,
      site.links.instagram,
      site.links.tiktok,
      "https://codeprepped.com",
      "https://www.hashton.agency",
    ],
    knowsAbout: [
      "Frontend engineering",
      "Design systems",
      "Web accessibility",
      "React",
      "TypeScript",
      "Contract software development",
      "Technical consulting",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
