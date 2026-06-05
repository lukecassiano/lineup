import type { Metadata } from "next";
import {
  Bagel_Fat_One,
  Fraunces,
  Newsreader,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const bagelFatOne = Bagel_Fat_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bagel",
  display: "swap",
});

const fraunces = Fraunces({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const newsreader = Newsreader({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "lineup.",
  description: "A community surf journal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bagelFatOne.variable} ${fraunces.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
        style={{
          fontFamily: "'Newsreader', Georgia, serif",
          color: "var(--ink)",
          background: "var(--cream)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
