
window.lsp = window.lsp || {};
window.lsp.core = window.lsp.core || {};
window.lsp.core = (function (core, win, $) {

    core.defaults = {
        version: "0.0.1",
        host: "",
        loingURL: "",
        baseURL: "", //+ "/FormBuilder.Web",
        invokeURL: ""
    };


    //获取框架身份信息
    core.state = (function (state) {
        var userContext = {};
        state.set = function (session) {
            userContext = session;
        }
        state.get = function (key) {
            return key ? userContext[key] : userContext;
        }
        return state;
    })(core.state || {});


    //数据处理类 处理 ajax 请求
    core.service = (function (service) {
        var baseURL = core.defaults.baseURL;
        service.init = function () {
            $.ajaxSetup({
                type: "post", // 默认使用POST方式
                error: function (jqXHR, textStatus, errorMsg) {
                    console.log('发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg);
                },
                success: function (data) {
                    console.log("请求状态成功");
                    //console.log(data);
                },
                beforeSend: function (XHR) {
                    XHR.setRequestHeader("formBulider", "2015");
                }
            });
        }
        //同步的ajax请求
        service.postSync = function (api, apiParams) {
            return $.ajax({
                url: baseURL + api,
                data: apiParams,
                async: false
            });
        }
        //请求通用的ajax封装
        service.post = function (api, apiParams, tipMessage) {
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

        service.invoke = function (namespace, method, params) {
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

        service.init();
        return service;
    })(core.service || {});


})(window.lsp.core, window, $);


window.lsp.cf = window.lsp.cf || {};
window.lsp.cf = (function (cf, core, win, $) {

    cf.defaults = {
        maxTab: 10,//最多打开多少tab页
        eanbleWebSocket: false//是否启动实时监听
    };

    cf.service = {
        isLost: function (callback) {
            //检测登录状态
            core.service.post("/FrameWork/SessionCheck", {}).then(function (data) {
                callback(data);
            });
        },
        getMenu: function (callback) {
            //获取菜单
            core.service.post("/FrameWork/Menu", {}).then(function (data) {
                callback(data);
            });
        },
        logOut: function (callback) {
            //注销登录
            core.service.post("/FrameWork/LogOut", {}).then(function (data) {
                callback(data);
            });
        }
    };
    // 个人收藏
    cf.favor = {
        add: function () {

        },
        remove: function () {

        },
        init: function () {
        }
    };

    // tab页管理
    cf.tab = (function () {
        var tab;
        var navData = [
            {
                id: "01", name: "表单平台", icon: "social-foursquare", root: true, child: [
                    {
                        id: "0101", name: "基础设置", root: true, icon: "ios-gear", child: [
                            {
                                id: "010101", name: "数据库设置", url: _global.sitePath + "/Runtime/Dict?frmid=14353f50-c631-42e3-a869-2fe3a2b9d3f6", root: true
                            },
                            {
                                id: "010102", name: "自定义取数", url: _global.sitePath + "/DataSource/List", root: true
                            }
                            ,
                            {
                                id: "010103", name: "构件管理", url: _global.sitePath + "/CMP/List", root: true
                            }
                        ]
                    },
                    {
                        id: "0102", name: "开发平台", url: "", root: true, icon: "monitor", child: [
                            {
                                id: "010201", name: "数据对象", url: _global.sitePath + "/DataObject/List", root: true
                            },
                            {
                                id: "010202", name: "数据模型", url: _global.sitePath + "/DataModel/List", root: true
                            },
                            {
                                id: "010203", name: "帮助定义", url: _global.sitePath + "/SmartHelp/List", root: true
                            },
                            {
                                id: "010204", name: "表单设计", url: _global.sitePath + "/Form/List", root: true
                            }
                        ]
                    }
                ]
            }
        ]

        $(function () {
            initTab();
            initNav(navData);
        });

        var initTab = function () {
            tab = $(".tabbar").leeTab();
        };
        var addTab = function (opt) {
            tab.addTabItem({
                tabid: opt.id,
                text: opt.name,
                url: opt.url,
                callback: function () {
                    //alert("加载完成!");
                }
            });
        }
        var initNav = function (node) {
            var g = $('<ul class="lee-navbar lee-navbar-gray"></ul>');
            $.each(navData, function (i, header) {
                if (header.root) {
                    var icon = header.icon ? "<i class='lee-ion-" + header.icon + "'></i>" : "";

                    var wrap = $("<li></li>")
                    wrap.append('<div class="nav-header">' + icon + ' <span class="menu-title">' + header.name + '</span><i class="arrow ion"></i></div>');

                    var subwrap = $('<ul class="nav-child" style="display: block;"></ul>');
                    $.each(header.child, function (j, sub) {
                        if (sub.root) {
                            var icon = sub.icon ? "<i class='lee-ion-" + sub.icon + "'></i>" : "";
                            var subcontainer = $("<li></li>");
                            subcontainer.append('<a class="nav-header" href="#">' + icon + '<span class="menu-title">' + sub.name + '</span> <i class="arrow ion"></i> </a>');

                            var thirdwrap = $('<ul class="nav-child" style="display: block;"></ul>');
                            $.each(sub.child, function (k, thrid) {
                                createDetail(thrid, thirdwrap);
                            })
                            subcontainer.append(thirdwrap);
                            subwrap.append(subcontainer);
                        } else {
                            createDetail(sub, subwrap);
                        }
                    });
                    wrap.append(subwrap);
                    g.append(wrap);
                } else {
                    createDetail(header, g);
                }

            });
            // $(".left-nav").empty();
            g.appendTo($(".left-nav"));

        }
        var createDetail = function (node, wrap) {
            var icon = node.icon ? "<i class='lee-ion-" + node.icon + "'></i>" : "";
            var item = $('<li class="nav-item"><a href="#">' + icon + '<span class="menu-title">' + node.name + '</span> </a></li>');
            item.click(function () {
                //alert(2);
                addTab(node);
            });
            wrap.append(item);
        }
    })();

    function bindEvent() {
        $(".tooglebtn").click(function () {
            var shirinkflag = $(this).data("shirink") || false;
            $("body").toggleClass("shrink");
            $(this).data("shirink", !shirinkflag);
            $(window).resize();
        });
    }

    /*处理菜单绑定*/
    $(function () {

        //初始化身份 
        //框架设置
        //菜单
        //个人收藏
        //消息通知
        //审计日志
        $(".nav-item", ".lee-navbar").click(function () {
            $(".nav-item.active").removeClass("active");
            $(this).addClass("active");
        });
        $(".nav-header", ".lee-navbar").click(function () {
            var parent = $(this).parent();
            if (parent.hasClass("collapse")) {
                parent.removeClass("collapse");
                parent.addClass("open");
                $(this).next().show();
            } else {
                parent.removeClass("open");
                parent.addClass("collapse");
                $(this).next().hide();
            }
        });
        var tab = $(".tabbar").leeTab({
            showSwitch: false,
            onBeforeRemoveTabItem: function (tabid) {
                //alert(1);
            },
            onAfterRemoveTabItem: function (tabid) {
                //alert(2);
            },
            onBeforeAddTabItem: function (tabid) {
               // alert(3);
            },
            onAfterAddTabItem: function (tabid) {
                //alert(5);
            },
            onBeforeSelectTabItem: function (tabid) {
               // alert(6);
            },
            onAfterSelectTabItem: function (tabid) {
                //alert(7);
            }
        });
        bindEvent();
    });
    return cf;

})(window.lsp.cf, window.lsp.core, window, $);