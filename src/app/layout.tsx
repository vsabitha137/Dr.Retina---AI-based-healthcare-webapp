import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dr.Retina | AI-Powered Diabetic Retinopathy Screening Portal",
  description:
    "Screening and decision-support workflow for diabetic retinopathy: patient intake, fundus upload, AI-assisted triage, doctor review, and longitudinal history.",
  icons: { icon: "/retina-icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
