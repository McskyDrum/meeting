var Bindtel = (function ($) {
    var mClick = "ontouchend" in document ? "touchstart" : "click";
    function init() {
        /*重定义内容高度*/
        var wh = $(window).height();
        var fh = $('.footer').height();
        $('.container').css('min-height', wh - fh);
        initEvent();
    }

    //页面事件初始化
    function initEvent(){
        //获取验证码
        var signCodeFlag = true;
        var signTimer;

        $("#tel").change(function () {
            if (!signCodeFlag) {
                return false;
            }
            if ($(this).val() != "" && (/^1[34578]\d{9}$/.test($(this).val()))) {
                $("#getCode").removeClass("disabled");
            } else {
                $("#getCode").addClass("disabled");
            }
        });

        var cookie_time = $.cookie("getCode_cookie");
        if (cookie_time) {
            var nowD = new Date().getTime();
            var waiteTime = Math.floor((parseInt(cookie_time) + 60000 - nowD) / 1000);
            if (waiteTime > 0) {
                jQuery("#getCode").text(' 等待' + waiteTime + '秒 ');
                jQuery("#getCode").addClass("disabled");
                var second = waiteTime;
                signTimer = setInterval(function () {
                    if (second > 0) {
                        second--;
                        jQuery("#getCode").text(' 等待' + second + '秒 ');
                    } else {
                        clearInterval(signTimer);
                        if ($("#tel").val() != "" && !$("#tel").hasClass("Validform_error")) {
                            jQuery("#getCode").removeClass("disabled");
                        }
                        $("#getCode").text('重新获取');
                        signCodeFlag = true;
                    }
                }, 900);
            }
        }

        $("#apply").on("click",function () {
            var phone = $.trim($("#tel").val());
            var code = $("#vcode").val();
            if(!phone || !code){
                return;
            }
            $.post("/phone/submitPhoneCode",{code:code,phone:phone},function(result){
                if(!result.success){
                    $.wiseinfo({content:result.message});
                    return
                }
                location.href = "/userCenter/index";
            });
        });

        $("#getCode").bind(mClick, function () {
            var ele = this;
            if ($(ele).hasClass("disabled") || !signCodeFlag) {
                return false;
            } else {
                signCodeFlag = false;
                $.ajax({
                    type: "POST",
                    url: "/phone/sendPhoneCode",
                    data: {
                        "phone": $.trim($("#tel").val())
                    },
                    isNoLoading: true,
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            jQuery(ele).addClass("disabled");
                            jQuery(ele).text(' 等待60秒 ');
                            //开始倒计时
                            var second = 60;
                            $.cookie("getCode_cookie", new Date().getTime());
                            signTimer = setInterval(function () {
                                if (second > 0) {
                                    second--;
                                    jQuery(ele).text(' 等待' + second + '秒 ');
                                } else {
                                    clearInterval(signTimer);
                                    if ($("#tel").val() != "" && !$("#tel").hasClass("Validform_error")) {
                                        jQuery(ele).removeClass("disabled");
                                    }
                                    $(ele).text('重新获取');
                                    signCodeFlag = true;
                                }
                            }, 900);
                        } else {
                            if (signTimer) clearInterval(signTimer);
                            jQuery(ele).removeClass("disabled");
                            jQuery(ele).text('重新获取');
                            signCodeFlag = true;
                        }
                    }
                });
            }
        });

    }

    return {
        init: init
    }
})(jQuery);