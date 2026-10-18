(function(){'use strict';
const networks=[
 ['instagram','Instagram','◎'],['tiktok','TikTok','♪'],['facebook','Facebook','f'],['youtube','YouTube','▶'],
 ['threads','Threads','@'],['x','X','𝕏'],['snapchat','Snapchat','◇'],['whatsapp','WhatsApp','◉'],
 ['telegram','Telegram','➤'],['spotify','Spotify','≋'],['discord','Discord','◈'],['twitch','Twitch','◧'],
 ['pinterest','Pinterest','P'],['linkedin','LinkedIn','in'],['reddit','Reddit','●'],['bluesky','Bluesky','✳']
];
const root=document.getElementById('platformLinks');
for(const [id,label,glyph] of networks){
 const a=document.createElement('a');
 const name=id==='youtube'?'views':'followers';
 a.href='/services/demo-'+id+'-'+name;
 const symbol=document.createElement('b');symbol.textContent=glyph;
 const title=document.createElement('span');title.textContent=label;
 a.append(symbol,title);root.append(a);
}
const cart=document.getElementById('cartCount');
if(window.SocialEngineCart){window.SocialEngineCart.subscribe(items=>{cart.textContent=items.length})}
const toggle=document.getElementById('menuToggle'),menu=document.getElementById('mobileMenu');
toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))});
menu.addEventListener('click',e=>{if(e.target.closest('a')){menu.hidden=true;toggle.setAttribute('aria-expanded','false')}});
})();