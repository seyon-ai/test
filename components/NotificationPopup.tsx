"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Leaf } from "lucide-react";
import Link from "next/link";

export default function NotificationPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show after 8 seconds if not dismissed
    const timer = setTimeout(() => {
      if (!dismissed) setShow(true);
    }, 8000);

    // Auto-hide after 6 seconds
    const hideTimer = setTimeout(() => {
      setShow(false);
    }, 14000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [dismissed]);

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-6 z-40 max-w-sm animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-ayurveda-blush/50 p-5 relative overflow-hidden">
        {/* Green accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ayurveda-green to-ayurveda-green-light" />

        {/* Close button */}
        <button
          onClick={() => {
            setShow(false);
            setDismissed(true);
          }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-ayurveda-cream/50 flex items-center justify-center text-ayurveda-navy/40 hover:text-ayurveda-navy hover:bg-ayurveda-blush transition-colors"
        >
          <X size={14} />
        </button>

        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-ayurveda-green/10 flex items-center justify-center shrink-0">
            <Leaf className="text-ayurveda-green" size={24} />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="font-serif font-bold text-ayurveda-navy text-base mb-1">
              Book Your Consultation
            </h3>
            <p className="text-ayurveda-navy/60 text-sm leading-relaxed">
              Start your healing journey with our expert Ayurvedic doctors.
              Teleconsultation & OPD visits available.
            </p>
            <Link
              href="/book"
              onClick={() => setShow(false)}
              className="inline-flex items-center gap-1.5 text-ayurveda-green text-sm font-semibold mt-3 hover:gap-2.5 transition-all"
            >
              <Calendar size={14} />
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
