
window.lsp = window.lsp || {};
window.lsp.core = window.lsp.core || {};
window.lsp.core = (function (core, win, $) {

    core.defaults = {
        version: "0.0.1",
        host: "",
        loingURL: "",
        baseURL: "/FormBuilder.Web",
        invokeURL: ""
    };

    core.utils = {
        arrayToTree: function (data, id, pid, child) {
            var childrenName = child || "children";
            if (!data || !data.length) return [];
            var targetData = []; //存储数据的容器(返回) 
            var records = {};
            var itemLength = data.length; //数据集合的个数
            for (var i = 0; i < itemLength; i++) {
                var o = data[i];
                var key = getKey(o[id]);
                records[key] = o;
            }
            for (var i = 0; i < itemLength; i++) {
                var currentData = data[i];
                var key = getKey(currentData[pid]);
                var parentData = records[key];
                if (!parentData) {
                    targetData.push(currentData);
                    continue;
                }
                parentData[childrenName] = parentData[childrenName] || [];
                parentData[childrenName].push(currentData);
            }
            return targetData;

            function getKey(key) {
                if (typeof (key) == "string") key = key.replace(/[.]/g, '').toLowerCase();
                return key;
            }
        }
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

    return core;
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
            core.service.post("/FrameWork/MenuInfo/GetMenuList", {}).then(function (data) {
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
    //系统身份
    cf.context = {
        init: function () {

        },
        get: function () {

        }
    };
    //系统设置
    cf.setting = {
        init: function () {
            // 框架设置 
            // 系统通知弹窗
            // 偏好设置
            // 自动运行菜单
        },
        get: function () {

        }
    };

    //系统菜单
    cf.menu = {
        init: function () {
            var self = this;
            cf.service.getMenu(function (data) {
                //
                var res = core.utils.arrayToTree(data.data, "ID", "PID");
                console.log(res);
                //初始化加载
                self.initView(res);
                self.bind();
            })
        },
        initView: function (navData) {

            var g = $('<ul class="lee-navbar lee-navbar-gray"></ul>');
            $.each(navData, function (i, header) {
                if (header.IsDetail == "0") {
                    var icon = header.ICON ? "<i class='" + header.ICON + "'></i>" : "";

                    var wrap = $("<li></li>")
                    wrap.append('<div class="nav-header">' + icon + ' <span class="menu-title">' + header.Name + '</span><i class="arrow ion"></i></div>');

                    var subwrap = $('<ul class="nav-child" style="display: block;"></ul>');
                    $.each(header.children, function (j, sub) {
                        if (sub.IsDetail == "0") {
                            var icon = sub.ICON ? "<i class='" + sub.ICON + "'></i>" : "";
                            var subcontainer = $("<li></li>");
                            subcontainer.append('<a class="nav-header" href="#">' + icon + '<span class="menu-title">' + sub.Name + '</span> <i class="arrow ion"></i> </a>');

                            var thirdwrap = $('<ul class="nav-child" style="display: block;"></ul>');
                            $.each(sub.children, function (k, thrid) {
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
            function createDetail(node, wrap) {
                var icon = node.ICON ? "<i class='" + node.ICON + "'></i>" : "";
                var item = $('<li class="nav-item"><a href="#">' + icon + '<span class="menu-title">' + node.Name + '</span> </a></li>');
                item.click(function () {
                    cf.tab.addTab(node);
                });
                wrap.append(item);
            }


        },
        bind: function () {
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
        },
        get: function (id) {

        },
        open: function (id) {

        },
        close: function (id) {

        }
    }


    function getChildWin(id) {
        var frm = document.getElementById(id);
        try {
            if (frm.contentWindow.lsp.cf.childIframe)
                return frm.contentWindow;
            else {
                return undefined;
            }
        }
        catch (e) {
            return undefined;
        }
    }
    // tab页管理
    cf.tab = {
        init: function () {
            this.tab = $(".tabbar").leeTab({
                showSwitch: false,
                onBeforeRemoveTabItem: function (tabid) {
                    //alert(1);
                },
                onAfterRemoveTabItem: function (tabid) {

                    $("#" + tabid).find("iframe").focus();
                    var w = getChildWin(tabid);
                    w && w.lsp.cf.childIframe.show && w.lsp.cf.childIframe.show();
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
        },
        addTab: function (opt) {
            this.tab.addTabItem({
                tabid: opt.ID,
                text: opt.Name,
                url: opt.URL + "&funcid=" + opt.ID,
                callback: function () {
                     
                }
            });
        },
        close: function (tabid) {
            this.tab.removeTabItem(tabid);
        }
    };


    //框架整体设置
    cf.core = {
        init: function () {
            this.bind();
        },
        bind: function () {
            $(".tooglebtn").click(function () {
                var shirinkflag = $(this).data("shirink") || false;
                $("body").toggleClass("shrink");
                $(this).find("i").toggleClass("icon-zhankai");
                $(this).data("shirink", !shirinkflag);
                $(window).resize();
            });
        }
    }



    /********iframe接口********/
    cf.childIframe = (function (child) {
        var $d = $(document);

        child.hide = function () {
            var e = $.Event('framehide');
            $d.trigger(e);
            return e.isDefaultPrevented();
        };

        child.show = function (e) {
            $(window).resize();
            var e = $.Event('frameshow');
            $d.trigger(e);
            return e.isDefaultPrevented();
        };

        child.refresh = function (e) {
            var e = $.Event('framerefresh');
            $d.trigger(e);
            return e.isDefaultPrevented();
        };

        child.close = function (e) {
            var e = $.Event('frameclose');
            $d.trigger(e);
            return e.isDefaultPrevented();
        };

        child.logout = function (e) {
            var e = $.Event('framelogout');
            $d.trigger(e);
        };

        return child;
    })(cf.childIframe || {});
    /*处理菜单绑定*/
    $(function () {
        //初始化身份 
        //框架设置
        //整体设置
        cf.core.init();
        //多页签设置
        cf.tab.init();
        //菜单设置
        cf.menu.init();
        //个人收藏
        //消息通知
        //审计日志
    });
    return cf;

})(window.lsp.cf, window.lsp.core, window, $);