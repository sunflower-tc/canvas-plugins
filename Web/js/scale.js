/**
 * Created by lvlq on 15/11/11.
 */
var doscale, undoscale, pinchout, pinchin, initScale, resizeFlag = false;
(function ($) {


    var target = document.getElementById("target");
    target.style.webkitTransition = 'all ease 0.05s';

    var initialScale = 1;
    var defaultScale = 1;
    var currentScale = initialScale;
    var indexScale = 0.015;//步长

    var index_x = 0, index_y = 0;

    var position = document.getElementById("position");
    position.style.webkitTransition = 'all ease 0.05s';

    var dx, dy;
    var a, b, c, d, e, f;
    doscale = function () {
        a = touch.on('#target', 'pinchstart', pinchstart);
        b = touch.on("#target", 'pinchout', pinchout);
        c = touch.on("#target", 'pinchin', pinchin);
        d = touch.on('#target', 'pinchend', pinchend);
        touch.on('#target', 'touchstart', function (ev) {
            ev.preventDefault();
        });
        e = touch.on('#position', 'drag', drag);
        f = touch.on('#position', 'dragend', dragend);
    };

    undoscale = function () {
        touch.off('#target', 'pinchstart', pinchstart);
        touch.off("#target", 'pinchout', pinchout);
        touch.off("#target", 'pinchin', pinchin);
        touch.off('#target', 'pinchend', pinchend);
        touch.off('#position', 'drag', drag);
        touch.off('#position', 'dragend', dragend);
    };

    initScale = function () {
        var img_width = parseInt($("#target").data("width"));
        var img_height = parseInt($("#target").data("height"));

        var img_outer_width = parseInt($("#page-3 .upload-img").width());
        var img_outer_height = parseInt($("#page-3 .upload-img").height());


        if (img_width < img_height) {
            currentScale = img_outer_width / img_width;
        } else {
            currentScale = img_outer_height / img_height;
        }

        target.style.webkitTransform = 'scale(' + currentScale + ')';
        initialScale = currentScale;
        $("#target").data("scale", initialScale);

        defaultScale = currentScale;

        var x = img_width * (currentScale - 1) / 2;
        var y = img_height * (currentScale - 1) / 2;

        dx = x;
        dy = y;
        index_x = dx;
        index_y = dy;
        var offx = dx + "px";
        var offy = dy + "px";
        position.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
        $("#position").data("dx", dx);
        $("#position").data("dy", dy);
    };

    var pinchstart = function (ev) {
        if (resizeFlag) return;
        ev.preventDefault();
    };

    pinchout = function (ev) {
        if (resizeFlag) return;
        var img_width = parseInt($("#target").data("width"));
        var img_height = parseInt($("#target").data("height"));
        currentScale = currentScale + indexScale;
        //currentScale = currentScale < 0.3 ? 0.3 : currentScale;
        currentScale = currentScale < defaultScale ? defaultScale : currentScale;
        this.style.webkitTransform = 'scale(' + currentScale + ')';
        initialScale = currentScale;
        dx = dx || 0;
        dy = dy || 0;
        var x = img_width * indexScale / 2;
        var y = img_height * indexScale / 2;
        var offx = dx + x + "px";
        var offy = dy + y + "px";
        position.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
        dx += x;
        dy += y;
    };

    pinchin = function (ev) {
        if (resizeFlag) return;
        var img_width = parseInt($("#target").data("width"));
        var img_height = parseInt($("#target").data("height"));
        currentScale = currentScale - indexScale;
        currentScale = currentScale < defaultScale ? defaultScale : currentScale;
        target.style.webkitTransform = 'scale(' + currentScale + ')';
        initialScale = currentScale;


        if (initialScale > defaultScale) {
            dx = dx || 0;
            dy = dy || 0;
            var x = img_width * -1 * indexScale / 2;
            var y = img_height * -1 * indexScale / 2;
            var offx = dx + x + "px";
            var offy = dy + y + "px";
            position.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
            $("#position").data("dx", dx + x);
            $("#position").data("dy", dy + y);
            dx += x;
            dy += y;
        }


    };

    var pinchend = function (ev) {
        if (resizeFlag) return;
        initialScale = currentScale;
        $("#target").data("scale", initialScale);
        drag({x: 0, y: 0});
        dragend();
    };

    var drag = function (ev) {
        if (resizeFlag) return;
        dx = dx || 0;
        dy = dy || 0;
        var ex = ev.x;
        var ey = ev.y;
        //var sc=$("#target").data("scale");
        //var w=parseInt($("#target").data("width")*sc);
        //var h=parseInt($("#target").data("height")*sc);
        //
        //if (currentScale==defaultScale){
        //    offx=-w;
        //    offy=-h;
        //}
        //offx=offx<-w/2?-w/2:offx;
        //offy=offy<-h/2?-h/2:offy;
        //offx=offx>w/2?w/2:offx;
        //offy=offy>h/2?h/2:offy;
        // alert("offx:"+w+"---offy:"+h);
        var img_width = parseInt($("#target").data("width"));
        var img_height = parseInt($("#target").data("height"));

        var img_outer_width = parseInt($("#page-3 .upload-img").width());
        var img_outer_height = parseInt($("#page-3 .upload-img").height());

        var i_w_l = dx - (img_width * initialScale - img_width) / 2;
        var i_w_r = img_width * initialScale - img_outer_width + i_w_l;

        var i_h_l = dy - (img_height * initialScale - img_height) / 2;
        var i_h_r = img_height * initialScale - img_outer_height + i_h_l;

        if (ex + i_w_l > 0) {
            console.log(1);
            ex = -1 * i_w_l;
        }

        if (ex + i_w_r < 0) {
            console.log(2);
            ex = -1 * i_w_r;
        }

        if (ey + i_h_l > 0) {
            console.log(1);
            ey = -1 * i_h_l;
        }

        if (ey + i_h_r < 0) {
            console.log(2);
            ey = -1 * i_h_r;
        }

        var offx = dx + ex + "px";
        var offy = dy + ey + "px";

        position.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
        //index_x = dx + ev.x;
        //index_y = dy + ev.y;
        $("#position").data("dx", dx + ex);
        $("#position").data("dy", dy + ey);
        index_x = dx + ex;
        index_y = dy + ey;
    };


    var dragend = function (ev) {
        if (resizeFlag) return;
        // alert(ev.x+":"+dx);
        //dx = dx + ev.x;
        //dy = dy + ev.y;
        dx = index_x;
        dy = index_y;


        //var sc=$("#target").data("scale");
        //var w=parseInt($("#target").data("width")*sc);
        //var h=parseInt($("#target").data("height")*sc);
        //dx=dx<-w/2?-w/2:dx;
        //dy=dy<-h/2?-h/2:dy;
        //dx=dx>w/2?w/2:dx;
        //dy=dy>h/2?h/2:dy;
        //position.style.webkitTransform = "translate3d(" + dx + "," + dy + ",0)";
        //$("#position").data("dx", dx);
        //$("#position").data("dy", dy);


    }
})(myZepto);
