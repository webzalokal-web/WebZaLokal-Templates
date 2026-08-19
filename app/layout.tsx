import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WebZaLokal — predlošci",
    template: "%s | WebZaLokal",
  },
  description:
    "Modularni predlošci web-stranica za restorane, kafiće i barove.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
