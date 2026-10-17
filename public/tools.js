const $=id=>document.getElementById(id);
const networks=[['Instagram',/^(?:www\.)?instagram\.com$/i],['TikTok',/^(?:www\.|m\.)?tiktok\.com$/i],['Facebook',/^(?:www\.|m\.)?(?:facebook\.com|fb\.watch)$/i],['YouTube',/^(?:www\.|m\.)?(?:youtube\.com|youtu\.be)$/i],['X',/^(?:www\.|mobile\.)?(?:x\.com|twitter\.com)$/i],['Threads',/^(?:www\.)?threads\.(?:com|net)$/i],['Snapchat',/^(?:www\.)?snapchat\.com$/i],['WhatsApp',/^(?:www\.)?(?:whatsapp\.com|wa\.me)$/i],['Telegram',/^(?:www\.)?(?:t\.me|telegram\.me)$/i],['Spotify',/^open\.spotify\.com$/i],['Discord',/^(?:www\.)?(?:discord\.com|discord\.gg)$/i],['Twitch',/^(?:www\.)?twitch\.tv$/i],['Pinterest',/^(?:www\.)?pinterest\.[a-z.]+$/i],['LinkedIn',/^(?:www\.)?linkedin\.com$/i],['Reddit',/^(?:www\.)?reddit\.com$/i],['Bluesky',/^(?:www\.)?bsky\.app$/i]];
function inspect(raw){try{const u=new URL(raw);if(!['https:','http:'].includes(u.protocol))return {valid:false,message:'Only HTTP and HTTPS links can be checked.'};if(u.username||u.password)return {valid:false,message:'Please remove credentials from this URL.'};const found=networks.find(([,rx])=>rx.test(u.hostname.toLowerCase()));if(!found)return {valid:false,message:'This URL is not from one of the 16 supported networks.'};if(!u.pathname||u.pathname==='/')return {valid:false,message:'This is a platform homepage, not a specific profile or post URL.'};return {valid:true,platform:found[0],host:u.hostname,kind:/\/(?:p|reel|reels|video|watch|status|shorts|post|posts|clip|videos)\//i.test(u.pathname)?'Post or video':'Profile, channel, or resource',message:'URL format recognized. Account existence and delivery eligibility have not been verified.'}}catch{return {valid:false,message:'Enter a complete URL starting with https://.'}}}
$('linkForm').addEventListener('submit',e=>{e.preventDefault();const data=inspect($('linkValue').value);const output=$('linkResult');output.replaceChildren();const b=document.createElement('strong');b.textContent=data.valid?data.platform+' · '+data.kind:'Link not recognized';const p=document.createElement('p');p.textContent=data.message;output.append(b,p)});
$('captionInput').addEventListener('input',e=>{const text=e.target.value;$('charCount').textContent=[...text].length.toLocaleString();$('wordCount').textContent=(text.trim().match(/\S+/g)||[]).length.toLocaleString();$('lineCount').textContent=(text?text.split(/\r\n|\r|\n/).length:0).toLocaleString()});
let currentUTM='',currentHashes='';
function putResult(id,message){const target=$(id);target.replaceChildren();const p=document.createElement('p');p.textContent=message;target.append(p)}
$('utmBuild').addEventListener('click',()=>{try{
 const url=new URL($('utmDestination').value.trim());
 if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw Error('Bad destination');
 const s=$('utmSource').value.trim(),m=$('utmMedium').value.trim(),c=$('utmCampaign').value.trim();
 if(!s||!m||!c)throw Error('Missing params');
 for(const [k,v] of [['utm_source',s],['utm_medium',m],['utm_campaign',c]])url.searchParams.set(k,v);
 currentUTM=url.toString();putResult('utmOutput',currentUTM);$('utmCopy').disabled=false;
 }catch{currentUTM='';$('utmCopy').disabled=true;putResult('utmOutput','Enter a valid HTTP(S) destination URL, source, medium and campaign.')}});
$('utmCopy').addEventListener('click',async()=>{if(!currentUTM)return;try{await navigator.clipboard.writeText(currentUTM);$('utmCopy').textContent='COPIED ✓'}catch{$('utmCopy').textContent='SELECT THE GENERATED URL TO COPY'}});
$('hashClean').addEventListener('click',()=>{
 const input=$('hashInput').value.split(/[,\n\s]+/).map(x=>x.replace(/^#+/,'').replace(/[^\p{L}\p{N}_]/gu,'').trim()).filter(Boolean);
 currentHashes=[...new Set(input.map(x=>x.toLowerCase()))].slice(0,100).map(x=>'#'+x).join(' ');
 putResult('hashOutput',currentHashes||'Enter some tags or words to clean.');$('hashCopy').disabled=!currentHashes;
});
$('hashCopy').addEventListener('click',async()=>{if(!currentHashes)return;try{await navigator.clipboard.writeText(currentHashes);$('hashCopy').textContent='COPIED ✓'}catch{$('hashCopy').textContent='SELECT THE RESULT TO COPY'}});
