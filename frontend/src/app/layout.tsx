import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verdant — thoughtful crop care",
  description:
    "A private, thoughtful field companion for crop health assessments and disease information.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
