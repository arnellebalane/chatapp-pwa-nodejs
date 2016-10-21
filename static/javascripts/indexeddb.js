const indb = idb.open('chatapp-pwa', 1, upgrade => {
    switch (upgrade.oldVersion) {
        case 0:
            upgrade.createObjectStore('messages', { keyPath: 'id' });
    }
});



const insertObjectToIndexedDb = (store, object) => {
    return indb.then(db => {
        object.id = (new Date()).valueOf();
        return db.transaction(store, 'readwrite')
            .objectStore(store).put(object);
    });
};


const retrieveObjectsFromIndexedDb = store => {
    return indb.then(db => {
        return db.transaction(store).objectStore(store).getAll();
    });
};


const deleteObjectFromIndexedDb = (store, key) => {
    return indb.then(db => {
        return db.transaction(store, 'readwrite')
            .objectStore(store).delete(key);
    });
};
