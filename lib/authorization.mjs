export const permissions = {
 Admin: ['create','reply','note','updateEnquiry','stage','appointment','optout','advance','retry','cancelJob','faq','settings','routing','replay'],
 Receptionist: ['create','reply','note','updateEnquiry','stage','appointment','optout','cancelJob'],
 Manager: []
};
export function authorize(role,action){ if(!permissions[role]?.includes(action)) throw new Error('Forbidden: your role cannot perform this action.'); }
export function effectiveRole(stored,preview){
 if(!permissions[stored]) throw new Error('Forbidden: invalid membership.');
 if(stored==='Admin' && permissions[preview]) return preview;
 return stored;
}
