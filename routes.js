const express = require('express');
const router = new express.Router();


router.use('/static', express.static(`${__dirname}/static`));


router.get('/', (req, res) => res.render('index.html'));


router.post('/login', (req, res) => {
    console.log(req.body);
    res.json({ jwtoken: 'arnellebalanejwt' });
});


module.exports = router;
