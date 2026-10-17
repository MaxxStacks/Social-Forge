(function(){'use strict';
 const key='socialforge.demo.cart.v2';
 const listeners=new Set();
 const safe=()=>{try{const raw=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(raw)?raw.filter(x=>x&&typeof x.id==='string'&&x.id.startsWith('demo-')&&Number.isSafeInteger(x.quantity)&&x.quantity>0).slice(0,30):[]}catch{return []}};
 let state=safe();
 const publish=()=>{try{localStorage.setItem(key,JSON.stringify(state))}catch{}for(const cb of listeners){try{cb(state)}catch{}}window.dispatchEvent(new CustomEvent('socialforge:cart',{detail:state}))};
 function add(item){if(!item||!/^demo-[a-z0-9-]+$/.test(item.id)||!Number.isSafeInteger(item.quantity)||item.quantity<1)return false;
 const normalized={id:item.id,quantity:item.quantity};const at=state.findIndex(x=>x.id===normalized.id);if(at<0){if(state.length>=30)return false;state.push(normalized)}else state[at]=normalized;publish();return true}
 function remove(id){state=state.filter(x=>x.id!==id);publish()}
 function clear(){state=[];publish()}
 function count(){return state.length}
 function get(){return state.map(x=>({...x}))}
 function subscribe(cb){listeners.add(cb);cb(get());return()=>listeners.delete(cb)}
 window.SocialForgeCart={add,remove,clear,count,get,subscribe};
})();