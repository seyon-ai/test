export const pageNames=['Overview','Enquiry Inbox','CRM Pipeline','Appointment Requests','Follow-Up Automation','FAQ Assistant','Analytics','Settings'];
export function parseNavigation(hash){try{const [name,id='']=decodeURIComponent(String(hash).replace(/^#/, '')).split('/');return {page:pageNames.includes(name)?name:'Overview',id:/^[a-f0-9-]{36}$/.test(id)?id:''};}catch{return {page:'Overview',id:''};}}
export function navigationHash(page,id=''){return '#'+encodeURIComponent(page)+(id?'/'+id:'');}
