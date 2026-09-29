"use client";

import { useState } from "react";
import { doctors, specialities, clinicInfo } from "@/lib/data";
import { Leaf, Phone, Calendar, Video, MapPin, CheckCircle, User, Clock, FileText } from "lucide-react";

type BookingStep = "mode" | "entry" | "form" | "confirmation";
type ConsultationType = "tele" | "opd" | null;
type EntryPath = "doctor" | "treatment" | null;

export default function BookPage() {
  const [step, setStep] = useState<BookingStep>("mode");
  const [consultationType, setConsultationType] = useState<ConsultationType>(null);
  const [entryPath, setEntryPath] = useState<EntryPath>(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmation");
  };

  const handleReset = () => {
    setStep("mode");
    setConsultationType(null);
    setEntryPath(null);
    setSelectedDoctor("");
    setSelectedSpeciality("");
    setFormData({ name: "", phone: "", date: "", time: "", notes: "" });
  };

  return (
    <>
      <section className="section-padding bg-gradient-to-br from-ayurveda-cream to-white pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-ayurveda-green font-medium text-sm tracking-wider uppercase mb-3">
            Appointments
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ayurveda-navy mb-4">
            Book Your <span className="text-ayurveda-green">Appointment</span>
          </h1>
          <div className="leaf-divider">
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
            <Leaf className="text-ayurveda-green" size={20} />
            <span className="w-12 h-px bg-ayurveda-green/30"></span>
          </div>
          <p className="text-ayurveda-navy/60 max-w-xl mx-auto mt-6">
            Choose your preferred consultation mode and book with ease.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white pt-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {["mode", "entry", "form", "confirmation"].map((s, i) => {
              const isActive = step === s;
              const isDone =
                ["mode", "entry", "form", "confirmation"].indexOf(step) > i;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      isActive
                        ? "bg-ayurveda-green text-white"
                        : isDone
                        ? "bg-ayurveda-green text-white"
                        : "bg-ayurveda-blush text-ayurveda-navy/40"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle size={16} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 3 && (
                    <div
                      className={`w-12 h-px ${
                        isDone ? "bg-ayurveda-green" : "bg-ayurveda-blush"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Consultation Mode */}
          {step === "mode" && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-ayurveda-navy mb-8 text-center">
                Choose Consultation Type
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => {
                    setConsultationType("tele");
                    setStep("entry");
                  }}
                  className="bg-ayurveda-cream/60 rounded-2xl p-8 border-2 border-ayurveda-blush/50 card-hover text-left group hover:border-ayurveda-green"
                >
                  <Video className="text-ayurveda-green mb-4" size={36} />
                  <h3 className="font-serif text-xl font-bold text-ayurveda-navy mb-2">
                    Teleconsultation
                  </h3>
                  <p className="text-ayurveda-navy/60 text-sm">
                    Consult via video/phone call from anywhere. Convenient for
                    follow-ups and remote patients.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setConsultationType("opd");
                    setStep("entry");
                  }}
                  className="bg-ayurveda-cream/60 rounded-2xl p-8 border-2 border-ayurveda-blush/50 card-hover text-left group hover:border-ayurveda-green"
                >
                  <MapPin className="text-ayurveda-green mb-4" size={36} />
                  <h3 className="font-serif text-xl font-bold text-ayurveda-navy mb-2">
                    OPD Visit
                  </h3>
                  <p className="text-ayurveda-navy/60 text-sm">
                    In-person consultation at our clinic with detailed physical
                    examination and pulse diagnosis.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Entry Path */}
          {step === "entry" && (
            <div className="animate-fade-in">
              <button
                onClick={() => setStep("mode")}
                className="text-ayurveda-green text-sm mb-6 hover:underline"
              >
                ← Back
              </button>
              <h2 className="font-serif text-2xl font-bold text-ayurveda-navy mb-8 text-center">
                How Would You Like to Book?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => {
                    setEntryPath("doctor");
                    setStep("form");
                  }}
                  className="bg-ayurveda-cream/60 rounded-2xl p-8 border-2 border-ayurveda-blush/50 card-hover text-left group hover:border-ayurveda-green"
                >
                  <User className="text-ayurveda-green mb-4" size={36} />
                  <h3 className="font-serif text-xl font-bold text-ayurveda-navy mb-2">
                    By Doctor
                  </h3>
                  <p className="text-ayurveda-navy/60 text-sm">
                    Choose a specific doctor for your consultation.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setEntryPath("treatment");
                    setStep("form");
                  }}
                  className="bg-ayurveda-cream/60 rounded-2xl p-8 border-2 border-ayurveda-blush/50 card-hover text-left group hover:border-ayurveda-green"
                >
                  <FileText className="text-ayurveda-green mb-4" size={36} />
                  <h3 className="font-serif text-xl font-bold text-ayurveda-navy mb-2">
                    By Treatment
                  </h3>
                  <p className="text-ayurveda-navy/60 text-sm">
                    Select your condition and we'll match you with the right
                    specialist.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Booking Form */}
          {step === "form" && (
            <div className="animate-fade-in">
              <button
                onClick={() => setStep("entry")}
                className="text-ayurveda-green text-sm mb-6 hover:underline"
              >
                ← Back
              </button>
              <h2 className="font-serif text-2xl font-bold text-ayurveda-navy mb-8 text-center">
                Fill in Your Details
              </h2>

              <div className="bg-ayurveda-cream/40 rounded-2xl p-6 mb-8 flex items-center gap-4">
                {consultationType === "tele" ? (
                  <Video size={24} className="text-ayurveda-green" />
                ) : (
                  <MapPin size={24} className="text-ayurveda-green" />
                )}
                <div>
                  <span className="font-medium text-ayurveda-navy">
                    {consultationType === "tele"
                      ? "Teleconsultation"
                      : "OPD Visit"}
                  </span>
                  <span className="text-ayurveda-navy/40 mx-3">|</span>
                  <span className="text-ayurveda-navy/70 text-sm">
                    {entryPath === "doctor" ? "Book by Doctor" : "Book by Treatment"}
                  </span>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-6">
                {/* Doctor or Treatment Selection */}
                {entryPath === "doctor" && (
                  <div>
                    <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                      Select Doctor
                    </label>
                    <select
                      required
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} — {doc.qualification}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {entryPath === "treatment" && (
                  <div>
                    <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                      Select Speciality / Condition
                    </label>
                    <select
                      required
                      value={selectedSpeciality}
                      onChange={(e) => setSelectedSpeciality(e.target.value)}
                      className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                    >
                      <option value="">Choose a speciality...</option>
                      {specialities.map((spec) => (
                        <optgroup key={spec.id} label={spec.category}>
                          {spec.conditions.map((cond) => (
                            <option key={cond.id} value={`${spec.id}/${cond.id}`}>
                              {cond.name} — {cond.englishName}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy placeholder-ayurveda-navy/30 focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 XXXXXXXXXX"
                    className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy placeholder-ayurveda-navy/30 focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Describe your symptoms or any specific concerns..."
                    className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy placeholder-ayurveda-navy/30 focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-lg">
                  <Calendar size={20} />
                  Confirm Appointment
                </button>
              </form>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === "confirmation" && (
            <div className="animate-fade-in text-center">
              <div className="w-20 h-20 rounded-full bg-ayurveda-green/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-ayurveda-green" size={40} />
              </div>
              <h2 className="font-serif text-3xl font-bold text-ayurveda-navy mb-4">
                Appointment Request Received!
              </h2>
              <p className="text-ayurveda-navy/60 max-w-md mx-auto mb-8">
                Thank you, <strong>{formData.name}</strong>! Your appointment
                request has been submitted. Our team will contact you at{" "}
                <strong>{formData.phone}</strong> to confirm the booking.
              </p>

              <div className="bg-ayurveda-cream/60 rounded-2xl p-6 max-w-sm mx-auto mb-8 text-left">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ayurveda-navy/60">Type:</span>
                    <span className="font-medium text-ayurveda-navy">
                      {consultationType === "tele" ? "Teleconsultation" : "OPD Visit"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ayurveda-navy/60">Date:</span>
                    <span className="font-medium text-ayurveda-navy">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ayurveda-navy/60">Time:</span>
                    <span className="font-medium text-ayurveda-navy">{formData.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  Book Another
                </button>
                <a
                  href={`tel:${clinicInfo.phone.replace(/\D/g, "")}`}
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Call Us
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
