"use client";

import { useState } from "react";
import { doctors, specialities, clinicInfo } from "@/lib/data";
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
} from "lucide-react";

type AdminTab = "dashboard" | "appointments" | "doctors" | "specialities" | "settings";

const mockAppointments = [
  {
    id: "APT-001",
    patientName: "Rahul Sharma",
    phone: "+91 9876543210",
    consultationType: "tele" as const,
    doctor: "Dr. Ayan Patra",
    speciality: null,
    dateTime: "2026-08-06 10:00",
    status: "pending" as const,
    notes: "Recurring acidity issue for 3 months",
    createdAt: "2026-08-04 14:30",
  },
  {
    id: "APT-002",
    patientName: "Priya Das",
    phone: "+91 9123456780",
    consultationType: "opd" as const,
    doctor: null,
    speciality: "PCOS/PCOD",
    dateTime: "2026-08-07 11:30",
    status: "confirmed" as const,
    notes: "Irregular periods, weight gain",
    createdAt: "2026-08-04 16:15",
  },
  {
    id: "APT-003",
    patientName: "Amit Kumar",
    phone: "+91 8765432109",
    consultationType: "opd" as const,
    doctor: "Dr. Swati Prasad",
    speciality: null,
    dateTime: "2026-08-05 09:00",
    status: "completed" as const,
    notes: "Follow-up for IBS treatment",
    createdAt: "2026-08-03 10:00",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "appointments", label: "Appointments", icon: <CalendarCheck size={18} /> },
    { id: "doctors", label: "Doctors", icon: <Users size={18} /> },
    { id: "specialities", label: "Specialities", icon: <Stethoscope size={18} /> },
    { id: "settings", label: "Clinic Settings", icon: <Settings size={18} /> },
  ];

  const pendingCount = mockAppointments.filter((a) => a.status === "pending").length;
  const todayCount = mockAppointments.filter((a) => a.dateTime.startsWith("2026-08-05")).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ayurveda-green-dark text-white fixed h-full overflow-y-auto hidden lg:block">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Leaf size={20} />
            </div>
            <div>
              <div className="font-serif font-bold">AGNIVESH</div>
              <div className="text-xs text-ayurveda-sage">Admin Panel</div>
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

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-xs text-white/50 mb-1">Clinic Phone</div>
            <div className="text-sm font-medium">{clinicInfo.phone}</div>
          </div>
        </div>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium min-w-[64px] ${
              activeTab === tab.id
                ? "text-ayurveda-green"
                : "text-gray-400"
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
                Overview of today's activities
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Today's Appointments", value: todayCount, color: "bg-ayurveda-green/10 text-ayurveda-green" },
                  { label: "Pending", value: pendingCount, color: "bg-amber-100 text-amber-700" },
                  { label: "Total Doctors", value: doctors.length, color: "bg-blue-100 text-blue-700" },
                  { label: "Specialities", value: specialities.length, color: "bg-purple-100 text-purple-700" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${stat.color}`}>
                      {stat.label}
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Recent Appointments
                </h2>
                <div className="space-y-3">
                  {mockAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {apt.patientName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {apt.dateTime} · {apt.consultationType === "tele" ? "Tele" : "OPD"}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          apt.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : apt.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-gray-900">
                    Appointments
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Manage all patient bookings
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                          Patient
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                          Type
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3 hidden md:table-cell">
                          Doctor/Speciality
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                          Date/Time
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                          Status
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {mockAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 text-sm">
                              {apt.patientName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {apt.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                                apt.consultationType === "tele"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-purple-50 text-purple-700"
                              }`}
                            >
                              {apt.consultationType === "tele" ? (
                                <Video size={12} />
                              ) : (
                                <MapPin size={12} />
                              )}
                              {apt.consultationType === "tele" ? "Tele" : "OPD"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                            {apt.doctor || apt.speciality || "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {apt.dateTime}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                apt.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : apt.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {apt.status === "pending" && (
                                <button className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="Confirm">
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              <button className="p-2 hover:bg-amber-50 rounded-lg text-amber-600" title="Reschedule">
                                <Clock size={16} />
                              </button>
                              <button className="p-2 hover:bg-red-50 rounded-lg text-red-600" title="Cancel">
                                <XCircle size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Doctors */}
          {activeTab === "doctors" && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-gray-900">
                    Doctors
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Manage doctor profiles
                  </p>
                </div>
                <button className="btn-primary !px-4 !py-2 text-sm inline-flex items-center gap-2">
                  <Plus size={16} /> Add Doctor
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-ayurveda-green/10 flex items-center justify-center text-ayurveda-green font-serif font-bold text-lg">
                        {doc.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-ayurveda-green">
                          {doc.qualification}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{doc.role}</p>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-600" title="Remove">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specialities */}
          {activeTab === "specialities" && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-gray-900">
                    Specialities & Conditions
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Manage treatment categories
                  </p>
                </div>
                <button className="btn-primary !px-4 !py-2 text-sm inline-flex items-center gap-2">
                  <Plus size={16} /> Add Category
                </button>
              </div>

              <div className="space-y-6">
                {specialities.map((spec) => (
                  <div
                    key={spec.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{spec.icon}</span>
                      <h3 className="font-semibold text-gray-900">
                        {spec.category}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {spec.conditions.length} conditions
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {spec.conditions.map((cond) => (
                        <div
                          key={cond.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {cond.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {cond.englishName}
                            </div>
                          </div>
                          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
                            <Edit size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="animate-fade-in">
              <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                Clinic Settings
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                Manage clinic information and preferences
              </p>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">
                        Phone
                      </label>
                      <input
                        type="text"
                        defaultValue={clinicInfo.phone}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={clinicInfo.email}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">
                        Address
                      </label>
                      <input
                        type="text"
                        defaultValue={clinicInfo.fullAddress}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Google Maps Location
                  </h3>
                  <div className="bg-gray-100 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 text-sm mb-4">
                    <MapPin className="mb-2" size={24} />
                    <span>Fixed location: Sarenga, Bankura – 722150</span>
                    <span className="text-xs mt-1">Address managed in data.ts</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {clinicInfo.fullAddress}
                  </div>

                  <h3 className="font-semibold text-gray-900 mt-8 mb-4">
                    Clinic Hours
                  </h3>
                  <div className="space-y-2">
                    {clinicInfo.hours.map((h, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <input
                          type="text"
                          defaultValue={h.day}
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5"
                        />
                        <input
                          type="text"
                          defaultValue={h.time}
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button className="btn-primary mt-6">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
