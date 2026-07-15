import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pastel Radar — friendly live flight tracking",
  description:
    "Pastel Radar is a calm, playful global flight tracker. Live aircraft from Airplanes.live and ADSB.fi, enriched by ADSBDB.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F5F1E8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary antialiased">{children}</body>
    </html>
  );
}
