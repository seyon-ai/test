export const malaysiaDay=t=>new Date(t).toLocaleDateString('en-CA',{timeZone:'Asia/Kuala_Lumpur'});
export function metrics(s,from='',to=''){
 const day=malaysiaDay;
 const inRange=t=>(!from||day(t)>=from)&&(!to||day(t)<=to);
 const en=s.enquiries.filter(e=>inRange(e.createdAt)); const ids=new Set(en.map(e=>e.id));
 const appointments=s.appointmentRequests.filter(a=>inRange(a.createdAt));
 const responseTimes=(predicate)=>en.map(e=>{const first=s.messages.filter(m=>m.enquiryId===e.id&&m.direction==='outbound'&&predicate(m)).sort((a,b)=>a.createdAt.localeCompare(b.createdAt))[0];return first?Math.max(0,(Date.parse(first.createdAt)-Date.parse(e.createdAt))/60000):null;}).filter(t=>t!==null);
 const times=responseTimes(()=>true);
 const automated=responseTimes(m=>m.kind==='automated'||(!m.kind&&['FAQ Assistant','Staff handoff'].includes(m.author)));
 const human=responseTimes(m=>m.kind==='staff'||(!m.kind&&m.author.startsWith('Staff •')));
 const average=list=>list.length?list.reduce((a,b)=>a+b,0)/list.length:null;
 const group=(list,key)=>list.reduce((a,r)=>(a[r[key]]=(a[r[key]]||0)+1,a),{});
 const days=group(en.map(e=>({...e,day:day(e.createdAt)})),'day');
 return {total:en.length,today:en.filter(e=>day(e.createdAt)===day(s.clock)).length,pending:appointments.filter(a=>a.status==='Pending').length,confirmed:appointments.filter(a=>a.status==='Confirmed').length,attended:en.filter(e=>e.stage==='Attended').length,unresolved:en.filter(e=>!e.resolved&&e.stage!=='Closed / Lost'&&e.stage!=='Attended').length,response:times.length?times.reduce((a,b)=>a+b,0)/times.length:null,responseSample:times.length,automatedResponse:average(automated),automatedResponseSample:automated.length,humanResponse:average(human),humanResponseSample:human.length,sources:group(en,'source'),pipeline:group(en,'stage'),days,appointments:appointments.length,jobs:group(s.followUpJobs.filter(j=>ids.has(j.enquiryId)),'status')};
}
