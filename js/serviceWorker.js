self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open("static-content-v1")
            .then(function (cache) {
                console.log("Caching");
                cache.addAll([
                    '../index.html',
                    '../css/appshell.css',
                    'main.js'
                ])
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
        .catch(function () {
            return caches.match("../index.html");
        })
)
    ;
});
