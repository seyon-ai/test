// Stellar Dental — client configuration for the Care Desk (live enquiry system).
// Single source of truth for clinic identity, channels and launch state.
// Channel badges in the UI must reflect these statuses honestly.

export const clinic = {
  id: 'stellar-dental',
  name: 'Stellar Dental',
  tagline: 'Expert care for healthy teeth and beautiful smiles',
  locations: [
    { id: 'setia-alam', name: 'Setia Alam', area: 'Shah Alam', address: 'Sunsuria Forum, near Setia City Mall' },
    { id: 'kota-damansara', name: 'Kota Damansara', area: 'Petaling Jaya', address: 'Dataran Sunway, between Sunway Giza and Nexis' }
  ],
  hours: 'Open 7 days a week at both clinics.',
  phone: '011-2884 0342',
  phoneHref: '+601128840342',
  whatsapp: '011-3996 4469',
  whatsappHref: '601139964469',
  website: 'https://www.stellardental.my/',
  rating: '5.0 · 1,040+ Google reviews',
  certifications: 'ISO 9001-certified, award-winning dental care'
};

// Enquiry "main concern" categories, matching stellardental.my's own inquiry form.
// Used for routing rules and the public enquiry form.
export const services = [
  'General Dentistry',
  'Braces & Aligners',
  'Cosmetic Dentistry',
  'Implants & Replacement',
  'Other'
];

// Channel truth table — the UI must never claim more than this.
// status: 'live' | 'ready' | 'pending' | 'off'
export const channels = {
  webForm: { name: 'Website enquiry form', status: 'ready', detail: 'Embedded form captures enquiries into the Care Desk inbox.' },
  whatsapp: { name: 'WhatsApp Business', status: 'pending', detail: 'Meta WhatsApp Business API — pending credentials and approved templates.' },
  email: { name: 'Email notifications', status: 'pending', detail: 'Transactional email — pending provider API key.' },
  crm: { name: 'HighLevel CRM', status: 'pending', detail: 'Optional contact sync — pending API access.' },
  scheduling: { name: 'External scheduling', status: 'pending', detail: 'Optional booking sync — pending provider.' }
};

// Top-bar status chip. Flip to 'LIVE · STELLAR DENTAL CARE DESK' at launch.
export const statusChip = 'PRE-LAUNCH · CHANNELS PENDING';

// Launch blockers owned by the friend/client (kept here so the app can surface them later).
export const launchChecklist = [
  'Confirm exact daily opening hours with the clinic',
  'Clinic-approved FAQ wording sign-off (admin answers only)',
  'Staff accounts and roles (Admin / Receptionist / Manager)',
  'Resend (or SES) API key for email notifications',
  'Meta WhatsApp Business API access + approved follow-up template',
  'DNS: point desk subdomain (e.g. care.stellardental.my) at the deployment'
];
