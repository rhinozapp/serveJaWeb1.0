module.exports = function (app) {
    //region Dependencies
    let express =        require('express'),
        logger         = require('morgan'),
        fs             = require('fs'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        FileStreamRotator = require('file-stream-rotator'),
        cors = require('cors'),
        logDirectory = './log/server/',
        consign = require('consign');
    //endregion

    //region Morgan Setup
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    var accessLogStream = FileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: logDirectory + '/access-%DATE%.log',
        frequency: 'daily',
        verbose: false
    });
    app.use(logger('dev', {stream: accessLogStream}));
    //endregion

    //region Config
    app.use(bodyParser.json({limit:'1000000000000000b'})); // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    app.use(express.static('./public/'));
    app.use('/static1', express.static('./www/'));
    app.use(cors({origin: 'http://localhost:80'}));
    app.use(cors({origin: 'http://localhost:8100'}));
    app.use(cors());
    //endregion

    //region CORS
    app.use(cors());
    app.options('*', cors());
    //endregion

    //region Consign
    consign({
        cwd: 'server/config',
        verbose : false
    })
        .include('models')
        .then('routes')
        .into(app);
    //endregion
};