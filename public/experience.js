(function(){'use strict';
 const $=id=>document.getElementById(id);
 let services=[],platforms=[],category='all',network='all',limit=6;
 const glyph={instagram:'◎',tiktok:'♪',facebook:'f',youtube:'▶',threads:'@',x:'𝕏',snapchat:'◇',whatsapp:'◉',telegram:'➤',spotify:'≋',discord:'◈',twitch:'◧',pinterest:'P',linkedin:'in',reddit:'●',bluesky:'✳'};
 const colors={instagram:'#9a4b78',tiktok:'#0b454f',facebook:'#2172db',youtube:'#d73d31',threads:'#25252a',x:'#26282b',snapchat:'#ddbc21',whatsapp:'#27a474',telegram:'#2489ca',spotify:'#21865f',discord:'#6061ac',twitch:'#874aca',pinterest:'#c63b32',linkedin:'#296db0',reddit:'#e55b37',bluesky:'#228be6'};
 const money=n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(n);
 const cart=window.SocialEngineCart;
 if(cart)cart.subscribe(items=>{for(const id of ['sfHeaderCartCount','sfSectionCartCount']){const el=$(id);if(el)el.textContent=items.length}});
 function createNetwork(p){const a=document.createElement('a');a.className='sf-network-link';a.href='/discover?platform='+encodeURIComponent(p.id);const i=document.createElement('span');i.className='sf-network-icon';i.style.setProperty('--icon-bg',colors[p.id]||'#202f36');i.textContent=glyph[p.id]||'✳';const name=document.createElement('span');name.textContent=p.name;a.append(i,name);return a}
 function formatCard(s){const article=document.createElement('article');article.className='sf-demo-card';article.innerHTML='<div class="sf-card-visual" data-platform="'+s.platform+'"><span class="sf-card-icon"></span><span class="sf-card-category">SAMPLE / NOT FOR SALE</span></div><div class="sf-card-body"><div class="sf-card-top"></div><h3><a></a></h3><p></p><div class="sf-card-data"></div><div class="sf-card-footer"><div class="sf-card-price"><small>SIMULATED / 1,000 CAD</small><strong></strong></div><a>DETAILS ↗</a></div></div>';
 article.querySelector('.sf-card-icon').textContent=glyph[s.platform]||'✳';
 article.querySelector('.sf-card-top').textContent=s.platform.toUpperCase()+' / '+s.category.toUpperCase();
 const links=article.querySelectorAll('a');for(const a of links)a.href='/services/'+encodeURIComponent(s.id);
 links[0].textContent=s.name;
 article.querySelector('p').textContent='Sample only · '+s.min.toLocaleString()+'–'+s.max.toLocaleString()+' units';
 article.querySelector('.sf-card-data').textContent='Simulated quantities • No supplier';
 article.querySelector('strong').textContent=money(s.pricePer1000);
 return article}
 function paint(){const cards=$('sfDemoCards');if(!cards)return;const result=services.filter(s=>(category==='all'||s.category===category)&&(network==='all'||s.platform===network));cards.replaceChildren(...result.slice(0,limit).map(formatCard));if(!result.length){const div=document.createElement('p');div.className='sf-demo-loading';div.textContent='No simulated products match those filters.';cards.append(div)}$('sfShowMore').hidden=result.length<=limit}
 document.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.category;limit=6;document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('sf-filter-active',b===btn));paint()}));
 $('sfDemoPlatform')?.addEventListener('change',e=>{network=e.target.value;limit=6;paint()});
 $('sfShowMore')?.addEventListener('click',()=>{limit+=6;paint()});
 $('heroMatch')?.addEventListener('click',()=>{const p=$('heroNetwork').value,g=$('heroGoal').value;location.href='/discover?platform='+encodeURIComponent(p)+'&goal='+encodeURIComponent(g)});
 $('sfMenu')?.addEventListener('click',()=>{const n=$('sfMobileNav');n.hidden=!n.hidden;$('sfMenu').setAttribute('aria-expanded',String(!n.hidden))});
 (async()=>{try{const r=await fetch('/api/demo/catalog');if(!r.ok)throw Error('demo offline');const data=await r.json();services=data.services;platforms=data.platforms;$('sfNetworks').replaceChildren(...platforms.map(createNetwork));const select=$('sfDemoPlatform');for(const p of platforms){const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name;select.append(opt)}paint()}catch(err){const div=$('sfDemoCards');div.textContent='Interactive sample products are currently unavailable. The live supplier catalog is unaffected.'}})();
})();