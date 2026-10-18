import {randomBytes,randomUUID,scrypt as scryptCallback,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {database,transaction} from './database.js';

const scrypt=promisify(scryptCallback),cookieName='se_session',sessionAge=7*86400;
const digest=value=>createHash('sha256').update(value).digest('hex');
const fail=(status,message)=>Object.assign(new Error(message),{status});
const uuid=value=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
function reply(res,status,body,extra={}){
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra});res.end(JSON.stringify(body));
}
async function readJson(req){
 if(!req.headers['content-type']?.startsWith('application/json'))throw fail(415,'Send a JSON request.');
 let size=0;const chunks=[];
 for await(const chunk of req){size+=chunk.length;if(size>8192)throw fail(413,'Request is too large.');chunks.push(chunk)}
 try{const value=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!value||Array.isArray(value)||typeof value!=='object')throw Error();return value}catch{throw fail(400,'Invalid request.')}
}
function checkOrigin(req){
 const expected=process.env.SITE_URL?new URL(process.env.SITE_URL).origin:null;
 let actual;try{actual=new URL(req.headers.origin).origin}catch{throw fail(403,'Reload this page and try again.')}
 if(expected?actual!==expected:new URL(actual).host!==req.headers.host)throw fail(403,'Request origin is not allowed.');
 if(process.env.NODE_ENV==='production'&&!expected)throw fail(503,'Account access is awaiting domain configuration.');
}
async function passwordHash(password){const salt=randomBytes(16).toString('hex');return salt+':'+(await scrypt(password,salt,64)).toString('hex')}
async function passwordMatches(password,stored){const [salt,hash]=stored.split(':');const actual=await scrypt(password,salt,64);return timingSafeEqual(actual,Buffer.from(hash,'hex'))}
async function limit(db,key,max){
 const {rows}=await db.query(`INSERT INTO se_auth_limits(key,attempts,expires_at) VALUES($1,1,now()+interval '15 minutes')
 ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN se_auth_limits.expires_at<now() THEN 1 ELSE se_auth_limits.attempts+1 END,
 expires_at=CASE WHEN se_auth_limits.expires_at<now() THEN now()+interval '15 minutes' ELSE se_auth_limits.expires_at END RETURNING attempts`,[digest(key)]);
 if(rows[0].attempts>max)throw fail(429,'Too many attempts. Try again in 15 minutes.');
}
async function session(db,req){
 const token=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);
 if(!token||!/^[a-f0-9]{64}$/.test(token))return null;
 const {rows}=await db.query('SELECT u.id,u.email,u.name,s.csrf_token,s.token_hash FROM se_sessions s JOIN se_users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()',[digest(token)]);
 return rows[0]||null;
}
function cookie(token,maxAge=sessionAge){return `${cookieName}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${process.env.NODE_ENV==='production'?'; Secure':''}`}
async function createSession(db,user,old){
 const token=randomBytes(32).toString('hex'),csrf=randomBytes(32).toString('hex');
 await transaction(db,async client=>{
  if(old)await client.query('DELETE FROM se_sessions WHERE token_hash=$1',[old.token_hash]);
  await client.query('DELETE FROM se_sessions WHERE expires_at<now()');
  await client.query('INSERT INTO se_sessions(token_hash,user_id,csrf_token,expires_at) VALUES($1,$2,$3,$4)',[digest(token),user.id,csrf,new Date(Date.now()+sessionAge*1000)]);
 });
 return token;
}
const publicUser=u=>({id:u.id,name:u.name,email:u.email});
export function createAccountHandler(getDatabase=database){return async function accountHandler(req,res,pathname){
 if(!pathname.startsWith('/api/auth/')&&!pathname.startsWith('/api/account'))return false;
 try{
  const db=getDatabase();
  if(pathname==='/api/auth/status'&&req.method==='GET'){reply(res,200,{available:!!db,fundingAvailable:false,ordersAvailable:false});return true}
  if(!db)throw fail(503,'Account access is being prepared. Please check back soon.');
  const mutating=['POST','PATCH','DELETE'].includes(req.method);
  if(mutating)checkOrigin(req);
  const user=await session(db,req);
  if(['/api/auth/register','/api/auth/login'].includes(pathname)&&req.method==='POST'){
   const body=await readJson(req),email=String(body.email||'').trim().toLowerCase(),password=body.password;
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||typeof password!=='string'||password.length<12||password.length>128)throw fail(422,'Use a valid email and a password between 12 and 128 characters.');
   // Use the socket address, not client-supplied forwarding headers.
   await limit(db,'auth:ip:'+req.socket.remoteAddress,40);await limit(db,'auth:email:'+email,10);
   let found;
   if(pathname.endsWith('/register')){
    const name=String(body.name||'').trim();if(name.length<2||name.length>80)throw fail(422,'Enter a name between 2 and 80 characters.');
    const hash=await passwordHash(password);
    try{found=await transaction(db,async client=>{
     const result=await client.query('INSERT INTO se_users(id,email,name,password_hash) VALUES($1,$2,$3,$4) RETURNING id,email,name',[randomUUID(),email,name,hash]);
     await client.query('INSERT INTO se_wallets(user_id) VALUES($1)',[result.rows[0].id]);return result.rows[0];
    })}catch(error){if(error.code==='23505')throw fail(409,'Unable to create this account. Try signing in.');throw error}
   }else{
    const result=await db.query('SELECT * FROM se_users WHERE email=$1',[email]);found=result.rows[0];
    const dummy='00000000000000000000000000000000:'+('00'.repeat(64));
    const valid=await passwordMatches(password,found?.password_hash||dummy);
    if(!found||!valid)throw fail(401,'Email or password is incorrect.');
   }
   const token=await createSession(db,found,user);reply(res,200,{user:publicUser(found)},{'Set-Cookie':cookie(token)});return true;
  }
  if(!user)throw fail(401,'Sign in to access your account.');
  if(mutating&&req.headers['x-csrf-token']!==user.csrf_token)throw fail(403,'Reload this page and try again.');
  if(pathname==='/api/auth/logout'&&req.method==='POST'){
   await db.query('DELETE FROM se_sessions WHERE token_hash=$1',[user.token_hash]);reply(res,200,{ok:true},{'Set-Cookie':cookie('',0)});return true;
  }
  if(pathname==='/api/account'&&req.method==='GET'){
   const wallet=await db.query('SELECT currency,balance_cents FROM se_wallets WHERE user_id=$1',[user.id]);
   const count=await db.query('SELECT count(*) AS total FROM se_orders WHERE user_id=$1',[user.id]);
   reply(res,200,{user:publicUser(user),csrfToken:user.csrf_token,wallet:{currency:wallet.rows[0].currency,balanceCents:Number(wallet.rows[0].balance_cents)},orderCount:Number(count.rows[0].total),fundingAvailable:false,ordersAvailable:false});return true;
  }
  if(pathname==='/api/account/orders'&&req.method==='GET'){
   const {rows}=await db.query('SELECT id,service_name,quantity,total_cents,currency,status,created_at FROM se_orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100',[user.id]);reply(res,200,{orders:rows});return true;
  }
  if(pathname.startsWith('/api/account/orders/')&&req.method==='GET'){
   const id=pathname.split('/').at(-1);if(!uuid(id))throw fail(404,'Order not found.');
   const {rows}=await db.query('SELECT id,service_name,quantity,total_cents,currency,status,created_at FROM se_orders WHERE id=$1 AND user_id=$2',[id,user.id]);
   if(!rows.length)throw fail(404,'Order not found.');
   const events=await db.query('SELECT status,message,created_at FROM se_order_events WHERE order_id=$1 ORDER BY created_at',[id]);reply(res,200,{order:rows[0],events:events.rows});return true;
  }
  if(pathname==='/api/account/transactions'&&req.method==='GET'){
   const {rows}=await db.query('SELECT id,amount_cents,currency,kind,description,created_at FROM se_ledger WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100',[user.id]);reply(res,200,{transactions:rows});return true;
  }
  if(pathname==='/api/account/funding'&&req.method==='POST')throw fail(503,'Account funding opens when our payment provider is connected. No money has been collected.');
  if(pathname==='/api/account/tickets'){
   if(req.method==='POST'){
    const data=await readJson(req),subject=String(data.subject||'').trim(),message=String(data.message||'').trim();
    if(subject.length<3||subject.length>120||message.length<10||message.length>3000)throw fail(422,'Add a subject (3–120 characters) and details (10–3,000 characters).');
    await limit(db,'ticket:'+user.id,5);
    const {rows}=await db.query('INSERT INTO se_tickets(id,user_id,subject,message) VALUES($1,$2,$3,$4) RETURNING id,subject,status,created_at',[randomUUID(),user.id,subject,message]);reply(res,201,{ticket:rows[0]});return true;
   }
   if(req.method==='GET'){const {rows}=await db.query('SELECT id,subject,message,status,created_at FROM se_tickets WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50',[user.id]);reply(res,200,{tickets:rows});return true}
  }
  if(pathname==='/api/account/profile'&&req.method==='PATCH'){
   const data=await readJson(req),name=String(data.name||'').trim();if(name.length<2||name.length>80)throw fail(422,'Enter a name between 2 and 80 characters.');
   const {rows}=await db.query('UPDATE se_users SET name=$2 WHERE id=$1 RETURNING id,name,email',[user.id,name]);reply(res,200,{user:rows[0]});return true;
  }
  if(pathname==='/api/account/password'&&req.method==='POST'){
   const data=await readJson(req);
   if(typeof data.currentPassword!=='string'||data.currentPassword.length>128||typeof data.newPassword!=='string'||data.newPassword.length<12||data.newPassword.length>128)throw fail(422,'Use a new password between 12 and 128 characters.');
   await limit(db,'password:'+user.id,5);
   const {rows}=await db.query('SELECT password_hash FROM se_users WHERE id=$1',[user.id]);
   if(!await passwordMatches(data.currentPassword,rows[0].password_hash))throw fail(401,'Current password is incorrect.');
   const hash=await passwordHash(data.newPassword);
   await transaction(db,async client=>{await client.query('UPDATE se_users SET password_hash=$2 WHERE id=$1',[user.id,hash]);await client.query('DELETE FROM se_sessions WHERE user_id=$1',[user.id])});
   const token=await createSession(db,user);reply(res,200,{ok:true},{'Set-Cookie':cookie(token)});return true;
  }
  throw fail(404,'Account endpoint not found.');
 }catch(error){
  const status=error.status||503;
  reply(res,status,{error:error.status?error.message:'Account services are temporarily unavailable. Please try again shortly.'});return true;
 }
}}
export const handleAccounts=createAccountHandler();
