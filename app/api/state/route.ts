import {getChatGPTUser} from '../../chatgpt-auth';
import {loadWorkspace} from '../../../lib/database';
import {effectiveRole} from '../../../lib/authorization.mjs';
export async function GET(request:Request){try{const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in with ChatGPT to open your private demo.'},{status:401});const w=await loadWorkspace(user.userId);return Response.json({...w,role:effectiveRole(w.role,new URL(request.url).searchParams.get('role')),identity:user.displayName},{headers:{'Cache-Control':'no-store'}});}catch(e:any){return Response.json({error:e.message},{status:500});}}
