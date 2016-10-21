const indb = idb.open('chatapp-pwa', 0, upgrade => {
    switch (upgrade.oldVersion) {
        case 0:
            upgrade.createObjectStore('messages');
    }
});



const insertObjectToDb => (store, object) => {
    return indb.then(db => {
        const transaction = db.transaction(store, 'readwrite');
        transaction.objectStore(store).put(object);
        return transaction.complete;
    });
};
