// Teleconsultation time slots
export const TELE_SLOTS = [
  { id: "morning-1", label: "6:00 AM – 8:00 AM", value: "06:00-08:00" },
  { id: "morning-2", label: "8:00 AM – 10:00 AM", value: "08:00-10:00" },
  { id: "midday-1", label: "10:00 AM – 12:00 PM", value: "10:00-12:00" },
  { id: "midday-2", label: "12:00 PM – 2:00 PM", value: "12:00-14:00" },
  { id: "afternoon-1", label: "2:00 PM – 4:00 PM", value: "14:00-16:00" },
  { id: "afternoon-2", label: "4:00 PM – 6:00 PM", value: "16:00-18:00" },
  { id: "evening-1", label: "6:00 PM – 8:00 PM", value: "18:00-20:00" },
  { id: "evening-2", label: "8:00 PM – 10:00 PM", value: "20:00-22:00" },
];

// Others treatment option
export const OTHERS_TREATMENT = {
  id: "others",
  name: "Others",
  englishName: "Other condition (please describe in notes)",
  sanskritName: "—",
  description: "If your condition is not listed, select this and describe it in the notes section. Our doctor will assess and guide you.",
};
