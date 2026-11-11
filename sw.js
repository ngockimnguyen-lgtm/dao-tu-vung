// Ưu tiên mạng: có mạng thì luôn lấy bản mới nhất (không cần cài lại),
// mất mạng thì dùng bản đã lưu để vẫn chơi được.
const CACHE = 'dao-tu-vung-v1';
const FILES = ['./', './index.html', './data.js', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // link đồng bộ Google đi thẳng mạng
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
