(function(){'use strict';
const byId=id=>document.getElementById(id),cart=window.SocialForgeCart;
const money=n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(n);
const samples=new Map();let expected=0;
const quote=async(id,quantity)=>{const r=await fetch('/api/demo/quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({serviceId:id,quantity})});const data=await r.json();if(!r.ok)throw Error(data.error||'Invalid');return data.quote};
byId('sfMenu')?.addEventListener('click',()=>{const n=byId('sfMobileNav');n.hidden=!n.hidden;byId('sfMenu').setAttribute('aria-expanded',String(!n.hidden))});
function clearStats(){for(const id of ['summaryCount','cartItemCount','sfHeaderCartCount']){const node=byId(id);if(node)node.textContent=id==='cartItemCount'?'(0)':'0'}byId('summaryTotal').textContent=money(0);byId('summarySubtotal').textContent=money(0)}
async function renderCart(){if(!samples.size)return;const seq=++expected;const items=cart.get().filter(x=>samples.has(x.id));const valid=[];
for(const x of items){try{const q=await quote(x.id,x.quantity);valid.push({item:x,quote:q,service:samples.get(x.id)})}catch{cart.remove(x.id);return}}
if(seq!==expected)return;const area=byId('cartItems');area.replaceChildren();
byId('sfHeaderCartCount').textContent=items.length;byId('summaryCount').textContent=items.length;byId('cartItemCount').textContent='('+items.length+')';
const sum=valid.reduce((acc,x)=>acc+x.quote.totalCents,0);byId('summaryTotal').textContent=money(sum/100);byId('summarySubtotal').textContent=money(sum/100);
if(!valid.length){const empty=document.createElement('div');empty.className='sf-cart-empty';empty.innerHTML='<div>✳</div><h3>Your demo cart is empty.</h3><p>Build a sample order with the service finder. No payment details are required.</p><a href="/discover">FIND DEMO SERVICES ↗</a>';area.append(empty);return}
for(const x of valid){const s=x.service;const card=document.createElement('article');card.className='sf-cart-item';
const icon=document.createElement('div');icon.className='sf-cart-item-icon';icon.textContent='✳';
const content=document.createElement('div');content.className='sf-cart-item-main';const h=document.createElement('h3');h.textContent=s.name;const p=document.createElement('p');p.textContent=s.platform.toUpperCase()+' / '+s.category.toUpperCase()+' / SIMULATED';
const label=document.createElement('label');label.textContent='QUANTITY';const input=document.createElement('input');input.type='number';input.min=s.min;input.max=s.max;input.step='1';input.inputMode='numeric';input.value=x.item.quantity;
const hint=document.createElement('small');hint.textContent='Min '+s.min.toLocaleString()+' / Max '+s.max.toLocaleString();
input.addEventListener('change',()=>{const n=Number(input.value);if(!Number.isSafeInteger(n)||n<s.min||n>s.max){input.value=x.item.quantity;hint.textContent='Quantity outside supplier-demo limits';return}cart.add({id:s.id,quantity:n});renderCart()});
label.append(input);content.append(h,p,label,hint);
const right=document.createElement('div');right.className='sf-cart-item-right';const price=document.createElement('strong');price.textContent=money(x.quote.totalCents/100);const remove=document.createElement('button');remove.type='button';remove.textContent='REMOVE ×';remove.addEventListener('click',()=>{cart.remove(s.id);renderCart()});right.append(price,remove);
card.append(icon,content,right);area.append(card)}
}
byId('clearCart').addEventListener('click',()=>{cart.clear();renderCart()});
byId('exportQuote').addEventListener('click',()=>{const items=cart.get().filter(x=>samples.has(x.id));if(!items.length)return;const rows=[['Service','Quantity','Sample rate per 1,000','Currency','Notice'],...items.map(x=>{const s=samples.get(x.id);return [s.name,x.quantity,s.pricePer1000,'CAD','Simulation only, not purchasable']})];const csv=rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='socialforge-simulated-quote.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),500)});
cart?.subscribe(()=>{byId('sfHeaderCartCount').textContent=cart.count()});
(async()=>{try{const response=await fetch('/api/demo/catalog');if(!response.ok)throw Error('Catalog unavailable');const {services}=await response.json();for(const s of services)samples.set(s.id,s);await renderCart()}catch{byId('cartItems').textContent='The sample cart is currently unavailable.';clearStats()}})();
})();