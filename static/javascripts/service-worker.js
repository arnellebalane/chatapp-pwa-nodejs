importScripts('/static/vendor/idb/lib/idb.js');
importScripts('/static/vendor/idb-keyval/idb-keyval.js');
importScripts('/static/javascripts/indexeddb.js');


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
                            body: JSON.stringify({ message: message })
                        })
                        .then(response => response.json())
                        .then(response => deleteObjectFromIndexedDb('messages', message.id));
                    }));
                });
            })
        );
    }
});
