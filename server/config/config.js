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
    logger.debug("Overriding 'Express' logger");
        //Attention: this is an example of how to use winston
        //Every time you want to log something YOU DON'T USE console.log(), instead you're gonna use logger.debug()
        //logger.info() also works. There is several levels of logs. ATTENTION ON THAT!
    /*app.use(morgan(':method :url :status :response-time ms - :date[web]', { stream: logger.stream }));*/
    //endregion

    //region Config
    app.use(bodyParser.json({ limit: '1000000000000000b' })); // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    app.use(express.static('./public/'));
    app.use('/app', express.static('./www/'));
    app.use(cors({origin: 'http://localhost:80', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'}));
    app.use(cors({origin: 'http://localhost:8100', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'}));
    app.use(cors({origin: 'http://maps.google.com', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'}));
    app.use(cors({origin: 'https://viacep.com.br', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'}));
    app.use(cors({origin: 'https://rhinozapp.herokuapp.com', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'}));
    app.use(cors({origin: 'https://rhinozapp.herokuapp.com:42701', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'}));
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