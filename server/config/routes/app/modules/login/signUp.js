exports.signup = function (req, res) {
    var mongoose = require('mongoose'),
        userModel = mongoose.model('user');

    switch (true){
        case req.body.type.indexOf('Facebook') > 0:
            new userModel({
                userIDFirebase : req.body.userIDFirebase,
                profileFace: req.body.profileFacebook,
                email : req.body.profileFacebook.profile.email
            }).save().then(function (data) {
                console.log(true);
            });
    }

    res.send(true);
};

/*var myModel = mongoose.model('user');
    var test = new myModel({
        email : 'test'
    });

    test.save().then(function (data) {
        console.log(data);
    });

    myModel.find().then(function (data) {
        console.log(data);
    });*/