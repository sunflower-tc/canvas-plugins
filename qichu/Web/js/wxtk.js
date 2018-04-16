var doFlag = false;
var posterId = "";
(function ($) {
    /**
     *
     * 微信jsapi认证，初始化
     */
    var weixinJsApi = function (cb) {
        var data = {
            debug: false,
            url: window.location.href.split("#")[0],
            jsApiList: [
                "downloadImage",
                "previewImage"
            ]
        };
        $.ajax({
            url: "/Weixin/jsapi/getJsConfig",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    cb(data.config);
                }
            }
        });
    };
})(Zepto);/**
 * Created by linkhuang on 2015/11/18.
 */
