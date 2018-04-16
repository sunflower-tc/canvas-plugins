/**
 * Created by lvlq on 15/8/20.
 */
var OAuth = require('wechat-oauth');
var config = require("../config/weixin")[env];
var R = require("../util/R");
var api = new OAuth(config.appid, config.appsecret, function (openid, callback) {
    R("qichu:" + openid + ":access_token").get()
        .then(function (token) {
            callback(null, token);
        })
        .catch(function (err) {
            callback(err);
        });
}, function (openid, token, callback) {
    R("qichu:" + openid + ":access_token").set(token)
        .then(function () {
            callback(null);
        })
        .catch(function (err) {
            callback(err);
        });
});

module.exports = api;