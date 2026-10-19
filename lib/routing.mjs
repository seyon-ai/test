export function routeStaff(state,service){
 const rules=state.routingRules.filter(r=>r.enabled).sort((a,b)=>a.priority-b.priority);
 const rule=rules.find(r=>r.service===service)||rules.find(r=>r.service==='*');
 return rule?.staffId || state.users.find(u=>u.active&&u.role==='Receptionist')?.id;
}
