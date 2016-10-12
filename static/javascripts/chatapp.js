let jwtoken, authenticated;


idbKeyval.get('jwtoken').then(value => {
    jwtoken = value;
    authenticated = jwtoken !== undefined;

    if (authenticated) {
        userAuthenticated();
    }
});


const userAuthenticated = once(_ => {
    console.log(jwtoken, authenticated);
});
