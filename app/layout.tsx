import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import NotificationPopup from "@/components/NotificationPopup";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Agnivesh Ayurveda and Panchakarma Centre — Your Health, Our Concern",
  description:
    "Authentic Ayurvedic healthcare & Panchakarma centre in Sarenga, Bankura, West Bengal. Expert doctors, teleconsultation & OPD visits.",
  keywords:
    "Ayurveda, Panchakarma, Ayurvedic clinic, Bankura, Sarenga, West Bengal",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Agnivesh Ayurveda",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2D6A4F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2D6A4F" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Agnivesh Ayurveda" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120'%3E%3Cpath d='M50 10 Q55 30 50 50 Q45 30 50 10' fill='%232D6A4F'/%3E%3Cpath d='M50 30 Q70 25 75 35 Q65 40 50 40' fill='%232D6A4F' opacity='0.85'/%3E%3Cpath d='M50 40 Q30 35 25 45 Q35 50 50 48' fill='%232D6A4F' opacity='0.85'/%3E%3Cpath d='M50 50 Q75 48 78 58 Q65 62 50 58' fill='%232D6A4F' opacity='0.8'/%3E%3Cpath d='M50 58 Q25 56 22 66 Q35 70 50 66' fill='%232D6A4F' opacity='0.8'/%3E%3Cpath d='M50 68 Q72 68 74 76 Q62 78 50 76' fill='%232D6A4F' opacity='0.75'/%3E%3Cpath d='M50 76 Q28 76 26 84 Q38 86 50 84' fill='%232D6A4F' opacity='0.75'/%3E%3Cpath d='M50 10 Q48 50 50 90 Q52 100 50 110' stroke='%232D6A4F' stroke-width='2' fill='none' opacity='0.6'/%3E%3C/svg%3E"
        />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ChatBot />
          <NotificationPopup />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
