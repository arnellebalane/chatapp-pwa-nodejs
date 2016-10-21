const indb = idb.open('chatapp-pwa', 1, upgrade => {
    switch (upgrade.oldVersion) {
        case 0:
            upgrade.createObjectStore('messages', { autoIncrement: true });
    }
});



const insertObjectToIndexedDb = (store, object) => {
    return indb.then(db => {
        return db.transaction(store, 'readwrite')
            .objectStore(store).put(object);
    });
};
