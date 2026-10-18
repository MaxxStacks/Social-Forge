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
  const home=await fetch(base+'/'); assert.equal(home.status,200); assert.match(await home.text(),/SocialEngine/);
  const css=await fetch(base+'/styles.css');assert.equal(css.status,200);
  const retailStyle=await fetch(base+'/retail-v2.css');assert.equal(retailStyle.status,200);
  const retailJs=await fetch(base+'/retail-v2.js');assert.equal(retailJs.status,200);

  for(const asset of ['/flat-ui.css','/mega-menu.js','/icons/instagram.svg','/icons/tiktok.svg','/icons/linkedin.svg']){
    const result=await fetch(base+asset);assert.equal(result.status,200,asset+' served');
  }
  const icon=await fetch(base+'/icons/nonexistent.svg');assert.equal(icon.status,404);
  const script=await fetch(base+'/app.js');assert.equal(script.status,200);
  const catalog=await fetch(base+'/api/catalog?platform=instagram');const data=await catalog.json();assert.equal(catalog.status,200);assert.equal(data.platforms.length,16);assert.equal(data.sync.mode,'supplier-api-read-only');
  const missingService=await fetch(base+'/services/unknown');assert.equal(missingService.status,404);
  for(const route of ['/explore','/tools','/help','/discover','/cart']){const page=await fetch(base+route);assert.equal(page.status,200);assert.match(await page.text(),/SocialEngine/i)}
  for(const asset of ['/pages.css','/explore.js','/tools.js','/experience.css','/experience-interactive.css','/cart-store.js','/experience.js','/discover.js','/demo-cart.js']){const resource=await fetch(base+asset);assert.equal(resource.status,200)}
  const shopper=await fetch(base+'/shop/instagram/followers');assert.equal(shopper.status,200);assert.match(await shopper.text(),/packageList/);
  const shopperView=await fetch(base+'/shop/tiktok/views');assert.equal(shopperView.status,200);
  const unsupported=await fetch(base+'/shop/notreal/followers');assert.equal(unsupported.status,404);
  for(const asset of ['/retail.css','/retail.js','/shop.css','/shop.js']){const resp=await fetch(base+asset);assert.equal(resp.status,200)}
  const demo=await fetch(base+'/api/demo/catalog');assert.equal(demo.status,200);const demoData=await demo.json();assert.equal(demoData.services.length,48);assert.equal(demoData.checkoutEnabled,false);
  const quote=await fetch(base+'/api/demo/quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({serviceId:'demo-instagram-views',quantity:1000})});assert.equal(quote.status,200);assert.equal((await quote.json()).quote.checkoutEnabled,false);
  const invalid=await fetch(base+'/api/demo/quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({serviceId:'demo-instagram-views',quantity:-2})});assert.equal(invalid.status,422);
  for(const route of ['/volume','/discounts','/rewards','/affiliates','/track','/articles','/articles/choosing-social-services','/support']){
    const response=await fetch(base+route);assert.equal(response.status,200,'Route: '+route);
    assert.match(await response.text(),/programMain/,'Programs shell: '+route);
  }
  for(const route of ['/account','/account/orders','/account/wallet','/account/transactions','/account/support','/account/settings']){
    const response=await fetch(base+route);assert.equal(response.status,200);assert.match(await response.text(),/dashboardView/);assert.match(response.headers.get('x-robots-tag'),/noindex/);
  }
  assert.equal((await fetch(base+'/articles/not-an-article')).status,404);
  assert.equal((await fetch(base+'/account/not-a-section')).status,404);
  assert.equal((await fetch(base+'/robots.txt')).status,200);
  assert.equal((await fetch(base+'/sitemap.xml')).status,200);
  const articleSource=await (await fetch(base+'/articles/choosing-social-services')).text();assert.match(articleSource,/Check what you are actually buying/);
  for(const asset of ['/programs.css','/programs.js','/resources.js','/cart-flat.css']){
    assert.equal((await fetch(base+asset)).status,200,'Asset: '+asset);
  }
  const discounted=await fetch(base+'/api/demo/quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({serviceId:'demo-instagram-followers',quantity:5000,code:'WELCOME10'})});
  assert.equal(discounted.status,200);
  const promo=(await discounted.json()).quote;
  assert.equal(promo.volumePercent,10);
  assert.equal(promo.couponPercent,10);
  assert.ok(promo.totalCents<promo.baseCents);
  const payment=await fetch(base+'/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:'{}'});assert.equal(payment.status,403);
  const admin=await fetch(base+'/api/admin/overview');assert.equal(admin.status,404);
 }finally{server.close();}
});
