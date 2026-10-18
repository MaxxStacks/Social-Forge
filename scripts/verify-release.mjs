import {spawnSync} from 'node:child_process';
const env={...process.env,NODE_ENV:'test',SEO_INDEXABLE:'false'};
for(const name of ['DATABASE_URL','SMMWORLD_API_KEY','BOOSTERO_API_KEY','JAP_API_KEY','SITE_URL'])delete env[name];
for(const args of [['scripts/check.mjs'],['--test'],['scripts/browser-qa.mjs']]){
 const result=spawnSync(process.execPath,args,{env,stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
}
