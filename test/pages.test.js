import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sendPage,sitemap} from '../src/pages.js';
test('canonical and schema use configured origin; preview offers and private pages stay excluded',async()=>{
 const priorSite=process.env.SITE_URL,priorIndex=process.env.SEO_INDEXABLE;
 process.env.SITE_URL='https://socialengine.example';process.env.SEO_INDEXABLE='true';
 const render=async(name,path)=>{const result={};await sendPage({writeHead:(status,headers)=>Object.assign(result,{status,headers}),end:body=>{result.body=body}},name,path);return result};
 try{
  const article=await render('programs.html','/articles/choosing-social-services');assert.match(article.body,/<link rel="canonical" href="https:\/\/socialengine.example\/articles\/choosing-social-services"/);assert.match(article.body,/"@type":"Article"/);assert.match(article.body,/Check what you are actually buying/);
  const shop=await render('shop.html','/shop/instagram/followers');assert.match(shop.headers['X-Robots-Tag'],/noindex/);assert.doesNotMatch(shop.body,/"@type":"Offer"/);
  const account=await render('account.html','/account');assert.match(account.headers['X-Robots-Tag'],/noindex/);assert.doesNotMatch(account.body,/application\/ld\+json/);
  assert.doesNotMatch(sitemap(),/\/account|\/shop\//);assert.match(sitemap(),/choosing-social-services/);
  process.env.SEO_INDEXABLE='false';assert.doesNotMatch(sitemap(),/<url>/);
 }finally{if(priorSite===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=priorSite;if(priorIndex===undefined)delete process.env.SEO_INDEXABLE;else process.env.SEO_INDEXABLE=priorIndex}
});
