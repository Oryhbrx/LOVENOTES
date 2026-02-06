self.addEventListener('install', e => {
  console.log('Service Worker installed ✅');
});

self.addEventListener('fetch', e => {
  // This can be used later for caching offline assets
});