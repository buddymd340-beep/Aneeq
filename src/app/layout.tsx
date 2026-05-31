import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Public Teaching Website`,
    template: `%s | ${site.name}`
  },
  description: "A simple, interactive teaching website with public courses and contact inquiries."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
