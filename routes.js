const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const config = require('./config');


const router = new express.Router();


router.use('/static', express.static(`${__dirname}/static`));


router.get('/', (req, res) => res.render('index.html'));


router.post('/login', (req, res) => {
    const jwtoken = jsonwebtoken.sign(req.body, config.get('JWT_SECRET'));
    res.json({ jwtoken: jwtoken });
});


module.exports = router;
