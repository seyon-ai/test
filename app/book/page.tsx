"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doctors, specialities, clinicInfo } from "@/lib/data";
import { TELE_SLOTS, OTHERS_TREATMENT } from "@/lib/slots";
import {
  Leaf,
  Phone,
  Calendar,
  Video,
  MapPin,
  CheckCircle,
  User,
  Clock,
  FileText,
  ArrowLeft,
  LogIn,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { db, isConfigValid } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";

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
    timeSlot: "",
    notes: "",
  });
  const [opdDates, setOpdDates] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { user, userData, loading } = useAuth();
  const router = useRouter();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?redirect=/book");
    }
  }, [user, loading, router]);

  // Pre-fill name from profile
  useEffect(() => {
    if (userData?.displayName && !formData.name) {
      setFormData((prev) => ({ ...prev, name: userData.displayName }));
    }
  }, [userData]);

  // Fetch available OPD dates from Firestore
  useEffect(() => {
    if (!isConfigValid || !db) return;
    const dbRef = db;
    const fetchOpdDates = async () => {
      try {
        const snap = await getDocs(collection(dbRef, "opdSchedule"));
        const dates = snap.docs.map((d) => d.id);
        setOpdDates(dates.sort());
      } catch (e) {
        console.error("Failed to fetch OPD dates:", e);
      }
    };
    fetchOpdDates();
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!isConfigValid || !db) {
      alert("Firebase is not configured. Please set up Firebase first.");
      return;
    }

    setSubmitting(true);
    try {
      // Handle "Others" treatment
      const specialityValue = selectedSpeciality === "others" ? "others" : selectedSpeciality;

      const appointmentData = {
        patientName: formData.name,
        patientEmail: user.email,
        patientUid: user.uid,
        phone: formData.phone,
        consultationType: consultationType,
        doctorId: entryPath === "doctor" ? selectedDoctor : null,
        specialityId: entryPath === "treatment" ? specialityValue : null,
        date: formData.date,
        timeSlot: formData.timeSlot,
        status: "pending",
        notes: formData.notes,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "appointments"), appointmentData);
      setStep("confirmation");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep("mode");
    setConsultationType(null);
    setEntryPath(null);
    setSelectedDoctor("");
    setSelectedSpeciality("");
    setFormData({ name: "", phone: "", date: "", timeSlot: "", notes: "" });
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="text-ayurveda-green animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

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

          {/* User badge */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mt-6 shadow-sm border border-ayurveda-blush/50">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
            ) : (
              <User size={16} className="text-ayurveda-green" />
            )}
            <span className="text-sm text-ayurveda-navy font-medium">
              {user.displayName || user.email}
            </span>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white pt-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {(["mode", "entry", "form", "confirmation"] as const).map((s, i) => {
              const isActive = step === s;
              const isDone =
                (["mode", "entry", "form", "confirmation"] as const).indexOf(step) > i;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      isActive || isDone
                        ? "bg-ayurveda-green text-white"
                        : "bg-ayurveda-blush text-ayurveda-navy/40"
                    }`}
                  >
                    {isDone ? <CheckCircle size={16} /> : i + 1}
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
                    Consult via video/phone call from anywhere.
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
                    In-person consultation at our clinic.
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
                className="text-ayurveda-green text-sm mb-6 hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back
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
                    Choose a specific doctor.
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
                    Select your condition.
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
                className="text-ayurveda-green text-sm mb-6 hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back
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
                    {consultationType === "tele" ? "Teleconsultation" : "OPD Visit"}
                  </span>
                  <span className="text-ayurveda-navy/40 mx-3">|</span>
                  <span className="text-ayurveda-navy/70 text-sm">
                    {entryPath === "doctor" ? "Book by Doctor" : "Book by Treatment"}
                  </span>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-6">
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
                      <option value="others">Others — Not listed above</option>
                    </select>
                  </div>
                )}

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
                    className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                  />
                </div>

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

                {/* Date + Time Slot */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                      Preferred Date
                    </label>
                    {consultationType === "opd" && opdDates.length > 0 ? (
                      /* OPD: only allow admin-set dates */
                      <select
                        required
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value, timeSlot: "" })
                        }
                        className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                      >
                        <option value="">Select an available date...</option>
                        {opdDates.map((d) => {
                          const dateObj = new Date(d + "T00:00:00");
                          const formatted = dateObj.toLocaleDateString("en-IN", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          });
                          return (
                            <option key={d} value={d}>
                              {formatted}
                            </option>
                          );
                        })}
                      </select>
                    ) : consultationType === "opd" && opdDates.length === 0 && isConfigValid ? (
                      /* OPD but no dates set by admin */
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <div>
                          <strong>OPD slots not yet open.</strong>
                          <p className="text-xs mt-1">
                            Our admin will publish available OPD dates soon. Meanwhile, you can book a{" "}
                            <strong>Teleconsultation</strong> or call{" "}
                            <strong>+91 7044085126</strong>.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Tele: free date picker */
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                      />
                    )}
                  </div>

                  <div>
                    {consultationType === "tele" ? (
                      /* Teleconsultation: time slot picker */
                      <>
                        <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                          Preferred Time Slot
                        </label>
                        <select
                          required
                          value={formData.timeSlot}
                          onChange={(e) =>
                            setFormData({ ...formData, timeSlot: e.target.value })
                          }
                          className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                        >
                          <option value="">Select a time slot...</option>
                          {TELE_SLOTS.map((slot) => (
                            <option key={slot.id} value={slot.value}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      /* OPD: time slot picker (clinic hours) */
                      <>
                        <label className="block text-sm font-medium text-ayurveda-navy mb-2">
                          Preferred Time Slot
                        </label>
                        <select
                          required
                          value={formData.timeSlot}
                          onChange={(e) =>
                            setFormData({ ...formData, timeSlot: e.target.value })
                          }
                          className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all"
                          disabled={!formData.date}
                        >
                          <option value="">Select a time slot...</option>
                          {TELE_SLOTS.filter((s) => {
                            // Only show slots within clinic hours (9 AM - 6 PM weekdays, 9 AM - 2 PM Sat)
                            if (!formData.date) return true;
                            const day = new Date(formData.date + "T00:00:00").getDay();
                            if (day === 0) return false; // Sunday closed
                            if (day === 6) return ["08:00-10:00", "10:00-12:00", "12:00-14:00"].includes(s.value); // Saturday
                            return true; // Weekday: all slots
                          }).map((slot) => (
                            <option key={slot.id} value={slot.value}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>

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
                    placeholder="Describe your symptoms..."
                    className="w-full rounded-xl border border-ayurveda-blush bg-white px-4 py-3 text-ayurveda-navy placeholder-ayurveda-navy/30 focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Calendar size={20} />
                      Confirm Appointment
                    </>
                  )}
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
                Appointment Booked!
              </h2>
              <p className="text-ayurveda-navy/60 max-w-md mx-auto mb-8">
                Your appointment request has been saved. Our team will contact
                you at <strong>{formData.phone}</strong> to confirm.
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
                    <span className="text-ayurveda-navy/60">Time Slot:</span>
                    <span className="font-medium text-ayurveda-navy">{formData.timeSlot}</span>
                  </div>
                </div>
              </div>

              <button onClick={handleReset} className="btn-secondary">
                Book Another
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
