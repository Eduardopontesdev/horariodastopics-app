(function(){
var FILES=["index.html","config.js","anuncios/anuncios.json"],sig=null,shown=false;
function h(s){var x=5381,i;for(i=0;i<s.length;i++)x=((x<<5)+x+s.charCodeAt(i))|0;return x}
function read(){return Promise.all(FILES.map(function(f){return fetch(f,{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.text()})}))
 .then(function(a){return a.map(h).join("-")}).catch(function(){return null})}
function bar(){if(shown)return;shown=true;var d=document.createElement("div");d.setAttribute("role","status");
 d.style.cssText="position:fixed;left:10px;right:10px;top:calc(10px + env(safe-area-inset-top,0px));z-index:60;background:#12806F;color:#fff;border-radius:12px;padding:10px 14px;display:flex;gap:10px;align-items:center;font:600 14px system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.35);max-width:540px;margin:0 auto";
 d.innerHTML='<span style="flex:1">Nova versão do app disponível.</span><button id="tu" style="background:#fff;color:#12806F;border:0;border-radius:10px;padding:9px 14px;font:700 14px system-ui">Atualizar</button>';
 document.body.appendChild(d);
 d.querySelector("#tu").onclick=function(){var go=function(){location.reload()};(window.caches?caches.keys().then(function(k){return Promise.all(k.map(function(x){return caches.delete(x)}))}):Promise.resolve()).then(go,go)}}
function check(){read().then(function(s){if(s===null)return;if(sig===null){sig=s;return}if(s!==sig)bar()})}
setTimeout(check,2500);setInterval(check,30*60*1000);
document.addEventListener("visibilitychange",function(){if(!document.hidden)check()});
})();
