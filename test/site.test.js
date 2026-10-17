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
  const retailStyle=await fetch(base+'/retail-v2.css');assert.equal(retailStyle.status,200);
  const retailJs=await fetch(base+'/retail-v2.js');assert.equal(retailJs.status,200);
  assert.match(await home.text(),/Instagram followers/i);
  const script=await fetch(base+'/app.js');assert.equal(script.status,200);
  const catalog=await fetch(base+'/api/catalog?platform=instagram');const data=await catalog.json();assert.equal(catalog.status,200);assert.equal(data.platforms.length,16);assert.equal(data.sync.mode,'supplier-api-read-only');
  const missingService=await fetch(base+'/services/unknown');assert.equal(missingService.status,404);
  for(const route of ['/explore','/tools','/help','/discover','/cart']){const page=await fetch(base+route);assert.equal(page.status,200);assert.match(await page.text(),/SocialForge/i)}
  for(const asset of ['/pages.css','/explore.js','/tools.js','/experience.css','/experience-interactive.css','/cart-store.js','/experience.js','/discover.js','/demo-cart.js']){const resource=await fetch(base+asset);assert.equal(resource.status,200)}
  const demo=await fetch(base+'/api/demo/catalog');assert.equal(demo.status,200);const demoData=await demo.json();assert.equal(demoData.services.length,48);assert.equal(demoData.checkoutEnabled,false);
  const quote=await fetch(base+'/api/demo/quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({serviceId:'demo-instagram-views',quantity:1000})});assert.equal(quote.status,200);assert.equal((await quote.json()).quote.checkoutEnabled,false);
  const invalid=await fetch(base+'/api/demo/quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({serviceId:'demo-instagram-views',quantity:-2})});assert.equal(invalid.status,422);
  const payment=await fetch(base+'/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:'{}'});assert.equal(payment.status,403);
  const admin=await fetch(base+'/api/admin/overview');assert.equal(admin.status,404);
 }finally{server.close();}
});
