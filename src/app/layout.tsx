import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IBO Mastery OS",
  description: "Two-student International Business Olympiad mastery platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
