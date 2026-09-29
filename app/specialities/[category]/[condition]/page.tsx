import { specialities } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Leaf, ArrowLeft, ArrowRight, Calendar, CheckCircle } from "lucide-react";

export function generateStaticParams() {
  const params: { category: string; condition: string }[] = [];
  specialities.forEach((s) =>
    s.conditions.forEach((c) =>
      params.push({ category: s.id, condition: c.id })
    )
  );
  return params;
}

export function generateMetadata({
  params,
}: {
  params: { category: string; condition: string };
}) {
  const spec = specialities.find((s) => s.id === params.category);
  const cond = spec?.conditions.find((c) => c.id === params.condition);
  if (!cond) return { title: "Condition Not Found" };
  return {
    title: `${cond.name} Treatment — Agnivesh Ayurveda`,
    description: `Ayurvedic treatment for ${cond.englishName}.`,
  };
}

export default function ConditionPage({
  params,
}: {
  params: { category: string; condition: string };
}) {
  const spec = specialities.find((s) => s.id === params.category);
  const cond = spec?.conditions.find((c) => c.id === params.condition);
  if (!cond || !spec) notFound();

  return (
    <>
      <section className="section-padding bg-gradient-to-br from-ayurveda-cream to-white pb-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/specialities/${spec.id}`}
            className="inline-flex items-center gap-2 text-ayurveda-green text-sm font-medium mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} /> Back to {spec.category}
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{spec.icon}</span>
            <span className="text-sm text-ayurveda-green font-medium uppercase tracking-wider">
              {spec.category}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-ayurveda-navy mb-2">
            {cond.name}
          </h1>
          <p className="text-xl text-ayurveda-green font-medium">
            {cond.englishName}
          </p>
          <p className="text-sm text-ayurveda-navy/50 mt-1 italic">
            Sanskrit: {cond.sanskritName}
          </p>

          <div className="leaf-divider justify-start mt-6">
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
            <Leaf className="text-ayurveda-green" size={20} />
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white pt-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* What It Is */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-ayurveda-navy mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-ayurveda-green/10 flex items-center justify-center">
                <Leaf size={16} className="text-ayurveda-green" />
              </div>
              What Is {cond.name}?
            </h2>
            <p className="text-ayurveda-navy/70 leading-relaxed text-lg">
              {cond.description}
            </p>
          </div>

          {/* Symptoms */}
          <div className="bg-ayurveda-cream/60 rounded-2xl p-8">
            <h2 className="font-serif text-2xl font-bold text-ayurveda-navy mb-6">
              Common Symptoms
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {cond.symptoms.map((symptom, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle
                    size={20}
                    className="text-ayurveda-green mt-0.5 shrink-0"
                  />
                  <span className="text-ayurveda-navy/70">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ayurvedic Approach */}
          <div className="bg-gradient-to-br from-ayurveda-green-dark to-ayurveda-green rounded-2xl p-8 md:p-10 text-white">
            <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Leaf size={16} />
              </div>
              Ayurvedic Approach
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              {cond.approach}
            </p>
          </div>

          {/* CTA */}
          <div className="bg-ayurveda-cream/40 rounded-2xl p-8 text-center">
            <h3 className="font-serif text-xl font-bold text-ayurveda-navy mb-3">
              Seeking Treatment for {cond.name}?
            </h3>
            <p className="text-ayurveda-navy/60 text-sm mb-6">
              Our experienced Ayurvedic doctors can create a personalized
              treatment plan for you.
            </p>
            <Link href="/book" className="btn-primary inline-flex items-center gap-2">
              <Calendar size={18} />
              Book Your Consultation
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
