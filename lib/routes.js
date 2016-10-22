const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const firebase = require('firebase');
const request = require('request');
const webpush = require('web-push');
const middlewares = require('./middlewares');
const config = require('../config');


firebase.initializeApp({
    databaseURL: config.get('FIREBASE_DATABASE_URL')
});
webpush.setGCMAPIKey(config.get('GCM_API_KEY'));

const database = firebase.database();
const router = new express.Router();


router.use('/static', express.static(`${__dirname}/../static`));
router.use('/manifest.json', express.static(`${__dirname}/../static/manifest.json`));
router.use('/service-worker.js', express.static(`${__dirname}/../static/javascripts/service-worker.js`));


router.get('/', (req, res) => res.render('index.html'));
router.get('/messages', (req, res) => res.render('messages.html'));


router.post('/login', (req, res) => {
    const refkey = req.body.email.replace(/[@.]/g, '-');
    database.ref(`users/${refkey}/name`).set(req.body.name);
    database.ref(`users/${refkey}/email`).set(req.body.email);
    database.ref(`users/${refkey}/avatar`).set(req.body.avatar);

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

        database.ref('users').once('value', data => {
            const users = data.val();
            for (let key in users) {
                const user = users[key];
                if (!user.subscription) {
                    continue;
                }

                if (user.subscription.keys) {
                    const payload = JSON.stringify({ user: req.user, message: message });
                    webpush.sendNotification(user.subscription, payload);
                } else {
                    const subscriptionId = user.subscription.endpoint.replace(/^.*\//g, '');
                    const options = {
                        url: 'https://android.googleapis.com/gcm/send',
                        headers: {
                            'Authorization': `key=${config.get('GCM_API_KEY')}`
                        },
                        body: {
                            registration_ids: [subscriptionId]
                        },
                        json: true
                    };
                    request.post(options);
                }
            }

            res.json({ key: reference.key });
        });
    }
);


router.post('/subscribe',
    middlewares.verifyAuthToken,

    (req, res) => {
        const subscription = req.body;
        const refkey = req.user.email.replace(/[@.]/g, '-');

        database.ref(`users/${refkey}/subscription`).set(subscription).then(_ => {
            res.json({ success: true });
        });
    }
);


router.post('/unsubscribe',
    middlewares.verifyAuthToken,

    (req, res) => {
        const refkey = req.user.email.replace(/[@.]/g, '-');
        database.ref(`users/${refkey}/subscription`).remove().then(_ => {
            res.json({ success: true });
        });
    }
);


module.exports = router;
