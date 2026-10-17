(function(){'use strict';
const byId=id=>document.getElementById(id);
const goalCategory={audience:'followers',reach:'views',engagement:'engagement'};
const goalHeadline={audience:'Audience-building examples',reach:'Visibility and reach examples',engagement:'Interaction examples'};
const money=n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(n);
let services=[],platforms=[],goal='reach',platform='instagram',budget=25,sequence=0;
const cart=window.SocialForgeCart;
function setNav(){cart?.subscribe(items=>{const el=byId('sfHeaderCartCount');if(el)el.textContent=items.length});
byId('sfMenu')?.addEventListener('click',()=>{const n=byId('sfMobileNav');n.hidden=!n.hidden;byId('sfMenu').setAttribute('aria-expanded',String(!n.hidden))})}
function opts(service){const list=[service.min,100,250,500,1000,2500,5000,10000,service.max].filter(n=>Number.isInteger(n)&&n>=service.min&&n<=service.max);return [...new Set(list)].sort((a,b)=>a-b)}
async function quote(id,quantity){const r=await fetch('/api/demo/quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({serviceId:id,quantity})});const data=await r.json();if(!r.ok)throw Error(data.error||'Quote failed');return data.quote}
function makeCard(service,preferred){const item=document.createElement('article');item.className='sf-match-card';
const top=document.createElement('div');top.className='sf-match-card-head';const heading=document.createElement('h4');heading.textContent=service.name;const label=document.createElement('b');label.textContent=preferred?'GOAL MATCH':'ALTERNATIVE';top.append(heading,label);
const note=document.createElement('div');note.className='sf-match-card-note';note.textContent='Illustrative '+service.category+' service · No connected supplier · No delivery.';
const amounts=document.createElement('div');amounts.className='sf-match-card-amount';
const chooseLabel=document.createElement('label');chooseLabel.textContent='QUANTITY';
const select=document.createElement('select');for(const n of opts(service)){const opt=document.createElement('option');opt.value=n;opt.textContent=n.toLocaleString();select.append(opt)}const start=opts(service).find(n=>n>=1000)||service.min;select.value=String(start);
chooseLabel.append(select);
const totalLabel=document.createElement('label');totalLabel.textContent='DEMO QUOTE';
const total=document.createElement('input');total.type='text';total.readOnly=true;total.value='Calculating…';totalLabel.append(total);amounts.append(chooseLabel,totalLabel);
const actions=document.createElement('div');actions.className='sf-match-card-actions';const add=document.createElement('button');add.type='button';add.textContent='ADD TO DEMO CART +';
const details=document.createElement('a');details.href='/services/'+encodeURIComponent(service.id);details.textContent='FULL DETAILS ↗';actions.append(add,details);
const status=document.createElement('div');status.className='sf-match-card-message';
let current=null;
async function recalc(){const n=Number(select.value);add.disabled=true;total.value='Calculating…';try{current=await quote(service.id,n);total.value=money(current.totalCents/100);status.textContent=current.totalCents/100<=budget?'Within selected demo budget':'Above selected demo budget — still available for simulation';add.disabled=false}catch(e){current=null;total.value='Unavailable';status.textContent='Quote validation failed.'}}
select.addEventListener('change',recalc);add.addEventListener('click',()=>{if(!current)return;const ok=cart?.add({id:service.id,quantity:current.quantity});status.textContent=ok?'Added to your demo cart. No purchase was made.':'Unable to save this sample package.';if(ok){add.textContent='ADDED ✓';setTimeout(()=>{add.textContent='ADD TO DEMO CART +'},1250)}});
item.append(top,note,amounts,actions,status);recalc();return item}
function render(){if(!services.length)return;const key=goalCategory[goal];byId('matchHeading').textContent=goalHeadline[goal];const candidates=services.filter(s=>s.platform===platform).sort((a,b)=>Number(b.category===key)-Number(a.category===key));const results=byId('matchResults');results.replaceChildren(...candidates.slice(0,3).map(s=>makeCard(s,s.category===key)));byId('matchMessage').textContent='Goal-matching is currently rules-based. All prices, suppliers, order parameters and packages are simulations. No order or payment will be submitted.'}
function changeGoal(next){goal=next;for(const b of document.querySelectorAll('[data-goal]'))b.classList.toggle('selected',b.dataset.goal===goal);render()}
setNav();
byId('budgetRange').addEventListener('input',e=>{budget=Number(e.target.value);byId('budgetValue').textContent=money(budget)+' CAD';render()});
document.querySelectorAll('[data-goal]').forEach(b=>b.addEventListener('click',()=>changeGoal(b.dataset.goal)));
byId('matchPlatform').addEventListener('change',e=>{platform=e.target.value;render()});
(async()=>{try{const r=await fetch('/api/demo/catalog');if(!r.ok)throw Error('Sample catalog unavailable');const payload=await r.json();platforms=payload.platforms;services=payload.services;const select=byId('matchPlatform');for(const p of platforms){const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name;select.append(opt)}const query=new URLSearchParams(location.search),selected=query.get('platform');platform=platforms.some(p=>p.id===selected)?selected:'instagram';select.value=platform;const desired=query.get('goal');changeGoal(['audience','reach','engagement'].includes(desired)?desired:'reach')}catch(e){byId('matchResults').textContent='Demo catalog is temporarily unavailable. No payments can be made.'}})();
})();