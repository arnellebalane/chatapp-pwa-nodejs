const indb = idb.open('chatapp-pwa', 1, upgrade => {
    switch (upgrade.oldVersion) {
        case 0:
            upgrade.createObjectStore('messages', { autoIncrement: true });
    }
});



const insertObjectToIndexedDb = (store, object) => {
    return indb.then(db => {
        const transaction = db.transaction(store, 'readwrite');
        transaction.objectStore(store).put(object);
        return transaction.complete;
    });
};
