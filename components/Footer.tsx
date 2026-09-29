import Link from "next/link";
import { Phone, MapPin, Leaf } from "lucide-react";
import { clinicInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-ayurveda-green-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg width="28" height="34" viewBox="0 0 100 120">
                <path d="M50 10 Q55 30 50 50 Q45 30 50 10" fill="white" />
                <path d="M50 30 Q70 25 75 35 Q65 40 50 40" fill="white" opacity="0.85" />
                <path d="M50 40 Q30 35 25 45 Q35 50 50 48" fill="white" opacity="0.85" />
                <path d="M50 50 Q75 48 78 58 Q65 62 50 58" fill="white" opacity="0.8" />
                <path d="M50 58 Q25 56 22 66 Q35 70 50 66" fill="white" opacity="0.8" />
              </svg>
              <div>
                <div className="font-serif text-lg font-bold">AGNIVESH</div>
                <div className="text-xs tracking-widest text-ayurveda-sage">
                  AYURVEDA
                </div>
              </div>
            </div>
              <p className="text-white/70 text-sm leading-relaxed">
              {clinicInfo.tagline}. Authentic Ayurvedic & Panchakarma healthcare rooted in
              classical wisdom, delivered with modern compassion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link href="/specialities" className="hover:text-white transition-colors">
                  Specialities
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-white transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialities */}
          <div>
            <h4 className="font-serif text-base font-semibold mb-4">
              We Treat
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Digestive Disorders</li>
              <li>Joint & Bone Diseases</li>
              <li>Anorectal Disorders</li>
              <li>Hormonal Imbalances</li>
              <li>Metabolic Conditions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-base font-semibold mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0" />
                <a href={`tel:${clinicInfo.phone.replace(/\D/g, "")}`} className="hover:text-white transition-colors">
                  {clinicInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{clinicInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {clinicInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Leaf size={12} />
            <span>Rooted in tradition, guided by science</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
