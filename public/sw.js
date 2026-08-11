self.addEventListener("install", (e)=> self.skipWaiting());
self.addEventListener("activate", (e)=> self.clients.claim());
self.addEventListener("fetch", (e)=>{
  // cache-first for images via pollinations proxy
  if(e.request.url.includes("/api/media/image")){
    e.respondWith(caches.open("igma-images").then(async cache=>{
      const cached = await cache.match(e.request);
      if(cached) return cached;
      const res = await fetch(e.request);
      cache.put(e.request, res.clone());
      return res;
    }));
  }
});
