"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { clinicInfo } from "@/lib/data";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/specialities", label: "Specialities" },
  { href: "/book", label: "Book Appointment" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-ayurveda-blush/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-ayurveda-green/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 8C17 8 14 6 12 8C10 10 12 14 12 14C12 14 8 12 6 14C4 16 6 20 6 20"
                stroke="#2D6A4F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M17 8C17 8 18 10 16 12C14 14 12 14 12 14"
                stroke="#2D6A4F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 14C12 14 14 12 16 10"
                stroke="#2D6A4F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 14C12 14 10 13 8 15"
                stroke="#2D6A4F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold text-ayurveda-navy leading-tight">
              AGNIVESH
            </span>
            <span className="font-serif text-xs tracking-widest text-ayurveda-green leading-tight">
              AYURVEDA
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "text-ayurveda-green"
                  : "text-ayurveda-navy/70 hover:text-ayurveda-green"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Phone */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${clinicInfo.phone.replace(/\D/g, "")}`}
            className="flex items-center gap-2 text-sm text-ayurveda-navy/70 hover:text-ayurveda-green transition-colors"
          >
            <Phone size={16} />
            <span>{clinicInfo.phone}</span>
          </a>
          <Link href="/book" className="btn-primary text-sm !px-5 !py-2">
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-ayurveda-navy"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-ayurveda-blush/50 px-6 pb-6 pt-4 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block py-3 text-base font-medium border-b border-ayurveda-blush/30 ${
                pathname === link.href
                  ? "text-ayurveda-green"
                  : "text-ayurveda-navy/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={`tel:${clinicInfo.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-2 text-ayurveda-navy/70"
            >
              <Phone size={16} />
              <span>{clinicInfo.phone}</span>
            </a>
            <Link href="/book" className="btn-primary text-center text-sm">
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
