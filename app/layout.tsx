import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apartment Directory",
  description: "Interactive apartment floor plan directory with household information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
