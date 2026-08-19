import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://webzalokal-demo.webzalokal.workers.dev"),
  title: {
    default: "WebZaLokal — predlošci",
    template: "%s | WebZaLokal",
  },
  description:
    "Modularni predlošci web-stranica za restorane, kafiće, barove i male lokalne dućane.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
