idbKeyval.get('jwtoken').then(value => {
    if (value === undefined) {
        requestAnimationFrame(_ => $('.signin-layer').addClass('layer--shown'));
    }
});


if (navigator.onLine) {
    // dynamically load the Google platform library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    script.onerror = error => console.warn(error);
    document.body.appendChild(script);
}


/**
 *  Callback function for when the user has finished signing in to the app
 *  through the "Sign in with Google" button.
 **/
function onsignin(googleUser) {
    const profile = googleUser.getBasicProfile();
    const user = {
        name: profile.getName(),
        email: profile.getEmail(),
        avatar: profile.getImageUrl()
    };
    login(user)
        .then(_ => $('.signin-layer').removeClass('layer--shown'))
        .then(userAuthenticated);
}


/**
 *  Send user information to server in exchange for a JSON Web Token which will
 *  then be stored in IndexedDB and used in the `Authentication` header for
 *  future server requests.
 **/
function login(user) {
    return fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(response => {
        jwtoken = response.jwtoken;
        authenticated = true;
        currentUser = user;
        return Promise.all([
            idbKeyval.set('jwtoken', jwtoken),
            idbKeyval.set('currentuser', user)
        ]);
    });
}


/**
 *  Logs out the current user session, deleting the JSON Web Token stored in
 *  the browser's IndexedDB.
 **/
function logout() {
    if (!gapi) return null;
    return gapi.auth2.getAuthInstance().signOut()
        .then(_ => {
            jwtoken = undefined;
            authenticated = false;
            currentUser = undefined;
            userDeauthenticated();
            return Promise.all([
                idbKeyval.delete('jwtoken'),
                idbKeyval.delete('currentuser')
            ]);
        })
        .then(_ => $('.signin-layer').addClass('layer--shown'));
}
