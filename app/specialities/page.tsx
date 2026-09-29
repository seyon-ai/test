import Link from "next/link";
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
        <div className="max-w-7xl mx-auto space-y-12">
          {specialities.map((spec, i) => (
            <div
              key={spec.id}
              className={`grid md:grid-cols-3 gap-10 items-start ${
                i % 2 === 1 ? "md:direction-rtl" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="sticky top-32">
                  <div className="w-20 h-20 rounded-2xl bg-ayurveda-green/10 flex items-center justify-center text-4xl mb-4">
                    {spec.icon}
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-ayurveda-navy mb-3">
                    {spec.category}
                  </h2>
                  <p className="text-ayurveda-navy/60 text-sm">
                    {spec.conditions.length} conditions treated under this
                    speciality
                  </p>
                </div>
              </div>

              <div
                className={`md:col-span-2 space-y-4 ${
                  i % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                {spec.conditions.map((cond) => (
                  <Link
                    key={cond.id}
                    href={`/specialities/${spec.id}/${cond.id}`}
                    className="block bg-ayurveda-cream/50 rounded-2xl p-6 border border-ayurveda-blush/50 card-hover group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-ayurveda-navy group-hover:text-ayurveda-green transition-colors">
                          {cond.name}
                        </h3>
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
