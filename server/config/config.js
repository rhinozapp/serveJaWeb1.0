module.exports = function(app) {
    //region Dependencies
    let express = require('express'),
        morgan = require('morgan'),
        fs = require('fs'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        FileStreamRotator = require('file-stream-rotator'),
        cors = require('cors'),
        logDirectory = './log/server/',
        consign = require('consign'),
        logger = require('./logger');
    //endregion

    //region Morgan Setup
    logger.debug("Overriding 'Express' logger")
    app.use(morgan(':method :url :status :response-time ms - :date[web]', { stream: logger.stream }));
    //endregion

    //region Config
    app.use(bodyParser.json({ limit: '1000000000000000b' })); // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    app.use(express.static('./public/'));
    app.use('/static1', express.static('./www/'));
    app.use(cors({ origin: 'http://localhost:80' }));
    app.use(cors({ origin: 'http://localhost:8100' }));
    app.use(cors({ origin: 'http://maps.google.com' }));
    app.use(cors({ origin: 'https://viacep.com.br' }));
    app.use(cors());
    //endregion

    //region CORS
    app.use(cors());
    app.options('*', cors());
    //endregion

    //region Consign
    consign({
            cwd: process.cwd() + '\\server\\config',
            verbose: false
        })
        .include('models')
        .then('routes')
        .into(app);
    //endregion
};