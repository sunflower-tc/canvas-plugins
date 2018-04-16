/**
 * Created by lvlq on 15/10/13.
 */
(function ($) {
    var getImgInfo = function (url, cb) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            cb({
                width: img.width,
                height: img.height
            })
        }
    };

    var plugin = function ($el) {
        this.$el = $el;
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.outerWidth = this.$el.parent().width();
        this.outerHeight = this.$el.parent().height();
        this.angle = 0;
        this.move();
        this.remove();
        this.resize();
        this.rotate();
        this.minWH = 30;

        this.$el.data("rate", this.$el.find(".img img").width() / this.$el.find(".img img").height());
        var self = this;
        getImgInfo(this.$el.find(".img img").attr("src"), function (data) {
            self.imgWidth = data.width;
            self.imgHeight = data.height;
        });
    };

    plugin.prototype.move = function () {
        var self = this;
        var flag = false;
        var beginTime, endTime;
        this.$el.find(".img").on("touchstart", function (e) {
            e.preventDefault();
            beginTime = (new Date).getTime();
            if (!self.$el.hasClass("focus")) return;
            flag = true;
            self.currentX = e.touches[0].clientX;
            self.currentY = e.touches[0].clientY;
            self.top = parseInt(self.$el.css("top").replace("px", ""));
            self.left = parseInt(self.$el.css("left").replace("px", ""));
            self.width = self.$el.width();
            self.height = self.$el.height();
            return false;
        }).on("touchmove", function (e) {
            if (!flag) return;
            var currentXIndex = e.touches[0].clientX - self.currentX;
            var currentYIndex = e.touches[0].clientY - self.currentY;
            self.top += currentYIndex;
            self.left += currentXIndex;
            var imgH, imgW;

            if (self.imgWidth > self.imgHeight) {
                imgH = self.imgHeight * (self.width - 20) / self.imgWidth;
                imgW = self.width - 20;
            } else {
                imgH = self.height - 20;
                imgW = self.imgWidth * (self.height - 20) / self.imgHeight;
            }
            //if (self.top < 0) self.top = 0;
            if (self.top < (-1 * self.height + imgH ) / 2) self.top = (-1 * self.height + imgH ) / 2;
            //if (self.left < 0) self.left = 0;
            if (self.left < (-1 * self.width + imgW ) / 2) self.left = (-1 * self.width + imgW ) / 2;
            //if (self.outerHeight < self.height + self.top) self.top = self.outerHeight - self.height;
            if (self.outerHeight + (self.height - imgH) / 2 < self.height + self.top) self.top = self.outerHeight + ((self.height - imgH) / 2) - self.height;
            //if (self.outerWidth < self.width + self.left) self.left = self.outerWidth - self.width;
            if (self.outerWidth + (self.width - imgW) / 2 < self.width + self.left) self.left = self.outerWidth + ((self.width - imgW) / 2) - self.width;


            self.currentX = e.touches[0].clientX;
            self.currentY = e.touches[0].clientY;
            self.$el.css({
                top: self.top + "px",
                left: self.left + "px"
            });
        }).on("touchend", function (e) {
            flag = false;
            endTime = (new Date).getTime();
            if (endTime - beginTime < 150) {
                $(".focus").removeClass("focus");
                self.$el.addClass("focus");
                $.Event('reselect', {bubbles: false});
                $("body").trigger("reselect");
            }
        });
    };

    plugin.prototype.remove = function () {
        var self = this;
        if (!self.$el.hasClass("focus")) return;
        self.$el.find(".remove").on("click", function () {
            self.$el.remove();
            $.Event('premove', {bubbles: false});
            $("body").trigger("premove");
        });
    };

    plugin.prototype.resize = function () {
        var self = this;
        var flag = false;
        var currentX = 0;
        var currentY = 0;
        self.$el.find(".resize").on("touchstart", function (e) {
            e.preventDefault();
            if (!self.$el.hasClass("focus")) return;
            flag = true;
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            self.top = parseInt(self.$el.css("top").replace("px", ""));
            self.left = parseInt(self.$el.css("left").replace("px", ""));
            self.width = self.$el.width();
            self.height = self.$el.height();
            return false;
        }).on("touchmove", function (e) {
            //if (!flag) return;
            //var lax = self.width / self.height;
            //var currentXIndex = e.touches[0].clientX - currentX;
            //var currentYIndex = e.touches[0].clientY - currentY;
            //
            //if ((currentXIndex < 0 && currentYIndex > 0) || (currentXIndex > 0 && currentYIndex < 0)) {
            //    currentYIndex = currentXIndex / lax;
            //
            //    var widthIndex = self.width - currentXIndex;
            //    var heigthIndex = self.height - currentYIndex;
            //    var leftIndex = self.left + currentXIndex;
            //
            //    if (!((self.top + heigthIndex > self.outerHeight) || (leftIndex < 0) || (widthIndex < self.minWH || heigthIndex < self.minWH))) {
            //        self.width -= currentXIndex;
            //        self.height -= currentYIndex;
            //        self.left = leftIndex;
            //        self.$el.height(self.height - 24);
            //        self.$el.width(self.width - 24);
            //        self.$el.css({
            //            left: self.left + "px"
            //        });
            //        self.$el.find(".img").css({
            //            "line-height": self.height - 24 + "px"
            //        });
            //    }
            //
            //}
            //currentX = e.touches[0].clientX;
            //currentY = e.touches[0].clientY;

            if (!flag) return;
            var lax = self.width / self.height;
            var currentXIndex = e.touches[0].clientX - currentX;
            var currentYIndex = e.touches[0].clientY - currentY;

            if ((currentXIndex < 0 && currentYIndex > 0) || (currentXIndex > 0 && currentYIndex < 0)) {
                currentYIndex = currentXIndex / lax;

                var widthIndex = self.width + currentXIndex;
                var heigthIndex = self.height + currentYIndex;
                var topIndex = self.top - currentYIndex;


                if (widthIndex + self.left > self.outerWidth) {
                    console.log(1);
                } else if (heigthIndex + self.top > self.outerHeight) {
                    console.log(2);
                } else if (widthIndex < self.minWH || heigthIndex < self.minWH) {
                    console.log(3);
                } else if (topIndex < 0) {
                    console.log(4);
                } else {
                    self.width += currentXIndex;
                    self.height += currentYIndex;
                    self.top -= currentYIndex;

                    self.$el.height(self.height - 24);
                    self.$el.width(self.width - 24);
                    self.$el.css({
                        top: self.top + "px"
                    });
                    self.$el.find(".img").css({
                        "line-height": self.height - 24 + "px"
                    });
                }
            }
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }).on("touchend", function (e) {
            flag = false;
        })
    };

    plugin.prototype.rotate = function () {
        var indexA = 10;
        var self = this;

        self.$el.find(".shun").on("touchend", function () {
            self.angle += indexA;
            self.$el.find(".img").css({
                "transform": "rotate(" + self.angle + "deg)",
                "-webkit-transform": "rotate(" + self.angle + "deg)"
            });
            self.$el.data("angle", self.angle);
        });

        self.$el.find(".ni").on("touchend", function () {
            self.angle -= indexA;
            self.$el.find(".img").css({
                "transform": "rotate(" + self.angle + "deg)",
                "-webkit-transform": "rotate(" + self.angle + "deg)"
            });
            self.$el.data("angle", self.angle);
        });
    };

    $.fn.plugin = function () {
        for (var i = 0; i < $(this).length; i++) {
            new plugin($(this).eq(i));
        }

    }
})(myZepto);