import { env } from 'cloudflare:workers';
import { seed } from './seed.mjs';
export async function loadWorkspace(userId:string){
 if(!env.DB)throw new Error('Database unavailable. No changes were saved.');
 let row=await env.DB.prepare('SELECT state, revision FROM workspaces WHERE owner_id = ?').bind(userId).first<any>();
 if(!row){const initial=seed();await env.DB.batch([
 env.DB.prepare('INSERT OR IGNORE INTO workspaces (owner_id,state,revision,created_at) VALUES (?,?,0,?)').bind(userId,JSON.stringify(initial),new Date().toISOString()),
 env.DB.prepare('INSERT OR IGNORE INTO memberships (user_id,workspace_id,role) VALUES (?,?,?)').bind(userId,userId,'Admin')]);row=await env.DB.prepare('SELECT state, revision FROM workspaces WHERE owner_id = ?').bind(userId).first<any>();}
 const member=await env.DB.prepare('SELECT role,workspace_id FROM memberships WHERE user_id = ?').bind(userId).first<any>();
 if(!member||member.workspace_id!==userId)throw new Error('Forbidden: workspace membership required.');
 return {state:JSON.parse(row.state),revision:row.revision,role:member.role};
}
export async function saveWorkspace(userId:string,state:any,revision:number){
 const result=await env.DB!.prepare('UPDATE workspaces SET state = ?, revision = revision + 1 WHERE owner_id = ? AND revision = ?').bind(JSON.stringify(state),userId,revision).run();
 if(result.meta.changes!==1)throw new Error('Conflict: another action changed the clinic. Refresh and retry.');
}
