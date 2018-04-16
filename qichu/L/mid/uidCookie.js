/**
 * Created by lvlq on 15/10/7.
 */
var uuid = require("uuid");

module.exports = function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        uid = uuid.v1();
        res.cookie("uid", uid, {maxAge: 365 * 24 * 60 * 60 * 1000});
        console.log(uid);
    }
    next();
};