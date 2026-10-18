(function(){
'use strict';
const networks=[['instagram','Instagram'],['tiktok','TikTok'],['facebook','Facebook'],['youtube','YouTube'],['threads','Threads'],['x','X'],['snapchat','Snapchat'],['whatsapp','WhatsApp'],['telegram','Telegram'],['spotify','Spotify'],['discord','Discord'],['twitch','Twitch'],['pinterest','Pinterest'],['linkedin','LinkedIn'],['reddit','Reddit'],['bluesky','Bluesky']];
const icon=(id)=>'<img src="/icons/'+id+'.svg" alt="" loading="lazy">';
const link=(id,type)=>'/shop/'+id+'/'+type;
const options=networks.map(([id,name])=>'<option value="'+id+'">'+name+'</option>').join('');
const serviceOptions='<option value="followers">Followers / audience</option><option value="views">Video and post views</option><option value="engagement">Engagement / reactions</option>';
const menu=document.getElementById('platformMenu');
if(menu){
 menu.innerHTML='<div class="mega-title"><div><strong>Find services by platform</strong><p class="se-layout-0be70499">Choose a network, then go directly to a sample product page.</p></div><span><label class="se-layout-7a1580e5"><span class="se-layout-eb99a4c1">16 NETWORKS</span><input class="se-layout-6b028652" id="megaSearch" type="search" placeholder="Search platforms" aria-label="Search platform menu"></label></span></div><div class="mega-networks">'+networks.map(([id,name])=>'<div class="mega-network" data-platform="'+id+'"><a href="'+link(id,'followers')+'" class="mega-network-main">'+icon(id)+name+'</a><div class="mega-service-links"><a href="'+link(id,'followers')+'">Followers</a><a href="'+link(id,'views')+'">Views</a><a href="'+link(id,'engagement')+'">Engagement</a></div></div>').join('')+'</div><div class="mega-bottom"><a href="/discover">All platforms →</a><a href="/explore">Real supplier inventory →</a><a href="/help">Help center →</a><small>Sample services are not available for purchase.</small></div>';
 const search=document.getElementById('megaSearch');
 if(search)search.addEventListener('input',()=>{const term=search.value.toLowerCase().trim();for(const card of menu.querySelectorAll('.mega-network'))card.hidden=!card.dataset.platform.includes(term)});
 const button=document.getElementById('platformMenuButton');
 const close=()=>{button.parentElement.classList.remove('open');button.setAttribute('aria-expanded','false')};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&button.parentElement.classList.contains('open')){close();button.focus()}});
 document.addEventListener('click',e=>{if(!button.parentElement.contains(e.target))close()});
}
const mobile=document.getElementById('retailMobileMenu');
if(mobile){
 const all=networks.map(([id,name])=>'<a href="'+link(id,'followers')+'">'+icon(id)+' '+name+'</a>').join('');
 mobile.innerHTML='<div class="se-layout-6a795606">CHOOSE A PLATFORM</div><div class="se-layout-a028eb51">'+all+'</div><div class="se-layout-d1db7095">MORE</div><a href="/account">My account</a><a href="/discover">Browse all examples</a><a href="/explore">Live supplier catalog</a><a href="/tools">Free tools</a><a href="/help">Help center</a><a href="/cart">Demo cart</a>';
}
for(const tile of document.querySelectorAll('.platform-tile')){
 const href=tile.getAttribute('href')||'',id=href.split('/')[2];
 const image=tile.querySelector('.platform-tile-icon');
 if(id&&networks.some(x=>x[0]===id)&&image)image.innerHTML=icon(id);
}
const hero=document.querySelector('.hero-visual');
if(hero){
 hero.innerHTML='<form class="retail-shop-panel" id="retailQuickShop"><div class="shop-label">YOUR NEXT STEP</div><h2>Find your package.</h2><p>Choose your platform and service. Compare quantities and see a clear example price.</p><label for="retailPlatform">01 — SOCIAL PLATFORM</label><select id="retailPlatform">'+options+'</select><label for="retailService">02 — TYPE OF SERVICE</label><select id="retailService">'+serviceOptions+'</select><button type="submit">EXPLORE PACKAGES →</button><small>Sample pricing. Purchases open after payment and supplier setup.</small></form>';
 document.getElementById('retailQuickShop').addEventListener('submit',e=>{e.preventDefault();const platform=document.getElementById('retailPlatform').value;const type=document.getElementById('retailService').value;if(networks.some(n=>n[0]===platform))location.assign(link(platform,type))});
 const heading=document.querySelector('.hero-copy h1');

}
})();
