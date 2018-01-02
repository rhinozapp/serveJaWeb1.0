//region Dependencies
<<<<<<< HEAD
var appName = 'rhinozApp';
var express = require('express'),
    app = express(),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');
require('./server/config/database/databaseConfig')('mongodb://localhost/' + appName);
//endregion

//region Config
/*app.use(bodyParser.json({ContentType:'utf-8'})); // parse application/json*/
app.use(bodyParser.json({ limit: '1000000000000000b' })); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.static(__dirname + '/www/'));
app.use(cors({ origin: 'http://localhost:80' }));
app.use(cors({ origin: 'http://localhost:8100' }));
app.use(cors());
//endregion

//region CORS
app.use(cors());
app.options('*', cors());
//endregion

//region Config
var config = require('./server/config/config');
config.config(app);
//endregion

//region Routes
var routes = require('./server/routes/router');
routes.routes(app);
=======
let express = require('express'),
    app = express(),
    appName = 'serveJa',
    dbUser = 'dev',
    dbPassword = 'dev001!';
//endregion

//region Config
require('./server/config/config')(app);
require('./server/config/database/databaseConfig')('mongodb://localhost/' + appName);
//require('./server/config/database/databaseConfig')('mongodb://'+ dbUser +':'+ dbPassword + '@ds149335.mlab.com:49335/heroku_gzm8rnrq');
>>>>>>> 462de9f4c9b5087f19df475bd5ffa19bd84d02e4
//endregion

//region Start App
let port = process.env.PORT || 80;
app.listen(port);
exports = module.exports = app;
console.log('Server opened at port ' + port);
//endregion