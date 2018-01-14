window.fBulider = window.fBulider || {};
window.fBulider.core = window.fBulider.core || {};

window.fBulider.core = (function (core, win, $) {



    core.defaults = {
        version: "0.0.1",
        host: "",
        loingURL: "",
        baseURL: _global.sitePath, //+ "/FormBuilder.Web",
        invokeURL: ""
    };

    core.isInFrame = function () {
        return window.top.framework ? true : false;
    }
    //异常处理类 ajax异常  程序异常 提示
    core.errorHandler = {

    };
    core.window = {
        open: function (id, name, url) {
            //window.open(url);
            window.top.$.leeDialog.open({
                title: name,
                name: 'winselector',
                isHidden: false,
                showMax: true,
                width: "900",
                slide: false,
                height: "380",
                url: url
            }).max();
        },
        openDialog: function (id, name, url) {
            //window.open(url);
            window.top.$.leeDialog.open({
                title: name,
                name: 'winselector',
                isHidden: false,
                showMax: true,
                width: "800",
                slide: false,
                height: "380",
                url: url
            });
        },
        openTab: function () {
        },
        openWindow: function () {
        }
    }

    //上下文信息 存储客户端的cookie值
    core.context = {
        get: function (key) {

        },
        set: function (key) {

        }
    };

    core.message = {
        warn: function () {

        },
        error: function () {

        },
        info: function () {

        },
        success: function () {

        },
        notify: function () {

        }
    };
    //数据处理类 处理 ajax 请求
    core.dataService = (function (dataService) {
        var baseURL = core.defaults.baseURL;
        dataService.init = function () {
            $.ajaxSetup({
                type: "post", // 默认使用POST方式
                error: function (jqXHR, textStatus, errorMsg) {
                    console.log('发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg);
                },
                success: function (data) {
                    console.log("请求状态成功");
                    console.log(data);
                },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader("formBulider", "2015");
                }
            });
        }
        //同步的ajax请求
        dataService.requestApiSync = function (api, apiParams) {
            return $.ajax({
                url: baseURL + api,
                data: apiParams,
                async: false
            });
        }
        //请求通用的ajax封装
        dataService.requestApi = function (api, apiParams, tipMessage) {
            //提示
            tipMessage && $.leeDialog.loading(tipMessage);
            var defer = $.Deferred();
            $.ajax({ url: baseURL + api, data: apiParams })
                .done(function (data) {
                    $.leeDialog.hideLoading();
                    //取消loading//如果有报错提示
                    if (data.res == false) {
                        leeUI.Error(data.mes);
                    }
                    defer.resolve(data);
                })
                .fail(function (data) {
                    $.leeDialog.hideLoading();
                    defer.reject(data);
                });
            return defer.promise();
        }

        dataService.invoke = function (namespace, method, params) {
            //反射后台的dll
            var data = {
                namespace: namespace,
                method: method,
                params: JSON.stringify(params)
            };

            var defer = $.Deferred();
            $.ajax({
                url: core.defaults.invokeURL,
                data: data
            }).done(function (data) {
                $.leeDialog.hideLoading();
                //取消loading//如果有报错提示
                if (data.res == false) {
                    leeUI.Error(data.mes);
                }
                defer.resolve(data);
            }).fail(function (data) {
                $.leeDialog.hideLoading();
                defer.reject(data);
            });
            return defer.promise();

        }

        dataService.init();
        return dataService;
    })(core.dataService || {});


    return core;

})(window.fBulider.core, window, $);


//utils
window.fBulider.utils = window.fBulider.utils || {};

window.fBulider.utils = {
    encode: function () {

    },
    decode: function () {

    },
    getQuery: function (key) {
        //获取URL参数传值
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
    }

}

$(function () {
    $(".lee-global-load").fadeOut();
});