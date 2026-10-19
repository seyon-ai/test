import {changeAppointment} from './appointments.mjs';
import {authorize} from './authorization.mjs';
import {evaluateFAQ} from './faq.mjs';
import {routeStaff} from './routing.mjs';
import {schedule,executeDue,cancelIneligible} from './followups.mjs';
export const stages=['New Enquiry','Contacted','Appointment Requested','Confirmed','Attended','Closed / Lost'];
import {services} from './clinic-config.mjs';
export {services};
export const uid=()=>crypto.randomUUID();
const clean=(v,max=1000)=>String(v??'').trim().slice(0,max);
export function applyAction(s,action,p={},actor={id:'test',role:'Admin'},eventId=uid()){
 authorize(actor.role,action);
 if(s.integrationEvents.some(e=>e.eventId===eventId))return {duplicate:true,enquiryId:s.integrationEvents.find(e=>e.eventId===eventId).enquiryId};
 const audit=(type,enquiryId=null,detail='')=>s.auditEvents.push({id:uid(),eventId,actorId:actor.id,actorRole:actor.role,type,enquiryId,detail,at:s.clock});
 const msg=(enquiryId,direction,text,author,faqId=null)=>s.messages.push({id:uid(),enquiryId,direction,text,author,faqId,kind:direction==='inbound'?'patient':author.startsWith('Staff •')?'staff':author==='Follow-up simulation'?'followup':'automated',createdAt:s.clock});
 const enquiry=()=>{const e=s.enquiries.find(e=>e.id===p.id);if(!e)throw new Error('Enquiry not found.');return e;};
 const stage=(e,next,reason)=>{const old=e.stage;e.stage=next;e.statusHistory.push({from:old,to:next,at:s.clock,actorId:actor.id,reason});audit('Pipeline updated',e.id,old+' → '+next);};
 /** @type {{duplicate?:boolean,enquiryId?:string}} */
 let result={};
 if(action==='create'){
  const name=clean(p.name,80),phone=clean(p.phone,30).replace(/[\s-]/g,'').replace(/^\+?60/,'+60'),text=clean(p.message);
  if(!name||!/^\+?60\d{8,10}$/.test(phone)||!text||!services.includes(p.service)||!['Website','WhatsApp','Facebook','Walk-in'].includes(p.source))throw new Error('Enter a name, Malaysian-format phone number (+60), service, source and message.');
  const preferredDate=clean(p.preferredDate,10),preferredTime=clean(p.preferredTime,5);
  if((preferredDate||preferredTime)&&(!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(preferredTime)||Number.isNaN(Date.parse(preferredDate))||new Date(preferredDate).toISOString().slice(0,10)!==preferredDate||preferredDate<s.clock.slice(0,10)))throw new Error('Choose a valid future preferred date and time.');
  let contact=s.contacts.find(c=>c.phone.replace(/^\+?60/,'+60')===phone);if(!contact){contact={id:uid(),clinicId:s.clinic.id,name,phone,createdAt:s.clock};s.contacts.push(contact);}
  s.consentRecords.push({id:uid(),contactId:contact.id,granted:p.consent===true,source:'Demo form',recordedAt:s.clock});
  const e={id:uid(),clinicId:s.clinic.id,contactId:contact.id,displayName:name,service:p.service,source:p.source,stage:'New Enquiry',assignedStaffId:routeStaff(s,p.service),takeover:false,resolved:false,escalated:false,notes:[],createdAt:s.clock,statusHistory:[{from:null,to:'New Enquiry',at:s.clock,actorId:actor.id}]};s.enquiries.push(e);msg(e.id,'inbound',text,name);
  const answer=evaluateFAQ(s.faqEntries,text);e.escalated=answer.escalated;msg(e.id,'outbound',answer.text,answer.escalated?'Staff handoff':'FAQ Assistant',answer.faqId);stage(e,'Contacted','Administrative response');audit(answer.escalated?'Staff escalation created':'Approved FAQ reply',e.id,answer.faqId||'Outside approved scope');audit('Staff assigned',e.id,e.assignedStaffId);
  if(preferredDate){const a={id:uid(),enquiryId:e.id,contactId:contact.id,service:e.service,preferredDate,preferredTime,staffId:e.assignedStaffId,status:'Pending',notes:'Preferred time only. Availability unverified.',createdAt:s.clock,history:[{status:'Pending',at:s.clock,actorId:actor.id}]};s.appointmentRequests.push(a);stage(e,'Appointment Requested','Patient preference');audit('Appointment request created',e.id,a.id);}
  schedule(s,e,uid);cancelIneligible(s,audit);audit('Enquiry created',e.id,name);result={enquiryId:e.id};
 } else if(action==='reply'){const e=enquiry();const t=clean(p.text);if(!t)throw new Error('Reply cannot be empty.');msg(e.id,'outbound',t,'Staff • '+actor.role);e.escalated=false;if(e.stage==='New Enquiry')stage(e,'Contacted','Staff reply');audit('Staff reply simulated',e.id,'No external message sent');}
 else if(action==='note'){const e=enquiry();const t=clean(p.text);if(!t)throw new Error('Note cannot be empty.');e.notes.push({id:uid(),text:t,actorId:actor.id,at:s.clock});audit('Internal note added',e.id);}
 else if(action==='updateEnquiry'){const e=enquiry();if(typeof p.takeover==='boolean')e.takeover=p.takeover;if(typeof p.resolved==='boolean')e.resolved=p.resolved;if(p.staffId){if(!s.users.some(u=>u.id===p.staffId&&u.active))throw new Error('Invalid staff');e.assignedStaffId=p.staffId;s.appointmentRequests.filter(a=>a.enquiryId===e.id&&a.status==='Pending').forEach(a=>a.staffId=p.staffId);}audit('Enquiry settings updated',e.id);cancelIneligible(s,audit);}
 else if(action==='stage'){const e=enquiry();const valid={'New Enquiry':['Contacted','Closed / Lost'],Contacted:['New Enquiry','Appointment Requested','Closed / Lost'],'Appointment Requested':['Contacted','Closed / Lost'],Confirmed:['Attended','Closed / Lost'],Attended:['Closed / Lost'],'Closed / Lost':[]};if(p.stage==='Confirmed')throw new Error('Confirm the appointment request explicitly on Appointment Requests.');if(!valid[e.stage]?.includes(p.stage))throw new Error('Invalid pipeline transition.');if(p.stage==='Appointment Requested'&&!s.appointmentRequests.some(a=>a.enquiryId===e.id&&a.status==='Pending'))throw new Error('Create an appointment request using the enquiry form.');if(p.stage==='Contacted'&&s.appointmentRequests.some(a=>a.enquiryId===e.id&&a.status==='Pending'))throw new Error('Cancel or reject the pending appointment request before moving back to Contacted.');if(p.stage==='Closed / Lost')s.appointmentRequests.filter(a=>a.enquiryId===e.id&&['Pending','Confirmed'].includes(a.status)).forEach(a=>{a.status='Cancelled';a.history.push({status:'Cancelled',at:s.clock,actorId:actor.id});});stage(e,p.stage,'Staff action');cancelIneligible(s,audit);}
 else if(action==='appointment'){changeAppointment(s,p,actor,stage,audit);cancelIneligible(s,audit);}
 else if(action==='optout'){const e=enquiry();s.consentRecords.push({id:uid(),contactId:e.contactId,granted:false,source:'Staff processed opt-out',recordedAt:s.clock});audit('Consent withdrawn',e.id);cancelIneligible(s,audit);}
 else if(action==='advance'){const hours=Number(p.hours);if(!Number.isFinite(hours)||hours<=0||hours>168)throw new Error('Advance between 1 and 168 hours.');s.clock=new Date(Date.parse(s.clock)+hours*3600000).toISOString();audit('Demo clock advanced',null,hours+' hours');executeDue(s,audit,msg);}
 else if(action==='cancelJob'||action==='retry'){const j=s.followUpJobs.find(j=>j.id===p.id);if(!j)throw new Error('Job not found');if(action==='cancelJob'){if(j.status!=='Pending')throw new Error('Only pending jobs can be cancelled');j.status='Cancelled';j.reason='Staff cancellation';}else{if(j.status!=='Failed'||j.attempts>=j.maxAttempts)throw new Error('Retry not permitted: failed jobs have a maximum of 2 attempts.');j.status='Pending';j.failSimulation=false;delete j.reason;j.dueAt=s.clock;}j.history.push({at:s.clock,status:j.status,reason:'Staff '+action});audit('Follow-up '+action,j.enquiryId);}
 else if(action==='faq'){const f=s.faqEntries.find(f=>f.id===p.id);if(!f)throw new Error('FAQ not found');const answer=clean(p.answer,2000);const keywords=clean(p.keywords,400).split(',').map(k=>k.trim()).filter(Boolean);if(!answer||!keywords.length)throw new Error('Answer and matching phrases required');f.answer=answer;f.keywords=keywords;f.approved=p.approved===true;f.updatedAt=s.clock;audit('FAQ approval updated',null,f.id);}
 else if(action==='routing'){if(!services.concat('*').includes(p.service)||!s.users.some(u=>u.id===p.staffId&&u.active))throw new Error('Invalid routing rule');const r=s.routingRules.find(r=>r.id===p.id);if(!r)throw new Error('Rule missing');r.service=p.service;r.staffId=p.staffId;r.enabled=p.enabled===true;audit('Routing rule updated',null,r.id);}
 else if(action==='settings'){if(p.intervalHours!==undefined){const h=Number(p.intervalHours);if(!Number.isFinite(h)||h<1||h>168)throw new Error('Follow-up interval must be 1–168 hours');s.settings.intervalHours=h;}if(typeof p.followUpEnabled==='boolean')s.settings.followUpEnabled=p.followUpEnabled;if(p.clinicName)s.clinic.name=clean(p.clinicName,80);audit('Clinic settings updated');}
 else if(action==='replay'){const ev=s.integrationEvents.find(e=>e.eventId===p.eventId);if(!ev)throw new Error('Event not found');audit('Integration replay suppressed',ev.enquiryId,'Existing unique event ID');result={duplicate:true,enquiryId:ev.enquiryId};}
 else throw new Error('Unknown action');
 s.integrationEvents.push({id:uid(),eventId,action,enquiryId:result.enquiryId||null,at:s.clock,status:result.duplicate?'Replay suppressed':'Processed',mode:'Demo'});
 return result;
}
