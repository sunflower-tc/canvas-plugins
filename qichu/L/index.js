/**
 * Created by lvlq on 15/11/7.
 */

var express = require('express');
var morgan = require("morgan");
var bodyParser = require('body-parser');
var session = require("express-session");
var cookieParser = require("cookie-parser");
env = process.env.NODE_ENV || 'production';//production development
var port = process.env.NODE_PORT || 18080;
console.log(env);

L = function (str) {
    var arr = str.split(".");
    var path = "";
    for (var i = 0; i < arr.length; i++) {
        path += "/" + arr[i];
    }
    return require(__dirname + path);
};

var modelArray = [];

var set = function (model) {
    modelArray.push(model);
};

var model = function (app, express, model) {
    var routes = require("../" + model);
    var routeApp = express.Router();
    routeApp.use(morgan('dev'));
    routes(routeApp);
    app.use('/' + model, routeApp);
};

var init = function () {

    var app = express();

    app.set("views", __dirname + "/../Web");
    app.engine('html', require('ejs').renderFile);

    app.use(bodyParser());
    app.use(cookieParser());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }));
    app.use(require("./mid/uidCookie"));
    for (var i = 0; i < modelArray.length; i++) {
        model(app, express, modelArray[i]);
    }
    app.use("/", express.static(__dirname + "/../Web"));

    app.listen(port);
    console.log('listen port ' + port);
};

module.exports = {
    init: init,
    set: set
};