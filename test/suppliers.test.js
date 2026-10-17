import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PROVIDERS,normalizeServices,normalizePlatform,fetchSupplierServices} from '../src/suppliers.js';
import {getSnapshot,publicCatalog} from '../src/supplier-catalog.js';
test('supplier normalization uses actual upstream IDs, limits and rates',()=>{
 const samples=[{service:456,name:'Instagram Reels Views',category:'Instagram / Reels',rate:'0.90',min:'100',max:'100000',type:'Default',refill:true,cancel:false}];
 const services=normalizeServices(samples,PROVIDERS[0],2.5);
 assert.equal(services.length,1);
 assert.equal(services[0].id,'boostero-456');
 assert.equal(services[0].min,100);
 assert.equal(services[0].max,100000);
 assert.equal(services[0].pricePer1000,2.25);
 assert.equal(services[0].platform,'instagram');
 assert.equal(services[0]._wholesaleRate,0.9);
});
test('unknown platform is not mislabeled or published',()=>{
 assert.equal(normalizePlatform('Uncategorized','Unknown service'),null);
 assert.equal(normalizeServices([{service:1,name:'Mystery',category:'Uncategorized',rate:'1',min:'10',max:'100'}],PROVIDERS[0]).length,0);
});
test('no supplier key means zero invented products',async()=>{
 const s=await getSnapshot({force:true,environment:{}});
 assert.equal(s.services.length,0);
 assert.equal(s.configured,0);
 const c=await publicCatalog({environment:{}});
 assert.equal(c.services.length,0);
});
test('supplier POST requests use documented encoding and server-only credentials',async()=>{
 const calls=[];
 const fake=async(url,opts)=>{calls.push({url,opts});return {ok:true,json:async()=>[{service:1,name:'Instagram Story views',category:'Instagram',rate:'1',min:'100',max:'10000'}]}};
 await fetchSupplierServices(PROVIDERS[0],'test_key',fake);
 await fetchSupplierServices(PROVIDERS[1],'test_key',fake);
 assert.match(calls[0].opts.body,/action=services/);
 assert.match(calls[1].opts.body,/"action":"services"/);
 assert.equal(calls[1].url,'https://my.smmworld.org/api/v2');
});
