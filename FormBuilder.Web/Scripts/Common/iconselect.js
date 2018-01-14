$(function () {
    $("#tab").leeTab({});
    var arr = [];
    for (var i = 0; i < leeicons.length; i++) {
        arr.push(' <div class="iconbox" data-value="' + leeicons[i] + '">');
        arr.push('<div class="preview"> <i class="' + leeicons[i] + '"></i> </div>');
        arr.push('<div class="description"> </div>');
        arr.push(' </div>');
    }
    $("#iconfont-list").html(arr.join(""));
    var arr2 = [];
    for (var i = 0; i < iconimages.length; i++) {
        arr2.push(' <div class="iconbox" data-value="' + iconimages[i] + '">');
        arr2.push('<div class="preview"> <i class="' + iconimages[i] + '"></i> </div>');
        arr2.push('<div class="description"> </div>');
        arr2.push(' </div>');
    }
    $("#icons-list").html(arr2.join(""));
    $("body").on("click", ".iconbox", function (e) {
        $(".iconbox.active").removeClass("active");
        $(this).addClass("active");
    });

});

function getSelectIcon() {
    return $(".iconbox.active").attr("data-value");
}