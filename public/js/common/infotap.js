/**
 * Created by 96421 on 2017/11/6.
 */
(function($){
    /*
     * 提示信息，默认信息显示1.5秒后消失；
     */
    $.wiseinfo = function(options){
        var defaults = {
            content: "",
            container:$("body"),
            delay: 1500
        };
        var opt = {};
        if(typeof options == "object"){
            opt = $.extend({}, defaults, options || {});
        }else{
            defaults.content = options;
            opt = defaults;
        }

        if(opt.container.find("#wise-info-box").length<=0){
            opt.container.append("<div id='wise-info-box'></div>");
        }

        var tipc = $("#wise-info-box");
        tipc.html(opt.content).addClass("show");
        setTimeout(function(){
            tipc.html("").removeClass("show");
        },opt.delay)
    };

    /*
     * 大图浏览，点击小图全屏显示大图；
     */
    $.fn.wiseShowPic = function(options){
        var defaults = {
            imgParent: ""
        };
        var opt = {};
        if(typeof options == "object"){
            opt = $.extend({}, defaults, options || {});
        }else{
            defaults.imgParent = options;
            opt = defaults;
        }

        if($("body").find("#wise-module-showPic").length<=0){
            $("body").append("<div id='wise-module-showPic'><div class='pic-show-container'><div class='swiper-wrapper'></div><div class='swiper-pagination'></div></div></div>");
        }

        return $(this).each(function(){
            var _imgP = this;
            $(_imgP).find("img").unbind("click").click(function(e){
                e.stopPropagation();
                var index = $(_imgP).find("img").index($(this));
                console.log(index);

                $("#wise-module-showPic .swiper-wrapper").html("");
                $(_imgP).find("img").each(function(){
                    var _img = this;
                    $("<div class='swiper-slide'>").append($(_img).clone()).appendTo($("#wise-module-showPic .swiper-wrapper"));
                });
                $("#wise-module-showPic").show();
                var picSwiper = new Swiper('.pic-show-container', {
                    pagination: '.swiper-pagination',
                    initialSlide : index
                });

                $('.pic-show-container .swiper-slide').click(function(){
                    $("#wise-module-showPic").hide();
                    picSwiper.slideTo(0, 1000, false);
                    picSwiper.destroy();
                });
            });
        });
    };

    /*
     * 提示信息弹窗,boxType: alert,confirm,noBtns——弹窗类型
     * update 1.0.1 has-title-img:true,false——是否需要title图片
     */
    $.wiseInfoWin = function(options){
        var defaults = {
            text: "",
            boxType: "alert",
            titleType: "normal",
            buttons:{
                SureTxt: "我知道了",
                Sure:function(){
                    $.noop();
                },
                CancelTxt: "下次再来",
                Cancel:function(){
                    $.noop();
                }
            }
        };
        var opt = {};
        if(typeof options == "object"){
            opt = $.extend(true, {}, defaults, options || {});
        }else{
            defaults.text = options;
            opt = defaults;
        }

        if($("body").find("#wise-info-window").length<=0){
            $("body").append('<div id="wise-info-window"><div class="win-box"> <div class="title">提示</div> <div class="con-wrap"> <div class="content"> <p></p> </div> <div class="win-btns"> <a class="sure"><span>我知道了</span></a> <a class="cancel"><span>下次再来</span></a> </div> </div> </div> </div>');
        }
        $("#wise-info-window .content p").html(opt.text);
        $("#wise-info-window .sure span").text(opt.buttons.SureTxt);
        $("#wise-info-window .cancel span").text(opt.buttons.CancelTxt);
        if(opt.boxType !="confirm"){
            $("#wise-info-window .win-btns").removeClass("confirm");
        }else{
            $("#wise-info-window .win-btns").addClass("confirm");
        }
        if(opt.boxType =="noBtns"){
            $("#wise-info-window .win-btns").hide();
        }
        $("#wise-info-window").show();
        $("#wise-info-window .sure").unbind().click(function(){
            opt.buttons.Sure();
            $("#wise-info-window").hide();
        });
        $("#wise-info-window .cancel").unbind().click(function(){
            opt.buttons.Cancel();
            $("#wise-info-window").hide();
        });
    };

})(jQuery,undefined);