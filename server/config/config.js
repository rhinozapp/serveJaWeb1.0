exports.config = function (app) {
    //region Dependencies
    var express =        require('express'),
        logger         = require('morgan'),
        fs             = require('fs'),
        FileStreamRotator = require('file-stream-rotator'),
        cors = require('cors'),
        logDirectory = __dirname + '/log/server/';
    //endregion

    //region Morgan Setup
    /*fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    var accessLogStream = FileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: logDirectory + '/access-%DATE%.log',
        frequency: 'daily',
        verbose: false
    });
    app.use(logger('dev', {stream: accessLogStream}));*/
    //endregion
};