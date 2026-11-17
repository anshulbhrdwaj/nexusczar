import type { Metadata } from "next";
import "./nexusczar.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusCzar | High-Performance Websites, Custom Software & SEO",
  description:
    "NexusCzar engineers high-performance websites, custom enterprise software, and targeted SEO growth engines to accelerate business growth.",
  icons: {
    icon: "/nexusczar/logonc.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="body" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

