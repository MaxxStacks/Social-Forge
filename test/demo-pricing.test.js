import {test} from 'node:test';import assert from 'node:assert/strict';
import {demoPrice} from '../src/demo-pricing.js';
test('demo savings increase with volume',()=>{
 const low=demoPrice('demo-instagram-followers',500);
 const mid=demoPrice('demo-instagram-followers',1000);
 const high=demoPrice('demo-instagram-followers',5000);
 assert.equal(low.quote.volumePercent,0);
 assert.equal(mid.quote.volumePercent,5);
 assert.equal(high.quote.volumePercent,10);
 assert.ok(high.quote.totalCents<high.quote.baseCents);
});
test('demo coupon applies after volume discounts',()=>{
 const q=demoPrice('demo-instagram-followers',5000,'WELCOME10');
 assert.equal(q.quote.couponPercent,10);
 assert.equal(q.quote.couponSavingsCents,Math.round((q.quote.baseCents-q.quote.volumeSavingsCents)*.10));
 assert.equal(q.quote.totalCents,q.quote.baseCents-q.quote.savingsCents);
});
test('invalid coupons and quantities fail',()=>{
 assert.equal(demoPrice('demo-instagram-followers',500,'FAKE').status,422);
 assert.equal(demoPrice('demo-instagram-followers',-1).status,422);
});
