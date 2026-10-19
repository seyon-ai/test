import {applyAction,uid} from './engine.mjs';
import {clinic} from './clinic-config.mjs';

// Real clinic profile + configuration. Operational collections start empty —
// a live clinic begins with zero enquiries, not synthetic patients.
function baseState(){
 return {version:1,clock:new Date().toISOString(),
  clinic:{id:clinic.id,name:clinic.name,location:clinic.locations.map(l=>l.name+' ('+l.address+')').join(' · '),hours:clinic.hours},
  roles:[{id:'Admin'},{id:'Receptionist'},{id:'Manager'}],
  users:[
   {id:'staff-frontdesk',name:'Front Desk',role:'Receptionist',active:true,initials:'FD'},
   {id:'staff-coordinator',name:'Treatment Coordinator',role:'Receptionist',active:true,initials:'TC'},
   {id:'staff-manager',name:'Practice Manager',role:'Manager',active:true,initials:'PM'}
  ],
  contacts:[],enquiries:[],messages:[],appointmentRequests:[],followUpJobs:[],consentRecords:[],auditEvents:[],integrationEvents:[],
  settings:{intervalHours:24,followUpEnabled:true},
  routingRules:[
   {id:'route-aligners',service:'Braces & Aligners',staffId:'staff-coordinator',enabled:true,priority:1},
   {id:'route-cosmetic',service:'Cosmetic Dentistry',staffId:'staff-coordinator',enabled:true,priority:2},
   {id:'route-implants',service:'Implants & Replacement',staffId:'staff-coordinator',enabled:true,priority:3},
   {id:'route-general',service:'General Dentistry',staffId:'staff-frontdesk',enabled:true,priority:4},
   {id:'route-default',service:'*',staffId:'staff-frontdesk',enabled:true,priority:9}
  ],
  // Administrative answers only. Each entry is replied verbatim when approved;
  // anything clinical (pain, bleeding, price, urgency, availability) escalates to staff.
  // Wording pending clinic sign-off before launch.
  faqEntries:[
   {id:'faq-hours',title:'Opening hours',keywords:['opening hours','open','hours','closing','weekends','weekend'],answer:'Stellar Dental is open 7 days a week at both Setia Alam and Kota Damansara. WhatsApp us at '+clinic.whatsapp+' to confirm today\u2019s opening hours.',approved:true},
   {id:'faq-locations',title:'Clinic locations',keywords:['location','address','where','branches','branch'],answer:'Stellar Dental has two clinics: Setia Alam at Sunsuria Forum (near Setia City Mall), and Kota Damansara at Dataran Sunway (between Sunway Giza and Nexis).',approved:true},
   {id:'faq-reschedule',title:'Rescheduling appointments',keywords:['reschedule','rescheduling','postpone','change appointment'],answer:'To reschedule, WhatsApp our team at '+clinic.whatsapp+' with your name and current appointment details, and we will find a new time with you.',approved:true},
   {id:'faq-contact',title:'Contact and appointment requests',keywords:['contact','appointment','book','booking','whatsapp','call','phone'],answer:'To book or change an appointment, WhatsApp '+clinic.whatsapp+' or call '+clinic.phone+'. Our team will confirm availability with you.',approved:true},
   {id:'faq-services',title:'Treatments offered',keywords:['services','offer','options'],answer:'Stellar Dental provides general dentistry (check-ups, scaling and polish, fillings), braces and clear aligners, veneers and whitening, and implants and tooth replacement. Our team can explain the administrative process for any of these.',approved:true}
  ]};
}

// Live workspace: real clinic, no sample records.
export function seed(){return baseState();}

// Training / test fixture: real clinic profile with a synthetic enquiry history.
// Never used for live provisioning (lib/database.ts calls seed()).
export function demoSeed(){
 const s=baseState();
 s.clock='2026-10-11T02:00:00.000Z';
 const rows=[['Nur Alya','General Dentistry','Website','What are your opening hours?',true,7],['Jason Wong','Braces & Aligners','WhatsApp','How do I request an appointment?',true,6],['Siti Hana','Cosmetic Dentistry','Facebook','What services do you offer?',true,5],['Arjun Kumar','General Dentistry','Website','My tooth hurts, what should I do?',true,4],['Chloe Tan','Braces & Aligners','WhatsApp','Where is the clinic?',false,3],['Muhammad Rizal','General Dentistry','Walk-in','How do I book an appointment?',true,2],['Evelyn Lee','Cosmetic Dentistry','Website','Can I reschedule my appointment?',true,2],['Farah Nadia','Implants & Replacement','Facebook','Can I replace a missing tooth with an implant?',true,1],['Adam Yusuf','General Dentistry','WhatsApp','What are your hours?',true,0],['Mei Ling','Braces & Aligners','Website','How do I request an appointment?',true,0],['Hafiz Zain','General Dentistry','Facebook','Where are you located?',true,0],['Priya Devi','Cosmetic Dentistry','Website','Tell me about services',true,0]];
 rows.forEach((r,i)=>{s.clock=new Date(Date.parse('2026-10-11T02:00:00Z')-r[5]*86400000+i*300000).toISOString();const appointment=[1,2,5,6,9].includes(i);applyAction(s,'create',{name:r[0],phone:'+6012000'+String(1000+i),service:r[1],source:r[2],message:r[3],consent:r[4],preferredDate:appointment?'2026-10-15':'',preferredTime:appointment?'10:30':''},{id:'demo-seed',role:'Admin'},'seed-event-'+i);const e=s.enquiries.at(-1);const outbound=s.messages.find(m=>m.enquiryId===e.id&&m.direction==='outbound');outbound.createdAt=new Date(Date.parse(e.createdAt)+(i%4)*60000+30000).toISOString();if([1,5].includes(i)){const a=s.appointmentRequests.at(-1);applyAction(s,'appointment',{id:a.id,status:'Confirmed'},{id:'staff-frontdesk',role:'Receptionist'});if(i===5)applyAction(s,'stage',{id:e.id,stage:'Attended'},{id:'staff-frontdesk',role:'Receptionist'});}if(i===6)applyAction(s,'appointment',{id:s.appointmentRequests.at(-1).id,status:'Cancelled'},{id:'staff-frontdesk',role:'Receptionist'});if(i===3)applyAction(s,'updateEnquiry',{id:e.id,takeover:true},{id:'staff-frontdesk',role:'Receptionist'});if(i===0){e.resolved=true;e.stage='Closed / Lost';e.statusHistory.push({from:'Contacted',to:e.stage,at:s.clock,actorId:'demo-seed'});}});
 s.clock='2026-10-11T03:00:00.000Z';const pending=s.followUpJobs.filter(j=>j.status==='Pending');if(pending[0])pending[0].failSimulation=true;
 applyAction(s,'advance',{hours:1},{id:'demo-seed',role:'Admin'});
 return s;
}
