import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
// PGlite runs real PostgreSQL. Serialize its single connection like a one-client pool.
export async function testDatabase(path){
 const pg=new PGlite(path);await pg.waitReady;
 await pg.exec(await readFile(new URL('../../src/schema.sql',import.meta.url),'utf8'));
 let tail=Promise.resolve();
 async function connect(){let release;const prior=tail;tail=new Promise(resolve=>{release=resolve});await prior;return {query:(sql,params)=>pg.query(sql,params),release}}
 return {connect,query:async(sql,params)=>{const c=await connect();try{return await c.query(sql,params)}finally{c.release()}},end:()=>pg.close()};
}
