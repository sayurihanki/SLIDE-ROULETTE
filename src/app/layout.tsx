import type { Metadata, Viewport } from "next";
import { AppChrome } from "@/components/app-chrome";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const description =
  "A work-safe AI deck generator and host console for in-person PowerPoint Karaoke.";

export const viewport: Viewport = {
  themeColor: "#0f7b78",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Slide Roulette",
    template: "%s · Slide Roulette",
  },
  description,
  applicationName: "Slide Roulette",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Slide Roulette",
    title: "Slide Roulette",
    description,
    images: [
      {
        url: "/images/hero-karaoke.png",
        alt: "Presenters reacting during a slide roulette round",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slide Roulette",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
