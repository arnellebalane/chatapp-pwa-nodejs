const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const firebase = require('firebase');
const middlewares = require('./middlewares');
const config = require('../config');


firebase.initializeApp({
    databaseURL: config.get('FIREBASE_DATABASE_URL')
});
const database = firebase.database();
const router = new express.Router();


router.use('/static', express.static(`${__dirname}/../static`));
router.use('/manifest.json', express.static(`${__dirname}/../static/manifest.json`));
router.use('/service-worker.js', express.static(`${__dirname}/../static/javascripts/service-worker.js`));


router.get('/', (req, res) => res.render('index.html'));
router.get('/messages', (req, res) => res.render('messages.html'));


router.post('/login', (req, res) => {
    const refkey = req.body.email.replace(/[@.]/g, '-');
    database.ref(`users/${refkey}`).set(req.body);

    const jwtoken = jsonwebtoken.sign(req.body, config.get('JWT_SECRET'));
    res.json({ jwtoken: jwtoken });
});


router.post('/message',
    middlewares.verifyAuthToken,

    (req, res) => {
        const message = {
            content: req.body.message,
            author: req.user.email.replace(/[@.]/g, '-'),
            when: (new Date()).valueOf()
        };
        const reference = database.ref('messages').push(message);
        res.json({ key: reference.key });
    }
);


router.post('/subscribe',
    middlewares.verifyAuthToken,

    (req, res) => {
        const subscription = req.body;
        const refkey = req.user.email.replace(/[@.]/g, '-');

        database.ref(`users/${refkey}/subscription`).set(subscription);
        res.json({ success: true });
    }
);


router.post('/unsubscribe',
    middlewares.verifyAuthToken,

    (req, res) => {
        const refkey = req.user.email.replace(/[@.]/g, '-');
        database.ref(`users/${refkey}/subscription`).remove();
        res.json({ success: true });
    }
);


module.exports = router;
