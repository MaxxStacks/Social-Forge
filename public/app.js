const $=s=>document.querySelector(s);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cad=c=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(c/100);
let catalog=[],platforms=[],active='all',search='',sort='featured',displayLimit=9,currentProduct=null,savedOnly=false;
const symbolMap={instagram:'◎',tiktok:'♪',facebook:'f',youtube:'▶',threads:'@',x:'𝕏',snapchat:'◈',whatsapp:'◉',telegram:'➤',spotify:'≋',discord:'◈',twitch:'◧',pinterest:'P',linkedin:'in',reddit:'●',bluesky:'✳'};
const categoryHeadlines={creator:'IDENTITY.',video:'MOTION.',design:'VISUALS.',commerce:'CONVERT.',analytics:'INSIGHT.'};
const accentCopy={instagram:'CREATE.',tiktok:'GO VIRAL.',facebook:'CONNECT.',youtube:'BE SEEN.',threads:'START TALKING.',x:'JOIN IN.',snapchat:'SNAP.',whatsapp:'SAY HELLO.',telegram:'BROADCAST.',spotify:'ON REPEAT.',discord:'BELONG.',twitch:'GO LIVE.',pinterest:'INSPIRE.',linkedin:'BUILD.',reddit:'DISCOVER.',bluesky:'TAKE FLIGHT.'};
const readSaved=()=>{try{return JSON.parse(localStorage.getItem('socialforge.saved')||'[]')}catch{return []}};
let saved=new Set(readSaved());
function syncSaved(){try{localStorage.setItem('socialforge.saved',JSON.stringify([...saved]))}catch{} $('#savedCount').textContent=saved.size;}
function platformName(id){return platforms.find(p=>p.id===id)?.name||id}
function renderPlatformNav(){
 $('#platformCount').textContent=platforms.length;
 $('#tickerList').innerHTML=platforms.map(p=>`<button class="platform-bubble" data-platform="${escapeHTML(p.id)}" type="button"><span class="bubble-glyph">${escapeHTML(symbolMap[p.id]||'✳')}</span>${escapeHTML(p.name)}</button>`).join('');
 const all=[{id:'all',name:'All products',glyph:'✳'},...platforms];
 $('#filters').innerHTML=all.map(p=>`<button data-platform="${escapeHTML(p.id)}" type="button" aria-pressed="${active===p.id}" class="${active===p.id?'active':''}"><span class="filter-left"><span class="filter-glyph">${escapeHTML(symbolMap[p.id]||p.glyph||'✳')}</span>${escapeHTML(p.name)}</span><span class="filter-count">${p.id==='all'?catalog.length:catalog.filter(s=>s.platform===p.id).length}</span></button>`).join('');
}
function filtered(){let out=catalog.filter(p=>(active==='all'||p.platform===active)&&(!savedOnly||saved.has(p.id))&&`${p.name} ${p.description} ${p.platform} ${p.category}`.toLowerCase().includes(search));if(sort==='price-low')out.sort((a,b)=>a.priceCents-b.priceCents);if(sort==='price-high')out.sort((a,b)=>b.priceCents-a.priceCents);if(sort==='name')out.sort((a,b)=>a.name.localeCompare(b.name));return out}
function render(){renderPlatformNav();syncSaved();const all=filtered();$('#resultCount').textContent=`${all.length} ${all.length===1?'PRODUCT':'PRODUCTS'}`;$('#activeFilter').textContent=[savedOnly?'Saved items':null,active!=='all'?platformName(active):null,search?`Results for “${search}”`:null].filter(Boolean).join(' · ');$('#activeFilter').style.display=active!=='all'||savedOnly||search?'block':'none';
 $('#cards').innerHTML=all.slice(0,displayLimit).map((s,i)=>{
 const isSaved=saved.has(s.id); const glyph=symbolMap[s.platform]||'✳';
 return `<article class="product-card"><div class="product-art art-${escapeHTML(s.platform)} art-${escapeHTML(s.category)}"><span class="art-corner">${escapeHTML(platformName(s.platform).toUpperCase())} / ${String(i+1).padStart(2,'0')}</span><span class="art-text">${escapeHTML(categoryHeadlines[s.category]||'CREATE.')}</span><span class="art-glyph">${escapeHTML(glyph)}</span></div><div class="card-info"><div class="card-topline"><span class="card-meta">${escapeHTML(s.category.toUpperCase())} / DIGITAL</span><button type="button" aria-label="${isSaved?'Remove from':'Save to'} saved products" class="card-like ${isSaved?'active':''}" data-save="${escapeHTML(s.id)}">${isSaved?'♥':'♡'}</button></div><h3>${escapeHTML(s.name)}</h3><p>${escapeHTML(s.description)}</p><div class="card-footer"><div class="card-price"><small>STARTING AT</small><strong>${cad(s.priceCents)}</strong><span>CAD</span></div><button class="card-view" data-service="${escapeHTML(s.id)}" aria-label="View ${escapeHTML(s.name)}" type="button">↗</button></div></div></article>`;
 }).join('')||`<div class="empty">Nothing matches that search yet. Try another platform or a different keyword.</div>`;
 $('#showMore').hidden=all.length<=displayLimit;
}
function selectPlatform(id){active=id;savedOnly=false;displayLimit=9;render();document.querySelector('#marketplace').scrollIntoView({behavior:'smooth'});}
function openProduct(id){let s=catalog.find(x=>x.id===id);if(!s)return;currentProduct=s;$('#modalPlatform').textContent=`${platformName(s.platform).toUpperCase()} / ${s.category.toUpperCase()} / PREVIEW`;$('#modalName').textContent=s.name;$('#modalDesc').textContent=s.description;$('#modalPrice').textContent=cad(s.priceCents)+' CAD';$('#modalGlyph').textContent=symbolMap[s.platform]||'✳';$('#modalArt').className=`modal-art art-${s.platform}`;$('#modalSave').textContent=(saved.has(id)?'Saved ♥':'Save this product ♡');$('#orderDialog').showModal()}
function toggleSaved(id){saved.has(id)?saved.delete(id):saved.add(id);render();if(currentProduct?.id===id)$('#modalSave').textContent=saved.has(id)?'Saved ♥':'Save this product ♡'}
async function init(){try{const res=await fetch('/api/catalog');if(!res.ok)throw new Error('Catalog unavailable');const data=await res.json();catalog=data.services;platforms=data.platforms;render();}catch(e){$('#cards').innerHTML='<div class="empty">The product catalog could not be loaded. Please try refreshing this page.</div>';$('#resultCount').textContent='CATALOG UNAVAILABLE'}}
$('#filters').addEventListener('click',e=>{const btn=e.target.closest('[data-platform]');if(btn)selectPlatform(btn.dataset.platform)});
$('#tickerList').addEventListener('click',e=>{const btn=e.target.closest('[data-platform]');if(btn)selectPlatform(btn.dataset.platform)});
$('#cards').addEventListener('click',e=>{const save=e.target.closest('[data-save]');if(save){toggleSaved(save.dataset.save);return;}const btn=e.target.closest('[data-service]');if(btn)openProduct(btn.dataset.service)});
$('#search').addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();displayLimit=9;render()});
$('#sort').addEventListener('change',e=>{sort=e.target.value;render()});
$('#showMore').addEventListener('click',()=>{displayLimit+=9;render()});
$('#savedTrigger').addEventListener('click',()=>{savedOnly=!savedOnly;active='all';search='';$('#search').value='';displayLimit=9;render();$('#marketplace').scrollIntoView({behavior:'smooth'})});
$('#modalClose').addEventListener('click',()=>$('#orderDialog').close());
$('#orderDialog').addEventListener('click',e=>{if(e.target===$('#orderDialog'))$('#orderDialog').close()});
$('#modalSave').addEventListener('click',()=>{if(currentProduct)toggleSaved(currentProduct.id)});
$('#menuToggle').addEventListener('click',()=>{const el=$('#mobileNav');el.hidden=!el.hidden;$('#menuToggle').setAttribute('aria-expanded',String(!el.hidden))});
$('#mobileNav').addEventListener('click',e=>{if(e.target.closest('a')){$('#mobileNav').hidden=true;$('#menuToggle').setAttribute('aria-expanded','false')}});
init();
