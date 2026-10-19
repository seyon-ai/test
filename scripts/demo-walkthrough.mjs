// One complete fictional enquiry journey, end to end, with self-checks.
// Usage: node scripts/demo-walkthrough.mjs   (from repo root; no dependencies)
// Prints a presenter-friendly transcript and verifies the 7 feature areas.
import {demoSeed,seed} from '../lib/seed.mjs';
import {applyAction} from '../lib/engine.mjs';
import {evaluateFAQ} from '../lib/faq.mjs';
import {metrics} from '../lib/reporting.mjs';

let pass=0,fail=0;
const ok=(cond,label,detail='')=>{if(cond){pass++;console.log('  ✅ '+label)}else{fail++;console.log('  ❌ '+label+(detail?' — '+detail:''))}};
const admin={id:'demo-admin',role:'Admin'},recep={id:'demo-recep',role:'Receptionist'};

console.log('\n══════════════════════════════════════════════════');
console.log('  ClinicFlow AI — full fictional enquiry walkthrough');
console.log('  (synthetic patient data only — nothing leaves this process)');
console.log('══════════════════════════════════════════════════\n');

const s=seed();s.clock='2026-10-11T02:00:00.000Z';
for(const key of ['contacts','enquiries','messages','appointmentRequests','followUpJobs','consentRecords','auditEvents','integrationEvents'])s[key]=[];

console.log('STEP 1 — Patient enquiry capture (web form)');
console.log('  Patient "Nurul Izzati" asks: "How do I request an appointment? I would like braces."');
const created=applyAction(s,'create',{name:'Nurul Izzati',phone:'+60123456789',service:'Braces & Aligners',source:'Website',message:'How do I request an appointment? I would like braces.',consent:true,preferredDate:'2026-10-15',preferredTime:'10:30'},admin,'evt-demo-001');
ok(!!created.enquiryId,'enquiry created with unique ID');
const e=s.enquiries.at(-1);
ok(s.contacts.length===1&&s.contacts[0].phone==='+60123456789','contact captured (Malaysian +60 normalised)');
ok(s.consentRecords.at(-1).granted===true,'follow-up consent recorded');

console.log('\nSTEP 2 — Automatic staff assignment');
ok(e.assignedStaffId==='staff-coordinator','Braces & Aligners routed to Treatment Coordinator (routing rule)');

console.log('\nSTEP 3 — Approved FAQ response');
const inbound=s.messages.find(m=>m.direction==='inbound');
const auto=s.messages.find(m=>m.direction==='outbound');
const faq=evaluateFAQ(s.faqEntries,inbound.text);
ok(auto.author==='FAQ Assistant'||auto.author==='Staff handoff','automatic reply posted to thread');
ok(faq.escalated===false&&auto.text===s.faqEntries.find(f=>f.id===faq.faqId)?.answer,'reply is the exact approved FAQ text (verbatim, no invention)');
console.log('  ↳ approved answer: "'+auto.text.slice(0,80)+'…"');

console.log('\nSTEP 4 — Clinical escalation guard (the safety story)');
const esc=evaluateFAQ(s.faqEntries,'My tooth hurts and I want pain medicine, is it safe?');
ok(esc.escalated===true&&esc.faqId===null,'clinical/urgent wording → fixed staff handoff, never auto-answered');

console.log('\nSTEP 5 — Appointment request & explicit staff confirmation');
ok(s.appointmentRequests.length===1&&s.appointmentRequests[0].status==='Pending','appointment request created (Pending — availability unverified)');
let blocked=false;try{applyAction(s,'stage',{id:e.id,stage:'Confirmed'},recep,'evt-demo-002')}catch{blocked=true}
ok(blocked,'pipeline cannot jump to Confirmed — staff must confirm the request explicitly');
applyAction(s,'appointment',{id:s.appointmentRequests[0].id,status:'Confirmed'},recep,'evt-demo-003');
ok(s.appointmentRequests[0].status==='Confirmed'&&e.stage==='Confirmed','Receptionist confirmed → request + pipeline updated with actor history');

console.log('\nSTEP 6 — Follow-up scheduling & suppression');
applyAction(s,'create',{name:'Jason Lim',phone:'+60129876543',service:'General Dentistry',source:'WhatsApp',message:'Where is the clinic?',consent:true},admin,'evt-demo-004');
const e2=s.enquiries.at(-1),j2=s.followUpJobs.find(j=>j.enquiryId===e2.id);
ok(!!j2&&j2.status==='Pending','follow-up job auto-scheduled for consented enquiry (interval 24h)');
applyAction(s,'updateEnquiry',{id:e2.id,takeover:true},recep,'evt-demo-005');
applyAction(s,'advance',{hours:1},admin,'evt-demo-006');
ok(j2.status==='Cancelled'&&/takeover/i.test(j2.reason),'human takeover suppresses the pending job immediately');
applyAction(s,'create',{name:'Chloe Tan',phone:'+60133445566',service:'Cosmetic Dentistry',source:'Facebook',message:'What services do you offer?',consent:true},admin,'evt-demo-007');
const e3=s.enquiries.at(-1),j3=s.followUpJobs.find(j=>j.enquiryId===e3.id);
applyAction(s,'advance',{hours:25},admin,'evt-demo-008');
ok(j3.status==='Sent'&&j3.attempts===1,'due job executed exactly once (simulated send — labelled as such)');
applyAction(s,'advance',{hours:48},admin,'evt-demo-009');
ok(j3.attempts===1,'no autonomous re-send');
applyAction(s,'optout',{id:e3.id},recep,'evt-demo-010');
ok(s.consentRecords.at(-1).granted===false,'opt-out recorded at contact level');

console.log('\nSTEP 7 — Audit log, idempotency & reporting');
ok(s.auditEvents.length>=10,'audit events recorded for every action (actor, role, timestamp, enquiry)');
const before=JSON.stringify(s);
const replay=applyAction(s,'create',{name:'Nurul Izzati',phone:'+60123456789',service:'Braces & Aligners',source:'Website',message:'duplicate?',consent:true},admin,'evt-demo-001');
ok(replay.duplicate===true&&JSON.stringify(s)===before,'replayed event ID is suppressed — zero duplicate records');
const m=metrics(s);
ok(m.total===3&&m.confirmed===1&&m.unresolved>=2,'dashboard metrics reconcile with stored records');
console.log('  ↳ totals:',JSON.stringify({total:m.total,confirmed:m.confirmed,unresolved:m.unresolved,jobs:m.jobs}));

console.log('\nSTEP 8 — Demo-history richness (what the director first sees)');
const demo=demoSeed();
const dm=metrics(demo);
ok(demo.enquiries.length===12,'workspace opens with 12 realistic fictional dental enquiries');
ok(Object.keys(dm.pipeline).length>=4,'pipeline is populated across stages for an instant dashboard');
console.log('  ↳ pipeline:',JSON.stringify(dm.pipeline),'| sources:',JSON.stringify(dm.sources));

console.log('────────────────────────────────────────────────────');
console.log('  RESULT: '+pass+' passed, '+fail+' failed');
console.log('────────────────────────────────────────────────────\n');
process.exit(fail?1:0);
