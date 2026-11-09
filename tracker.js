(function(){
var C=window.TOPICS_CFG||{},SB=C.sb||{},cols=SB.cols||{};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
if(C.ga){var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+C.ga;document.head.appendChild(s);
 window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",C.ga,{send_page_view:false})}
function H(x){var h={apikey:SB.key};if(/^eyJ/.test(SB.key))h.Authorization="Bearer "+SB.key;for(var k in x)h[k]=x[k];return h}
function uid(){var u=ls("topics_uid");if(!u){u=(self.crypto&&crypto.randomUUID)?crypto.randomUUID():Date.now()+"-"+Math.random().toString(16).slice(2);ls("topics_uid",u)}return u}
function send(tipo,pagina){
 if(!(SB.url&&SB.key&&SB.table))return;
 var row={};row[cols.tipo||"tipo"]=tipo;row[cols.pagina||"pagina"]=pagina;if(cols.uid!==false)row[cols.uid||"uid"]=uid();
 try{fetch(SB.url+"/rest/v1/"+SB.table,{method:"POST",keepalive:true,headers:H({"Content-Type":"application/json",Prefer:"return=minimal"}),body:JSON.stringify(row)}).catch(function(){})}catch(e){}
}
var cache=null,at=0;
window.Topics={
 track:function(tipo,pagina){
  if(ls("topics_ignorar")==="1")return;
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
