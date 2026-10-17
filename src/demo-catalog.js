import {platforms} from './catalog.js';
// Synthetic commerce fixtures. NEVER mix into the authenticated supplier catalog.
const templates=[
 {type:'Audience',suffix:'Audience expansion',category:'followers',unit:'followers',min:100,max:25000,rate:8.2},
 {type:'Reach',suffix:'Content discovery',category:'views',unit:'views',min:500,max:100000,rate:2.6},
 {type:'Engagement',suffix:'Community interactions',category:'engagement',unit:'interactions',min:50,max:25000,rate:5.4}
];
const tweaks={instagram:[1,1.15,1.2],tiktok:[1.1,.85,1.1],facebook:[.95,1.15,.95],youtube:[1.3,1.35,1.4],threads:[1.15,1,1.1],x:[1.2,1.05,1],snapchat:[1.15,.9,1.2],whatsapp:[1.45,1.3,1.4],telegram:[.8,.8,.95],spotify:[1.2,.85,1.3],discord:[1.25,1,1.1],twitch:[1.15,.95,1.15],pinterest:[1,1.05,1],linkedin:[1.5,1.25,1.35],reddit:[1.15,1.25,1.4],bluesky:[1.05,1,1.15]};
export const demoServices=platforms.flatMap((platform)=>templates.map((t,i)=>{
 const id='demo-'+platform.id+'-'+t.category;
 const display=platform.name+' '+t.suffix;
 return {
  id,platform:platform.id,category:t.category,name:display,description:`Illustrative ${platform.name} ${t.category} product for testing the storefront only.`,
  supplier:'DEMO / NO PROVIDER',orderType:'Preview only',min:t.min,max:t.max,
  refill:false,cancel:false,pricePer1000:Math.round(t.rate*tweaks[platform.id][i]*100)/100,
  priceCurrency:'CAD',pricingBasis:'per 1,000',
  status:'simulation',demo:true,requiresReview:true,unit:t.unit,
  disclaimer:'Synthetic sample. No supplier API, delivery, account interaction, or purchase is connected.'
 };
}));
export function demoServiceById(id){return demoServices.find(s=>s.id===id)||null}
export function demoQuote(id,quantity){
 const service=demoServiceById(id);
 if(!service)return {error:'Unknown demo service',status:404};
 if(typeof quantity!=='number'||!Number.isSafeInteger(quantity)||quantity<service.min||quantity>service.max)return {error:`Quantity must be between ${service.min} and ${service.max}`,status:422};
 const rateCents=Math.round(service.pricePer1000*100);
 // Integer cent calculation; quantity/rate here are bounded demonstration inputs.
 const totalCents=Math.round(rateCents*quantity/1000);
 return {quote:{serviceId:id,name:service.name,quantity,unit:service.unit,rateCentsPer1000:rateCents,totalCents,currency:'CAD',demo:true,checkoutEnabled:false,supplierConnected:false,message:'Simulation only — not a purchasable or fulfillable service.'}};
}
