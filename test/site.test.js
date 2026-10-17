import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {app} from '../src/server.js';
import {platforms} from '../src/catalog.js';

test('platform taxonomy covers 16 supported networks',()=>assert.equal(platforms.length,16));
test('public preview routes and disabled checkout',async()=>{
 const server=http.createServer(app).listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));
 try{
  const base='http://127.0.0.1:'+server.address().port;
  const health=await fetch(base+'/api/health'); assert.equal(health.status,200); assert.equal((await health.json()).mode,'preview');
  const home=await fetch(base+'/'); assert.equal(home.status,200); assert.match(await home.text(),/SocialForge/);
  const css=await fetch(base+'/styles.css');assert.equal(css.status,200);
  const script=await fetch(base+'/app.js');assert.equal(script.status,200);
  const catalog=await fetch(base+'/api/catalog?platform=instagram');const data=await catalog.json();assert.equal(catalog.status,200);assert.equal(data.platforms.length,16);assert.equal(data.sync.mode,'supplier-api-read-only');
  const missingService=await fetch(base+'/services/unknown');assert.equal(missingService.status,404);
  for(const route of ['/explore','/tools','/help']){const page=await fetch(base+route);assert.equal(page.status,200);assert.match(await page.text(),/SocialForge/i)}
  for(const asset of ['/pages.css','/explore.js','/tools.js']){const resource=await fetch(base+asset);assert.equal(resource.status,200)}
  const payment=await fetch(base+'/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:'{}'});assert.equal(payment.status,403);
  const admin=await fetch(base+'/api/admin/overview');assert.equal(admin.status,404);
 }finally{server.close();}
});
