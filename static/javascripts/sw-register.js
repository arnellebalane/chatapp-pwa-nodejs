if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('Service worker successfully registered.');
    }).catch(error => {
        console.error('Service worker registration failed.', error);
    });
}
