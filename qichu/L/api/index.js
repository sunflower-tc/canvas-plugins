/**
 * Created by lvlq on 15/8/19.
 */
var WechatAPI = require('wechat-api');
var config = require("../config/weixin")[env];
var R = require("../util/R");
var urllib = require("urllib");
var api = new WechatAPI(config.appid, config.appsecret, function (callback) {
    R("qichu:access_token").get()
        .then(function (token) {
            callback(null, token);
        })
        .catch(function (err) {
            callback(err);
        });


    //urllib.request("http://h5.easybird.cn/getwxtoken", {
    //    dataType: "json"
    //}, function (err, data, res) {
    //    if (err) {
    //        callback(err);
    //        return;
    //    }
    //    data.accessToken = data.token;
    //    data.expireTime = (new Date()).getTime() + 1000000;
    //    callback(null, data);
    //    console.log(JSON.stringify(data));
    //});

}, function (token, callback) {
    token.expireTime = (new Date).getTime() + 10 * 60 * 1000;

    R("qichu:access_token").set(token)
        .then(function () {
            callback(null);
        })
        .catch(function (err) {
            callback(err);
        });
});

api.registerTicketHandle(function (type, callback) {
    R("qichu:" + type + ":ticketToken").get()
        .then(function (token) {
            callback(null, token);
        })
        .catch(function (err) {
            callback(err);
        });
}, function (type, ticketToken, callback) {
    R("qichu:" + type + ":ticketToken").set(ticketToken)
        .then(function () {
            callback(null);
        })
        .catch(function (err) {
            callback(err);
        });
});

module.exports = api;