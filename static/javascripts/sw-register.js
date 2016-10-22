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

            const data = { message: message };
            insertObjectToIndexedDb('messages', data)
                .then(_ => registration.sync.register('send-message'))
                .then(_ => {
                    this.message.value = '';
                    formControls.prop('disabled', false);
                });
        }
    });

    registration.pushManager.getSubscription().then(subscription => {
        if (subscription) {
            subscriptionButton.text('Unsubscribe from Push Notifications');
        }
    });


    subscriptionButton.on('click', _ => {
        registration.pushManager.getSubscription().then(subscription => {
            if (subscription) {
                return unsubscribeFromPushNotifications(subscription);
            }
            return subscribeToPushNotifications(registration);
        });
    });

};


const subscriptionButton = $('.subscription-button');


const subscribeToPushNotifications = registration => {
    subscriptionButton.prop('disabled', true);
    return registration.pushManager.subscribe({ userVisibleOnly: true }).then(subscription => {
        console.log(subscription);
        toast('You are now subscribed to push notifications!');
        subscriptionButton.text('Unsubscribe from Push Notifications');
        subscriptionButton.prop('disabled', false);
    });
};


const unsubscribeFromPushNotifications = subscription => {
    subscriptionButton.prop('disabled', true);
    return subscription.unsubscribe().then(_ => {
        toast('You are now unsubscribed from push notifications!');
        subscriptionButton.text('Subscribe to Push Notifications');
        subscriptionButton.prop('disabled', false);
    });
}
