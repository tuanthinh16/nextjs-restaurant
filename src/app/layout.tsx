import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/app/languageContex";
import { business_name } from "@/config/config";
import { SessionProvider } from "next-auth/react";
import { ProvidersSession } from "@/components/SessionProviderApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const app_name = business_name as string;
export const metadata: Metadata = {
  title: app_name,
  description: app_name.toLocaleLowerCase(),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: app_name.toUpperCase(),
    description: app_name.toLocaleLowerCase(),
    url: "https://luxuryrestaurant.com",
    siteName: app_name,
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProvidersSession >
          <LanguageProvider>

            <main className="mx-auto min-h-screen w-full">
              {children}
            </main>

          </LanguageProvider>
        </ProvidersSession>
      </body>
    </html>
  );
}
