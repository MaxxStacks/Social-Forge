// Read-only supplier catalog ingestion. API credentials never leave the server.
// No orders, engagement delivery, or charges are triggered by this module.
export const PROVIDERS = Object.freeze([
  {id:'boostero',label:'Boostero',endpoint:'https://boostero.com/api/v2',keyName:'BOOSTERO_API_KEY',format:'form'},
  {id:'smmworld',label:'SMM World',endpoint:'https://my.smmworld.org/api/v2',keyName:'SMMWORLD_API_KEY',format:'json'},
  {id:'justanotherpanel',label:'JustAnotherPanel',endpoint:'https://www.justanotherpanel.live/api/public/v2',keyName:'JAP_API_KEY',format:'json'},
]);
export const normalizePlatform=(category,name)=>{
 const source=(category+' '+name).toLowerCase();
 const matches=[
 ['instagram',/instagram|\binsta\b|\big\b/],['tiktok',/tik\s?tok/],
 ['facebook',/facebook|\bfb\b/],['youtube',/you\s?tube|\byt\b/],
 ['threads',/threads/],['x',/twitter|\bx\.com\b|\bx\s*\/\s*twitter\b/],
 ['snapchat',/snapchat/],['whatsapp',/whatsapp/],['telegram',/telegram/],
 ['spotify',/spotify/],['discord',/discord/],['twitch',/twitch/],
 ['pinterest',/pinterest/],['linkedin',/linkedin/],['reddit',/reddit/],['bluesky',/bluesky/]
 ];
 return matches.find(([,rx])=>rx.test(source))?.[0]||null;
};
export function normalizeServices(rows, provider, multiplier=2.5, currency='USD'){
 if(!Array.isArray(rows))throw new Error('Supplier response was not an array of services');
 return rows.flatMap(row=>{
   if(!row || typeof row!=='object')return [];
   const serviceId=String(row.service||'');
   const rate=Number(row.rate), min=Number(row.min), max=Number(row.max);
   if(!/^[0-9]+$/.test(serviceId)||!Number.isFinite(rate)||rate<0||!Number.isInteger(min)||!Number.isInteger(max)||min<1||max<min)return [];
   const name=String(row.name||'').trim().slice(0,180);
   const supplierCategory=String(row.category||'').trim().slice(0,180);
   if(!name)return [];
   const platform=normalizePlatform(supplierCategory,name);
   if(!platform)return []; // hold unknown/misclassified products, don't invent a platform.
   const type=String(row.type||'Default').slice(0,80);
   const retailRatePer1000=Math.round(rate*multiplier*100)/100;
   const id=provider.id+'-'+serviceId;
   return [{
     id,platform,category:supplierCategory||'Other',name,
     description:supplierCategory+' • '+type+' • '+min.toLocaleString('en-US')+'–'+max.toLocaleString('en-US')+' units',
     supplier:provider.label,orderType:type,min,max,
     refill:Boolean(row.refill),cancel:Boolean(row.cancel),
     pricePer1000:retailRatePer1000,priceCurrency:currency,pricingBasis:'per 1,000',
     status:'supplier-unreviewed',requiresReview:true,
     // Supplier price / ID stays server-side; never expose wholesale rates publicly.
     _supplierId:provider.id,_supplierServiceId:serviceId,_wholesaleRate:rate
   }];
 });
}
export async function fetchSupplierServices(provider, key, fetcher=fetch){
 if(typeof key!=='string'||!key.trim())throw new Error('Supplier key missing');
 const payload={key,action:'services'};
 const isForm=provider.format==='form';
 const response=await fetcher(provider.endpoint,{
  method:'POST',
  headers:{'Content-Type':isForm?'application/x-www-form-urlencoded':'application/json'},
  body:isForm?new URLSearchParams(payload).toString():JSON.stringify(payload),
  signal:AbortSignal.timeout(12000)
 });
 if(!response.ok)throw new Error(provider.id+' returned HTTP '+response.status);
 const body=await response.json();
 if(!Array.isArray(body))throw new Error(provider.id+' sent an invalid services response');
 return body;
}
export const sanitizeForStorefront=({ _supplierId,_supplierServiceId,_wholesaleRate,...publicService})=>publicService;
