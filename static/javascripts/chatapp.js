let jwtoken = localStorage.getItem('jwtoken');
let authenticated = jwtoken !== null;

if (authenticated) {
    userAuthenticated();
}


function userAuthenticated() {
    console.log(localStorage.getItem('jwtoken'), authenticated);
}
