window.fBulider.framework = window.fBulider.framework || {};
window.fBulider.framework = (function (framework, win, $) {

    framework.defaults = {
        maxTab: 10,//最多打开多少tab页
        eanbleWebSocket: false//是否启动实时监听
    };
    framework.tab = (function () {
        var tab;
        var navData = [
            {
                id: "01", name: "表单平台", icon: "social-foursquare", root: true, child: [
                    {
                        id: "0101", name: "基础设置", root: true, icon: "ios-gear", child: [
                            {
                                id: "010101", name: "数据库设置", url: _global.sitePath + "/Settings/DBConnection", root: true
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
            var g = $('<ul class="lee-navbar"></ul>');
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
            $(".left-nav").empty();
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



    $(function () {
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
    });
    return framework;

})(window.fBulider.framework, window, $);