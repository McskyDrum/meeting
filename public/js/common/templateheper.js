$(function () {
    template.helper('priceFormat', function (price) {
        
        var priceNum = parseFloat(price).toFixed(2);
        var arr = priceNum.split(".");
        //console.log(arr);
        return '<em class="listEm priceEm"><span class="priceFlag">￥</span><span class="priceInt">' + arr[0] + '</span><span class="pricePoint">.</span><span class="priceFloat">' + arr[1] + '</span></em>';
    });

    template.helper('purchasePriceFormat', function (price) {

        var priceNum = parseFloat(price).toFixed(2);
        
        return '<span class="goods-purchaseprice">￥' + priceNum + '</span>';
    });
});