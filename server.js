//region Dependencies
let express = require('express'),
    app = express(),
    appName = 'rhinozApp';
//endregion

//region Config
require('./server/config/config')(app);
require('./server/config/database/databaseConfig')('mongodb://localhost/' + appName);
//endregion

//region Start App
let port = process.env.PORT || 80;
app.listen(port);
exports = module.exports = app;
console.log('Server opened at port '+port);
//endregion