var admin = require("firebase-admin");
exports.doLogin = function (req, res) {
    console.log(req.body);

    res.json({test : true});
};