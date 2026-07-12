import type { Metadata } from "next";

import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for contracts, consulting, or senior frontend roles.",
};

export default function ContactPage() {
  return <ContactSection />;
}
