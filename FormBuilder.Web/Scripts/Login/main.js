$(function () {

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