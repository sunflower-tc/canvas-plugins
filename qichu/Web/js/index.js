/**
 * Created by lvlq on 15/11/7.
 */
var pageSwiper, getdata, getPrize;
(function ($) {
    var musicurl = "";
    var sound;
    pageSwiper = new Swiper('#swiper-page', {
        initialSlide: 0,
        //noSwiping: false
        onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
            swiperAnimateCache(swiper); //隐藏动画元素 
            swiperAnimate(swiper); //初始化完成开始动画
        },
        onSlideChangeEnd: function (swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        }
    });
    var osSwiper = new Swiper('#swiper-os', {
        initialSlide: 0,
        loop: true,
        noSwiping: false
    });

    (function () {
        var img = new Image();
        img.src = "/images/page-1/video-pre.jpg";
        img.onload = function () {
            var imgH = img.height;
            var s_h = $(window).height() - 88 - 72;
            var s_w = $(window).width();

            var y_s = s_h / imgH + 0.02;

            var BL = s_w / 640;

            $("#page-1 .video-area .poster").height(parseInt(BL * 766)).width(s_w + 2);
        };


        var img1 = new Image();
        img1.src = "/images/page-1/anniu.png";
        img1.onload = function () {
            var imgH = img1.height;
            var s_h = $(window).height() - 88 - 72;
            var s_w = $(window).width();

            var y_s = s_h / imgH + 0.02;

            var BL = s_w / 640;

            $("#page-1 .video-area .play-btn-bg").height(parseInt(BL * 766)).width(s_w + 2);
        };

        var img3 = new Image();
        img3.src = "/images/page-1/video-end.jpg";
        img3.onload = function () {
            var imgH = img3.height;
            var s_h = $(window).height() - 88 - 72;
            var s_w = $(window).width();

            var y_s = s_h / imgH + 0.02;

            var BL = s_w / 640;

            $("#page-1 .video-area .ender").height(parseInt(BL * 766)).width(s_w + 2);
        };

        var img4 = new Image();
        img4.src = "/images/page-1/bw.png";
        img4.onload = function () {
            var imgH = img4.height;
            var s_h = $(window).height() - 88 - 72;
            var s_w = $(window).width();

            var y_s = s_h / imgH + 0.02;

            var BL = s_w / 640;

            $("#page-1 .video-area .b-w").height(parseInt(BL * 766)).width(s_w + 2);
        };


    })();

    //page-1
    var pageOneSound = new Howl({
        urls: ["/media/anniu.mp3"]
    });

    $("#page-1 .play-btn").one("touchend", function () {
        $("#video")[0].play();
        pageOneSound.play();
    });

    $("#video").one("timeupdate", function () {
        $("#page-1 .video-area").addClass("play");
        $("#page-1 .video-area .b-w").show();
        var videoH = $("#video").height();
        var s_h = $(window).height() - 88 - 72;
        var s_w = $(window).width();

        var y_s = s_h / videoH + 0.02;

        var BL = s_w / 640;

        $("#video").height(parseInt(BL * 766)).width(s_w + 2);

    });

    $("#video").on("ended", function () {
        $("#page-1 .video-area").addClass("end");
        $("#page-1 .video-area .b-w").hide();
    });

    /*
     $('.poster,.video-box').hide();
     $("#page-1 .ender").show();
     */

    $("#page-1 .ender").on("touchend", function () {
        pageOneSound.play();
        pageSwiper.slideTo(1);
        /*
         $('.end-play').show().addClass('play');
         $('.opa').addClass('opa0');
         pageOneSound.play();
         setTimeout(function () {
         pageSwiper.slideTo(1);
         setTimeout(function () {
         $('.end-play').css('display', 'none');
         $('.opa0').removeClass('opa0');
         }, 1000);
         }, 400);
         */
    });

    $("#page-1 .read-org").on("click", function () {
        $("#video")[0].pause();
        pageSwiper.slideNext();
    });

    /* pageSwiper.slideTo(4); */

    $("#page-1 .listen-baby").on("click", function () {
        $("#video")[0].pause();
        pageSwiper.slideTo(1);
    });

    //page-2

    $("#page-2 .next-btn img").on("touchend", function () {
        $("#page-2 .desc-area").show();
    });

    SM_TRACK.getWx(function (err, wx) {
        // err 初始化错误, 如js安全域名, 签名失败, 活动结束等, 一切正常 err == null
        if (err) {
            return alert(JSON.stringify(err))
        }
        $("#page-2").find(".desc-area").on("touchend", function () {
            wx.chooseImage({ // 微信官方的wx, 调用图片接口
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                    wx.uploadImage({
                        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                            setBG(localIds[0], res.serverId, function () {
                                doscale();
                                pageSwiper.slideNext();
                            });
                        },
                        error: function () {
                            alert("上传失败，请重试");
                        }
                    });

                }
            });
        });
    });
    /*$("#page-2").find(".desc-area").on("touchend", function () {
     wx.chooseImage({
     count: 1,
     sizeType: ['compressed'],
     sourceType: ['album', 'camera'],
     success: function (res) {
     var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

     wx.uploadImage({
     localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
     isShowProgressTips: 1, // 默认为1，显示进度提示
     success: function (res) {
     setBG(localIds[0], res.serverId, function () {
     doscale();
     pageSwiper.slideNext();
     });
     },
     error: function () {
     alert("上传失败，请重试");
     }
     });

     }
     })
     });*/

    //page-3

    var setBG = function (url, serverid, cb) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            $(".upload-img img#target")
                .attr("src", url)
                .data("serverid", serverid)
                .data("width", img.width)
                .data("height", img.height);

            var H = $("#page-3").height();
            var W = $("#page-3").width();

            var B_H = $("#page-3 .btn-area.set-size").height();
            var B_W = $("#page-3 .btn-area.set-size").width();

            var Img_H = H - B_H;
            var Img_W = W;

            $("#page-3 .upload-img").height(Img_H);

            initScale();
            cb && cb();
        };
    };
    //setBG("images/test.png", "q2xIhBF5UECEJTEEx1ZN3jnf46RgAx3FC6wXzHpRURhR42SM5GcMqQ5iLHxgCPJE", function () {
    //    doscale();
    //});

    getdata = function () {
        var plugIns = [];
        var $plugin = $(".plugin");
        var serverId = $("#page-3").find(".upload-img img#target").data("serverid");
        for (var i = 0; i < $plugin.length; i++) {
            var $e = $plugin.eq(i);
            var img_w = $e.find(".img img").width();
            var d = {
                top: parseInt($e.css("top").replace("px", "")) * 2 + $e.height(),
                left: parseInt($e.css("left").replace("px", "")) * 2 + $e.width(),
                width: img_w * 2,
                rota: $e.data("angle") || 0,
                src: $e.find(".img img").attr("src")
            };

            plugIns.push(d);
        }
        return {
            bgId: serverId || "",
            plugIns: JSON.stringify(plugIns),
            bgWidth: $(window).width(),
            bgHeight: $(".upload-img").height(),
            bgTop: $(".upload-img").data("top"),
            bgLeft: $(".upload-img").data("left"),
            music: musicurl,
            dx: $("#position").data("dx"),
            dy: $("#position").data("dy"),
            scale: $("#target").data("scale"),
            imgWidth: $("#target").data("width")
        }
    };

    $("#page-3").find(".upload-img").on("scroll", function () {
        var t = $(this)[0].scrollTop;
        var l = $(this)[0].scrollLeft;
        $(this).data("top", t);
        $(this).data("left", l);
    });

    $("#page-3").find(".set-size .btn.reset").on("touchend", function () {
        //$("#page-2 .desc-area").hide();
        pageSwiper.slideTo(1);
    });

    $("#page-3").find(".set-size .btn.next").on("touchend", function () {
        $("#page-3").find(".set-size").hide();
        $("#page-3").find(".set-os").hide();
        $("#page-3").find(".set-sex").show();
        resizeFlag = true;
        //        $("#page-3").find(".upload-img").addClass("final");
        //        if (browser.versions.android) {
        //            var t = $("#page-3").find(".upload-img").data("top");
        //            var l = $("#page-3").find(".upload-img").data("left");
        //            $("#page-3").find(".upload-img").find("img.bg").css({
        //                "margin-top": -1 * parseInt(t) + "px",
        //                "margin-left": -1 * parseInt(l) + "px"
        //            });
        //        }
        //        osSwiper.update();
        //        undoscale();
    });

    $("#page-3").find(".set-sex .btn.reset").on("touchend", function () {
        $("#page-3").find(".set-size").show();
        $("#page-3").find(".set-sex").hide();
        $("#page-3").find(".set-os").hide();
        resizeFlag = false;
    });

    $("#page-3").find(".set-sex .btn.next").on("touchend", function () {
        if ($("#page-3").find(".set-sex .set-option.active").length == 0) {
            alert("请选择宝宝性别~~");
            return;
        }

        $("#page-3").find(".set-size").hide();
        $("#page-3").find(".set-sex").hide();
        $("#page-3").find(".set-os").show();
        osSwiper.update();
    });

    $("#page-3").find(".set-sex .set-option").on("touchend", function () {
        $("#page-3").find(".set-sex .set-option").removeClass("active");
        $(this).addClass("active");
        $("#page-3").find(".set-sex .btn.next").addClass("focus");

        if ($(this).hasClass("sex-boy")) {
            $("#page-3").find(".set-os .swiper-slide img").removeClass("active");
            $("#page-3").find(".set-os .swiper-slide img.boy-os").addClass("active");
        } else {
            $("#page-3").find(".set-os .swiper-slide img").removeClass("active");
            $("#page-3").find(".set-os .swiper-slide img.girl-os").addClass("active");
        }
    });

    $("#page-3").find(".btn-direction.left").on("touchend", function () {
        osSwiper.slidePrev();
    });

    $("#page-3").find(".btn-direction.right").on("touchend", function () {
        osSwiper.slideNext()
    });

    $("#page-3 .swiper-slide").on("touchend", function () {
        $(".plugin").remove();
        var src = $(this).find("img.active").attr("src");
        musicurl = $(this).find("img.active").data("music");
        $("#audio").attr("src", musicurl);
        var html = new EJS({
            "element": "t-plugin"
        }).render({
                imgurl: src
            });
        var $html = $(html);
        $(".upload-img").append($html);
        $html.plugin();
    });
    $("#page-3").find(".set-os .btn.reset").on("touchend", function () {
        $("#page-3").find(".plugin").remove();
        $("#page-3").find(".set-size").hide();
        $("#page-3").find(".set-os").hide();
        $("#page-3").find(".set-sex").show();
    });

    var getPosterFlag = false;
    $("#page-3").find(".set-os .btn.next").on("touchend", function (e) {
        e.stopPropagation();
        if (getPosterFlag) return;
        getPosterFlag = true;
        if ($(".plugin").length == 0) {
            alert("请选择一个配置哦~~");
            getPosterFlag = false;
            return false;
        }

        var data = getdata();
        sound = new Howl({
            urls: [musicurl],
            onplay: function () {
                babyMusicFlag = true;
                $("#page-4 .music-2").show();
            },
            onend: function () {
                babyMusicFlag = false;
                $("#page-4 .music-2").hide();
            }
        });

        $("#audio").on("ended", function () {
            $("#page-4 .music-2").hide();
        });

        $.ajax({
            url: "/index/upload",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (data) {
                //alert(JSON.stringify(data));
                setBG4(data.path, function () {
                    pageSwiper.slideTo(3);
                    //if (browser.versions.android) {
                    $("#audio")[0].play();
                    $("#page-4 .music-2").show();
                    //} else {
                    //    sound.play();
                    //}
                    getPosterFlag = false;
                });
                //分享朋友圈
                var opt = {
                    title: "我家宝贝的有声萌照，效果棒棒嗒 ！一起来听吧~", // 分享标题
                    // link: "http://qichugiving.weixinzjit.com/Index/share?id=" + data.id, // 分享链接
                    imgUrl: "http://qichugiving.weixinzjit.com/images/share2.jpg", // 分享图标
                    qs: function () {
                        return 'shareid=' + data.id;
                    },
                    success: function () {
                        alert("分享成功");
                    },
                    cancel: function () {
                    }
                };
                SM_TRACK.setTimeLine(opt);

                //分享给朋友
                var apt = {
                    title: '我家宝贝的有声萌照，效果棒棒嗒 ！', // 分享标题
                    desc: "一起来听吧，也晒晒你家的萌宝呦~", // 分享描述
                    //  link: "http://qichugiving.weixinzjit.com/Index/share?id=" + data.id, // 分享链接
                    imgUrl: "http://qichugiving.weixinzjit.com/images/share2.jpg", // 分享图标
                    qs: function () {
                        return 'shareid=' + data.id;
                    },
                    success: function () {
                        alert("分享成功");
                    },
                    cancel: function () {
                    }
                };
                SM_TRACK.setAppMessage(apt);
            },
            error: function () {
                alert("网络错误");
                getPosterFlag = false;
            },
            timeout: 5000
        })

        return false;
    });

    //page-4
    var babyMusicFlag = false;
    $("#page-4").find(".make-img").on("touchend", function () {
        //if (browser.versions.android) {
        $("#audio")[0].pause();
        $("#audio")[0].play();
        $("#page-4 .music-2").show();
        //} else {
        //    if (babyMusicFlag) return;

        //sound.play();
        //}
    });

    var setBG4 = function (url, cb) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            $("#page-4 .make-img img.bg")
                .attr("src", url);

            var H = $("#page-4").height();
            var W = $("#page-4").width();

            var B_H = $("#page-4 .btn-area").height();
            var B_W = $("#page-4 .btn-area").width();

            var Img_H = H - B_H;
            var Img_W = W;

            $("#page-4 .make-img").height(Img_H);

            cb && cb();
        };
    };
    var getprizeflag = false;
    $("#page-4").find(".get-prize").on("touchend", function (e) {
        e.stopPropagation();
        if (getprizeflag) return false;
        getprizeflag = true;
        getPrize();
        return false;
    });

    $("#page-4").find(".reset").on("touchend", function (e) {
        e.stopPropagation();
        pageSwiper.slideTo(1);
        $("#page-3").find(".set-size").show();
        $("#page-3").find(".set-sex").hide();
        $("#page-3").find(".set-os").hide();
        $("#page-3").find(".plugin").remove();
        resizeFlag = false;
        return false;
    });

    getPrize = function () {
        $.ajax({
            url: "/Index/getprize",
            type: "POST",
            data: {},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.error) {
                    pageSwiper.slideTo(4);
                } else {
                    pageSwiper.slideTo(5);
                    $("#name").val(data.data.name);
                    $("#phone").val(data.data.phone);
                    $("#address").val(data.data.address);
                }
                getprizeflag = false;
            },
            error: function () {
                alert("网络错误");
                getprizeflag = false;
            }
        })
    };

    //page-5

    $("#page-5").find(".btn").on("touchend", function () {
        $(".dialog").show();
    });

    //page-6

    $("#page-6 .input").height($(window).height() * 0.05);

    var addinfo = function (data) {
        $.ajax({
            url: "/Index/addinfo",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    alert("保存成功");
                    $(".dialog").show();
                } else {
                    alert("保存失败");
                }
            },
            error: function () {
                alert("网络错误");
            }
        })
    };
    $("#page-6").find(".btn").on("touchend", function () {
        var dto = {
            name: $("#name").val(),
            phone: $("#phone").val(),
            address: $("#address").val()
        };

        if (!dto.name) {
            $(".dialog-input").removeClass("phone-format");
            $(".dialog-input").removeClass("no-name");
            $(".dialog-input").removeClass("no-address");
            $(".dialog-input").addClass("no-name");
            return;
        }

        if (!dto.phone) {
            $(".dialog-input").removeClass("phone-format");
            $(".dialog-input").removeClass("no-name");
            $(".dialog-input").removeClass("no-address");
            $(".dialog-input").addClass("phone-format");
            return;
        }

        if (!/^1[3|4|5|8|7][0-9]\d{8}$/.test(dto.phone)) {
            $(".dialog-input").removeClass("phone-format");
            $(".dialog-input").removeClass("no-name");
            $(".dialog-input").removeClass("no-address");
            $(".dialog-input").addClass("phone-format");
            return;
        }

        if (!dto.address) {
            $(".dialog-input").removeClass("phone-format");
            $(".dialog-input").removeClass("no-name");
            $(".dialog-input").removeClass("no-address");
            $(".dialog-input").addClass("no-address");
            return;
        }

        addinfo(dto);
    });

    $("#page-6").find(".dialog-input .d-btn").on("touchend", function () {
        $(".dialog-input").removeClass("phone-format");
        $(".dialog-input").removeClass("no-name");
        $(".dialog-input").removeClass("no-address");
    });

    $(".dialog").on("touchend", function () {
        $(this).hide();
    })


    setInterval(function () {
        $("#page-2 .gif img").attr("src", "images/page-2/111.gif");
        $("#page-4 .music-2 img").attr("src", "images/yinfu.gif");
    }, 2 * 1000);
})(myZepto);