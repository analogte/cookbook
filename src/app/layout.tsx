import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gastronomique - Premium Recipe Collection",
    template: "%s | Gastronomique",
  },
  description:
    "สูตรอาหารพรีเมียมและเทคนิคการทำอาหารระดับเชฟ สำหรับผู้ที่หลงใหลในศิลปะการทำอาหาร",
  keywords: [
    "สูตรอาหาร",
    "recipe",
    "cooking",
    "ทำอาหาร",
    "อาหารไทย",
    "Thai cuisine",
    "premium recipes",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-cream font-sans antialiased">
        <TRPCProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </TRPCProvider>
      </body>
    </html>
  );
}
