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


router.get('/', (req, res) => res.render('index.html'));


router.post('/login', (req, res) => {
    const refkey = req.body.email.replace(/[@.]/g, '-');
    database.ref(`users/${refkey}`).set(req.body);

    const jwtoken = jsonwebtoken.sign(req.body, config.get('JWT_SECRET'));
    res.json({ jwtoken: jwtoken });
});


module.exports = router;
