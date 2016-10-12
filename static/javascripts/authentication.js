// `authenticated` variable is defined in `chatapp.js` file
if (!authenticated) {
    requestAnimationFrame(_ => $('.signin').addClass('signin--shown'));
}


// dynamically load the Google platform library
const script = document.createElement('script');
script.src = 'https://apis.google.com/js/platform.js';
script.async = true;
script.defer = true;
script.onerror = error => console.warn(error);
document.body.appendChild(script);


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
        .then(_ => $('.signin').removeClass('signin--shown'))
        .then(userAuthenticated);
}


/**
 *  Send user information to server in exchange for a JSON Web Token which will
 *  then be stored in LocalStorage and used in the `Authentication` header for
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
        localStorage.setItem('jwtoken', jwtoken);
        authenticated = true;
        return jwtoken;
    });
}


/**
 *  Logs out the current user session, deleting the JSON Web Token stored in
 *  the browser's LocalStorage.
 **/
function logout() {
    if (!gapi) return null;
    return gapi.auth2.getAuthInstance().signOut()
        .then(_ => $('.signin').addClass('signin--shown'));
}
