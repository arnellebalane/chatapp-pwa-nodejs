if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('Service worker successfully registered.');
        initializeProgressiveWebApp(registration);
    }).catch(error => {
        console.error('Service worker registration failed.', error);
    });
}


const initializeProgressiveWebApp = registration => {

    $('.message-form').off('submit').on('submit', function(e) {
        e.preventDefault();

        const message = this.message.value.trim();
        if (message.length > 0) {
            const formControls = $(this).find('input, .send-messsage-button');
            formControls.prop('disabled', true);

            insertObjectToIndexedDb('messages', message)
                .then(_ => registration.sync.register('send-message'))
                .then(_ => {
                    this.message.value = '';
                    formControls.prop('disabled', false);
                });
        }
    });

};
