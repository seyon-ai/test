import fs from 'node:fs';
const input=JSON.parse(fs.readFileSync(0,'utf8'));
const results=[];
for(const test of [
 {name:'Anonymous document',path:'/',auth:false},
 {name:'Anonymous API read',path:'/api/state',auth:false},
 {name:'Service request cannot impersonate browser identity',path:'/api/state',auth:true},
 {name:'Unauthenticated appointment mutation rejected',path:'/api/action',auth:true,method:'POST',body:{action:'appointment',payload:{id:'qa-nonexistent',status:'Confirmed'},eventId:'qa-unauth-'+Date.now(),role:'Admin'}}
]){
 try{const headers={};if(test.auth)headers['OAI-Sites-Authorization']='Bearer '+input.token;if(test.body)headers['Content-Type']='application/json';const r=await fetch(input.url+test.path,{method:test.method||'GET',redirect:'manual',headers,...(test.body?{body:JSON.stringify(test.body)}:{})});const body=await r.text();results.push({test:test.name,status:r.status,contentType:r.headers.get('content-type'),signInGate:body.includes('Log in to access')||body.includes('Sign in required'),error:body.startsWith('{')?JSON.parse(body).error:undefined});}
 catch(error){results.push({test:test.name,error:error.message});}
}
fs.writeFileSync('qa/published-http-results.json',JSON.stringify({at:new Date().toISOString(),results},null,2));console.log(JSON.stringify(results));
