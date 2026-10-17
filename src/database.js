import pg from 'pg';
import {readFile} from 'node:fs/promises';

let pool;
export function database(){
 if(!process.env.DATABASE_URL)return null;
 return pool??=new pg.Pool({connectionString:process.env.DATABASE_URL,max:10,connectionTimeoutMillis:5000,idleTimeoutMillis:30000});
}
export async function migrate(db=database()){
 if(!db)throw new Error('DATABASE_URL is required');
 const client=await db.connect();
 try{
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(2755901)');
  await client.query(await readFile(new URL('./schema.sql',import.meta.url),'utf8'));
  await client.query('COMMIT');
 }catch(error){await client.query('ROLLBACK');throw error}finally{client.release()}
}
export async function transaction(db,fn){
 const client=await db.connect();
 try{await client.query('BEGIN');const result=await fn(client);await client.query('COMMIT');return result}
 catch(error){await client.query('ROLLBACK');throw error}finally{client.release()}
}
