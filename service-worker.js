

const CACHE_NAME = 'diario-v1'

// Arquivos que serão cacheados na instalação
const ARQUIVOS_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
]

self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando arquivos estáticos')
      return cache.addAll(ARQUIVOS_CACHE)
    })
  )
  self.skipWaiting()
})

// ==========================================
// ACTIVATE — remove caches antigos
// ==========================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando...')
  event.waitUntil(
    caches.keys().then((nomes) => {
      return Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => {
            console.log('[SW] Removendo cache antigo:', nome)
            return caches.delete(nome)
          })
      )
    })
  )
  self.clients.claim()
})


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((respostaCacheada) => {
    
      if (respostaCacheada) {
        return respostaCacheada
      }

    
      return fetch(event.request)
        .then((respostaRede) => {
         
          const respostaParaCache = respostaRede.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, respostaParaCache)
          })

          return respostaRede
        })
        .catch(() => {
          
          if (event.request.destination === 'document') {
            return caches.match('/index.html')
          }
        })
    })
  )
})
