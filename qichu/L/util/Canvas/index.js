/**
 * Created by lvlq on 15/10/19.
 */
var canvas = require("canvas");
var fs = require("fs");
var Image = canvas.Image;
var wxApi = require("../../api");
var saveDir = __dirname + "/../../../Web/upload/";
var uuid = require("uuid");
var Q = require("q");
var R = require("../R");
var util = require("util");
var logo_dir = __dirname + "/../../../Web/images/logo.png";
var logo2_dir = __dirname + "/../../../Web/images/logo-2.png";

var path = require("path");

var Canvas = function (option) {
    this.bg_img = option.bg_img;
    this.other_img = option.other_img || [];
    this.canvasWidth = option.canvasWidth;
    this.canvasHeight = option.canvasHeight;
    this.canvasTop = option.canvasTop;
    this.canvasLeft = option.canvasLeft;
    this.dx = option.dx;
    this.dy = option.dy;
    this.scale = option.scale;
    this.imgWidth = option.imgWidth;
    this.canvas = null;
    this.ctx = null;
    this.filePath = null;
    this.path = null;
};

var getMedia = function (media_id, cb) {
    wxApi.getMedia(media_id, function (err, buffer) {
        if (err) cb(err, buffer);
        else {
            try {
                JSON.parse(buffer.toString());
                R("qichu:access_token").set("")
                    .then(function () {
                        getMedia(media_id, cb);
                    });
            } catch (e) {
                cb(err, buffer);
            }
            //console.log(buffer.toString());
            //console.log(util.isBuffer(buffer));
            //console.log(util.isObject(buffer));
        }
    });
};

Canvas.prototype.doBG = function () {
    var defer = Q.defer();
    var img = new Image();
    var self = this;
    console.log(this.bg_img);
    wxApi.getMedia(this.bg_img, function (err, buffer) {
    //getMedia(this.bg_img, function (err, buffer) {
        console.log(err);
        if (err) defer.reject(err);
        else {
            //console.log(buffer.toString());
            try {
                JSON.parse(buffer.toString());
                console.log(buffer.toString());
            } catch (e) {
                //cb(err, buffer);
            }
            img.src = buffer;
            //console.log(img.width);
            var width = self.canvasWidth;
            var height = self.canvasHeight;

            var logo_img = new Image();
            logo_img.src = fs.readFileSync(logo_dir);

            var logo_img_width = self.canvasWidth;
            var logo_img_height = logo_img.height * self.canvasWidth / logo_img.width;

            var logo2_img = new Image();
            logo2_img.src = fs.readFileSync(logo2_dir);

            var logo2_img_width = self.canvasWidth;
            var logo2_img_height = logo2_img.height * self.canvasWidth / logo2_img.width;

            self.canvas = new canvas(width * 2, height * 2);
            self.ctx = self.canvas.getContext('2d');


            var indexW = (img.width * self.scale - img.width) / 2;
            var indexH = (img.height * self.scale - img.height) / 2;
            self.canvasTop = ( self.dy * (img.width / self.imgWidth ) * -1 + indexH ) / self.scale;
            self.canvasLeft = ( self.dx * (img.width / self.imgWidth ) * -1 + indexW ) / self.scale;
            console.log(img.width);
            console.log(indexW, indexH);
            console.log(self.dx, self.dy);
            console.log(self.canvasLeft, self.canvasTop);
            console.log(self.scale);


            self.ctx.drawImage(img, self.canvasLeft, self.canvasTop, (width * (img.width / self.imgWidth ) / self.scale), (height * (img.width / self.imgWidth ) / self.scale), 0, 0, width * 2, height * 2);
            self.ctx.drawImage(logo_img, 0, 0, logo_img_width * 2, logo_img_height * 2);
            self.ctx.drawImage(logo2_img, 0, (height - logo2_img_height) * 2, logo2_img_width * 2, logo2_img_height * 2);
            defer.resolve();
        }
    });
    return defer.promise;
};

Canvas.prototype.translate = function () {
    for (var i = 0; i < this.other_img.length; i++) {
        var info = this.other_img[i];
        var imgurl = __dirname + "/../../../Web/" + info.src;
        this.draw(imgurl, info.top, info.left, info.width, info.rota);
    }
};

Canvas.prototype.draw = function (dir, top, left, width, rota) {
    console.log(dir, top, left, width, rota);
    dir = dir || "";
    top = top || 0;
    left = left || 0;
    width = width || 0;
    rota = rota || 0;

    console.log(fs.existsSync(dir));

    if (!dir || !fs.existsSync(dir)) {
        return;
    }


    var img = new Image();
    dir = path.normalize(dir);
    img.src = fs.readFileSync(dir);
    var rote = width / img.width;
    var height = img.height * rote;

    top = top - (height / 2);
    left = left - (width / 2);

    console.log(dir);
    console.log(img.src);
    this.ctx.save();
    this.ctx.translate(width / 2 + left, height / 2 + top);
    this.ctx.rotate(rota * Math.PI / 180);
    this.ctx.drawImage(img, -width / 2, -height / 2, width, height);
    this.ctx.restore();
};

Canvas.prototype.save = function () {
    var filename = uuid.v1() + ".png";
    this.filePath = saveDir + filename;
    this.path = "/upload/" + filename;
    fs.writeFileSync(this.filePath, this.canvas.toBuffer());
};

module.exports = Canvas;