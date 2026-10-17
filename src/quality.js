// Deterministic screening for upstream services — never an assertion of authenticity.
// Signals are advisory only. No service passes commerce approval automatically.
const highRisk=/\b(fake|bot|bots|non\s?drop|guaranteed|instant followers|auto.?likes|mass dm|spam|undetectable|password|required login)\b/i;
const metricRisk=/\b(followers?|likes?|views?|subscribers?|members?|reactions?|retweets?|reposts?|watch.?time|streams?|plays?)\b/i;
const platformTerms=/\b(instagram|tiktok|facebook|youtube|threads|twitter|snapchat|whatsapp|telegram|spotify|discord|twitch|pinterest|linkedin|reddit|bluesky)\b/i;
const round=n=>Math.round(n*100)/100;
export function screenService(s){
 const flags=[],text=[s.name,s.category,s.description].join(' ');
 if(!s.id||!s.platform)flags.push('UNMAPPED_SERVICE');
 if(!Number.isSafeInteger(s.min)||!Number.isSafeInteger(s.max)||s.min<=0||s.max<s.min)flags.push('INVALID_QUANTITY_RANGE');
 if(!Number.isFinite(s.pricePer1000)||s.pricePer1000<=0)flags.push('INVALID_PRICE');
 if(!/^[A-Z]{3}$/.test(s.priceCurrency)||s.priceCurrency==='UNVERIFIED')flags.push('CURRENCY_UNVERIFIED');
 if(highRisk.test(text))flags.push('HIGH_RISK_MARKETING_CLAIM');
 if(metricRisk.test(text))flags.push('ENGAGEMENT_METRICS_POLICY_REVIEW');
 if(!platformTerms.test(text))flags.push('PLATFORM_CLASSIFICATION_VERIFY');
 if(s.orderType!=='Default')flags.push('NON_STANDARD_ORDER_PARAMETERS');
 let score=100;
 for(const flag of flags)score-=flag==='HIGH_RISK_MARKETING_CLAIM'?35:flag==='ENGAGEMENT_METRICS_POLICY_REVIEW'?30:flag==='NON_STANDARD_ORDER_PARAMETERS'?15:20;
 return {id:s.id,platform:s.platform,supplier:s.supplier,score:Math.max(0,score),flags,needsManualReview:true,canSell:false};
}
export function analyzeCatalog(snapshot){
 const entries=(snapshot.services||[]).map(screenService);
 const counts={};const platforms={};const suppliers={};
 for(const e of entries){
  platforms[e.platform]=(platforms[e.platform]||0)+1;
  suppliers[e.supplier]=(suppliers[e.supplier]||0)+1;
  for(const f of e.flags)counts[f]=(counts[f]||0)+1;
 }
 const unique=new Set((snapshot.services||[]).map(s=>s.id));
 const duplicates=entries.length-unique.size;
 if(duplicates)counts.DUPLICATE_SERVICE_IDS=duplicates;
 const risks=entries.reduce((a,e)=>a+e.score,0);
 return {
  auditVersion:'1.0',mode:'advisory-read-only',generatedAt:new Date().toISOString(),
  inventory:{total:entries.length,unique:unique.size,duplicateIds:duplicates,platforms,suppliers},
  review:{pending:entries.length,approved:0,automaticallySellable:0,averageSignalScore:entries.length?round(risks/entries.length):null,flagCounts:counts},
  upstream:{configured:snapshot.configured,connected:snapshot.connected,lastUpdated:snapshot.lastUpdated,errors:snapshot.errors},
  commerce:{payments:false,fulfillment:false,orderLedger:false,supplierOrderSubmission:false},
  caveat:'Scores are deterministic heuristics, not AI, legal determinations, platform approval, genuine-engagement verification, or supplier quality guarantees. Every listing requires manual review.',
  sample:entries.slice(0,100)
 };
}
