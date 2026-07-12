import type { Metadata } from "next";

import { WorkSection } from "@/components/sections/work-section";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected work and case studies — Harry Ashton.",
};

export default function WorkIndexPage() {
  return <WorkSection />;
}
