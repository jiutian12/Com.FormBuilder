﻿/*  Session管理 */
/* nameSpace:Page.Context */

(function (win, $) {
    var ContextManger = function () {
    }
    var _debugSession = {
        UserID: "01",
        UserName: "测试用户",
        CompanyCode: "0001"
    };
    ContextManger.prototype = {
        init: function () {

        },
        set: function (data) {
            _debugSession = data;
        },
        get: function (key) {
            //获取session信息
            return _debugSession[key];
        },
        heartBreak: function () {
            // 心跳每隔几分钟刷新一次当前状态
        },
        isLost: function () {
            // 会话是否消失
        }
    };
    var context = new ContextManger();
    context.init();

    //如果获取不到当前Session 给出提示

    win.Page.Context = context;
})(window, $);


/*表单参数管理 */
/* nameSpace:Page.FormState */

(function (win, $) {
    var FormStateManger = function () {
    }

    var _formSateObj = {};

    FormStateManger.prototype = {
        init: function () {
            this.initQueryFormState();

        },
        initQueryFormState: function () {
            // 通过url给querystring赋值

            var formState = this.getQuery("formstate");

            var arr = formState.split(";");
            for (var item in arr) {
                var val_arr = arr[item].split(",");
                var key = val_arr[0];
                var value = val_arr[1];
                this.set(key, value);
            }
        },
        getQuery: function (key) {
            var search = location.search.slice(1); //得到get方式提交的查询字符串
            var arr = search.split("&");
            for (var i = 0; i < arr.length; i++) {
                var ar = arr[i].split("=");
                if (ar[0] == key) {
                    if (unescape(ar[1]) == 'undefined') {
                        return "";
                    } else {
                        return unescape(ar[1]);
                    }
                }
            }
            return "";
        },
        set: function (key, value) {
            // 保留字 dataid id type action 
            _formSateObj[key] = value;
        },
        get: function (key) {
            return _formSateObj[key];
        },
        serialize: function () {

        }
    };
    var sateManager = new FormStateManger();
    sateManager.init();

    win.Page.FormSate = sateManager;
})(window, $);


/* 表单全局配置 */
/* nameSpace:Page.Config */

(function (win, $) {

    win.Page.Config = {};
})(window, $);