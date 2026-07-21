"use strict";
const VERSION="4.0.0";const CACHE=`advar-atlas-${VERSION}`;
const CORE=["./","./index.html","./offline.html","./manifest.webmanifest","./css/app.css","./css/pwa-responsive.css","./js/app.js","./js/pwa.js","./assets/brand/advar-mark.svg","./assets/icons/favicon.svg","./assets/icons/icon-192x192.png","./assets/icons/icon-512x512.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("advar-atlas-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("fetch",event=>{const req=event.request;if(req.method!=="GET")return;const url=new URL(req.url);if(url.origin!==location.origin)return;if(req.mode==="navigate"){event.respondWith(networkFirst(req));return}if(["script","style","worker"].includes(req.destination)){event.respondWith(networkFirst(req));return}event.respondWith(staleWhileRevalidate(req))});
async function networkFirst(req){const cache=await caches.open(CACHE);try{const res=await fetch(req,{cache:"no-cache"});if(res.ok)cache.put(req,res.clone());return res}catch(_){return await cache.match(req)||await cache.match("./index.html")||await cache.match("./offline.html")}}
async function staleWhileRevalidate(req){const cache=await caches.open(CACHE);const cached=await cache.match(req);const fresh=fetch(req).then(res=>{if(res.ok&&res.type!=="opaque")cache.put(req,res.clone());return res}).catch(()=>null);return cached||await fresh||new Response("Offline",{status:503})}
