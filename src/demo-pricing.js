import {demoQuote} from './demo-catalog.js';
export const DEMO_TIERS=[{min:1000,percent:5},{min:5000,percent:10},{min:10000,percent:15},{min:25000,percent:20}];
export const DEMO_CODES={WELCOME10:10,SAVE5:5,BULK15:15};
export function demoPrice(serviceId,quantity,code=''){
 const initial=demoQuote(serviceId,quantity);
 if(initial.error)return initial;
 const normalized=String(code||'').trim().toUpperCase().slice(0,20);
 if(normalized&&!Object.hasOwn(DEMO_CODES,normalized))return {error:'Not a valid demo discount code',status:422};
 const baseCents=initial.quote.totalCents;
 const volumePercent=DEMO_TIERS.reduce((pct,t)=>quantity>=t.min?t.percent:pct,0);
 const volumeSavingsCents=Math.round(baseCents*volumePercent/100);
 const afterVolume=baseCents-volumeSavingsCents;
 if(normalized==='BULK15'&&afterVolume<5000)return {error:'BULK15 requires a $50.00 demo subtotal after volume savings',status:422};
 const couponPercent=normalized?DEMO_CODES[normalized]:0;
 const couponSavingsCents=Math.round(afterVolume*couponPercent/100);
 return {quote:{...initial.quote,baseCents,volumePercent,volumeSavingsCents,couponCode:normalized,couponPercent,couponSavingsCents,totalCents:Math.max(0,afterVolume-couponSavingsCents),savingsCents:volumeSavingsCents+couponSavingsCents,disclaimer:'Simulated discounts with no monetary value. No payment or provider fulfillment.'}};
}
