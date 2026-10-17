import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(dir+'/'+e.name):dir+'/'+e.name))).flat()}
const all=(await Promise.all(['src','public','scripts','test'].map(files))).flat();
let failures=0;
for(const file of all){
 if(/\.(?:js|mjs)$/.test(file)){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0){console.error(result.stderr);failures++}}
 if(file.startsWith('public/')&&/\.(css|html)$/.test(file)){
  const content=await readFile(file,'utf8');
  if(/(?:linear|radial|conic)-gradient\(/i.test(content)){console.error('Gradient found: '+file);failures++}
  if(/SocialForge|SOCIALFORGE|>forge<|>FORGE</.test(content)){console.error('Old branding found: '+file);failures++}
 }
}
if(failures)process.exitCode=1;else console.log('Syntax, public branding and no-gradient checks passed.');
