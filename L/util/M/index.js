/**
 * Created by lvlq on 15/7/25.
 */
var config = require("../../config/mysql")[env];
var mysql = require("mysql");
var util = require('util');
var Q = require("q");


var exec = function (sql, obj) {
    console.log(sql);
    console.log(obj);
    var defer = Q.defer();
    var connection = mysql.createConnection(config);
    connection.connect();
    connection.query(sql, obj, function (err, rows, fields) {
        if (!!err) {
            defer.reject(err);
        }
        else {
            defer.resolve(rows, fields);
        }

    });
    connection.end();
    return defer.promise;
};

var doWhere = function (where) {
    var str = "";

    var sqlOper = function (oper, parma) {
        switch (oper) {
            case "in":
                return " in ('" + parma[oper].join("','") + "') ";
                break;
            case "notin":
                return " not in ('" + parma[oper].join("','") + "') ";
                break;
            default:
                return " " + oper + " '" + parma[oper] + "' ";
                break;
        }
    };

    var x = function (w) {
        if (w.and || w.or) {
            var key;
            if (w.and) key = 'and';
            if (w.or) key = "or";
            str += "(";
            for (var i = 0; i < w[key].length; i++) {
                if (w[key][i].and || w[key][i].or) {
                    x(w[key][i]);
                } else {
                    for (var oper in w[key][i]) {
                        str += " `" + oper + "`";
                        for (var o in w[key][i][oper]) {
                            str += sqlOper(o, w[key][i][oper]);
                        }
                    }
                }
                if (i != w[key].length - 1)
                    str += " " + key + " ";
            }
            str += ")"
        } else {
            for (var oper in w) {
                str += " `" + oper + "`";
                for (var o in w[oper]) {
                    str += sqlOper(o, w[oper]);
                }
            }
        }
    };

    x(where);
    return "where " + str;
};

module.exports = function (table) {
    return {
        find: function (columns) {
            var obj, sql;
            if (!columns) {
                obj = [table];
                sql = "select * from ?? %s %s %s %s";
            } else {
                obj = [columns, table];
                sql = "select ?? from ?? %s %s %s %s";
            }
            var find = {
                where: function (where) {
                    var str = doWhere(where);
                    this.array[3] = str;

                    return this;
                },
                group: function (group) {
                    var str = ' group by ' + group;
                    this.array[0] = str;
                    return this;
                },
                order: function (key, sort) {
                    var str = ' order by ' + key + " " + sort;
                    this.array[1] = str;
                    return this;
                },
                limit: function (start, num) {
                    var str = ' limit ' + start + "," + num;
                    this.array[2] = str;
                    return this;
                },
                count: function () {
                    obj = [table];
                    sql = "select count(1) as count from ??";
                    return this;
                },
                exec: function () {
                    var s = util.format(sql, this.array[3], this.array[0], this.array[1], this.array[2]);
                    return exec(s, obj);
                },
                array: ["", "", "", ""]
            };

            return find;
        },
        insert: function (post) {
            var sql = "insert into ?? set ?";
            var obj = [table, post];
            return {
                exec: function () {
                    return exec(sql, obj);
                }
            };
        },
        delete: function () {
            var sql = "delete from ?? %s";
            var obj = [table];
            return {
                where: function (where) {
                    var str = doWhere(where);
                    this.array[0] = str;
                    return this;
                },
                exec: function () {
                    var s = util.format(sql, this.array[0]);
                    return exec(s, obj);
                },
                array: [""]
            };
        },
        update: function (data) {
            var sql = "update ?? set ? %s";
            var obj = [table, data];
            return {
                where: function (where) {
                    var str = doWhere(where);
                    this.array[0] = str;
                    return this;
                },
                exec: function () {
                    var s = util.format(sql, this.array[0]);
                    return exec(s, obj);
                },
                array: ["", "", "", ""]
            };
        }
    };
};