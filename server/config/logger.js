let winston = require('winston');
winston.emitErrs = true;

let logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'log/server/all-logs.log',
            handleExceptions: true,
            json: true,
            //maxsize: 5242880, //5MB
            //maxFiles: 5, //A cada 5 MB de arquivo, cria-se outro
            colorize: false
        }),
        /*new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })*/
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};