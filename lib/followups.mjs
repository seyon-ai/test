import {mockMessaging} from './integrations.mjs';
export function consented(s,id){return s.consentRecords.filter(c=>c.contactId===id).at(-1)?.granted===true;}
export function suppression(s,e){
 if(!consented(s,e.contactId))return 'Consent withdrawn or absent';
 if(e.takeover)return 'Human takeover';
 if(e.resolved||['Confirmed','Attended','Closed / Lost'].includes(e.stage))return 'Enquiry resolved or terminal';
 if(s.appointmentRequests.some(a=>a.enquiryId===e.id&&['Confirmed','Rejected','Cancelled'].includes(a.status)))return 'Appointment finalized or cancelled';
 return null;
}
export function schedule(s,e,id){
 if(!s.settings.followUpEnabled||suppression(s,e)||s.followUpJobs.some(j=>j.enquiryId===e.id&&j.status==='Pending'))return;
 s.followUpJobs.push({id:id(),enquiryId:e.id,contactId:e.contactId,status:'Pending',dueAt:new Date(Date.parse(s.clock)+s.settings.intervalHours*3600000).toISOString(),createdAt:s.clock,attempts:0,maxAttempts:2,failSimulation:false,history:[]});
}
export function executeDue(s,audit,message){
 for(const j of s.followUpJobs.filter(j=>j.status==='Pending'&&j.dueAt<=s.clock)){
  const e=s.enquiries.find(e=>e.id===j.enquiryId),reason=!s.settings.followUpEnabled?'Automation disabled':suppression(s,e);
  if(reason){j.status='Cancelled';j.reason=reason;j.history.push({at:s.clock,status:j.status,reason});audit('Follow-up suppressed',e.id,reason);continue;}
  j.attempts++;
  try{j.provider=mockMessaging.send(j);j.status='Sent';j.sentAt=s.clock;message(e.id,'outbound','Following up on your enquiry. If you would like our staff to assist with an appointment request, please reply here.','Follow-up simulation');audit('Follow-up simulated',e.id,'No external message sent');}
  catch(error){j.status='Failed';j.reason=error.message;audit('Follow-up failed',e.id,j.reason);}
  j.history.push({at:s.clock,status:j.status,attempt:j.attempts,...(j.reason?{reason:j.reason}:{})});
 }
}
export function cancelIneligible(s,audit){for(const j of s.followUpJobs.filter(j=>j.status==='Pending')){const e=s.enquiries.find(e=>e.id===j.enquiryId);const reason=suppression(s,e);if(reason){j.status='Cancelled';j.reason=reason;j.history.push({at:s.clock,status:j.status,reason});audit('Follow-up suppressed',e.id,reason);}}}
