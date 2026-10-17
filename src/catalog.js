// Canonical platform taxonomy. Storefront inventory must come from suppliers.
export const platforms=[
 ["instagram","Instagram","◎"],["tiktok","TikTok","♪"],["facebook","Facebook","f"],
 ["youtube","YouTube","▶"],["threads","Threads","@"],["x","X","𝕏"],
 ["snapchat","Snapchat","◈"],["whatsapp","WhatsApp","◉"],["telegram","Telegram","➤"],
 ["spotify","Spotify","≋"],["discord","Discord","◈"],["twitch","Twitch","◧"],
 ["pinterest","Pinterest","P"],["linkedin","LinkedIn","in"],["reddit","Reddit","●"],
 ["bluesky","Bluesky","✳"]
].map(([id,name,glyph])=>({id,name,glyph}));
