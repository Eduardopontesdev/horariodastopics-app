const C="topics-v4";
const A=["./","./index.html","./config.js","./tracker.js","./install.js","./update.js","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
// pré-carrega cada arquivo separadamente: se algum faltar na hospedagem, o app continua instalável
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
// "rede primeiro": com internet, sempre baixa a versão mais nova; sem internet, abre a última guardada
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||!e.request.url.startsWith(self.location.origin))return;
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request).then(m=>m||caches.match("./index.html"))));
});
