(function(){
'use strict';
const networks=[['instagram','Instagram'],['tiktok','TikTok'],['facebook','Facebook'],['youtube','YouTube'],['threads','Threads'],['x','X'],['snapchat','Snapchat'],['whatsapp','WhatsApp'],['telegram','Telegram'],['spotify','Spotify'],['discord','Discord'],['twitch','Twitch'],['pinterest','Pinterest'],['linkedin','LinkedIn'],['reddit','Reddit'],['bluesky','Bluesky']];
const icon=(id)=>'<img src="/icons/'+id+'.svg" alt="" loading="lazy">';
const link=(id,type)=>'/shop/'+id+'/'+type;
const options=networks.map(([id,name])=>'<option value="'+id+'">'+name+'</option>').join('');
const serviceOptions='<option value="followers">Followers / audience</option><option value="views">Video and post views</option><option value="engagement">Engagement / reactions</option>';
const menu=document.getElementById('platformMenu');
if(menu){
 menu.innerHTML='<div class="mega-title"><div><strong>Find services by platform</strong><p style="font-size:12px;color:#6d7b8e">Choose a network, then go directly to a sample product page.</p></div><span><label style="display:flex;gap:9px;align-items:center"><span style="white-space:nowrap">16 NETWORKS</span><input id="megaSearch" type="search" placeholder="Search platforms" aria-label="Search platform menu" style="border:1px solid #cad9e8;padding:11px 13px;border-radius:4px;width:200px;max-width:100%"></label></span></div><div class="mega-networks">'+networks.map(([id,name])=>'<div class="mega-network" data-platform="'+id+'"><a href="'+link(id,'followers')+'" class="mega-network-main">'+icon(id)+name+'</a><div class="mega-service-links"><a href="'+link(id,'followers')+'">Followers</a><a href="'+link(id,'views')+'">Views</a><a href="'+link(id,'engagement')+'">Engagement</a></div></div>').join('')+'</div><div class="mega-bottom"><a href="/discover">All platforms →</a><a href="/explore">Real supplier inventory →</a><a href="/help">Help center →</a><small>Sample services are not available for purchase.</small></div>';
 const search=document.getElementById('megaSearch');
 if(search)search.addEventListener('input',()=>{const term=search.value.toLowerCase().trim();for(const card of menu.querySelectorAll('.mega-network'))card.hidden=!card.dataset.platform.includes(term)});
 const button=document.getElementById('platformMenuButton');
 const close=()=>{button.parentElement.classList.remove('open');button.setAttribute('aria-expanded','false')};
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 document.addEventListener('click',e=>{if(!button.parentElement.contains(e.target))close()});
}
const mobile=document.getElementById('retailMobileMenu');
if(mobile){
 const all=networks.map(([id,name])=>'<a href="'+link(id,'followers')+'">'+icon(id)+' '+name+'</a>').join('');
 mobile.innerHTML='<div style="font-size:10px;font-weight:900;letter-spacing:.08em;padding:12px">CHOOSE A PLATFORM</div><div style="display:grid;grid-template-columns:1fr 1fr">'+all+'</div><div style="font-size:10px;font-weight:900;letter-spacing:.08em;padding:15px">MORE</div><a href="/discover">Browse all examples</a><a href="/explore">Live supplier catalog</a><a href="/tools">Free tools</a><a href="/help">Help center</a><a href="/cart">Demo cart</a>';
}
for(const tile of document.querySelectorAll('.platform-tile')){
 const href=tile.getAttribute('href')||'',id=href.split('/')[2];
 const image=tile.querySelector('.platform-tile-icon');
 if(id&&networks.some(x=>x[0]===id)&&image)image.innerHTML=icon(id);
}
const hero=document.querySelector('.hero-visual');
if(hero){
 hero.innerHTML='<form class="retail-shop-panel" id="retailQuickShop"><div class="shop-label">A SIMPLE SHOPPING EXPERIENCE</div><h2>Find your social service.</h2><p>Choose what you want to explore. See sample package quantities and prices immediately, without a complicated dashboard.</p><label for="retailPlatform">01 — SOCIAL PLATFORM</label><select id="retailPlatform">'+options+'</select><label for="retailService">02 — TYPE OF SERVICE</label><select id="retailService">'+serviceOptions+'</select><button type="submit">VIEW EXAMPLE PACKAGES →</button><small>Development preview. Checkout and supplier order placement are disabled.</small></form>';
 document.getElementById('retailQuickShop').addEventListener('submit',e=>{e.preventDefault();const platform=document.getElementById('retailPlatform').value;const type=document.getElementById('retailService').value;if(networks.some(n=>n[0]===platform))location.assign(link(platform,type))});
 const heading=document.querySelector('.hero-copy h1');
 if(heading)heading.innerHTML='Social services,<br><em>made simple.</em>';
}
})();
