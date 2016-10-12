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


const userAuthenticated = once(_ => {
    console.log(jwtoken, authenticated, currentUser);
    $('.messages-layer').addClass('layer--shown');
});


const userDeauthenticated = _ => {
    userAuthenticated.called = false;
    $('.messages-layer').removeClass('layer--shown');
};
