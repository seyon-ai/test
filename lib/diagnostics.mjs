// Read-only, bounded verification payload. No contact details or auth secrets.
export function diagnosticSummary(s,revision){
 const count=(rows,field)=>rows.reduce((a,r)=>(a[r[field]]=(a[r[field]]||0)+1,a),{});
 const collections=['users','roles','contacts','enquiries','messages','faqEntries','appointmentRequests','followUpJobs','consentRecords','routingRules','auditEvents','integrationEvents'];
 return {revision,clock:s.clock,collections:Object.fromEntries(collections.map(k=>[k,s[k].length])),pipeline:count(s.enquiries,'stage'),sources:count(s.enquiries,'source'),appointmentStatuses:count(s.appointmentRequests,'status'),followUpStatuses:count(s.followUpJobs,'status'),unresolved:s.enquiries.filter(e=>!e.resolved&&!['Attended','Closed / Lost'].includes(e.stage)).length,latestEnquiries:s.enquiries.slice(-5).map(e=>({id:e.id,contactId:e.contactId,stage:e.stage,assignedStaffId:e.assignedStaffId,createdAt:e.createdAt})),responseClassification:'FAQ/handoff, human staff and follow-up records are separate; no external delivery is measured.'};
}
