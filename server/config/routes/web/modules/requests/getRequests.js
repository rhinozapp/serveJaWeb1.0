exports.getRequests = function (req, res) {
    let mongoose = require('mongoose'),
        tables = mongoose.model('tables');

    /*req.io.on('connection', function(socket){
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });*/

    /*req.io.sockets.emit(req.body.id, true);
    req.io.sockets.on(req.body.id, function (data) {
        console.log(data);
    });*/

    res.json({
        status : true
    });
};