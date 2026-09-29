import { doctors } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Star, Calendar, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return doctors.map((d) => ({ id: d.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const doc = doctors.find((d) => d.id === params.id);
  if (!doc) return { title: "Doctor Not Found" };
  return {
    title: `${doc.name} — Agnivesh Ayurveda`,
    description: `${doc.name}, ${doc.role}. ${doc.experience} of experience.`,
  };
}

export default function DoctorProfile({ params }: { params: { id: string } }) {
  const doc = doctors.find((d) => d.id === params.id);
  if (!doc) notFound();

  return (
    <>
      <section className="section-padding bg-gradient-to-br from-ayurveda-cream to-white">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-ayurveda-green text-sm font-medium mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} /> Back to Doctors
          </Link>

          <div className="grid md:grid-cols-5 gap-10 items-start">
            {/* Photo */}
            <div className="md:col-span-2">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[3/4]">
                <Image
                  src={doc.photo}
                  alt={doc.name}
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ayurveda-green-dark/30 to-transparent" />
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-3">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-ayurveda-navy mb-2">
                {doc.name}
              </h1>
              <p className="text-ayurveda-green font-medium text-lg">
                {doc.qualification}
              </p>
              <p className="text-ayurveda-navy/60 mt-1">{doc.role}</p>

              <div className="leaf-divider justify-start mt-6">
                <span className="w-12 h-px bg-ayurveda-green/30"></span>
                <Leaf className="text-ayurveda-green" size={20} />
                <span className="w-12 h-px bg-ayurveda-green/30"></span>
              </div>

              <div className="bg-ayurveda-cream/60 rounded-2xl p-6 mt-6">
                <div className="flex items-center gap-2 text-sm text-ayurveda-navy/70">
                  <Star size={16} className="text-ayurveda-green fill-ayurveda-green" />
                  <span className="font-medium">{doc.experience} experience</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-serif text-xl font-semibold text-ayurveda-navy mb-3">
                  About
                </h3>
                <p className="text-ayurveda-navy/70 leading-relaxed">
                  {doc.bio}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="font-serif text-xl font-semibold text-ayurveda-navy mb-4">
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doc.specialities.map((s) => (
                    <span
                      key={s}
                      className="bg-ayurveda-green/10 text-ayurveda-green text-sm px-4 py-2 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/book"
                className="btn-primary inline-flex items-center gap-2 mt-10"
              >
                <Calendar size={18} />
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
