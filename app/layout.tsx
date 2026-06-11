import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadCommand | Estates Elevate",
  description: "Client-facing real estate lead command center for Estates Elevate agents."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
