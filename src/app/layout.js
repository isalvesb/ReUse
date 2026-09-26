import { Krona_One, Inter } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
