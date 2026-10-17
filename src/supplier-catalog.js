import {PROVIDERS,fetchSupplierServices,fetchSupplierCurrency,normalizeServices,sanitizeForStorefront} from './suppliers.js';
const MAX_AGE_MS=15*60*1000;
let state={services:[],providers:[],lastUpdated:null,configured:0,connected:0,errors:[]};
let expires=0;
let inFlight;
export async function getSnapshot({force=false,environment=process.env,fetcher=fetch}={}){
 if(!force && Date.now()<expires)return state;
 if(inFlight)return inFlight;
 inFlight=(async()=>{
  const configured=PROVIDERS.filter(p=>environment[p.keyName]?.trim());
  const providerStatuses=PROVIDERS.map(p=>({id:p.id,name:p.label,configured:Boolean(environment[p.keyName]?.trim()),connected:false}));
  if(!configured.length){
   state={services:[],providers:providerStatuses,lastUpdated:null,configured:0,connected:0,errors:[]};
   expires=Date.now()+MAX_AGE_MS;
   return state;
  }
  const markup=Number(environment.RETAIL_MARKUP_MULTIPLIER||'2.5');
  if(!Number.isFinite(markup)||markup<1||markup>20)throw Error('Invalid markup configuration');
  const outcomes=await Promise.allSettled(configured.map(async p=>{
   const [rows,currency]=await Promise.all([fetchSupplierServices(p,environment[p.keyName],fetcher),fetchSupplierCurrency(p,environment[p.keyName],fetcher)]);
   return {provider:p,rows,services:normalizeServices(rows,p,markup,currency),currency};
  }));
  const services=[],errors=[];
  for(let i=0;i<outcomes.length;i++){
   const p=configured[i],o=outcomes[i],entry=providerStatuses.find(s=>s.id===p.id);
   if(o.status==='fulfilled'){entry.connected=true;entry.count=o.value.services.length;services.push(...o.value.services);}
   else {entry.error='Supplier unavailable';errors.push(p.id+' sync failed');}
  }
  // Never carry forward unverifiable inventory after a failed sync.
  state={services,providers:providerStatuses,lastUpdated:new Date().toISOString(),configured:configured.length,connected:providerStatuses.filter(p=>p.connected).length,errors};
  expires=Date.now()+(errors.length?60*1000:MAX_AGE_MS);
  return state;
 })();
 try{return await inFlight}finally{inFlight=null}
}
export async function publicCatalog({force=false,environment,fetcher}={}){
 const snapshot=await getSnapshot({force,environment,fetcher});
 return {services:snapshot.services.map(sanitizeForStorefront),providers:snapshot.providers,platforms:null,
  sync:{configured:snapshot.configured,connected:snapshot.connected,lastUpdated:snapshot.lastUpdated,errors:snapshot.errors,mode:'supplier-api-read-only',checkoutEnabled:false}};
}
export async function publicService(id){
 const state=await getSnapshot();
 const s=state.services.find(s=>s.id===id);
 return s?sanitizeForStorefront(s):null;
}
