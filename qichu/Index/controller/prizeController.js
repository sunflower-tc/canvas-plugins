/**
 * Created by lvlq on 15/9/25.
 */
var uuid = require("uuid");
var M = require("../../util/M");
var Q = require("q");

Date.prototype.toLocaleString = function () {
    var pad = function (num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    };
    return this.getFullYear() + "-" +
        pad((this.getMonth() + 1), 2) + "-" +
        pad(this.getDate(), 2) + " " +
        pad(this.getHours(), 2) + ":" +
        pad(this.getMinutes(), 2) + ":" +
        pad(this.getSeconds(), 2);
};

/**
 * 判断用户是否中奖
 * @param req
 * @param res
 */
var info = function (req, res) {
    var uid = req.cookies.uid;
    Q.fcall(function () {
        return M("ysld_user_prize_info")
            .find()
            .where({id: {"=": uid}})
            .exec();
    }).then(function (data) {
        if (data.length == 0) {
            res.json({success: true, prize: 0});
        } else {
            res.json({success: true, prize: 1});
        }
    }).catch(function (err) {
        res.json({success: false, err: err.message});
    });
};

/**
 * 计算用户中奖几率，返回是否中奖
 * @param req
 * @param res
 */
var calculate = function (req, res) {
    var uid = req.cookies.uid;
    Q.fcall(function () {
        if (!uid) {
            throw new Error("无效用户");
        }
        return M("ysld_user_prize_info")
            .find()
            .where({id: {"=": uid}})
            .exec();
    }).then(function (data) {
        if (data.length != 0) {
            throw new Error("亲~~已经领过奖不能再领了哦！");
        }

        return M("ysld_prize_list").find().where({"user_id": {"=": uid}}).exec();
    }).then(function (data) {
        if (data.length > 0) {
            return;
        }

        return Q.fcall(function () {
            var date = new Date().toLocaleString();
            return M("ysld_prize_list").find().where({
                and: [
                    {"is_get": {"=": 0}},
                    {"start_time": {"<": date}}
                ]
            }).exec();
        }).then(function (data) {
            var count = data.length;
            console.log(count);
            if (count == 0) {
                throw new Error("没有领上门票，再接再厉哦~~");
            }

            var odds = 0.005;

            var random = Math.random();

            if (random < odds) {
                var date = new Date().toLocaleString();

                return Q.fcall(function () {
                    return M("ysld_prize_list")
                        .find()
                        .where({
                            and: [
                                {"is_get": {"=": 0}},
                                {"start_time": {"<": date}}
                            ]
                        })
                        .limit(0, 1)
                        .exec();
                }).then(function (data) {
                    if (data.length == 0) {
                        throw new Error("没有领上门票，再接再厉哦~~");
                    }

                    return M("ysld_prize_list")
                        .update({
                            is_get: 1,
                            user_id: uid
                        })
                        .where({
                            and: [
                                {"is_get": {"=": 0}},
                                {"start_time": {"<": date}},
                                {"id": {"=": data[0].id}}
                            ]
                        })
                        .exec();
                });

            } else {
                throw new Error("没有领上门票，再接再厉哦~~");
            }
        }).then(function (data) {
            if (data.affectedRows != 0) {
                return data;
            } else {
                throw new Error("没有领上门票，再接再厉哦~~");
            }
        });
    }).then(function () {
        res.json({success: true});
    }).catch(function (err) {
        res.json({success: false, err: err.message});
    });
};
/**
 * 记录中奖用户信息
 * @param req
 * @param res
 */
var userinfo = function (req, res) {
    var uid = req.cookies.uid;
    var name = req.body.name;
    var phone = req.body.phone;
    var address = req.body.address;
    Q.fcall(function () {
        if (!uid) {
            throw new Error("无效用户");
        }
        return M("ysld_user_prize_info").find().where({id: {"=": uid}}).exec();
    }).then(function (data) {
        if (data.length != 0) {
            throw new Error("亲~~已经领过奖不能再领了哦！");
        }
        return M("ysld_prize_list").find().where({"user_id": {"=": uid}}).exec();
    }).then(function (data) {
        if (data.length == 0) {
            throw new Error("亲~~您未中奖哦！");
        }

        return M("ysld_user_prize_info").insert({
            id: uid,
            name: name,
            phone: phone,
            address: address,
            prize_id: data[0].id
        }).exec();
    }).then(function () {
        res.json({success: true});
    }).catch(function (err) {
        res.json({success: false, err: err.message});
    });
};

module.exports = {
    info: info,
    calculate: calculate,
    userinfo: userinfo
};