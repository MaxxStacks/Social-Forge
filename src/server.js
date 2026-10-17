import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {platforms} from './catalog.js';
import {getSnapshot} from './supplier-catalog.js';
import {analyzeCatalog} from './quality.js';
import {publicCatalog,publicService} from './supplier-catalog.js';
import {demoServices,demoServiceById,demoQuote} from './demo-catalog.js';

const publicRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const files = new Map([['/','index.html'],['/index.html','index.html'],['/styles.css','styles.css'],['/app.js','app.js'],['/service.js','service.js'],['/service.css','service.css'],['/pages.css','pages.css'],['/explore.js','explore.js'],['/tools.js','tools.js'],['/experience.css','experience.css'],['/experience-interactive.css','experience-interactive.css'],['/cart-store.js','cart-store.js'],['/nav.js','nav.js'],['/discover.js','discover.js'],['/experience.js','experience.js'],['/demo-cart.js','demo-cart.js'],['/retail-v2.css','retail-v2.css'],['/retail-v2.js','retail-v2.js'],['/retail.css','retail.css'],['/retail.js','retail.js'],['/shop.css','shop.css'],['/shop.js','shop.js'],['/operations.css','operations.css'],['/operations.js','operations.js']]);
const contentTypes = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const headers = {'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY'};
function json(res,status,body) {
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});
 res.end(JSON.stringify(body));
}
export async function handle(req,res){
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(req.method==='GET'&&pathname==='/api/health') return json(res,200,{ok:true,service:'socialforge',mode:'preview',checkoutAvailable:false});
 if(req.method==='GET'&&pathname==='/api/catalog'){
   const params=new URL(req.url,'http://localhost').searchParams;
   const platform=params.get('platform'), query=(params.get('q')||'').toLowerCase().trim().slice(0,120);
   const snapshot=await publicCatalog();
   const services=snapshot.services.filter(s=>(!platform||s.platform===platform)&&(!query||(`${s.name} ${s.category} ${s.description}`).toLowerCase().includes(query)));
   return json(res,200,{platforms,services,sync:snapshot.sync,providers:snapshot.providers});
 }
 if(req.method==='GET'&&pathname.startsWith('/api/services/')){
   const id=pathname.slice('/api/services/'.length);
   if(!/^[a-z0-9-]{1,90}$/.test(id))return json(res,404,{error:'Service not found'});
   const service=id.startsWith('demo-')?demoServiceById(id):await publicService(id);
   return service?json(res,200,{service}):json(res,404,{error:'Service not found'});
 }
 if(req.method==='GET'&&pathname==='/api/operations/readiness'){
   const snapshot=await getSnapshot();
   const report=analyzeCatalog(snapshot);
   // Only aggregated counts and public provider names — no raw service or wholesale data.
   delete report.sample;
   report.providerStatus=snapshot.providers.map(p=>({id:p.id,name:p.name,connected:p.connected,configured:p.configured}));
   return json(res,200,report);
 }
 if(req.method==='GET'&&pathname==='/api/demo/catalog'){
  return json(res,200,{platforms,services:demoServices,mode:'simulated',checkoutEnabled:false,disclaimer:'Synthetic demonstration inventory. No upstream API, payment or fulfillment.'});
 }
 if(req.method==='GET'&&pathname.startsWith('/api/demo/services/')){
  const id=pathname.slice('/api/demo/services/'.length);
  const sample=demoServiceById(id);
  return sample?json(res,200,{service:sample}):json(res,404,{error:'Demo service not found'});
 }
 if(req.method==='POST'&&pathname==='/api/demo/quote'){
  let raw='';
  for await(const chunk of req){
   raw+=chunk.toString('utf8');
   if(raw.length>2048)return json(res,413,{error:'Request exceeds size limit'});
  }
  let data;try{data=JSON.parse(raw)}catch{return json(res,400,{error:'Invalid JSON'})}
  if(!data || typeof data.serviceId!=='string')return json(res,400,{error:'Missing serviceId'});
  const answer=demoQuote(data.serviceId,data.quantity);
  return answer.error?json(res,answer.status,{error:answer.error}):json(res,200,answer);
 }
 if(pathname==='/api/orders' || pathname.startsWith('/api/orders/')){
  return json(res,403,{error:'Checkout is disabled in this public preview. No orders or charges are accepted.'});
 }
 if(pathname==='/api/admin/overview')return json(res,404,{error:'Unavailable in public preview'});
 if(req.method==='GET'&&/^\/services\/[a-z0-9-]{1,90}\/?$/.test(pathname)){
 const id=pathname.split('/')[2];if(!(id.startsWith('demo-')?demoServiceById(id):await publicService(id)))return json(res,404,{error:'Service not found'});
 const body=await readFile(path.join(publicRoot,'service.html'));
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...headers,'Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'"});return res.end(body);
}
 if(req.method==='GET' && /^\/shop\/[a-z0-9-]+\/(followers|views|engagement)\/?$/.test(pathname)){
  const [,shop,network,serviceType]=pathname.split('/');
  if(!platforms.some(p=>p.id===network) || !['followers','views','engagement'].includes(serviceType))return json(res,404,{error:'Unsupported sample service'});
  const body=await readFile(path.join(publicRoot,'shop.html'));
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...headers,'Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"});
  return res.end(body);
 }
 if(req.method==='GET' && ['/cart','/discover','/operations'].includes(pathname)){
  const pageName=pathname==='/cart'?'cart.html':pathname==='/operations'?'operations.html':'discover.html';
  const body=await readFile(path.join(publicRoot,pageName));
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...headers,'Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'"});
  return res.end(body);
 }
 if(req.method==='GET' && ['/explore','/tools','/help'].includes(pathname)){
  const pageName=pathname.slice(1)+'.html';
  const body=await readFile(path.join(publicRoot,pageName));
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...headers,'Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"});
  return res.end(body);
 }
 if(req.method==='GET' && files.has(pathname)){
  const name=files.get(pathname);
  const type=contentTypes[path.extname(name)]||'application/octet-stream';
  const body=await readFile(path.join(publicRoot,name));
  res.writeHead(200,{'Content-Type':type,'Cache-Control':name==='index.html'?'no-cache':'public, max-age=3600',...headers,'Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"});
  return res.end(body);
 }
 return json(res,404,{error:'Not found'});
}
export function app(req,res){handle(req,res).catch(err=>{console.error('Request failed:',err.message);if(!res.headersSent)json(res,500,{error:'Internal server error'});else res.end();});}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||3000);
 const host=process.env.HOST||'0.0.0.0';
 http.createServer(app).listen(port,host,()=>console.log(`SocialForge preview listening on ${host}:${port}`));
}
