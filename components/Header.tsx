"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone, User, LogOut, Shield } from "lucide-react";
import { clinicInfo } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, userData, loading, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-ayurveda-blush/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg
            width="32"
            height="38"
            viewBox="0 0 100 120"
            className="text-ayurveda-green group-hover:scale-110 transition-transform"
          >
            <path d="M50 10 Q55 30 50 50 Q45 30 50 10" fill="#2D6A4F" />
            <path d="M50 30 Q70 25 75 35 Q65 40 50 40" fill="#2D6A4F" opacity="0.85" />
            <path d="M50 40 Q30 35 25 45 Q35 50 50 48" fill="#2D6A4F" opacity="0.85" />
            <path d="M50 50 Q75 48 78 58 Q65 62 50 58" fill="#2D6A4F" opacity="0.8" />
            <path d="M50 58 Q25 56 22 66 Q35 70 50 66" fill="#2D6A4F" opacity="0.8" />
            <path d="M50 68 Q72 68 74 76 Q62 78 50 76" fill="#2D6A4F" opacity="0.75" />
            <path d="M50 76 Q28 76 26 84 Q38 86 50 84" fill="#2D6A4F" opacity="0.75" />
            <path d="M50 10 Q48 50 50 90 Q52 100 50 110" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          </svg>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold text-ayurveda-navy leading-tight">
              AGNIVESH
            </span>
            <span className="font-serif text-[10px] tracking-widest text-ayurveda-green leading-tight">
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

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${clinicInfo.phone.replace(/\D/g, "")}`}
            className="flex items-center gap-2 text-sm text-ayurveda-navy/70 hover:text-ayurveda-green transition-colors"
          >
            <Phone size={16} />
            <span>{clinicInfo.phone}</span>
          </a>

          {!loading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-ayurveda-cream/50 rounded-full pl-1 pr-4 py-1 hover:bg-ayurveda-blush transition-colors"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-ayurveda-green/10 flex items-center justify-center">
                        <User size={16} className="text-ayurveda-green" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-ayurveda-navy max-w-[120px] truncate">
                      {user.displayName?.split(" ")[0] || "User"}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-ayurveda-blush/50 py-2 animate-fade-in">
                      <div className="px-4 py-3 border-b border-ayurveda-blush/30">
                        <div className="text-sm font-medium text-ayurveda-navy truncate">
                          {user.displayName || "User"}
                        </div>
                        <div className="text-xs text-ayurveda-navy/50 truncate">
                          {user.email}
                        </div>
                      </div>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-ayurveda-navy hover:bg-ayurveda-cream/50"
                        >
                          <Shield size={16} className="text-ayurveda-green" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth?redirect=/book" className="btn-primary text-sm !px-5 !py-2">
                  Sign In
                </Link>
              )}
            </>
          )}
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
            {!loading &&
              (user ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-ayurveda-green font-medium"
                    >
                      <Shield size={16} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600 font-medium"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth?redirect=/book"
                  className="btn-primary text-center text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In / Sign Up
                </Link>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
