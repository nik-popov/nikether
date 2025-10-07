import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import { cn } from "@/lib/utils";

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-poppins",
});

const fontPtSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

export const metadata: Metadata = {
  title: "Rhythmic Canvas",
  description: "Super cool animated DJ/artist producer website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-body antialiased", fontPoppins.variable, fontPtSans.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
