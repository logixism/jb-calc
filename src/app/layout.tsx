import type { Metadata } from "next";
import { Afacad_Flux } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const afacadFlux = Afacad_Flux({
  variable: "--font-afacad-flux",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JB Calculator",
  description:
    "A feature-rich calculator with support for cross-trading for Roblox Jailbreak, powered by JBValues",
  keywords: [
    "Roblox",
    "Jailbreak",
    "Calculator",
    "Trading",
    "JBValues",
    "Cross-trade",
  ],
  authors: [{ name: "logix.lol" }],
  openGraph: {
    title: "JB Calculator",
    description:
      "A feature-rich calculator with support for cross-trading for Roblox Jailbreak, powered by JBValues",
    type: "website",
    url: "https://calc.logix.lol",
  },
  twitter: {
    card: "summary_large_image",
    title: "JB Calculator",
    description:
      "A feature-rich calculator with support for cross-trading for Roblox Jailbreak, powered by JBValues",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${afacadFlux.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
