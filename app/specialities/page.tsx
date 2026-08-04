import Link from "next/link";
import Image from "next/image";
import { specialities } from "@/lib/data";
import { Leaf, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Specialities — Agnivesh Ayurveda",
  description: "Explore our Ayurvedic specialities covering digestive, musculoskeletal, anorectal & hormonal disorders.",
};

export default function SpecialitiesPage() {
  return (
    <>
      <section className="section-padding bg-gradient-to-br from-ayurveda-cream to-white pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
            Treatments
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ayurveda-navy mb-4">
            Our <span className="text-ayurveda-green">Specialities</span>
          </h1>
          <div className="leaf-divider">
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
            <Leaf className="text-ayurveda-green" size={20} />
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
          </div>
          <p className="text-ayurveda-navy/60 max-w-2xl mx-auto mt-6">
            We offer comprehensive Ayurvedic treatment across multiple
            specialities, addressing root causes rather than just symptoms.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white pt-8">
        <div className="max-w-7xl mx-auto space-y-14">
          {specialities.map((spec, i) => (
            <div
              key={spec.id}
              className={`grid lg:grid-cols-5 gap-10 items-start ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image */}
              <div className={`lg:col-span-2 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="sticky top-32">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                    <Image
                      src={spec.image}
                      alt={spec.category}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ayurveda-green-dark/40 to-transparent" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">
                      {spec.icon}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h2 className="font-serif text-xl md:text-2xl font-bold leading-tight">
                        {spec.category}
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        {spec.conditions.length} conditions treated
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className={`lg:col-span-3 space-y-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                {spec.conditions.map((cond) => (
                  <Link
                    key={cond.id}
                    href={`/specialities/${spec.id}/${cond.id}`}
                    className="block bg-ayurveda-cream/50 rounded-2xl p-6 border border-ayurveda-blush/50 card-hover group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-serif text-lg font-semibold text-ayurveda-navy group-hover:text-ayurveda-green transition-colors">
                            {cond.name}
                          </h3>
                          <span className="text-xs bg-ayurveda-green/10 text-ayurveda-green px-2 py-0.5 rounded-full">
                            {cond.sanskritName}
                          </span>
                        </div>
                        <p className="text-ayurveda-green text-sm font-medium mt-1">
                          {cond.englishName}
                        </p>
                        <p className="text-ayurveda-navy/60 text-sm mt-2 line-clamp-2">
                          {cond.description}
                        </p>
                      </div>
                      <ArrowRight
                        size={20}
                        className="text-ayurveda-green/40 group-hover:text-ayurveda-green group-hover:translate-x-1 transition-all shrink-0 mt-1"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
