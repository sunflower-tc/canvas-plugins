/**
 * Created by lvlq on 15/9/25.
 */
env = process.env.NODE_ENV || 'development';//production development
var M = require("./L/util/M");
var uuid = require("uuid");
var urllib = require("urllib");

urllib.request("http://h5.easybird.cn/getwxtoken", {
    dataType: "json"
}, function (err, data, res) {
    if (err) {
        throw err;
    }
    console.log(JSON.stringify(data));
});