import type { Metadata } from "next";
import "./globals.css";

import { ArticlesProvider } from "@/contexts/ArticlesContext";
import { QuotationsProvider } from "../contexts/QuotationsContext";

export const metadata: Metadata = {
  title: "RileFlow",
  description: "Smart Business Documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body>
        <ArticlesProvider>
          <QuotationsProvider>{children}</QuotationsProvider>
        </ArticlesProvider>
      </body>
    </html>
  );
}
