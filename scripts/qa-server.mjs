import http from 'node:http';
import {app} from '../src/server.js';
import {createAccountHandler} from '../src/accounts.js';
import {testDatabase} from '../test/helpers/postgres.mjs';
const db=await testDatabase(),accounts=createAccountHandler(()=>db);
const server=http.createServer((req,res)=>accounts(req,res,new URL(req.url,'http://localhost').pathname).then(handled=>{if(!handled)app(req,res)}));
server.listen(Number(process.env.PORT||4137),'127.0.0.1',()=>console.log('Local QA server ready'));
async function close(){server.close();await db.end();process.exit(0)}
process.on('SIGTERM',close);process.on('SIGINT',close);
