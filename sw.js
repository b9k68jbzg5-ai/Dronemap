const S='shell-v2',R='runtime-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(S).then(c=>c.addAll(['./','./index.html'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(S).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
  }else if(u.hostname.endsWith('amazonaws.com')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{
      if(n.ok||n.type==='opaque'){const cp=n.clone();caches.open(R).then(c=>c.put(e.request,cp))}
      return n})));
  }
});
