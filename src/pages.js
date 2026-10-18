import {readFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {articles} from '../public/article-data.js';
import {platforms} from './catalog.js';

export {articles};
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const titles={
 '/':['SocialEngine — Your next move in social','Explore social media service packages and manage orders, wallet activity and support in your SocialEngine account. Pre-launch preview.'],
 '/articles':['SocialEngine Journal — Guides to social services','Practical guides to social services, transparent pricing and social content planning.'],
 '/volume':['Volume pricing | SocialEngine','Understand quantity tiers, base pricing and promotional savings. Interactive pricing examples, not live offers.'],
 '/tools':['Free social tools | SocialEngine','Create campaign URLs, check social links and prepare captions with free browser tools.'],
 '/help':['Help center | SocialEngine','Answers about accounts, social service packages, pricing and the pre-launch experience.'],
 '/explore':['Supplier catalog | SocialEngine','Browse available supplier inventory. Imported services require review before sale.'],
 '/support':['Support | SocialEngine','Explore support resources or save a request in your SocialEngine account.'],
 '/discover':['Explore social media services | SocialEngine','Find platform-specific package examples across 16 social networks.'],
 '/rewards':['Rewards preview | SocialEngine','Explore the planned SocialEngine rewards program. No redeemable benefits are active.'],
 '/affiliates':['Affiliate preview | SocialEngine','Explore the future affiliate experience. Referral tracking and payouts are not active.'],
 '/discounts':['Discount previews | SocialEngine','Try sample promotional codes with clear quantity savings and coupon conditions.']
};
export function siteOrigin(){
 try{const url=new URL(process.env.SITE_URL);return ['http:','https:'].includes(url.protocol)?url.origin:null}catch{return null}
}
export function indexable(){return process.env.SEO_INDEXABLE==='true'&&!!siteOrigin()}
export async function sendPage(res,name,pathname,status=200){
 let html=await readFile(new URL('../public/'+name,import.meta.url),'utf8');
 let [title,description]=titles[pathname]||['SocialEngine — Social services','Explore the SocialEngine marketplace. Pre-launch preview.'];
 const privatePage=/^\/(account|cart|track|operations)(\/|$)/.test(pathname);
 const article=articles.find(a=>pathname==='/articles/'+a.slug);
 if(article){
  title=article.title+' | SocialEngine';description=article.intro;
  html=html.replace(/(<h1 id="programTitle">)[\s\S]*?(<\/h1>)/,'$1'+esc(article.title)+'$2');
  html=html.replace(/(<p id="programLead">)[\s\S]*?(<\/p>)/,'$1'+esc(article.intro)+'$2');
  const content='<article class="program-article"><p class="article-byline">By SocialEngine editorial team</p><p>'+esc(article.intro)+'</p>'+article.sections.map(([h,p])=>'<h2>'+esc(h)+'</h2><p>'+esc(p)+'</p>').join('')+'<a href="/articles">All guides →</a></article>';
  html=html.replace(/(<section class="program-body retail-container" id="programBody">)[\s\S]*?(<\/section>)/,'$1'+content+'$2');
 }
 if(pathname==='/articles'){
  const content='<div class="program-grid">'+articles.map(a=>'<article class="program-panel"><h2><a href="/articles/'+a.slug+'">'+esc(a.title)+'</a></h2><p>'+esc(a.intro)+'</p></article>').join('')+'</div>';
  html=html.replace(/(<h1 id="programTitle">)[\s\S]*?(<\/h1>)/,'$1SocialEngine Journal$2').replace(/(<section class="program-body retail-container" id="programBody">)[\s\S]*?(<\/section>)/,'$1'+content+'$2');
 }
 const shop=/^\/shop\/([a-z0-9-]+)\/(followers|views|engagement)/.exec(pathname);
 if(shop){const platform=platforms.find(p=>p.id===shop[1]);const label=platform?.name||shop[1];const category=shop[2][0].toUpperCase()+shop[2].slice(1);title=label+' '+category+' — Package preview | SocialEngine';description='Compare '+label+' '+shop[2]+' package quantities, sample prices and volume savings. Purchases are not open yet.';html=html.replace(/(<h1 id="productTitle">)[\s\S]*?(<\/h1>)/,'$1'+esc(label+' '+category)+'$2')}
 html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(title)+'</title>');
 html=html.replace(/<meta name="description"[^>]*>/,'');
 html=html.replace(/<meta name="robots"[^>]*>/,'');
 const origin=siteOrigin(),nonce=randomBytes(16).toString('base64'),canIndex=indexable()&&!privatePage&&!shop&&!pathname.startsWith('/services/')&&status===200;
 let meta='<meta name="description" content="'+esc(description)+'"><meta name="robots" content="'+(canIndex?'index,follow':'noindex,nofollow')+'"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(description)+'"><meta property="og:type" content="'+(article?'article':'website')+'">';
 if(origin){const url=origin+pathname;meta+='<link rel="canonical" href="'+esc(url)+'"><meta property="og:url" content="'+esc(url)+'">';
  if(!privatePage&&status===200){const graph=[{'@type':'Organization','@id':origin+'/#organization',name:'SocialEngine',url:origin},{'@type':'WebSite','@id':origin+'/#website',name:'SocialEngine',url:origin,publisher:{'@id':origin+'/#organization'}}];
   if(pathname!=='/')graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'SocialEngine',item:origin},{'@type':'ListItem',position:2,name:article?'Journal':title.split('|')[0].trim(),item:article?origin+'/articles':url},...(article?[{'@type':'ListItem',position:3,name:article.title,item:url}]:[])]});
   if(article)graph.push({'@type':'Article',headline:article.title,description:article.intro,mainEntityOfPage:url,author:{'@id':origin+'/#organization'},publisher:{'@id':origin+'/#organization'}});
   meta+='<script type="application/ld+json" nonce="'+nonce+'">'+JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')+'</script>';
  }
 }
 html=html.replace('</head>',meta+'<link rel="preload" href="/fonts/syne-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/dm-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/socialengine.css"><script defer src="/site-experience.js"></script></head>');
 res.writeHead(status,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY',...(!canIndex?{'X-Robots-Tag':'noindex, nofollow'}:{}),'Content-Security-Policy':`default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'nonce-${nonce}'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`});
 res.end(html);
}
export function sitemap(){
 const urls=indexable()?['/','/articles','/tools','/help',...articles.map(a=>'/articles/'+a.slug)]:[];
 return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>'<url><loc>'+esc(siteOrigin()+url)+'</loc></url>').join('')+'</urlset>';
}
