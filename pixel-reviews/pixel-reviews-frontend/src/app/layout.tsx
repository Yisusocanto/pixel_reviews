import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Background from "@/components/commons/Background";
import TanstackProvider from "@/providers/TanstackProvider";
import AuthContextProvider from "@/providers/AuthProvider";
import { Footer } from "@/components/commons/Footer";
import AppNavbar from "@/components/commons/Navbar";
import { exo } from "@/fonts/fonts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Pixel Reviews - The Next Gen of Game Reviews",
    template: "%s | Pixel Reviews",
  },
  description:
    "Join the ultimate community for gamers. Track your collection, write detailed reviews, and connect with friends who share your passion for pixels.",
  keywords: [
    "game reviews",
    "video games",
    "gaming community",
    "pixel reviews",
    "game database",
    "social gaming",
  ],
  authors: [{ name: "Pixel Reviews Team" }],
  creator: "Pixel Reviews",
  publisher: "Pixel Reviews",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://pixel-reviews-livid.vercel.app"
  ),
  openGraph: {
    title: "Pixel Reviews",
    description: "Share your opinions about videogames",
    url: "/",
    siteName: "Pixel Reviews",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Pixel Reviews Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Reviews",
    description: "Share your opinions about videogames",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${exo.className} antialiased`}>
        <TanstackProvider>
          <AuthContextProvider>
            <Background />
            <div className="flex flex-col min-h-screen">
              <Toaster richColors theme="dark" />

              <AppNavbar />
              <main className="grow">{children}</main>
              <Footer />
            </div>
            <Analytics />
            <SpeedInsights />
          </AuthContextProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
