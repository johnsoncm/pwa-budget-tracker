var CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
'./',
'./assets/js/db.js',
'./manifest.json',
'./styles.css',
'./assets/icons/icon-192x192.png',
'./assets/icons/icon-512x512.png',
'./index.js',

]

self.addEventListener('install' , function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
});

self.addEventListener('fetch' , function(event){
    if (event.request.url.includes('/api/')){
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone())
                    }
                    return response;
                })
                .catch(err =>{
                    return cache.match(event.request)
                })
            }) .catch(err => console.log('error', err))
               
        )
        return
    }  

    event.respondWith(
        fetch(event.request)
        .catch(function(){
            return caches.match(event.request).then(function(response){
               if (response){
                   return response
               } else if (event.request.headers.get('accept').includes('text-html')){
               return caches.match('/')
               }
            });
        })
    )
})



