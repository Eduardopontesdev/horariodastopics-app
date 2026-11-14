(function(){
var C=window.TOPICS_CFG||{},SB=C.sb||{},cols=SB.cols||{};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
if(C.ga){var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+C.ga;document.head.appendChild(s);
 window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",C.ga,{send_page_view:false})}
function H(x){var h={apikey:SB.key};if(/^eyJ/.test(SB.key))h.Authorization="Bearer "+SB.key;for(var k in x)h[k]=x[k];return h}
function uid(){var u=ls("topics_uid");if(!u){u=(self.crypto&&crypto.randomUUID)?crypto.randomUUID():Date.now()+"-"+Math.random().toString(16).slice(2);ls("topics_uid",u)}return u}
function origem(){
 try{
  if((window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone)return "App instalado";
  var q=new URLSearchParams(location.search),s=q.get("utm_source"),m=q.get("utm_medium");
  if(s){s=s.toLowerCase().slice(0,30);s=s.charAt(0).toUpperCase()+s.slice(1);if(s==="Whatsapp"){s="WhatsApp"}return m?s+" · "+m.toLowerCase().slice(0,20):s}
  var r=document.referrer;if(!r)return "Direto";
  var h=new URL(r).hostname.replace(/^www\./,"").toLowerCase();
  if(h===location.hostname.replace(/^www\./,""))return "Interno";
  if(/(^|\.)google\./.test(h))return "Google";
  if(/bing\.com|duckduckgo|yahoo\.|ecosia|brave\./.test(h))return "Outro buscador";
  if(/facebook\.com|fb\.com|fb\.me/.test(h))return "Facebook";
  if(/instagram\.com/.test(h))return "Instagram";
  if(/(^|\.)t\.co$|twitter\.com|(^|\.)x\.com$/.test(h))return "X";
  if(/whatsapp\.com|wa\.me/.test(h))return "WhatsApp";
  if(/youtube\.com|youtu\.be/.test(h))return "YouTube";
  if(/horariodastopics|blogspot\./.test(h))return "Blog";
  return h.slice(0,40)
 }catch(e){return "Direto"}
}
function dispositivo(){var u=navigator.userAgent||"";
 if(/iPad|Tablet/i.test(u)||(/Android/i.test(u)&&!/Mobile/i.test(u)))return "tablet";
 return /Mobi|iPhone|Android/i.test(u)?"celular":"computador"}
var ORI=origem(),DSP=dispositivo(),BOT=/bot|crawl|spider|slurp|headless|lighthouse|facebookexternalhit|preview|monitor|pingdom/i.test(navigator.userAgent||"");
function post(row,retry){
 try{fetch(SB.url+"/rest/v1/"+SB.table,{method:"POST",keepalive:true,headers:H({"Content-Type":"application/json",Prefer:"return=minimal"}),body:JSON.stringify(row)})
  .then(function(r){if(!r.ok&&retry){ls("topics_noextra","1");var m={};for(var k in row){if(k!==(cols.origem||"origem")&&k!==(cols.dispositivo||"dispositivo"))m[k]=row[k]}post(m,false)}}).catch(function(){})}catch(e){}
}
function send(tipo,pagina){
 if(!(SB.url&&SB.key&&SB.table))return;
 var row={};row[cols.tipo||"tipo"]=tipo;row[cols.pagina||"pagina"]=pagina;if(cols.uid!==false)row[cols.uid||"uid"]=uid();
 var extra=cols.origem!==false&&ls("topics_noextra")!=="1";
 if(extra){row[cols.origem||"origem"]=ORI;row[cols.dispositivo||"dispositivo"]=DSP}
 post(row,extra)
}
var cache=null,at=0;
window.Topics={
 track:function(tipo,pagina){
  if(BOT||ls("topics_ignorar")==="1")return;
  pagina=pagina||"home";
  if(tipo==="view"){
   if(window.gtag)gtag("event","page_view",{page_title:pagina,page_location:location.href.split("#")[0]+"#"+pagina,page_path:"/"+pagina});
   var d=new Date().toISOString().slice(0,10);
   if(ls("topics_visita")!==d){ls("topics_visita",d);send("visita",pagina);if(window.gtag)gtag("event","visita",{pagina:pagina})}
  }else if(window.gtag)gtag("event",tipo,{pagina:pagina});
  send(tipo,pagina);
 },
 stats:function(){
  if(!(SB.url&&SB.key&&SB.rpc))return Promise.resolve(null);
  if(cache&&Date.now()-at<60000)return Promise.resolve(cache);
  return fetch(SB.url+"/rest/v1/rpc/"+SB.rpc,{method:"POST",headers:H({"Content-Type":"application/json"}),body:"{}"})
   .then(function(r){return r.ok?r.json():null}).then(function(j){if(Array.isArray(j))j=j[0];cache=j;at=Date.now();return j}).catch(function(){return null})
 }
};
})();
