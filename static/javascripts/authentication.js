// `authenticated` variable is defined in `chatapp.js` file
if (!authenticated) {

    requestAnimationFrame(_ => $('.signin').addClass('signin--shown'));

    // dynamically load the Google platform library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    script.onerror = error => console.warn(error);
    document.body.appendChild(script);


    function onsignin(googleUser) {
        const profile = googleUser.getBasicProfile();
        const user = {
            name: profile.getName(),
            avatar: profile.getImageUrl()
        };
        login(user)
            .then(_ => $('.signin').removeClass('signin--shown'))
            .then(userAuthenticated);
    }


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


    function logout() {
        if (!gapi) return null;
        return gapi.auth2.getAuthInstance().signOut()
            .then($('.signin').addClass('signin--shown'));
    }

}
