import Link from "next/link";
import Image from "next/image";
import { doctors } from "@/lib/data";
import { Leaf, Star, ArrowRight, Calendar } from "lucide-react";

export const metadata = {
  title: "Our Doctors — Agnivesh Ayurveda",
  description: "Meet our experienced panel of Ayurvedic physicians — Dr. Ayan Patra and Dr. Swati Prasad.",
};

export default function DoctorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-ayurveda-cream to-white pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
            Our Team
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ayurveda-navy mb-4">
            Our <span className="text-ayurveda-green">Doctors</span>
          </h1>
          <div className="leaf-divider">
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
            <Leaf className="text-ayurveda-green" size={20} />
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
          </div>
          <p className="text-ayurveda-navy/60 max-w-2xl mx-auto mt-6">
            Our experienced panel of Ayurvedic physicians brings classical
            wisdom and modern understanding together for your complete
            well-being.
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="section-padding bg-white pt-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-gradient-to-br from-ayurveda-cream/60 to-white rounded-3xl overflow-hidden shadow-lg card-hover border border-ayurveda-blush/50"
            >
              <div className="relative h-80 md:h-96 overflow-hidden">
                <Image
                  src={doc.photo}
                  alt={doc.name}
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ayurveda-green-dark/40 to-transparent" />
              </div>
              <div className="p-8">
                <h2 className="font-serif text-2xl font-bold text-ayurveda-navy mb-2">
                  {doc.name}
                </h2>
                <p className="text-ayurveda-green font-medium text-sm">
                  {doc.qualification}
                </p>
                <p className="text-ayurveda-navy/60 text-sm mt-1">
                  {doc.role}
                </p>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1 text-ayurveda-navy/70">
                    <Star size={14} className="text-ayurveda-green fill-ayurveda-green" />
                    <span>{doc.experience} experience</span>
                  </div>
                </div>

                <p className="text-ayurveda-navy/60 text-sm leading-relaxed mt-4">
                  {doc.bio}
                </p>

                <div className="mt-6">
                  <h4 className="font-medium text-ayurveda-navy text-sm mb-2">
                    Areas of Focus:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {doc.specialities.map((s) => (
                      <span
                        key={s}
                        className="bg-ayurveda-green/10 text-ayurveda-green text-xs px-3 py-1 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/book"
                  className="btn-primary inline-flex items-center gap-2 mt-6 text-sm"
                >
                  <Calendar size={16} />
                  Book Consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-ayurveda-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ayurveda-navy mb-4">
            Not sure which doctor to see?
          </h2>
          <p className="text-ayurveda-navy/60 mb-6">
            Book by treatment/condition and we&apos;ll match you with the right
            specialist.
          </p>
          <Link href="/book" className="btn-primary inline-flex items-center gap-2">
            Book by Treatment <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
