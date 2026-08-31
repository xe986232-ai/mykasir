import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreshCart — Grocery App",
  description: "Grocery shopping made simple",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#EFF1F0] font-sans">
        {children}
      </body>
    </html>
  );
}
