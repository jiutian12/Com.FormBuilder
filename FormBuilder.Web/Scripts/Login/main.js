$(function () {


    function randomPic() {
        var arr = [
            "1", "2", "3",
            "4", "5", "6",
            "7", "8", "9",
            "11", "12", "13",
            "14", "15", 
            "17", "18", "19",
            "20", "21", "22", "23", "24", "25"

        ];
        var index = Math.floor((Math.random() * arr.length));
        $.setStyle(" .banner, .logo_box:before, .header:before { background: url(/FormBuilder.Web/CSS/images/" + arr[index] + ".jpg) !important;}", "css_bg");
    }
    randomPic();
    $("#btnLogin").click(function () {
        var acc = $("#userAccount").val();
        var password = $("#userPwd").val();
        if (acc == "") {
            leeUI.Error("请输入账户名！");
            return;
        }
        if (password == "") {
            leeUI.Error("请输入账户密码！");
            return;
        }
        var code = "1111";

        fBulider.core.dataService.requestApi("/Login/AccLogin", { acc: acc, pwd: password, code: code }, "正在登录...").done(function (data) {
            if (data.res) {
                leeUI.Success(data.mes);



                window.location.href = callbackurl ? callbackurl : _global.sitePath + "/CommonFB/MetaExplorer";

            }
        }).fail(function (data) {
            console.log(data);
        });
    });
});





/*设置CSS样式的扩展*/
$.setStyle = function (cssText, id) {
    var head = document.getElementsByTagName('head')[0] || document.documentElement;
    var element = document.getElementById(id);
    $(element).remove();

    element = document.createElement('style');
    id && (element.id = id);
    element.type = "text/css";
    head.appendChild(element);
    if (element.styleSheet !== undefined) {
        // IE http://support.microsoft.com/kb/262161
        if (document.getElementsByTagName('style').length > 31) {
            throw new Error('Exceed the maximal count of style tags in IE')
        }
        element.styleSheet.cssText = cssText
    } else {
        element.appendChild(document.createTextNode(cssText));
    }
}