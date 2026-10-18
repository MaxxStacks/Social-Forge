import {articles} from './article-data.js';
(function(){'use strict';
const $=id=>document.getElementById(String(id).replace(/^#/,'')),body=$('programBody'),page=location.pathname.split('/').filter(Boolean);
if(!['support','articles'].includes(page[0]))return;

function heading(title,lead){$('programTitle').textContent=title;$('programLead').textContent=lead;document.title=title+' | SocialEngine'}
function renderArticles(){
 heading('Insights & articles','Original, practical guides on buying digital services, pricing and building stronger social content.');
 body.innerHTML='<div class="program-overline">THE SOCIALENGINE JOURNAL</div><h class="se-layout-d9fdfe64"2>Learn before you buy.</h2><div class="program-grid">'+articles.map(a=>'<article class="program-panel"><div class="program-overline">'+a.category+'</div><h2>'+a.title+'</h2><p>'+a.intro+'</p><a class="program-btn" href="/articles/'+a.slug+'">Read guide →</a></article>').join('')+'</div><p class="program-hint">Articles are educational content and do not claim that any example supplier service is approved or available.</p>';
}
function renderArticle(slug){
 const entry=articles.find(a=>a.slug===slug);if(!entry){heading('Article not found','Return to all guides.');body.innerHTML='<a class="program-btn" href="/articles">Explore articles →</a>';return}
 heading(entry.title,entry.intro);
 body.innerHTML='<article class="program-article"><div class="program-overline">'+entry.category+' · BY SOCIALENGINE EDITORIAL TEAM</div><p>'+entry.intro+'</p>'+entry.sections.map(([h,p])=>'<h2>'+h+'</h2><p>'+p+'</p>').join('')+'<a class="program-btn" href="/articles">← Back to the journal</a></article>';
}
function support(){
 heading('Support & chat','Try a scripted help assistant and locally saved support drafts. Live support is not connected.');
 body.innerHTML='<div class="program-two"><section class="program-panel"><div class="program-overline">AUTOMATED CHAT · DEMO</div><h2>How can we help?</h2><p>This scripted assistant can answer common questions about products, prices, coupons and order tracking. There is no human agent connected.</p><div class="program-chat" id="chatLog" aria-live="polite"><p>Hi! Ask about discounts, orders, suppliers, rewards or an account. I’m a scripted preview—not a live support agent.</p></div><form class="se-layout-92c18f6b" id="chatForm"><label for="chatText">MESSAGE</label><div class="program-field-row"><input id="chatText" maxlength="250" required placeholder="Ask a question…"><button type="submit">Send →</button></div></form></section><section class="program-panel"><div class="program-overline">SUPPORT REQUEST · LOCAL TEST</div><h2>Save a demo ticket</h2><p>Test how a ticket form would work. It stays in this browser: no email or real ticket is sent.</p><form id="ticketForm"><label for="ticketSubject">SUBJECT</label><input id="ticketSubject" maxlength="100" required placeholder="Question about a demo order"><label for="ticketBody">DETAILS</label><textarea id="ticketBody" required maxlength="1000" placeholder="Describe your request"></textarea><button type="submit">Save demo draft →</button></form><div class="program-feedback" id="ticketStatus"></div><a class="program-link" href="/help">Browse frequently asked questions →</a></section></div><div class="program-notice se-layout-66d8b591"><strong>Preview limitation:</strong> The scripted chat does not provide real-time human assistance. Draft tickets are not submitted to a team. Do not share passwords, payment information or private account data.</div>';
 const log=$('chatLog');function chatMessage(msg,klass){const p=document.createElement('p');p.textContent=msg;if(klass)p.className=klass;log.append(p);log.scrollTop=log.scrollHeight}
 $('#chatForm').addEventListener('submit',e=>{e.preventDefault();const message=$('chatText').value.trim();if(!message)return;chatMessage(message,'mine');$('#chatText').value='';const s=message.toLowerCase();let answer;
 if(/coupon|code|discount|promo/.test(s))answer='You can try WELCOME10, SAVE5 or BULK15 on the demo pricing page. These have no real cash value.';
 else if(/order|tracking|refund|refill|delivery/.test(s))answer='There are no live orders or refunds. Use the sample cart and local tracking page to explore how order history could work.';
 else if(/reward|point|loyalty/.test(s))answer='Rewards are simulated based on demo orders stored in your browser. No redeemable balance exists.';
 else if(/affiliate|commission|referral/.test(s))answer='The referral calculator models example earnings. No tracking or commission payments are available.';
 else if(/api|supplier|smm/.test(s))answer='Real products require authenticated supplier connections, approved listings and payment eligibility. Demo products are unrelated to supplier fulfillment.';
 else answer='I can explain demo orders, prices, codes, rewards or supplier integration. For anything else, save a local demo ticket draft.';
 chatMessage(answer,'')});
 $('#ticketForm').addEventListener('submit',e=>{e.preventDefault();const a=$('ticketSubject').value.trim(),b=$('ticketBody').value.trim();if(!a||!b)return;let drafts=[];try{drafts=JSON.parse(localStorage.getItem('sf.demo.tickets')||'[]')}catch{}drafts.unshift({subject:a,message:b,date:new Date().toISOString(),status:'local draft only'});try{localStorage.setItem('sf.demo.tickets',JSON.stringify(drafts.slice(0,20)))}catch{}$('#ticketStatus').textContent='Demo draft saved locally. No request was sent.';e.target.reset()});
}
if(page[0]==='support')support();else if(page[1])renderArticle(page[1]);else renderArticles();
})();