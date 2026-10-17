import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {app} from '../src/server.js';
import {platforms,services} from '../src/catalog.js';

test('multi-platform catalog includes 16 platforms and seeded preview services',()=>{
 assert.equal(platforms.length,16);
 assert.equal(services.length,36);
 assert.ok(services.every(s=>s.status==='preview' && s.includes.length>0 && s.youProvide.length>0));
});
test('public preview routes and disabled checkout',async()=>{
 const server=http.createServer(app).listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));
 try{
  const base='http://127.0.0.1:'+server.address().port;
  const health=await fetch(base+'/api/health'); assert.equal(health.status,200); assert.equal((await health.json()).mode,'preview');
  const home=await fetch(base+'/'); assert.equal(home.status,200); assert.match(await home.text(),/SocialForge/);
  const css=await fetch(base+'/styles.css');assert.equal(css.status,200);
  const script=await fetch(base+'/app.js');assert.equal(script.status,200);
  const catalog=await fetch(base+'/api/catalog?platform=instagram');const products=(await catalog.json()).services;assert.ok(products.length>0);assert.ok(products.every(p=>p.platform==='instagram'));
  const detail=await fetch(base+'/services/'+services[0].id);assert.equal(detail.status,200);assert.match(await detail.text(),/detail-hero/);
  const serviceApi=await fetch(base+'/api/services/'+services[0].id);assert.equal(serviceApi.status,200);assert.equal((await serviceApi.json()).service.id,services[0].id);
  const missingService=await fetch(base+'/services/unknown');assert.equal(missingService.status,404);
  const payment=await fetch(base+'/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:'{}'});assert.equal(payment.status,403);
  const admin=await fetch(base+'/api/admin/overview');assert.equal(admin.status,404);
 }finally{server.close();}
});
