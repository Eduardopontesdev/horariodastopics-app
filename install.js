(function(){
var ls=function(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
var std=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone;
if(std||+ls("topics_inst_off")>Date.now())return;
var ev=null,ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!/crios|fxios/i.test(navigator.userAgent);
function bar(html,btn){var d=document.createElement("div");d.setAttribute("role","dialog");
 d.style.cssText="position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:50;background:#14202B;color:#EDF2F5;border-radius:14px;padding:12px 14px;display:flex;gap:10px;align-items:center;font:600 14px system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.35);max-width:540px;margin:0 auto";
 d.innerHTML='<span style="font-size:24px">\ud83d\ude90</span><span style="flex:1">'+html+'</span>'+(btn?'<button id="ti" style="background:#F5C400;color:#14202B;border:0;border-radius:10px;padding:10px 14px;font:700 14px system-ui">Instalar</button>':'')+'<button id="tx" aria-label="Fechar" style="background:none;border:0;color:#93A3AF;font-size:22px;cursor:pointer">\u00d7</button>';
 document.body.appendChild(d);d.querySelector("#tx").onclick=function(){d.remove();ls("topics_inst_off",String(Date.now()+7*864e5))};return d}
addEventListener("beforeinstallprompt",function(e){e.preventDefault();ev=e;var d=bar("Instale o app das Topics no seu celular",true);
 d.querySelector("#ti").onclick=function(){d.remove();ev.prompt();ev.userChoice.then(function(){ev=null},function(){})}});
addEventListener("appinstalled",function(){var d=document.querySelector("[role=dialog]");if(d)d.remove()});
if(ios)setTimeout(function(){bar("Para instalar: toque em <b>Compartilhar</b> e em <b>Adicionar \u00e0 Tela de In\u00edcio</b>",false)},2500);
})();
