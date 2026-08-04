import Image from "next/image";
import Link from "next/link";
import { Leaf, Heart, Target, BookOpen, Users, ArrowRight } from "lucide-react";
import { clinicInfo, whyChooseUs } from "@/lib/data";

export const metadata = {
  title: "About Us — Agnivesh Ayurveda",
  description: "Learn about Agnivesh Ayurveda — our story, mission, and commitment to authentic Ayurvedic healthcare.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-ayurveda-cream to-white pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
            Our Story
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ayurveda-navy mb-4">
            About <span className="text-ayurveda-green">Agnivesh</span>
          </h1>
          <div className="leaf-divider">
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
            <Leaf className="text-ayurveda-green" size={20} />
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
          </div>
          <p className="text-ayurveda-navy/60 max-w-2xl mx-auto mt-6 text-lg">
            Rooted in ancient wisdom, guided by modern science — delivering
            authentic Ayurvedic healthcare with compassion.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white pt-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="bg-ayurveda-cream/50 rounded-3xl p-4 shadow-lg">
              <Image
                src="/images/logo.png"
                alt="Agnivesh Ayurveda"
                width={400}
                height={400}
                className="rounded-2xl w-full h-auto"
              />
            </div>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-ayurveda-navy mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-ayurveda-navy/70 leading-relaxed">
              <p>
                Agnivesh Ayurveda was founded with a simple yet powerful
                belief: that authentic Ayurvedic healthcare — rooted in the
                classical texts of Charaka, Sushruta, and Vagbhata — can
                address the root causes of modern ailments when delivered with
                genuine expertise and compassion.
              </p>
              <p>
                Our name honors <strong>Agnivesh</strong>, the revered sage and
                foremost disciple of Maharshi Atreya, who compiled the
                foundational teachings that later became the Charaka Samhita —
                one of the most authoritative texts of Ayurvedic medicine.
              </p>
              <p>
                Today, under the guidance of our experienced panel of doctors,
                we continue this ancient tradition of healing — combining
                time-tested Ayurvedic principles with a modern understanding of
                health, to offer personalized treatments that truly transform
                lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-ayurveda-cream/40">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-ayurveda-green/10 flex items-center justify-center mb-6">
              <Target className="text-ayurveda-green" size={28} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-ayurveda-navy mb-4">
              Our Mission
            </h3>
            <p className="text-ayurveda-navy/70 leading-relaxed">
              To make authentic, root-cause Ayurvedic treatment accessible to
              everyone — through affordable pricing, flexible consultation
              options, and a patient-first approach that honors both ancient
              wisdom and individual needs.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-ayurveda-green/10 flex items-center justify-center mb-6">
              <Heart className="text-ayurveda-green" size={28} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-ayurveda-navy mb-4">
              Our Vision
            </h3>
            <p className="text-ayurveda-navy/70 leading-relaxed">
              To be the most trusted name in Ayurvedic healthcare — where
              patients receive not just treatment, but true healing; where
              every consultation is a step toward lasting wellness rooted in
              nature and guided by science.
            </p>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
              Our Philosophy
            </span>
            <h2 className="font-serif text-3xl font-bold text-ayurveda-navy mb-4">
              The Ayurvedic Approach
            </h2>
            <div className="leaf-divider">
              <span className="w-12 h-px bg-ayurveda-green/30"></span>
              <Leaf className="text-ayurveda-green" size={20} />
              <span className="w-12 h-px bg-ayurveda-green/30"></span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen size={24} />,
                title: "Classical Foundation",
                desc: "Every treatment protocol is rooted in the classical Ayurvedic texts — Charaka Samhita, Sushruta Samhita, and Ashtanga Hridayam.",
              },
              {
                icon: <Users size={24} />,
                title: "Personalized Care",
                desc: "We assess your unique Prakriti (body constitution), Vikriti (current imbalance), and lifestyle to craft individualized treatment plans.",
              },
              {
                icon: <Leaf size={24} />,
                title: "Natural Healing",
                desc: "We use authentic herbal formulations, Panchakarma therapies, dietary guidance, and lifestyle modifications — all natural, no shortcuts.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-ayurveda-cream/50 rounded-2xl p-8 border border-ayurveda-blush/50 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-ayurveda-green/10 flex items-center justify-center text-ayurveda-green mb-4">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-ayurveda-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-ayurveda-navy/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-ayurveda-cream/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl font-bold text-ayurveda-navy">
              Why Patients Trust Us
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm card-hover"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-serif text-lg font-semibold text-ayurveda-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-ayurveda-navy/60 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-ayurveda-green-dark to-ayurveda-green text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Begin Your Healing Journey Today
          </h2>
          <p className="text-white/70 mb-8">
            Experience authentic Ayurvedic care with our expert doctors.
          </p>
          <Link href="/book" className="inline-flex items-center gap-2 bg-white text-ayurveda-green px-8 py-3 rounded-full font-medium hover:bg-ayurveda-sage transition-colors">
            Book Appointment <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
