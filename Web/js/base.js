// +----------------------------------------------------------------------
// | Tjs [ Sucry 自己改造的js库  此文件一般改造系统变量for Html5 ] 基于jquery
// +----------------------------------------------------------------------
// | v1.6.2 release  2014.12.18
// +----------------------------------------------------------------------
// | Copyright (c) 2014-2015 http://www.dayima.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: Sucry <sqboytan@126.com><tankang@dayima.com>
// +----------------------------------------------------------------------

/*************************************************************************
 * 改造系统alert
 * param  str  传入要弹出的str
 *          pos  弹出的位置        1
 *                            2
 *                            3
 * return false
 *************************************************************************/
window.alert = function (str, pos) {
    if (document.getElementById("tAlert") || !str) {
        return false;
    }
    var position = '';
    var pos = pos || 1;
    var tAlert_wrap = document.createElement("div");
    tAlert_wrap.setAttribute("id", "tAlert");
    tAlert_wrap.style.textAlign = "center";
    tAlert_wrap.style.position = "fixed";
    tAlert_wrap.style.zIndex = "100";
    switch (pos) {
        case 1:
            position = '10%';
            break;
        case 2:
            position = '40%';
            break;
        case 3:
            position = "85%";
            break;
        default:
            position = "10%";
            break;
    }
    tAlert_wrap.style.top = position;
    tAlert_wrap.style.width = "100%";
    document.getElementsByTagName("body")[0].appendChild(tAlert_wrap);
    var tAlert_in = document.createElement("div");
    tAlert_in.style.padding = "4px 14px";
    tAlert_in.style.maxWidth = "200px";
    tAlert_in.style.zIndex = "99";
    tAlert_in.style.fontSize = "12px";
    tAlert_in.style.textShadow = "none";
    tAlert_in.style.display = "inline-block";
    tAlert_in.style.lineHeight = "16px";
    tAlert_in.style.backgroundColor = "#000000";
    tAlert_in.style.color = "#ffffff";
    tAlert_in.style.borderRadius = "6px";
    tAlert_in.style.opacity = "0.8";
    tAlert_in.style.wordBreak = "break-all";
    tAlert_in.textContent = str;
    document.getElementById("tAlert").appendChild(tAlert_in);
    setTimeout(function () {
        document.getElementsByTagName("body")[0].removeChild(tAlert_wrap);
    }, 3000);
    return false;
}


/*************************************************************************
 *　方法:Array.remove(dx)   此函数是已知数组下标进行删除。
 *　功能:删除数组元素.
 *　参数:dx删除元素的下标.
 *　返回:在原数组上修改数组
 *************************************************************************/
Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}
/*************************************************************************
 *　方法:Array.removeValue(dx)   此函数是已知数值进行删除数组中对应的数组元素。
 *　功能:删除数组元素.
 *　参数:dx删除元素的值.
 *　返回:在原数组上修改数组
 *************************************************************************/
Array.prototype.removeValue = function (dx) {
    //if(isNaN(dx)||dx>this.length){return false;}
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != dx) {
            this[n++] = this[i];
        } else {
            this.length -= 1
        }
    }
}

/*************************************************************************
 *　对象名:tReg
 *　功能    :  一些正则的集合。
 *　参数    :  @param telphone、email and so on
 *　返回    :  返回true or false
 *************************************************************************/
var tReg = function () {
};
/*
 * 正则匹配手机号码  传入tels 返回true or false
 * */
tReg.prototype.matchTels = function (tels) {
    var telReg = !!tels.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/);
    return telReg;
}


/*
 * 获取对象的长度
 * */

function getObjecLength(obj) {
    var i = 0;
    for (v in obj) {
        i++;
    }
    return i;
}


/*************************************************************************
 *　对象名    :    t_animationEvent
 *　功能        :   CSS3动画执行完毕\开始\循环执行后执行的一些事件  兼容webkit\Mozilla\Opera\MS等浏览器
 *　参数        :    @param 无
 *　返回        :    返回 事件参数
 *************************************************************************/
var t_animationEvent = function () {
};
t_animationEvent.prototype.t_transitionend = function () {
    var t;
    var el = document.createElement('t_element');
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd',
        'MsTransition': 'msTransitionEnd'
    }
    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

t_animationEvent.prototype.t_animationstart = function () {
    var t;
    var el = document.createElement('t_element');
    var animations = {
        'animation': 'animationstart',
        'OAnimation': 'oAnimationStart',
        'MozAnimation': 'animationstart',
        'WebkitAnimation': 'webkitAnimationStart',
        'MsAnimation': 'msAnimationStart'
    }
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

t_animationEvent.prototype.t_animationend = function () {
    var t;
    var el = document.createElement('t_element');
    var animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd',
        'MsAnimation': 'msAnimationEnd'
    }
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

t_animationEvent.prototype.t_animationiteration = function () {
    var t;
    var el = document.createElement('t_element');
    var animations = {
        'animation': 'animationiteration',
        'OAnimation': 'oAnimationIteration',
        'MozAnimation': 'animationiteration',
        'WebkitAnimation': 'webkitAnimationIteration',
        'MsAnimation': 'msAnimationIteration'
    }
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

/**
 * 获取url中得参数
 * @author lvliqi
 * @param name
 * @returns {null}
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 数字补零
 * @author lvliqi
 * @param num
 * @param n
 * @returns {string}
 */
var pad = function (num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
};

/**
 * 重写默认confirm
 * @param str
 * @param cb 回调一个bool值
 * @param title 默认是'美月优选提示您'
 */
window.confirm = function (str, cb, title) {
    title = title || '美月优选提示您';
    var html =
        '<style>#cancel:active,#affirm:active{background-color: #e7e7e7}</style>' +
        '<div style="position:fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0,0,0,0.7);z-index: 999999;">' +
        '    <div style="position:absolute;top: 50%;left: 50%;margin-top:-75px;margin-left: -130px;width: 260px; border-radius: 5px;background-color: #f5f5f5;">' +
        '        <div style="min-height: 85px;border-bottom: 1px solid #dadada;">' +
        '            <div style="text-align: center;padding-top: 22px;color: #333333;font-size: 17px;font-weight: bold;">' +
        title +
        '            </div>' +
        '            <div style="margin-top: 11px;color: #333333;font-size: 13px;text-align: center;padding: 0 10px;word-break: break-all;margin-bottom: 10px;">' +
        str +
        '            </div>' +
        '        </div>' +
        '        <div style="text-align: center;">' +
        '            <span id="cancel" style="border-bottom-left-radius: 5px;font-weight: bold;display: table-cell;line-height: 44px;width: 130px;text-align: center;color: #007aff;font-size: 16px;border-right: 1px solid #dadada;">' +
        '                取消' +
        '            </span>' +
        '            <span id="affirm" style="border-bottom-right-radius:5px;display: table-cell;line-height: 44px;width: 130px;text-align: center;color: #007aff;font-size: 16px;">' +
        '                确认' +
        '            </span>' +
        '        </div>' +
        '    </div>' +
        '</div>';
    var $dialog = $(html);
    $("body").append($dialog);

    $dialog.find("#cancel").off("click").on("click", function () {
        cb(false);
        $dialog.remove();
    });

    $dialog.find("#affirm").off("click").on("click", function () {
        cb(true);
        $dialog.remove();
    });
};

/**
 * 判断浏览器版本
 * @type {{versions: {webKit, ios, android, weixin, txnews, sinawb, mqq}, language: string}}
 */
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            webKit: u.indexOf('AppleWebKit') > -1,
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            weixin: u.indexOf('MicroMessenger') > -1,
            txnews: u.indexOf('qqnews') > -1,
            sinawb: u.indexOf('weibo') > -1,
            mqq: u.indexOf('QQ') > -1
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

/**
 * 动态加载js
 * @param url
 * @param callback
 */
function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                if (callback) {
                    callback()
                }
            }
        }
    } else {
        script.onload = function () {
            if (callback) {
                callback()
            }
        }
    }
    script.src = url;
    document.body.appendChild(script)
}


var myTouch = "click";
if (browser.versions.webKit || browser.versions.ios) {
    myTouch = "tap";
}