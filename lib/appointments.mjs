export function changeAppointment(s,p,actor,stage,audit){
 const a=s.appointmentRequests.find(a=>a.id===p.id);
 if(!a)throw new Error('Request not found');
 if(!['Confirmed','Rejected','Cancelled'].includes(p.status))throw new Error('Invalid appointment status');
 if(a.status!=='Pending'&&!(a.status==='Confirmed'&&p.status==='Cancelled'))throw new Error('Request is already finalized');
 const e=s.enquiries.find(e=>e.id===a.enquiryId);
 if(e.stage==='Attended')throw new Error('An attended appointment cannot be cancelled.');
 a.status=p.status;a.notes=String(p.notes||a.notes).trim().slice(0,1000);
 a.history.push({status:a.status,at:s.clock,actorId:actor.id});
 stage(e,a.status==='Confirmed'?'Confirmed':a.status==='Rejected'?'Closed / Lost':'Contacted','Explicit staff '+a.status);
 audit('Appointment '+a.status,e.id,'Staff-confirmed demo only; no verified scheduling provider');
}
