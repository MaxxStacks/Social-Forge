import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {platforms,services,getService} from './catalog.js';

const publicRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const files = new Map([['/','index.html'],['/index.html','index.html'],['/styles.css','styles.css'],['/app.js','app.js'],['/service.js','service.js'],['/service.css','service.css']]);
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
  const url=new URL(req.url,'http://localhost');
  const platform=url.searchParams.get('platform');
  const query=(url.searchParams.get('q')||'').toLowerCase().trim().slice(0,120);
  return json(res,200,{platforms,services:services.filter(s=>(!platform||s.platform===platform)&&(!query||`${s.name} ${s.description} ${s.platform} ${s.category}`.toLowerCase().includes(query)))});
 }
 if(req.method==='GET'&&pathname.startsWith('/api/services/')){
 const id=pathname.slice('/api/services/'.length);
 if(!/^[a-z0-9-]{1,90}$/.test(id))return json(res,404,{error:'Service not found'});
 const service=getService(id);return service?json(res,200,{service}):json(res,404,{error:'Service not found'});
}
 if(pathname==='/api/orders' || pathname.startsWith('/api/orders/')){
  return json(res,403,{error:'Checkout is disabled in this public preview. No orders or charges are accepted.'});
 }
 if(pathname==='/api/admin/overview')return json(res,404,{error:'Unavailable in public preview'});
 if(req.method==='GET'&&/^\/services\/[a-z0-9-]{1,90}\/?$/.test(pathname)){
 const id=pathname.split('/')[2];if(!getService(id))return json(res,404,{error:'Service not found'});
 const body=await readFile(path.join(publicRoot,'service.html'));
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache',...headers,'Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'"});return res.end(body);
}
 if(req.method==='GET' && files.has(pathname)){
  const name=files.get(pathname);
  const type=contentTypes[path.extname(name)]||'application/octet-stream';
  const body=await readFile(path.join(publicRoot,name));
  res.writeHead(200,{'Content-Type':type,'Cache-Control':name==='index.html'?'no-cache':'public, max-age=3600',...headers,'Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"});
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
