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
  title: "Pixel Reviews",
  description: "Shared your opinions about videogames",
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
