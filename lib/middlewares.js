const jsonwebtoken = require('jsonwebtoken');
const config = require('../config');


function verityAuthToken(req, res, next) {
    if (!req.headers.hasOwnProperty('authorization')) {
        throw new Error('No authorization header found.');
    }
    const authorization = req.headers.authorization;
    const jwtoken = authorization.replace(/^Bearer /i, '');
    try {
        req.user = jsonwebtoken.verify(jwtoken, config.get('JWT_SECRET'));
        next();
    } catch (err) {
        res.status(401).send('Authorization token is invalid.');
    }
}


exports.verifyAuthToken = verityAuthToken;
