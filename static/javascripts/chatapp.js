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
        const url = this.action;
        const data = { message: message };
        postDataToServer(url, data).then(response => this.message.value = '');
    }
});


$('.logout-button').on('click', _ => logout());


const userAuthenticated = once(_ => {
    console.log(jwtoken, authenticated, currentUser);
    $('.message-layer, .messages-layer').addClass('layer--shown');
});


const userDeauthenticated = _ => {
    userAuthenticated.called = false;
    $('.message-layer, .messages-layer').removeClass('layer--shown');
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
