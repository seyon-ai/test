import { specialities } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Leaf, ArrowRight, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return specialities.map((s) => ({ category: s.id }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const spec = specialities.find((s) => s.id === params.category);
  if (!spec) return { title: "Category Not Found" };
  return {
    title: `${spec.category} — Agnivesh Ayurveda`,
    description: `Ayurvedic treatments for ${spec.category.toLowerCase()}.`,
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const spec = specialities.find((s) => s.id === params.category);
  if (!spec) notFound();

  return (
    <>
      {/* Hero with image */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        <Image
          src={spec.image}
          alt={spec.category}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ayurveda-green-dark/90 via-ayurveda-green-dark/60 to-ayurveda-green-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ayurveda-green-dark/50 to-transparent" />
        
        <div className="relative z-10 h-full max-w-5xl mx-auto px-6 md:px-12 flex items-end pb-10">
          <div className="text-white">
            <Link
              href="/specialities"
              className="inline-flex items-center gap-2 text-white/80 text-sm font-medium mb-4 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> All Specialities
            </Link>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">
                {spec.icon}
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                  {spec.category}
                </h1>
                <p className="text-white/80 text-sm mt-1">
                  {spec.conditions.length} conditions treated with classical Ayurveda
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions List */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto space-y-6">
          {spec.conditions.map((cond) => (
            <Link
              key={cond.id}
              href={`/specialities/${spec.id}/${cond.id}`}
              className="block bg-gradient-to-r from-ayurveda-cream/60 to-white rounded-2xl p-8 border border-ayurveda-blush/50 card-hover group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-ayurveda-navy group-hover:text-ayurveda-green transition-colors">
                      {cond.name}
                    </h2>
                    <span className="text-xs bg-ayurveda-green/10 text-ayurveda-green px-2 py-0.5 rounded-full">
                      {cond.sanskritName}
                    </span>
                  </div>
                  <p className="text-ayurveda-green font-medium text-sm mt-1">
                    {cond.englishName}
                  </p>
                  <p className="text-ayurveda-navy/60 text-sm mt-3 max-w-2xl">
                    {cond.description}
                  </p>
                </div>
                <ArrowRight
                  size={24}
                  className="text-ayurveda-green/40 group-hover:text-ayurveda-green group-hover:translate-x-2 transition-all shrink-0"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
