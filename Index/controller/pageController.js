/**
 * Created by lvlq on 15/10/23.
 */
var uuid = require("uuid");
var M = L("util.M");
var oAuth = L("api.oAuth");
var Canvas = L("util.Canvas");
var Q = require("q");
var config = require("../config");

var jumpURL = function (req, res) {
    var redirectUrl = req.protocol + "://" + req.hostname + "/Index";
    var date = (new Date()).getTime();
    var state = date;
    res.cookie('state', date, {
        maxAge: 2 * 60 * 10000,
        path: '/'
    });
    var scope = "snsapi_base";
    var url = oAuth.getAuthorizeURL(redirectUrl, state, scope);
    console.log(url);
    res.redirect(url);
};

var renderHTML = function (req, res) {
    res.render("index.html");
};

var show = function (req, res) {
    var state = req.query.state;
    var cookie = req.cookies.state;

    if (state && state == cookie) {
        res.clearCookie('state', {
            path: '/'
        });
        renderHTML(req, res);
    } else {
        if (env == "production") {
            jumpURL(req, res);
        } else {
            res.clearCookie('state', {
                path: '/'
            });
            renderHTML(req, res);
        }
    }
};

var upload = function (req, res) {
    console.log(req.body.bgId);
    console.log(parseFloat(req.body.bgWidth));
    console.log(parseFloat(req.body.bgHeight));
    console.log(parseFloat(req.body.bgTop));
    console.log(parseFloat(req.body.bgLeft));
    console.log(req.body.plugIns);
    console.log(parseFloat(req.body.dx));
    console.log(parseFloat(req.body.dy));
    console.log(parseFloat(req.body.scale));
    console.log(parseFloat(req.body.imgWidth));
    var canvas = new Canvas({
        bg_img: req.body.bgId,
        canvasWidth: parseFloat(req.body.bgWidth),
        canvasHeight: parseFloat(req.body.bgHeight),
        canvasTop: parseFloat(req.body.bgTop),
        canvasLeft: parseFloat(req.body.bgLeft),
        other_img: JSON.parse(req.body.plugIns),
        dx: parseFloat(req.body.dx),
        dy: parseFloat(req.body.dy),
        scale: parseFloat(req.body.scale),
        imgWidth: parseFloat(req.body.imgWidth)
    });

    var userModel = M("qc_user");


    canvas.doBG().then(function () {
        canvas.translate();
        canvas.save();
        console.log(canvas.path);
        var id = uuid.v1();
        userModel.insert({
            id: id,
            openid: req.cookies["uid"],
            img_url: canvas.path,
            music: req.body.music
        }).exec().then(function () {
            console.log(1);
            res.json({
                id: id,
                path: canvas.path,
                music: req.body.music
            });
        }).catch(function (err) {
            console.log(2);
            res.json({
                err: err
            });
        })

    }).catch(function (err) {
        console.log(3);
        res.json({
            err: err
        });
    });
};
var dispaly = function (req, res) {
    var shareid = req.query.shareid;
    if (shareid || shareid != "") {
        var userModel = M("qc_user");
        userModel.find().where({
            id: {
                "=": shareid
            }
        }).exec().then(function (data) {
            if (data.length == 0) throw new Error();

            res.render("share.html", {
                resource: "/",
                img_url: data[0].img_url,
                music: data[0].music
            });

        }).catch(function () {

            res.render("index.html", {
                resource: "/"
            });
        });
    } else {
        res.render("index.html", {
            resource: "/"
        });
    }
};

var showshare = function (req, res) {
    var id = req.query.id;
    var userModel = M("qc_user");

    if (id || id != "") {
        userModel.find().where({
            id: {
                "=": id
            }
        }).exec().then(function (data) {
            if (data.length == 0) throw new Error();

            res.render("share.html", {
                resource: "/",
                img_url: data[0].img_url,
                music: data[0].music
            });

        }).catch(function () {

            res.render("index.html", {
                resource: "/"
            });
        });
    } else {
        res.render("index.html", {
            resource: "/"
        });
    }
};

var getPrize = function (req, res) {
    var uid = req.cookies.uid;
    var codelist = M("qc_code_list");
    var playlist = M("qc_play");
    Q.fcall(function () {
        return Q.fcall(function () {
            return playlist.find().where({
                uid: {"=": uid}
            }).exec()
        }).then(function (data) {
            if (data.length != 0) {
                console.log("此用户完过了，无法再中面霜:" + uid);
                throw new Error("999");
            }
            return codelist.find().where({
                uid: {
                    "=": uid
                }
            }).exec();
        });
    }).then(function (data) {
        if (data.length == 0) {
            return Q.fcall(function () {
                var random = Math.random();
                //if (random < 0.2) {
                if (random < config.chance) {
                    console.log("逻辑上中奖了:" + uid);
                    return;
                } else {
                    throw new Error("999");
                }
            }).then(function () {
                return codelist.find().count().exec()
            }).then(function (data) {
                console.log("当前中奖用户个数为:" + data[0].count + ",最大中奖个数为:" + config.num);
                //if (data[0].count >= 1000) {
                if (data[0].count >= config.num) {
                    throw new Error("999");
                }

                return codelist.insert({
                    id: uuid.v1(),
                    uid: uid
                }).exec().then(function () {
                    //return codelist.find().order("create_time", "asc").limit(0, 1000).exec();
                    return codelist.find().order("create_time", "asc").limit(0, config.num).exec();
                }).then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].uid == uid) {
                            return data[i];
                        }
                    }

                    throw new Error(999);
                });

            });
        } else {
            return data[0];
        }
    }).then(function (data) {
        console.log("此用户中面霜:" + uid);

        res.json({
            error: 0,
            data: data
        });
    }).catch(function () {
        console.log("此用户未中奖:" + uid);
        playlist.insert({
            id: uuid.v1(),
            uid: uid
        }).exec();

        res.json({
            error: 999
        })
    });
};

var addinfo = function (req, res) {
    var name = req.body.name;
    var phone = req.body.phone;
    var address = req.body.address;
    var uid = req.cookies.uid;
    var codelist = M("qc_code_list");

    codelist.update({
        name: name,
        phone: phone,
        address: address
    }).where({
        uid: {
            "=": uid
        }
    }).exec().then(function () {
        res.json({
            success: true
        });
    }).catch(function (err) {
        res.json({
            success: false,
            err: err
        });
    });

};


var addzan = function (req, res) {
    var zan_table = M("qc_zan");
    var uid = req.cookies.uid;
    zan_table.insert({
        uid: uid
    }).exec().then(function () {
        res.json({
            success: false
        });
    }).catch(function () {
        res.json({
            success: false
        });
    });
}

var getzan = function (req, res) {
    var zan_table = M("qc_zan");
    var uid = req.cookies.uid;
    zan_table.find().count().exec().then(function (data) {
        var num = parseInt(data[0].count) + 300;
        res.json({
            num: num
        });
    }).catch(function () {
        res.json({
            num: 6578
        });
    })
}


module.exports = {
    show: show,
    dispaly: dispaly,
    upload: upload,
    showshare: showshare,
    getPrize: getPrize,
    addinfo: addinfo,
    addzan: addzan,
    getzan: getzan
};