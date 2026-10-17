(function(){'use strict';
const $=id=>document.getElementById(id);
const platforms=[['instagram','Instagram','◎','#e065ad'],['tiktok','TikTok','♪','#28222d'],['facebook','Facebook','f','#2076ee'],['youtube','YouTube','▶','#ff4242'],['threads','Threads','@','#2d2931'],['x','X','𝕏','#28222d'],['snapchat','Snapchat','◇','#e6c400'],['whatsapp','WhatsApp','◉','#29ba81'],['telegram','Telegram','➤','#2dabe2'],['spotify','Spotify','≋','#1dbb73'],['discord','Discord','◈','#7874f3'],['twitch','Twitch','◧','#9c53ea'],['pinterest','Pinterest','P','#e5455b'],['linkedin','LinkedIn','in','#257bc6'],['reddit','Reddit','●','#fe602a'],['bluesky','Bluesky','✳','#3891f8']];
const cart=window.SocialForgeCart;if(cart){cart.subscribe(items=>{if($('retailCartCount'))$('retailCartCount').textContent=items.length})}
const nav=$('navPlatforms'),grid=$('platformGrid');
for(const [id,name,icon,color] of platforms){
 const href='/shop/'+id+'/'+(id==='youtube'?'views':'followers');
 const a=document.createElement('a');a.href=href;a.textContent=icon+' '+name;nav.append(a);
 const tile=document.createElement('a');tile.className='platform-tile';tile.href=href;
 const ico=document.createElement('span');ico.className='platform-tile-icon';ico.style.setProperty('--platform-color',color);ico.textContent=icon;
 const title=document.createElement('strong');title.textContent=name;const arrow=document.createElement('span');arrow.textContent='↗';
 tile.append(ico,title,arrow);grid.append(tile);
}
$('retailMenuButton')?.addEventListener('click',()=>{const menu=$('retailMobileMenu');menu.hidden=!menu.hidden;$('retailMenuButton').setAttribute('aria-expanded',String(!menu.hidden))});
$('platformMenuButton')?.addEventListener('click',()=>{const box=$('platformMenuButton').parentElement;box.classList.toggle('open');$('platformMenuButton').setAttribute('aria-expanded',String(box.classList.contains('open')))});
document.addEventListener('click',e=>{const box=$('platformMenuButton')?.parentElement;if(box&&!box.contains(e.target)){box.classList.remove('open');$('platformMenuButton').setAttribute('aria-expanded','false')}});
})();