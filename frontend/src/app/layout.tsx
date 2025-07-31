import type { Metadata } from "next";
import { Geist, Geist_Mono , Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agrilo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
