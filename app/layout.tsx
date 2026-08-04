import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "Agnivesh Ayurveda and Panchakarma Centre — Your Health, Our Concern",
  description:
    "Authentic Ayurvedic healthcare & Panchakarma centre in Sarenga, Bankura, West Bengal. Expert doctors, teleconsultation & OPD visits. Treats digestive, joint, anorectal & hormonal disorders.",
  keywords:
    "Ayurveda, Panchakarma, Ayurvedic clinic, Bankura, Sarenga, West Bengal, teleconsultation, IBS, arthritis, PCOS, piles, diabetes, holistic health, Nadi Pariksha",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
