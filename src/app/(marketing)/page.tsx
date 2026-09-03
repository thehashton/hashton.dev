import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductsSection } from "@/components/sections/products-section";
import { WorkSection } from "@/components/sections/work-section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: site.url,
  },
};

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ProductsSection />
      <ContactSection />
    </>
  );
}
