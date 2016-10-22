importScripts('/static/vendor/idb/lib/idb.js');
importScripts('/static/vendor/idb-keyval/idb-keyval.js');
importScripts('/static/javascripts/indexeddb.js');


const cacheName = 'cache-v1';
const urlsToCache = [
    '/',
    '/static/stylesheets/fonts.css',
    '/static/stylesheets/components.css',
    '/static/stylesheets/chatapp.css',
    '/static/vendor/jquery/dist/jquery.min.js',
    '/static/vendor/idb/lib/idb.js',
    '/static/vendor/idb-keyval/idb-keyval.js',
    '/static/javascripts/utils.js',
    '/static/javascripts/indexeddb.js',
    '/static/javascripts/chatapp.js',
    '/static/javascripts/authentication.js',
    '/static/javascripts/sw-register.js',
    '/static/fonts/quicksand/regular.woff2',
    '/static/fonts/quicksand/bold.woff2',
    '/static/images/logout.png'
];


self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(urlsToCache)
        }).then(_ => {
            console.log(`Caching complete for "${cacheName}"`);
        })
    );
});


self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheKeys => {
            return Promise.all(cacheKeys.map(cacheKey => {
                if (cacheKey !== cacheName) {
                    return caches.delete(cacheKey);
                }
            }));
        })
    );
});


self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(e.request);
        })
    );
});


self.addEventListener('push', e => {
    if (e.data) {
        const data = e.data.json();
        var notificationTitle = data.user.name;
        var notificationOptions = {
            body: data.message.content,
            icon: data.user.avatar,
            data: {
                redirectUrl: '/messages'
            }
        };
    } else {
        var notificationTitle = 'You received a new message';
        var notificationOptions = {
            body: 'Tap to view in messages',
            icon: '/static/images/chatapp.png'
        };
    }
    e.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});


self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        self.clients.matchAll({ type: 'window' }).then(clients => {
            if (clients.length > 0) {
                clients[0].navigate(e.notification.data.redirectUrl);
                clients[0].focus();
            } else {
                self.clients.openWindow(e.notification.data.redirectUrl);
            }
        })
    );
});


self.addEventListener('sync', e => {
    if (e.tag === 'send-message') {
        e.waitUntil(
            retrieveObjectsFromIndexedDb('messages').then(messages => {
                return idbKeyval.get('jwtoken').then(jwtoken => {
                    return Promise.all(messages.map(message => {
                        return fetch('/message', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${jwtoken}`
                            },
                            body: JSON.stringify({ message: message.message })
                        })
                        .then(response => response.json())
                        .then(response => deleteObjectFromIndexedDb('messages', message.id));
                    }));
                });
            })
        );
    }
});
