import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const js=files('dist/server').filter(p=>p.endsWith('.js')).map(p=>fs.readFileSync(p,'utf8')).join('\n');
for(const text of ['local_clinicflow_demo_admin','admin@clinicflow.test','__sites_local_auth'])assert.ok(!js.includes(text),'Development fixture found in production Worker: '+text);
console.log('PASS: loopback-only fictional auth fixture is excluded from production Worker.');
