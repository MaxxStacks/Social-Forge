import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {platforms} from './catalog.js';
import {getSnapshot} from './supplier-catalog.js';
import {analyzeCatalog} from './quality.js';
import {publicCatalog,publicService} from './supplier-catalog.js';
import {demoServices,demoServiceById} from './demo-catalog.js';
import {demoPrice} from './demo-pricing.js';
import {handleAccounts} from './accounts.js';
import {sendPage,articles,sitemap,indexable,siteOrigin} from './pages.js';
import {database,migrate} from './database.js';
import {assistantAnswer} from './assistant.js';

const publicRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const files = new Map([['/polish.css','polish.css'],['/fonts/geist-latin-wght-normal.woff2','fonts/geist-latin-wght-normal.woff2'],['/fonts/geist-latin-ext-wght-normal.woff2','fonts/geist-latin-ext-wght-normal.woff2'],['/fonts/Geist-LICENSE.txt','fonts/Geist-LICENSE.txt'],['/layout.css','layout.css'],['/account.css','account.css'],['/account.js','account.js'],['/article-data.js','article-data.js'],['/','index.html'],['/index.html','index.html'],['/styles.css','styles.css'],['/app.js','app.js'],['/service.js','service.js'],['/service.css','service.css'],['/pages.css','pages.css'],['/explore.js','explore.js'],['/tools.js','tools.js'],['/experience.css','experience.css'],['/experience-interactive.css','experience-interactive.css'],['/cart-store.js','cart-store.js'],['/nav.js','nav.js'],['/discover.js','discover.js'],['/experience.js','experience.js'],['/demo-cart.js','demo-cart.js'],['/retail-v2.css','retail-v2.css'],['/retail-v2.js','retail-v2.js'],['/retail.css','retail.css'],['/flat-ui.css','flat-ui.css'],['/mega-menu.js','mega-menu.js'],['/programs.css','programs.css'],['/programs.js','programs.js'],['/resources.js','resources.js'],['/cart-flat.css','cart-flat.css'],['/retail.js','retail.js'],['/shop.css','shop.css'],['/shop.js','shop.js'],['/operations.css','operations.css'],['/operations.js','operations.js']]);
const contentTypes = {'.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
for(const name of ['socialengine.css','site-experience.js','creator.webp','fonts/syne-latin-wght-normal.woff2','fonts/dm-sans-latin-wght-normal.woff2'])files.set('/'+name,name);
contentTypes['.webp']='image/webp';
const headers = {'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY'};
function json(res,status,body) {
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});
 res.end(JSON.stringify(body));
}
export async function handle(req,res){
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(req.method==='GET'&&pathname==='/api/assistant'){
  const q=new URL(req.url,'http://localhost').searchParams.get('q')||'';
  if(q.length>500)return json(res,400,{error:'Question must be 500 characters or fewer'});
  return json(res,200,{mode:'guided',...assistantAnswer(q)});
 }
 if(req.method==='GET'&&pathname==='/index.html'){res.writeHead(308,{Location:'/'});return res.end()}
 if(req.method==='GET'&&pathname==='/robots.txt'){res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});return res.end(indexable()?'User-agent: *\nDisallow: /account\nDisallow: /api/\nDisallow: /cart\nDisallow: /shop/\nDisallow: /services/\nSitemap: '+siteOrigin()+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n')}
 if(req.method==='GET'&&pathname==='/sitemap.xml'){res.writeHead(200,{'Content-Type':'application/xml; charset=utf-8'});return res.end(sitemap())}
 if(await handleAccounts(req,res,pathname))return;
 if(req.method==='GET'&&pathname==='/api/health') return json(res,200,{ok:true,service:'socialengine',mode:'preview',checkoutAvailable:false});
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
  const answer=demoPrice(data.serviceId,data.quantity,data.code);
  return answer.error?json(res,answer.status,{error:answer.error}):json(res,200,answer);
 }
 if(pathname==='/api/orders' || pathname.startsWith('/api/orders/')){
  return json(res,403,{error:'Checkout is disabled in this public preview. No orders or charges are accepted.'});
 }
 if(pathname==='/api/admin/overview')return json(res,404,{error:'Unavailable in public preview'});

 if(req.method==='GET'&&/^\/account(?:\/(?:orders(?:\/[a-f0-9-]{36})?|wallet|transactions|support|settings))?$/.test(pathname))return sendPage(res,'account.html',pathname);
 if(req.method==='GET'&&/^\/services\/[a-z0-9-]{1,90}\/?$/.test(pathname)){
  const id=pathname.split('/')[2];if(!(id.startsWith('demo-')?demoServiceById(id):await publicService(id)))return json(res,404,{error:'Service not found'});
  return sendPage(res,'service.html',pathname);
 }
 if(req.method==='GET'&&/^\/shop\/[a-z0-9-]+\/(followers|views|engagement)\/?$/.test(pathname)){
  const [,shop,network,serviceType]=pathname.split('/');
  if(!platforms.some(p=>p.id===network))return json(res,404,{error:'Service not found'});
  return sendPage(res,'shop.html',pathname.replace(/\/$/,''));
 }
 const programRoutes=['/volume','/discounts','/rewards','/affiliates','/track','/articles','/support'];
 if(req.method==='GET'&&(programRoutes.includes(pathname)||articles.some(a=>pathname==='/articles/'+a.slug)))return sendPage(res,'programs.html',pathname);
 const pageRoutes={'/cart':'cart.html','/discover':'discover.html','/operations':'operations.html','/explore':'explore.html','/tools':'tools.html','/help':'help.html'};
 if(req.method==='GET'&&pageRoutes[pathname])return sendPage(res,pageRoutes[pathname],pathname);
 if(req.method==='GET'&&/^\/icons\/[a-z0-9-]{1,32}\.svg$/.test(pathname)){
  const body=await readFile(path.join(publicRoot,'icons',pathname.slice('/icons/'.length))).catch(()=>null);
  if(!body)return json(res,404,{error:'Icon unavailable'});
  res.writeHead(200,{'Content-Type':'image/svg+xml','Cache-Control':'public, max-age=86400',...headers});return res.end(body);
 }
 if(req.method==='GET'&&files.has(pathname)){
  const name=files.get(pathname);if(name.endsWith('.html'))return sendPage(res,name,pathname==='/'?'/':pathname);
  const body=await readFile(path.join(publicRoot,name));res.writeHead(200,{'Content-Type':contentTypes[path.extname(name)]||'application/octet-stream','Cache-Control':'no-cache',...headers});return res.end(body);
 }
 return json(res,404,{error:'Not found'});
}

export function app(req,res){handle(req,res).catch(err=>{console.error('Request failed:',err.message);if(!res.headersSent)json(res,500,{error:'Internal server error'});else res.end();});}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(database())await migrate();
 const port=Number(process.env.PORT||3000);
 const host=process.env.HOST||'0.0.0.0';
 http.createServer(app).listen(port,host,()=>console.log(`SocialEngine preview listening on ${host}:${port}`));
}
