/* Hors ligne : on sert le réseau en priorité, et le cache si la salle n'a pas de réseau. */
const CACHE = "biceps-v10";
const SHELL = ["./", "index.html", "app.js", "exercises.js", "figures.js", "programs.js", "coach.js", "share.js", "logo-white.png", "manifest.webmanifest", "logo.png", "logo-cut.png", "badge.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET" || r.url.endsWith(".mp4")) return;
  const same = new URL(r.url).origin === location.origin, fresh = same && !/\.(jpg|png)$/.test(new URL(r.url).pathname);
  e.respondWith((fresh ? fetch(r.url, {cache: "no-cache"}) : fetch(r)).then(res => { if (res.ok && (new URL(r.url).origin === location.origin || r.url.includes("fonts.g"))) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r, {ignoreSearch: true}).then(m => m || (r.mode === "navigate" ? caches.match("index.html") : Response.error()))));
});
self.addEventListener("notificationclick", e => {
  const n = e.notification, live = n.tag === "live";
  if (!live) n.close();
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(cs => {
    const c = cs.find(x => x.url.includes(self.registration.scope)) || cs[0];
    if (c) { c.postMessage({type: "open-live"}); return c.focus(); }
    return self.clients.openWindow(live ? "./?live=1" : "./");
  }));
});
