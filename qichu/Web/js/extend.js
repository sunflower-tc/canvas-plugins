(function ($) {
    var getzan = function () {
        $.ajax({
            url: "/Index/getzan",
            type: "POST",
            data: {},
            dataType: "json",
            success: function (data) {
                $("#page-1 .zan-num .num").html(data.num);
            }
        });
    }

    getzan();

    var addzan = function () {
        $.ajax({
            url: "/Index/addzan",
            type: "POST",
            data: {},
            dataType: "json",
            success: function () {
            }
        })
    }

    $("#page-1 .zan-num").one("touchend", function () {
        var n = $("#page-1 .zan-num .num").html();
        var num = parseInt(n);
        num++;
        addzan();
        $("#page-1 .zan-num .num").html(num);
    });


})(myZepto);