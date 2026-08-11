import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "IGMA — Create Imagination",
  description: "AI Social Platform + AI Story-to-Reel Studio. Quick posts and Imagine Studio reels in a unified explore feed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-60px)]">{children}</main>
        <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-silver-dim">
          <p>© 2026 IGMA — Built with Groq + Pollinations + Firebase Spark • <a href="/about" className="underline">About</a> • <a href="/privacy-policy" className="underline">Privacy</a> • <a href="/terms" className="underline">Terms</a></p>
        </footer>
      </body>
    </html>
  );
}
