import {randomUUID} from 'node:crypto';
import {transaction} from './database.js';

// Server-internal primitive. No client or unverified webhook can invoke this.
// Positive funding entries must only be called by a future approved, verified payment adapter.
export async function postLedgerEntry(db,{userId,amountCents,currency='CAD',kind,reference,description}){
 if(!Number.isSafeInteger(amountCents)||amountCents===0||Math.abs(amountCents)>10000000||currency!=='CAD')throw new Error('Invalid ledger amount');
 if(!['funding','purchase','refund','chargeback'].includes(kind)||!reference||reference.length>200)throw new Error('Invalid ledger reference');
 if((['funding','refund'].includes(kind)&&amountCents<0)||(['purchase','chargeback'].includes(kind)&&amountCents>0))throw new Error('Invalid ledger direction');
 return transaction(db,async client=>{
  const wallet=await client.query('SELECT balance_cents FROM se_wallets WHERE user_id=$1 FOR UPDATE',[userId]);
  if(!wallet.rows.length)throw new Error('Wallet unavailable');
  const previous=await client.query('SELECT * FROM se_ledger WHERE reference=$1',[reference]);
  if(previous.rows.length){
   const entry=previous.rows[0];
   if(entry.user_id!==userId||Number(entry.amount_cents)!==amountCents||entry.currency!==currency||entry.kind!==kind)throw new Error('Ledger reference conflict');
   return {entry,replayed:true};
  }
  const balance=Number(wallet.rows[0].balance_cents)+amountCents;
  if(!Number.isSafeInteger(balance)||balance<0)throw new Error('Insufficient available funds');
  const {rows}=await client.query('INSERT INTO se_ledger(id,user_id,amount_cents,currency,kind,reference,description) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',[randomUUID(),userId,amountCents,currency,kind,reference,description]);
  await client.query('UPDATE se_wallets SET balance_cents=$2 WHERE user_id=$1',[userId,balance]);
  return {entry:rows[0],replayed:false};
 });
}
