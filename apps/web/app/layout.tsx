import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HeritageVault",
  description: "AI-powered cultural preservation platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
