import {getChatGPTUser} from '../../chatgpt-auth';
import {loadWorkspace} from '../../../lib/database';
import {diagnosticSummary} from '../../../lib/diagnostics.mjs';
export async function GET(){
 try{
  const user=await getChatGPTUser();
  if(!user)return Response.json({error:'Authentication required'},{status:401});
  const w=await loadWorkspace(user.userId);
  const bytes=new TextEncoder().encode(JSON.stringify(w.state));
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  const snapshotDigest=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  return Response.json({...diagnosticSummary(w.state,w.revision),snapshotDigest,stateBytes:bytes.byteLength},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e:any){return Response.json({error:e.message},{status:e.message.startsWith('Forbidden')?403:500});}
}
