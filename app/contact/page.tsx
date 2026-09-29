import { clinicInfo } from "@/lib/data";
import { Phone, Mail, MapPin, Clock, Leaf, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Contact Us — Agnivesh Ayurveda and Panchakarma Centre",
  description: "Visit us at Sarenga, Bankura. Phone, address, and clinic hours.",
};

export default function ContactPage() {
  return (
    <>
      <section className="section-padding bg-gradient-to-br from-ayurveda-cream to-white pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
            Reach Out
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ayurveda-navy mb-4">
            Contact <span className="text-ayurveda-green">Us</span>
          </h1>
          <div className="leaf-divider">
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
            <Leaf className="text-ayurveda-green" size={20} />
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
          </div>
          <p className="text-ayurveda-navy/60 max-w-xl mx-auto mt-6">
            We'd love to hear from you. Visit our clinic, call us, or send an email.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white pt-8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">
          {/* Clinic Address — prominent, fixed */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl font-bold text-ayurveda-navy mb-6">
              Visit Our Clinic
            </h2>

            {/* Featured Address Card */}
            <div className="bg-gradient-to-br from-ayurveda-green-dark to-ayurveda-green rounded-3xl p-8 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
              {/* Decorative leaf */}
              <svg className="absolute -right-6 -top-6 opacity-10" width="180" height="180" viewBox="0 0 200 200" fill="none">
                <path d="M100 20 Q140 50 100 100 Q60 50 100 20" fill="white" />
                <path d="M100 100 Q150 130 100 180 Q50 130 100 100" fill="white" />
                <path d="M100 20 Q80 60 100 100" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M100 100 Q80 140 100 180" stroke="white" strokeWidth="1.5" fill="none" />
              </svg>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <MapPin className="text-ayurveda-sage" size={26} />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-ayurveda-sage font-medium mb-2">
                    Clinic Address
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight mb-2">
                    Agnivesh Ayurveda and Panchakarma Centre
                  </h3>
                  <p className="text-white/85 text-base leading-relaxed">
                    Sarenga–Goaltore Road,<br />
                    Sarenga, Bankura – 722150<br />
                    West Bengal, India
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${clinicInfo.googleMapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 bg-white text-ayurveda-green px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-ayurveda-sage transition-colors"
                  >
                    <MapPin size={16} />
                    Get Directions
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <a
                href={`tel:${clinicInfo.phone.replace(/\D/g, "")}`}
                className="flex items-start gap-4 p-5 bg-ayurveda-cream/50 rounded-2xl card-hover group border border-ayurveda-blush/50"
              >
                <div className="w-12 h-12 rounded-xl bg-ayurveda-green/10 flex items-center justify-center shrink-0">
                  <Phone className="text-ayurveda-green" size={22} />
                </div>
                <div>
                  <h3 className="font-medium text-ayurveda-navy mb-1">
                    Phone
                  </h3>
                  <p className="text-ayurveda-green font-semibold text-lg">
                    {clinicInfo.phone}
                  </p>
                  <p className="text-ayurveda-navy/50 text-sm mt-1">
                    Tap to call
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${clinicInfo.email}`}
                className="flex items-start gap-4 p-5 bg-ayurveda-cream/50 rounded-2xl card-hover group border border-ayurveda-blush/50"
              >
                <div className="w-12 h-12 rounded-xl bg-ayurveda-green/10 flex items-center justify-center shrink-0">
                  <Mail className="text-ayurveda-green" size={22} />
                </div>
                <div>
                  <h3 className="font-medium text-ayurveda-navy mb-1">
                    Email
                  </h3>
                  <p className="text-ayurveda-green font-medium">
                    {clinicInfo.email}
                  </p>
                  <p className="text-ayurveda-navy/50 text-sm mt-1">
                    We respond within 24 hours
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-5 bg-ayurveda-cream/50 rounded-2xl border border-ayurveda-blush/50">
                <div className="w-12 h-12 rounded-xl bg-ayurveda-green/10 flex items-center justify-center shrink-0">
                  <Clock className="text-ayurveda-green" size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-ayurveda-navy mb-3">
                    Clinic Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    {clinicInfo.hours.map((h, i) => (
                      <div
                        key={i}
                        className="flex justify-between gap-6 text-ayurveda-navy/70"
                      >
                        <span>{h.day}</span>
                        <span className="font-medium text-ayurveda-navy">
                          {h.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Info */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-ayurveda-navy mb-6">
              Why Visit Us
            </h2>
            <div className="bg-ayurveda-cream/40 rounded-2xl p-6 border border-ayurveda-blush/50 mb-6">
              <ul className="space-y-4">
                {[
                  { title: "In-Person Pulse Diagnosis", desc: "Traditional Nadi Pariksha for accurate Prakriti assessment" },
                  { title: "Panchakarma Therapies", desc: "Full suite of detoxification treatments at our centre" },
                  { title: "Personal Consultations", desc: "One-on-one time with our experienced Ayurvedic doctors" },
                  { title: "Authentic Herbal Medicines", desc: "Classical formulations prepared following traditional methods" },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-ayurveda-green/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Leaf size={12} className="text-ayurveda-green" />
                    </div>
                    <div>
                      <div className="font-medium text-ayurveda-navy text-sm">{item.title}</div>
                      <div className="text-ayurveda-navy/60 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${clinicInfo.googleMapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white rounded-2xl p-6 border-2 border-ayurveda-green/20 hover:border-ayurveda-green card-hover text-center group"
            >
              <MapPin className="text-ayurveda-green mx-auto mb-3" size={32} />
              <div className="font-serif font-semibold text-ayurveda-navy mb-1">
                Open in Google Maps
              </div>
              <div className="text-xs text-ayurveda-navy/60 mb-3">
                Sarenga, Bankura – 722150
              </div>
              <span className="text-ayurveda-green text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Get Directions <ExternalLink size={14} />
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
