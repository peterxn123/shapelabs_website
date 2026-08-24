import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import "./globals.css";

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "shape labs",
  description: "we build tiny apps that solve real workflows.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${questrial.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
