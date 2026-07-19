import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://exora.in"),
  title: {
    default: "EXORA — Flowers that stay",
    template: "%s — EXORA",
  },
  description:
    "Joyful handmade crochet blooms and bouquets, crafted slowly in Surat and designed to stay beautiful.",
  openGraph: {
    title: "EXORA — Flowers without a goodbye.",
    description:
      "Joyful handmade crochet blooms, crafted slowly in Surat and made to stay.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1732,
        height: 908,
        alt: "EXORA handmade crochet flowers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXORA — Flowers without a goodbye.",
    description: "Joyful handmade crochet blooms, crafted slowly and made to stay.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/vision_final_logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/vision_final_logo.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://pub-2a5d8e5eaff3498da143b1150b20a7c1.r2.dev"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
