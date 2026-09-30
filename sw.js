const S='shell-v3',T='tiles-v1',L='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.';
const TH=['server.arcgisonline.com','tile.openstreetmap.org'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(S).then(c=>Promise.allSettled(['./','./index.html',L+'min.css',L+'min.js'].map(u=>c.add(u)))));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(TH.includes(u.host)){
    e.respondWith(caches.open(T).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n}))));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(S).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
