
    const urlsToCache = [
        'index.html',
        'css/appshell.css',
        'js/main.js',
        'js/jquery-3.3.1.js',
        'fonts/icomoon.woff',
        'css/style.css'
    ]


    self.addEventListener('install', function (event) {
        event.waitUntil(
            caches.open("static-content-v1")
                .then(function (cache) {
                    cache.addAll(urlsToCache)
                })
        );
    });

    self.addEventListener('fetch', function (event) {
        if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
            return;
        }
        const url = new URL(event.request.url);
        if (url.origin == location.origin && url.pathname == "/lightbulb") {
            event.respondWith(caches.match("index.html"));
            return;
        }
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    });


