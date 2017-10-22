;(function($){
    $.fn.mtap = function(fn){
        if(typeof fn !== 'function'){
            console.log("mtap arguments error!!");
            return false;
        }
        var isSupportTouch = "ontouchend" in document ? true : false;
        if(isSupportTouch){
            var startTx, startTy;
            return $(this).each(function(){
                /*单次触摸事件*/
                $(this).on('touchstart',function(e){
                    var touches = e.originalEvent.targetTouches[0];
                    startTx = touches.clientX;
                    startTy = touches.clientY;
                });
                $(this).on('touchend',function(e){
                    //touchend事件中应该是只有个changedTouches触摸实例列表的
                    var touches = e.originalEvent.changedTouches[0];
                    var endTx = touches.clientX;
                    var endTy = touches.clientY;
                    // 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
                    if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){
                        fn.call(this,e);
                    }
                });
            });
        }else{
            return $(this).each(function(){
                $(this).click(function(e){
                    fn.call(this,e);
                });
            });
        }
    };
    $.fn.toggleScroll = function(){
        var minSHei = $(this).height();
        var _this = this;
        var isSupportTouch = "ontouchend" in document ? true : false;
        if(isSupportTouch){
            var startTx, startTy;
            $(document).on('touchstart',function(e){
                var touches = e.originalEvent.targetTouches[0];
                startTx = touches.clientX;
                startTy = touches.clientY;
            });
            $(document).on('touchend',function(e){
                //touchend事件中应该是只有个changedTouches触摸实例列表的
                var touches = e.originalEvent.changedTouches[0];
                var endTx = touches.clientX;
                var endTy = touches.clientY;
                // 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
                if(Math.round(startTy - endTy) >= 10 ){
                    if($(document).scrollTop()>minSHei){
                        $(_this).hide();
                    }
                }
                if(Math.round(startTy - endTy) <= -10){
                    $(_this).show();
                }
            });
        }else{
            var beforeScrollTop = document.body.scrollTop || document.documentElement.scrollTop,oldDirec = "";
            $(window).scroll(function(){
                var afterScrollTop = document.body.scrollTop || document.documentElement.scrollTop,
                    delta = afterScrollTop - beforeScrollTop;
                if( delta === 0 ) return false;
                beforeScrollTop = afterScrollTop;
                var direc = delta > 0 ? "down" : "up";
                if(direc == oldDirec){
                    return false
                }else{
                    oldDirec = direc;
                    if(direc == "down"){
                        $(_this).hide();
                    }else{
                        $(_this).show();
                    }
                }
            });
        }
    }
})(jQuery,undefined);