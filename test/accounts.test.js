import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {randomUUID} from 'node:crypto';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {testDatabase} from './helpers/postgres.mjs';
import {createAccountHandler} from '../src/accounts.js';
import {postLedgerEntry} from '../src/ledger.js';

test('private accounts: sessions, CSRF, isolation, support persistence and closed funding',async()=>{
 const db=await testDatabase(),handler=createAccountHandler(()=>db);
 const server=http.createServer((req,res)=>handler(req,res,new URL(req.url,'http://localhost').pathname));server.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const call=async(path,{method='GET',body,cookie,csrf,requestOrigin=origin}={})=>{
  const response=await fetch(origin+path,{method,headers:{Origin:requestOrigin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(csrf?{'X-CSRF-Token':csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,cookie:response.headers.get('set-cookie')?.split(';')[0],data:await response.json()};
 };
 try{
  assert.equal((await call('/api/account')).status,401);
  const body={name:'Test customer',email:'customer@example.test',password:'strong passphrase for testing'};
  assert.equal((await call('/api/auth/register',{method:'POST',body,requestOrigin:'https://outside.test'})).status,403);
  const first=await call('/api/auth/register',{method:'POST',body});assert.equal(first.status,200);assert.ok(first.cookie);
  const me=await call('/api/account',{cookie:first.cookie});assert.equal(me.status,200);assert.equal(me.data.wallet.balanceCents,0);assert.equal(me.data.user.email,body.email);assert.equal(me.data.user.password_hash,undefined);
  const csrf=me.data.csrfToken,cookie=first.cookie;
  assert.equal((await call('/api/account/profile',{method:'PATCH',cookie,body:{name:'No CSRF'}})).status,403);
  assert.equal((await call('/api/account/profile',{method:'PATCH',cookie,csrf,body:{name:'Updated customer'}})).status,200);
  assert.equal((await call('/api/account/funding',{method:'POST',cookie,csrf,body:{amountCents:1000000}})).status,503);
  assert.equal((await call('/api/account',{cookie})).data.wallet.balanceCents,0);
  const ticket=await call('/api/account/tickets',{method:'POST',cookie,csrf,body:{subject:'A real saved request',message:'Please clarify this service before launch.'}});assert.equal(ticket.status,201);
  assert.equal((await call('/api/account/tickets',{cookie})).data.tickets.length,1);
  const orderId=randomUUID();await db.query('INSERT INTO se_orders(id,user_id,service_name,quantity,total_cents,status) VALUES($1,$2,$3,$4,$5,$6)',[orderId,me.data.user.id,'Test service fixture',100,500,'pending']);
  assert.equal((await call('/api/account/orders/'+orderId,{cookie})).status,200);
  const other=await call('/api/auth/register',{method:'POST',body:{...body,email:'other@example.test'}});
  assert.equal((await call('/api/account/orders/'+orderId,{cookie:other.cookie})).status,404);
  assert.equal((await call('/api/account/orders',{cookie:other.cookie})).data.orders.length,0);
  assert.equal((await call('/api/account/tickets',{cookie:other.cookie})).data.tickets.length,0);
  const stored=(await db.query('SELECT password_hash FROM se_users WHERE id=$1',[me.data.user.id])).rows[0].password_hash;assert.ok(!stored.includes(body.password));
  assert.equal((await call('/api/auth/login',{method:'POST',body:{email:body.email,password:'incorrect password 123'}})).status,401);
  const login=await call('/api/auth/login',{method:'POST',body});assert.equal(login.status,200);
  const invalidChange=await call('/api/account/password',{method:'POST',cookie,csrf,body:{currentPassword:'not the correct password',newPassword:'A replacement passphrase 2026'}});assert.equal(invalidChange.status,401);
  const changed=await call('/api/account/password',{method:'POST',cookie,csrf,body:{currentPassword:body.password,newPassword:'A replacement passphrase 2026'}});assert.equal(changed.status,200);
  assert.equal((await call('/api/account',{cookie:login.cookie})).status,401);
  const renewed=await call('/api/account',{cookie:changed.cookie});assert.equal(renewed.status,200);
  assert.equal((await call('/api/auth/logout',{method:'POST',cookie:changed.cookie,csrf:renewed.data.csrfToken,body:{}})).status,200);
  assert.equal((await call('/api/account',{cookie:changed.cookie})).status,401);
  const updatedLogin=await call('/api/auth/login',{method:'POST',body:{...body,password:'A replacement passphrase 2026'}});assert.equal(updatedLogin.status,200);
  await db.query("UPDATE se_sessions SET expires_at=now()-interval '1 second' WHERE user_id=$1",[me.data.user.id]);
  assert.equal((await call('/api/account',{cookie:updatedLogin.cookie})).status,401);
  assert.equal((await call('/api/account',{cookie})).status,401);
 }finally{server.close();await db.end()}
});

test('account and ledger survive database shutdown and reopen',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'socialengine-db-test-')),userId=randomUUID();let db;
 try{
  db=await testDatabase(dir);await db.query('INSERT INTO se_users(id,email,name,password_hash) VALUES($1,$2,$3,$4)',[userId,'persist@example.test','Persistent fixture','test-only']);await db.query('INSERT INTO se_wallets(user_id) VALUES($1)',[userId]);
  await postLedgerEntry(db,{userId,amountCents:2500,kind:'funding',reference:'persistence-test',description:'Test fixture credit'});await db.end();db=null;
  db=await testDatabase(dir);assert.equal(Number((await db.query('SELECT balance_cents FROM se_wallets WHERE user_id=$1',[userId])).rows[0].balance_cents),2500);assert.equal((await db.query('SELECT * FROM se_ledger WHERE user_id=$1',[userId])).rows.length,1);
 }finally{if(db)await db.end();await rm(dir,{recursive:true,force:true})}
});

test('wallet ledger rejects duplicate credits, conflicting references and concurrent overspend',async()=>{
 const db=await testDatabase(),userId=randomUUID();
 try{
  await db.query('INSERT INTO se_users(id,email,name,password_hash) VALUES($1,$2,$3,$4)',[userId,'ledger@example.test','Ledger fixture','not a login hash']);await db.query('INSERT INTO se_wallets(user_id) VALUES($1)',[userId]);
  const credit={userId,amountCents:1000,kind:'funding',reference:'verified-test-payment',description:'Test payment fixture'};
  const results=await Promise.all([postLedgerEntry(db,credit),postLedgerEntry(db,credit)]);assert.equal(results.filter(r=>r.replayed).length,1);
  await assert.rejects(postLedgerEntry(db,{...credit,amountCents:2000}),/conflict/);
  const spend=await Promise.allSettled(['a','b'].map(key=>postLedgerEntry(db,{userId,amountCents:-800,kind:'purchase',reference:key,description:'Test purchase'})));
  assert.equal(spend.filter(r=>r.status==='fulfilled').length,1);assert.equal(Number((await db.query('SELECT balance_cents FROM se_wallets WHERE user_id=$1',[userId])).rows[0].balance_cents),200);
  assert.equal((await db.query('SELECT * FROM se_ledger WHERE user_id=$1',[userId])).rows.length,2);
  await assert.rejects(db.query('UPDATE se_ledger SET amount_cents=1 WHERE user_id=$1',[userId]),/append-only/);
  await assert.rejects(db.query('DELETE FROM se_ledger WHERE user_id=$1',[userId]),/append-only/);
  await assert.rejects(postLedgerEntry(db,{...credit,amountCents:1.2}),/Invalid/);
 }finally{await db.end()}
});
