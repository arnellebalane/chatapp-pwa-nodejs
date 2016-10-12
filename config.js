const nconf = require('nconf');


nconf
    .argv()
    .env()
    .file({ file: `${__dirname}/config.json` })
    .defaults({
        PORT: 3000
    });


module.exports = nconf;
