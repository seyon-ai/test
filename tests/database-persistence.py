# Exercise the actual migrated local D1 SQLite file, including atomic revisions.
import sqlite3, pathlib, json, subprocess
root=pathlib.Path(__file__).resolve().parents[1]
paths=list((root/'.wrangler/state/v3/d1/miniflare-D1DatabaseObject').glob('*.sqlite'))
dbpath=next(p for p in paths if p.name!='metadata.sqlite')
state=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {seed} from './lib/seed.mjs'; console.log(JSON.stringify(seed()))"],cwd=root))
con=sqlite3.connect(dbpath)
con.execute('PRAGMA foreign_keys = ON')
con.execute('DELETE FROM memberships WHERE user_id = ?',('persistence-test',))
con.execute('DELETE FROM workspaces WHERE owner_id = ?',('persistence-test',))
con.execute('INSERT INTO workspaces(owner_id,state,revision,created_at) VALUES(?,?,0,?)',('persistence-test',json.dumps(state),state['clock']))
con.execute('INSERT INTO memberships(user_id,workspace_id,role) VALUES(?,?,?)',('persistence-test','persistence-test','Receptionist'))
con.commit();con.close()
# New connection simulates reload; all entities and IDs must match exactly.
con=sqlite3.connect(dbpath)
stored,revision=con.execute('SELECT state,revision FROM workspaces WHERE owner_id=?',('persistence-test',)).fetchone()
assert json.loads(stored)==state
assert con.execute('SELECT role FROM memberships WHERE user_id=?',('persistence-test',)).fetchone()[0]=='Receptionist'
changed=con.execute('UPDATE workspaces SET revision=revision+1 WHERE owner_id=? AND revision=?',('persistence-test',revision)).rowcount
assert changed==1
stale=con.execute('UPDATE workspaces SET revision=revision+1 WHERE owner_id=? AND revision=?',('persistence-test',revision)).rowcount
assert stale==0
con.execute('DELETE FROM memberships WHERE user_id=?',('persistence-test',))
con.execute('DELETE FROM workspaces WHERE owner_id=?',('persistence-test',));con.commit();con.close()
print('PASS: migrated D1 persistence, membership reload, entity references and concurrent-write protection')
