importScripts('/static/vendor/idb/lib/idb.js');
importScripts('/static/vendor/idb-keyval/idb-keyval.js');
importScripts('/static/javascripts/indexeddb.js');


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
