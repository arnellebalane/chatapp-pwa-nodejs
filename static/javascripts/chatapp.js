let jwtoken, authenticated, currentUser;


idbKeyval.get('jwtoken').then(value => {
    jwtoken = value;
    authenticated = jwtoken !== undefined;

    if (authenticated) {
        idbKeyval.get('currentuser').then(value => {
            currentUser = value;
            userAuthenticated();
        });
    }
});


$('.message-form').on('submit', function(e) {
    e.preventDefault();

    const message = this.message.value.trim();
    if (message.length > 0) {
        const formControls = $(this).find('input, .send-messsage-button');
        formControls.prop('disabled', true);

        const url = this.action;
        const data = { message: message };
        postDataToServer(url, data).then(_ => {
            this.message.value = '';
            formControls.prop('disabled', false);
            toast('Message sent!');
        });
    }
});


$('.logout-button').on('click', _ => logout());


const userAuthenticatedCallbacks = [];
const userDeauthenticatedCallbacks = [];

userAuthenticatedCallbacks.push(_ => {
    console.log(jwtoken, authenticated, currentUser);
    $('.message-layer').addClass('layer--shown');
});

userDeauthenticatedCallbacks.push(_ => {
    userAuthenticated.called = false;
    $('.message-layer').removeClass('layer--shown');
});


const userAuthenticated = once(_ => {
    userAuthenticatedCallbacks.forEach(callback => callback());
});

const userDeauthenticated = _ => {
    userDeauthenticatedCallbacks.forEach(callback => callback());
};


const postDataToServer = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtoken}`
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
};


const toastElement = $('.toast');
let toastTimer = null;

const toast = message => {
    toastElement.text(message).removeClass('toast--hidden');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(_ => toastElement.addClass('toast--hidden'), 2000);
};
