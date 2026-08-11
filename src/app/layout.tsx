import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata = {
  title: "IGMA — Create Imagination",
  description: "AI Social Platform + AI Story-to-Reel Studio. Quick posts and Imagine Studio reels in a unified explore feed.",
  icons: { icon: "/duck-logo.png", apple: "/duck-logo.png" },
  manifest: "/manifest.json",
  themeColor: "#0A0A0B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0A0A0B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-60px)]">{children}</main>
          <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-silver-dim">
            <p>© 2026 IGMA — Groq + Pollinations (gen.pollinations.ai) + Firebase Spark + imgbb • PWA ready • <a href="/about" className="underline">About</a> • <a href="/privacy-policy" className="underline">Privacy</a> • <a href="/terms" className="underline">Terms</a></p>
          </footer>
        </AuthProvider>
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}`}} />
      </body>
    </html>
  );
}
