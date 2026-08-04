import Link from "next/link";
import Image from "next/image";
import { doctors, specialities, whyChooseUs, clinicInfo } from "@/lib/data";
import { ArrowRight, Video, MapPin, Star, Leaf, Phone, Clock } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-white via-ayurveda-cream to-ayurveda-blush">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-[0.07]">
        <Image
          src="/images/herbs-ayurvedic.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Decorative leaves */}
      <div className="absolute top-20 right-10 opacity-10 animate-float">
        <svg width="120" height="200" viewBox="0 0 120 200" fill="none">
          <path d="M60 10 Q80 40 60 80 Q40 40 60 10" fill="#2D6A4F" />
          <path d="M60 80 Q90 100 60 140 Q30 100 60 80" fill="#2D6A4F" />
          <path d="M60 140 Q80 160 60 190 Q40 160 60 140" fill="#2D6A4F" />
        </svg>
      </div>
      <div className="absolute bottom-20 left-10 opacity-5 animate-float" style={{ animationDelay: "3s" }}>
        <svg width="80" height="150" viewBox="0 0 80 150" fill="none">
          <path d="M40 5 Q55 30 40 60 Q25 30 40 5" fill="#2D6A4F" />
          <path d="M40 60 Q60 75 40 100 Q20 75 40 60" fill="#2D6A4F" />
          <path d="M40 100 Q55 115 40 145 Q25 115 40 100" fill="#2D6A4F" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-ayurveda-green/10 text-ayurveda-green px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf size={16} />
            <span>Classical Ayurvedic Healthcare & Panchakarma</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ayurveda-navy leading-tight mb-6">
            Your Health,{" "}
            <span className="text-ayurveda-green">Our Concern</span>
          </h1>
          <p className="text-lg text-ayurveda-navy/70 leading-relaxed mb-8 max-w-xl">
            Authentic Ayurvedic treatments & Panchakarma therapies rooted in classical wisdom. Our
            experienced panel of doctors offers personalized,
            root-cause healing — both online and in-person.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/book" className="btn-primary inline-flex items-center gap-2">
              Book Appointment
              <ArrowRight size={18} />
            </Link>
            <Link href="/specialities" className="btn-secondary inline-flex items-center gap-2">
              Explore Treatments
            </Link>
          </div>
          <div className="flex items-center gap-8 mt-10 pt-8 border-t border-ayurveda-navy/10">
            <div>
              <div className="font-serif text-2xl font-bold text-ayurveda-green">2</div>
              <div className="text-xs text-ayurveda-navy/60">Expert Doctors</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-ayurveda-green">4+</div>
              <div className="text-xs text-ayurveda-navy/60">Specialities</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-ayurveda-green">15+</div>
              <div className="text-xs text-ayurveda-navy/60">Conditions Treated</div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center lg:justify-end animate-slide-up">
          <div className="relative">
            <div className="absolute -inset-4 bg-ayurveda-green/5 rounded-[2rem] transform rotate-3"></div>
            <div className="relative bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 border border-ayurveda-blush/50">
              <Image
                src="/images/logo.jpg"
                alt="Agnivesh Ayurveda Logo"
                width={320}
                height={320}
                className="w-auto h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ayurveda-navy mb-4">
            Authentic Ayurvedic Care,{" "}
            <span className="text-ayurveda-green">Reimagined</span>
          </h2>
          <div className="leaf-divider">
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
            <Leaf className="text-ayurveda-green" size={20} />
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((item, i) => (
            <div
              key={i}
              className="bg-ayurveda-cream/50 rounded-2xl p-8 card-hover border border-ayurveda-blush/50"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-serif text-xl font-semibold text-ayurveda-navy mb-3">
                {item.title}
              </h3>
              <p className="text-ayurveda-navy/60 leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorsMarquee() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-ayurveda-cream/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-14 text-center">
        <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
          Our Doctors
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-ayurveda-navy mb-4">
          Meet Your Healing Guides
        </h2>
        <div className="leaf-divider">
          <span className="w-12 h-px bg-ayurveda-green/30"></span>
          <Leaf className="text-ayurveda-green" size={20} />
          <span className="w-12 h-px bg-ayurveda-green/30"></span>
        </div>
        <p className="text-ayurveda-navy/60 max-w-xl mx-auto mt-4 text-sm">
          Experienced Ayurvedic physicians dedicated to your well-being — both online and in-person.
        </p>
      </div>

      {/* Marquee Track */}
      <div className="relative">
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-ayurveda-cream/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-ayurveda-cream/60 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
          {[...doctors, ...doctors, ...doctors].map((doc, i) => (
            <Link
              key={`${doc.id}-${i}`}
              href={`/doctors/${doc.id}`}
              className="shrink-0 w-[340px] group"
            >
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-ayurveda-blush/30 card-hover h-full">
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={doc.photo}
                    alt={doc.name}
                    fill
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Name overlay on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-serif text-xl font-bold leading-tight">
                      {doc.name}
                    </h3>
                    <p className="text-white/80 text-sm mt-1 font-medium">
                      {doc.qualification}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-ayurveda-navy">Available</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <p className="text-ayurveda-navy/70 text-sm leading-relaxed line-clamp-2">
                    {doc.role}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ayurveda-blush/50">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-medium text-ayurveda-navy">{doc.experience}</span>
                    </div>
                    <span className="text-ayurveda-navy/30">·</span>
                    <div className="flex items-center gap-1 text-xs text-ayurveda-navy/60">
                      <Video size={12} />
                      <span>Tele & OPD</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-ayurveda-green text-xs font-medium">
                      View Profile
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <Link href="/doctors" className="btn-secondary inline-flex items-center gap-2">
          View All Doctors
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function SpecialitiesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
            What We Treat
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ayurveda-navy mb-4">
            Our Specialities
          </h2>
          <div className="leaf-divider">
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
            <Leaf className="text-ayurveda-green" size={20} />
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
          </div>
          <p className="text-ayurveda-navy/60 max-w-xl mx-auto mt-4 text-sm">
            Comprehensive Ayurvedic care across multiple specialities — treating root causes, not just symptoms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {specialities.map((spec) => (
            <Link
              key={spec.id}
              href={`/specialities/${spec.id}`}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-ayurveda-blush/30 card-hover"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={spec.image}
                  alt={spec.category}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ayurveda-green-dark/80 via-ayurveda-green-dark/30 to-transparent" />
                
                {/* Icon */}
                <div className="absolute top-5 right-5 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">
                  {spec.icon}
                </div>

                {/* Title on image */}
                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight">
                    {spec.category}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {spec.conditions.length} conditions treated
                  </p>
                </div>
              </div>

              {/* Conditions preview */}
              <div className="p-6">
                <ul className="space-y-2">
                  {spec.conditions.slice(0, 3).map((cond) => (
                    <li
                      key={cond.id}
                      className="flex items-start gap-2.5 text-sm text-ayurveda-navy/70"
                    >
                      <Leaf size={12} className="text-ayurveda-green mt-1 shrink-0" />
                      <div>
                        <span className="font-medium text-ayurveda-navy">
                          {cond.name}
                        </span>{" "}
                        <span className="text-ayurveda-navy/40">—</span>{" "}
                        <span className="text-ayurveda-navy/60">{cond.englishName}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-ayurveda-green font-medium text-sm mt-5 group-hover:gap-3 transition-all">
                  View all conditions <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationModes() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background with panchakarma image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-panchakarma.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ayurveda-green-dark/95 via-ayurveda-green/90 to-ayurveda-green-dark/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-14">
          <span className="inline-block text-ayurveda-sage font-medium text-sm tracking-wider uppercase mb-3">
            Flexible Consultations
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Choose How You{" "}
            <span className="text-ayurveda-sage">Consult</span>
          </h2>
          <div className="leaf-divider">
            <span className="w-12 h-px bg-white/30"></span>
            <Leaf className="text-ayurveda-sage" size={20} />
            <span className="w-12 h-px bg-white/30"></span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 card-hover group">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Video className="text-ayurveda-sage" size={28} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-3">
              Teleconsultation
            </h3>
            <p className="text-white/75 text-sm leading-relaxed mb-6">
              Consult from the comfort of your home via video or phone call.
              Perfect for follow-ups, second opinions, and remote patients.
              Get prescriptions delivered to your doorstep.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-white text-ayurveda-green px-6 py-3 rounded-full font-semibold hover:bg-ayurveda-sage transition-colors"
            >
              Book Online <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 card-hover group">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MapPin className="text-ayurveda-sage" size={28} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-3">
              OPD Visit
            </h3>
            <p className="text-white/75 text-sm leading-relaxed mb-6">
              Visit our clinic for in-person consultation with detailed physical
              examination, pulse diagnosis (Nadi Pariksha), and hands-on
              treatment planning.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-white text-ayurveda-green px-6 py-3 rounded-full font-semibold hover:bg-ayurveda-sage transition-colors"
            >
              Book In-Person <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PanchakarmaSection() {
  return (
    <section className="section-padding bg-ayurveda-cream/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
            <Image
              src="/images/hero-panchakarma.jpg"
              alt="Panchakarma Therapy"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ayurveda-green-dark/30 to-transparent" />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3">
              <div className="text-xs text-ayurveda-green font-semibold uppercase tracking-wider">Classical Therapy</div>
              <div className="font-serif text-lg font-bold text-ayurveda-navy">Panchakarma Centre</div>
            </div>
          </div>
          
          <div>
            <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
              Detoxification & Rejuvenation
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ayurveda-navy mb-4">
              Panchakarma{" "}
              <span className="text-ayurveda-green">Therapies</span>
            </h2>
            <div className="leaf-divider justify-start">
              <span className="w-12 h-px bg-ayurveda-green/30"></span>
              <Leaf className="text-ayurveda-green" size={20} />
              <span className="w-12 h-px bg-ayurveda-green/30"></span>
            </div>
            <p className="text-ayurveda-navy/70 leading-relaxed mb-6">
              Our centre offers the complete classical Panchakarma — Ayurveda's most powerful 
              five-fold detoxification and rejuvenation therapy, administered under qualified 
              medical supervision for deep healing.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {["Vamana", "Virechana", "Basti", "Nasya", "Raktamokshana"].map((therapy) => (
                <div key={therapy} className="flex items-center gap-2 text-sm text-ayurveda-navy/80">
                  <Leaf size={14} className="text-ayurveda-green" />
                  <span>{therapy}</span>
                </div>
              ))}
            </div>
            <Link href="/book" className="btn-primary inline-flex items-center gap-2">
              Book Panchakarma Consultation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="section-padding bg-ayurveda-cream">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-ayurveda-navy mb-4">
          Ready to Begin Your Healing Journey?
        </h2>
        <p className="text-ayurveda-navy/60 mb-8 max-w-xl mx-auto">
          Take the first step toward authentic, root-cause Ayurvedic treatment.
          Book your consultation today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/book" className="btn-primary inline-flex items-center gap-2">
            <Phone size={18} />
            Book Appointment
          </Link>
          <a
            href={`tel:${clinicInfo.phone.replace(/\D/g, "")}`}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Clock size={18} />
            Call {clinicInfo.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyChooseUsSection />
      <DoctorsMarquee />
      <SpecialitiesSection />
      <PanchakarmaSection />
      <ConsultationModes />
      <CTASection />
    </>
  );
}
