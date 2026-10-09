import { Krona_One, Inter } from "next/font/google";
import { Suspense } from "react";
import InternalNavigationTracker from "@/components/InternalNavigationTracker";
import "./globals.css";

const kronaOne = Krona_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-krona",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${kronaOne.variable} ${inter.variable}`}>
        <Suspense fallback={null}>
          <InternalNavigationTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
