import {platforms} from './catalog.js';
// Public, deterministic guidance. Never infer availability, delivery or account balances.
export function assistantAnswer(input){
 const q=String(input||'').trim().toLowerCase();
 if(!q||q.length>500)return {answer:'Ask about a platform, sample packages, your dashboard or the pre-launch experience.',href:'/help',label:'Explore the help center'};
 if(/fund|deposit|pay|bonus|wallet|money|refund/.test(q))return {answer:'Funding, payments and purchases are not available yet. Your account has a wallet activity view, but no funds can be deposited. Sample prices are for exploring the experience only.',href:'/account/wallet',label:'Explore your wallet'};
 if(/password|safe|risk|guarantee|organic/.test(q))return {answer:'Never share your social password. Packages do not guarantee organic growth, real engagement or sales. Social platforms may remove purchased activity or restrict accounts. Payments and delivery are not open in this preview.',href:'/help',label:'Read how the preview works'};
 if(/account|dashboard|sign|login|order|support/.test(q))return {answer:'You can create an account, manage your profile and save support requests today. The dashboard includes order history and wallet activity. Purchases and funding remain disabled.',href:'/account',label:'Open your dashboard'};
 const platform=platforms.find(p=>q.includes(p.name.toLowerCase())||new RegExp('\\b'+p.id+'\\b').test(q));
 if(platform){const category=/view|reach|video/.test(q)?'views':/like|engag|reaction/.test(q)?'engagement':'followers';return {answer:'Explore '+platform.name+' '+category+' packages and compare sample quantities and prices. These are illustrative packages, not live supplier inventory. No charge or order is placed.',href:'/shop/'+platform.id+'/'+category,label:'Explore '+platform.name+' '+category};}
 if(/tool|caption|campaign|link/.test(q))return {answer:'Try our browser tools for campaign links, caption preparation and social link checks. They are available without placing an order.',href:'/tools',label:'Open free tools'};
 return {answer:'Start with the platform you use, then choose followers, views or engagement. You can compare sample packages or explore your account. This is guided help from our service information; payments and delivery are not open yet.',href:'/discover',label:'Find your starting point'};
}
