const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const consolidate = require('consolidate');
const config = require('./config');


const app = express();

app.use(morgan('dev'));
app.use(bodyparser.json());

app.use(require('./routes'));

app.engine('html', consolidate.nunjucks);
app.set('views', `${__dirname}/views`);

app.listen(config.get('PORT'),
    _ => console.log(`Server is now running at port ${config.get('PORT')}`));
