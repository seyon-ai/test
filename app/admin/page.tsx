"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { db, isConfigValid } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Stethoscope,
  Settings,
  Leaf,
  Phone,
  Video,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Shield,
  LogOut,
} from "lucide-react";
import Link from "next/link";

type AdminTab = "dashboard" | "appointments" | "doctors" | "specialities" | "opd-schedule" | "settings";

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  phone: string;
  consultationType: "tele" | "opd";
  doctorId?: string;
  specialityId?: string;
  dateTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  createdAt?: any;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [opdDates, setOpdDates] = useState<string[]>([]);
  const [newOpdDate, setNewOpdDate] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, userData, isAdmin, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Auth guard — redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, authLoading, router]);

  // Real-time appointments listener
  useEffect(() => {
    if (!isAdmin || !isConfigValid || !db) return;

    setLoading(true);
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Appointment[];
      setAppointments(data);
      setLoading(false);
    });

    // Fetch OPD schedule
    const fetchOpdDates = async () => {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, "opdSchedule"));
        setOpdDates(snap.docs.map((d) => d.id).sort());
      } catch (e) {
        console.error("Failed to fetch OPD dates:", e);
      }
    };
    fetchOpdDates();

    return () => unsubscribe();
  }, [isAdmin]);

  const handleStatusChange = async (
    aptId: string,
    status: Appointment["status"]
  ) => {
    if (!db) return;
    await updateDoc(doc(db, "appointments", aptId), { status });
  };

  const handleDeleteAppointment = async (aptId: string) => {
    if (!db) return;
    if (!confirm("Delete this appointment?")) return;
    await deleteDoc(doc(db, "appointments", aptId));
  };

  // OPD Schedule management
  const handleAddOpdDate = async () => {
    if (!db || !newOpdDate) return;
    try {
      await setDoc(doc(db, "opdSchedule", newOpdDate), { date: newOpdDate });
      setOpdDates((prev) => [...prev, newOpdDate].sort());
      setNewOpdDate("");
    } catch (e) {
      console.error("Failed to add OPD date:", e);
    }
  };

  const handleRemoveOpdDate = async (date: string) => {
    if (!db) return;
    if (!confirm(`Remove ${date} from OPD schedule?`)) return;
    await deleteDoc(doc(db, "opdSchedule", date));
    setOpdDates((prev) => prev.filter((d) => d !== date));
  };

  const handleClearAllOpdDates = async () => {
    if (!db) return;
    if (!confirm("Remove ALL OPD dates? This cannot be undone.")) return;
    const dbRef = db;
    const batch = writeBatch(dbRef);
    opdDates.forEach((d) => {
      batch.delete(doc(dbRef, "opdSchedule", d));
    });
    await batch.commit();
    setOpdDates([]);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="text-ayurveda-green animate-spin" size={40} />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = appointments.filter((a) =>
    a.dateTime?.startsWith(todayStr)
  ).length;

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "appointments", label: "Appointments", icon: <CalendarCheck size={18} /> },
    { id: "doctors", label: "Doctors", icon: <Users size={18} /> },
    { id: "specialities", label: "Specialities", icon: <Stethoscope size={18} /> },
    { id: "opd-schedule", label: "OPD Schedule", icon: <CalendarCheck size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ayurveda-green-dark text-white fixed h-full overflow-y-auto hidden lg:block">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <svg width="28" height="34" viewBox="0 0 100 120">
              <path d="M50 10 Q55 30 50 50 Q45 30 50 10" fill="white" />
              <path d="M50 30 Q70 25 75 35 Q65 40 50 40" fill="white" opacity="0.85" />
              <path d="M50 40 Q30 35 25 45 Q35 50 50 48" fill="white" opacity="0.85" />
              <path d="M50 50 Q75 48 78 58 Q65 62 50 58" fill="white" opacity="0.8" />
              <path d="M50 58 Q25 56 22 66 Q35 70 50 66" fill="white" opacity="0.8" />
            </svg>
            <div>
              <div className="font-serif font-bold text-sm">AGNIVESH</div>
              <div className="text-[10px] text-ayurveda-sage tracking-wider">ADMIN PANEL</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-ayurveda-sage" />
              <span className="text-xs text-ayurveda-sage font-medium uppercase">Admin</span>
            </div>
            <div className="text-sm font-medium truncate">{user.displayName || "Admin"}</div>
            <div className="text-xs text-white/50 truncate">{user.email}</div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/"
            className="block text-center text-xs text-white/40 hover:text-white transition-colors py-2"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium min-w-[64px] ${
              activeTab === tab.id ? "text-ayurveda-green" : "text-gray-400"
            }`}
          >
            {tab.icon}
            <span className="truncate">{tab.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-10">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="animate-fade-in">
              <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                Real-time overview of your clinic
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Today's Appts", value: todayCount, color: "bg-ayurveda-green/10 text-ayurveda-green" },
                  { label: "Pending", value: pendingCount, color: "bg-amber-100 text-amber-700" },
                  { label: "Total Appts", value: appointments.length, color: "bg-blue-100 text-blue-700" },
                  { label: "Completed", value: appointments.filter((a) => a.status === "completed").length, color: "bg-emerald-100 text-emerald-700" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${stat.color}`}>
                      {stat.label}
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Recent Appointments (Live)
                </h2>
                {appointments.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">
                    No appointments yet. They will appear here in real-time.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{apt.patientName}</div>
                          <div className="text-xs text-gray-500">
                            {apt.dateTime?.split("T")[0]} · {apt.consultationType === "tele" ? " Tele" : "📍 OPD"}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          apt.status === "pending" ? "bg-amber-100 text-amber-700"
                          : apt.status === "confirmed" ? "bg-green-100 text-green-700"
                          : apt.status === "completed" ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <div className="animate-fade-in">
              <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Appointments</h1>
              <p className="text-gray-500 text-sm mb-8">Real-time from Firestore</p>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {appointments.length === 0 ? (
                  <p className="text-gray-400 text-center py-12">No appointments yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Patient</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Type</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3 hidden md:table-cell">Doctor/Speciality</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Date</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                          <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {appointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900 text-sm">{apt.patientName}</div>
                              <div className="text-xs text-gray-500">{apt.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                                apt.consultationType === "tele" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                              }`}>
                                {apt.consultationType === "tele" ? <Video size={12} /> : <MapPin size={12} />}
                                {apt.consultationType === "tele" ? "Tele" : "OPD"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                              {apt.doctorId || apt.specialityId || "—"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{apt.dateTime?.split("T")[0]}</td>
                            <td className="px-6 py-4">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                apt.status === "pending" ? "bg-amber-100 text-amber-700"
                                : apt.status === "confirmed" ? "bg-green-100 text-green-700"
                                : apt.status === "completed" ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                              }`}>{apt.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {apt.status === "pending" && (
                                  <button onClick={() => handleStatusChange(apt.id, "confirmed")} className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="Confirm">
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                {apt.status === "confirmed" && (
                                  <button onClick={() => handleStatusChange(apt.id, "completed")} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="Mark Complete">
                                    <Clock size={16} />
                                  </button>
                                )}
                                <button onClick={() => handleStatusChange(apt.id, "cancelled")} className="p-2 hover:bg-red-50 rounded-lg text-red-600" title="Cancel">
                                  <XCircle size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Doctors */}
          {activeTab === "doctors" && (
            <div className="animate-fade-in">
              <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Doctors</h1>
              <p className="text-gray-500 text-sm mb-8">Manage doctor profiles in Firestore</p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
                <strong>Note:</strong> Doctor data is managed via Firestore <code className="bg-amber-100 px-1 rounded">doctors</code> collection. 
                Add/edit doctors directly in the Firebase Console or use the admin SDK.
                Seed data is available in <code className="bg-amber-100 px-1 rounded">lib/data.ts</code>.
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {["dr-ayan-patra", "dr-swati-prasad"].map((id) => (
                  <div key={id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-ayurveda-green/10 flex items-center justify-center text-ayurveda-green font-serif font-bold text-lg">
                        {id.split("-").map((w) => w[0]?.toUpperCase()).join("").slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</h3>
                        <p className="text-sm text-ayurveda-green">B.A.M.S., M.D. (Ayu)</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specialities */}
          {activeTab === "specialities" && (
            <div className="animate-fade-in">
              <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Specialities</h1>
              <p className="text-gray-500 text-sm mb-8">Managed via Firestore <code className="bg-gray-100 px-1 rounded">specialities</code> collection</p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                4 speciality categories with 15+ conditions are pre-seeded. 
                Edit them via Firebase Console under the <code className="bg-amber-100 px-1 rounded">specialities</code> collection.
              </div>
            </div>
          )}

          {/* OPD Schedule */}
          {activeTab === "opd-schedule" && (
            <div className="animate-fade-in">
              <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">OPD Schedule</h1>
              <p className="text-gray-500 text-sm mb-8">
                Set available OPD dates. Patients can only book on these dates.
              </p>

              {/* Add date */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Add OPD Date</h3>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={newOpdDate}
                    onChange={(e) => setNewOpdDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-ayurveda-green focus:ring-2 focus:ring-ayurveda-green/20 outline-none"
                  />
                  <button
                    onClick={handleAddOpdDate}
                    disabled={!newOpdDate}
                    className="btn-primary !px-6 text-sm disabled:opacity-40"
                  >
                    <Plus size={16} className="inline mr-1" />
                    Add Date
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select dates when doctors will be available for in-person OPD visits.
                </p>
              </div>

              {/* Current dates */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Available OPD Dates ({opdDates.length})
                  </h3>
                  {opdDates.length > 0 && (
                    <button
                      onClick={handleClearAllOpdDates}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {opdDates.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <CalendarCheck size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No OPD dates set yet.</p>
                    <p className="text-xs mt-1">
                      Add dates above to allow patients to book OPD visits.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {opdDates.map((d) => {
                      const dateObj = new Date(d + "T00:00:00");
                      const formatted = dateObj.toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      });
                      const isPast = dateObj < new Date(new Date().toDateString());
                      return (
                        <div
                          key={d}
                          className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
                            isPast
                              ? "bg-gray-50 border-gray-200 text-gray-400"
                              : "bg-ayurveda-cream/50 border-ayurveda-green/20 text-ayurveda-navy"
                          }`}
                        >
                          <div>
                            <div className="font-medium">{formatted}</div>
                            <div className="text-xs opacity-60">{d}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveOpdDate(d)}
                            className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="animate-fade-in">
              <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Clinic Settings</h1>
              <p className="text-gray-500 text-sm mb-8">Manage via Firestore <code className="bg-gray-100 px-1 rounded">clinicInfo</code> document</p>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Current Info</h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-gray-500">Name:</span> <span className="font-medium">Agnivesh Ayurveda and Panchakarma Centre</span></div>
                    <div><span className="text-gray-500">Address:</span> <span className="font-medium">Sarenga–Goaltore Road, Sarenga, Bankura – 722150</span></div>
                    <div><span className="text-gray-500">Phone:</span> <span className="font-medium">+91 7044085126</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Admin Accounts</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">Admin access is granted to these emails:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>admin@agniveshayurveda.com</li>
                      <li>drayan@agniveshayurveda.com</li>
                      <li>drswati@agniveshayurveda.com</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      To add more admins, update the <code className="bg-gray-100 px-1 rounded">ADMIN_EMAILS</code> array in <code className="bg-gray-100 px-1 rounded">lib/auth-context.tsx</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
