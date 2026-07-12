import type { Metadata } from "next";

import { AboutSection } from "@/components/sections/about-section";

export const metadata: Metadata = {
  title: "About",
  description: "Background, approach, and experience — Harry Ashton.",
};

export default function AboutPage() {
  return <AboutSection />;
}
