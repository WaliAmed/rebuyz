import type { Metadata } from "next";
import { Providers } from "@/lib/store";
import "./globals.css";
export const metadata: Metadata = {
  title: "Zahid Autos — Good parts. Great journeys.",
  description:
    "Explore quality automotive parts, transmission fluids, and community cars. A complete frontend demo.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
