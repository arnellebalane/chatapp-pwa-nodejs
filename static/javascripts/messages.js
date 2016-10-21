firebase.initializeApp({
    databaseURL: 'https://chatapp-pwa-nodejs.firebaseio.com/'
});
const database = firebase.database();

const messagesContainer = $('.messages');
const messageTemplateSource = $('template#message').html();
const messageTemplate = Handlebars.compile(messageTemplateSource);


const retrieveMessages = _ => {
    database.ref('messages').on('child_added', messageData => {
        const message = messageData.val();

        database.ref(`users/${message.author}`).once('value', userData => {
            message.author = userData.val();
            message.outgoing = message.author.email === currentUser.email;
            renderMessage(message);
        });
    });
};


const renderMessage = (message) => {
    const renderedMessage = $(messageTemplate(message));
    renderedMessage.addClass('message--entering');

    messagesContainer.prepend(renderedMessage);
    setTimeout(_ => renderedMessage.removeClass('message--entering'), 0);
};


userAuthenticatedCallbacks.push(_ => {
    retrieveMessages();
    $('.messages-layer').addClass('layer--shown');
});

userDeauthenticatedCallbacks.push(_ => {
    messagesContainer.empty();
    database.ref('messages').off('value');
    $('.messages-layer').removeClass('layer--shown');
});
