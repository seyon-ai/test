"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Feed" },
  { href: "/explore", label: "Explore" },
  { href: "/imagine", label: "Imagine" },
  { href: "/messages", label: "Messages" },
  { href: "/notifications", label: "Alerts" },
  { href: "/search", label: "Search" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 h-[60px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl metallic flex items-center justify-center font-display font-bold text-sm">IG</div>
          <span className="font-display font-bold text-lg tracking-tight">IGMA</span>
          <span className="hidden sm:inline text-[10px] tracking-[0.2em] text-silver-dim ml-1">IMAGINATION</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map(n=>{
            const active = path===n.href || (n.href!=="/" && path.startsWith(n.href));
            return <Link key={n.href} href={n.href} className={`px-3 py-1.5 rounded-full text-sm transition ${active?"bg-white text-black font-medium":"text-silver-dim hover:text-white hover:bg-white/5"}`}>{n.label}</Link>
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/imagine" className="hidden sm:inline-flex metallic px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition">+ New Story</Link>
          <Link href="/profile/edit" className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs">●</Link>
        </div>
      </div>
      <div className="md:hidden flex gap-1 px-4 pb-2 overflow-auto">
        {nav.map(n=> <Link key={n.href} href={n.href} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${path===n.href?"bg-white text-black":"text-silver-dim border border-white/10"}`}>{n.label}</Link>)}
      </div>
    </header>
  )
}
