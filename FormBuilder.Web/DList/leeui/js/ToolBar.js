/**
 * 
 */
(function ($) {

    $.fn.leeToolBar = function (options) {
        return $.leeUI.run.call(this, "leeUIToolBar", arguments);
    };

    $.leeUIDefaults.ToolBar = {

    };

    $.leeUI.controls.ToolBar = function (element, options) {
        $.leeUI.controls.ToolBar.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.ToolBar.leeExtend($.leeUI.core.UIComponent, {
        __getType: function () {
            return 'ToolBar';
        },
        __idPrev: function () {
            return 'ToolBar';
        },
        _extendMethods: function () {
            return [];
        },
        _render: function () {
            var g = this,
				p = this.options;
            g.toolbarItemCount = 0;
            g.toolBar = $(this.element);
            g.toolBar.addClass("lee-toolbar"); //外围包裹css
            g.set(p);
        },
        _setItems: function (items) {
            var g = this;
            g.toolBar.html("");
            $(items).each(function (i, item) {
                g.addItem(item);
            });
        },
        removeItem: function (itemid) {
            var g = this,
				p = this.options;
            $("> .lee-toolbar-item[toolbarid=" + itemid + "]", g.toolBar).remove();
        },
        setEnabled: function (itemid) {
            var g = this,
				p = this.options;
            $("> .lee-toolbar-item[toolbarid=" + itemid + "]", g.toolBar).removeClass("lee-toolbar-item-disable");
            $("a[toolbarid=" + itemid + "]", g.toolBar).removeAttr("disabled");
        },
        _setDisabled: function (itemid) {
            var g = this,
				p = this.options;

            $("> .lee-toolbar-item[toolbarid=" + itemid + "]", g.toolBar).addClass("lee-toolbar-item-disable");

            $("a[toolbarid=" + itemid + "]", g.toolBar).attr("disabled", "disabled");
        },
        setDisabled: function (itemid) {
            var g = this,
				p = this.options;
            $("> .lee-toolbar-item[toolbarid=" + itemid + "]", g.toolBar).addClass("lee-toolbar-item-disable").removeClass("lee-panel-btn-over");

            $("a[toolbarid=" + itemid + "]", g.toolBar).attr("disabled", "disabled");
        },
        isEnable: function (itemid) {
            var g = this,
				p = this.options;
            return !$("> .lee-toolbar-item[toolbarid=" + itemid + "]", g.toolBar).hasClass("lee-toolbar-item-disable");
        },
        bulidDropDownMenu: function (item, $wrap) {
            var self = this;
            $.each(item.childs, function (i, obj) {

                if (obj.line) {
                    $wrap.append('<li class="divider"></li>');
                    return;
                }
                if (obj.header) {
                    $wrap.append('<li class="dropdown-header">' + obj.text + '</li>');
                    return;
                }
                var $item = $("<li></li>");
                obj.disable && $item.addClass("disabled");
                var $menuitem = $('<a href="#" toolbarid="' + obj.id + '">' + obj.text + '</a>');
                if (obj.childs) {
                    $item.addClass("dropdown-submenu")
                    var $subwrap = $('<ul class="dropdown-menu"></ul>');
                    $item.append($menuitem).append($subwrap);
                    self.bulidDropDownMenu(obj, $subwrap);
                } else {
                    $item.append($menuitem);
                }
                if (obj.icon) {
                    $menuitem.prepend("<i class='icon-img icon-" + obj.icon + "'></i>");
                } else if (obj.iconfont) {
                    $menuitem.prepend("<i class='lee-ion lee-ion-" + obj.iconfont + "'></i>");
                }
                $menuitem.click(function () {
                    //alert(2);
                    if ($(this).attr("disabled") == "disabled")
                        return;
                    if ($(this).parent().hasClass("disabled"))
                        return;
                    var res = obj.click(obj, self);
                    self.trigger('buttonClick', [res, item]);
                });
                $wrap.append($item);

            });
        },
        setAlign: function ($ele, align) {

            if (align == "1")
                $ele.css("float", "right");
        },
        addLine: function (item) {
            var $line = $('<div class="lee-bar-separator"></div>');
            this.setAlign($line, item.align);
            this.toolBar.append($line);
        },
        addText: function (item) {
          
            var $text = $('<div class="lee-toolbar-item lee-toolbar-text"><span><p>' + (item.text || "") + '</p></span></div>');
            this.setAlign($text, item.align);
            this.toolBar.append($text);
        },
        addSearchBox: function (item) {
            var g = this;
            var $search = $('<div class="lee-search-wrap lee-toolbar-item"><input class="lee-search-words" type="text" placeholder="请输入查询关键字"><i class="lee-ion-close close"></i><button class="search lee-ion-search" type="button" ></button></div>');
            this.setAlign($search, item.align);
            this.toolBar.append($search);


            $("button", $search).click(function () {
                var res = item.click(item, g, $("input", $search).val());// 查询按钮调用
                g.trigger('buttonClick', [res, item]);
            });

            $("input", $search).keyup(function (event) {
                if (event.keyCode == 13) {
                    var res = item.click(item, g, $("input", $search).val());// 查询按钮调用
                    g.trigger('buttonClick', [res, item]);
                }
                showClose();
            });


            $(".close").click(function () {
                $("input", $search).val("");
                showClose();
                $("input", $search).focus();
            });

            function showClose() {
                if ($("input", $search).val() == "") {
                    $(".close", $search).hide();
                } else {
                    $(".close", $search).show();
                }
            }
            return this;
        },
        addLink: function (item) {
            var $link = $('<div class="lee-search-wrap lee-toolbar-item" ><a href="javascript:void(0)" style="padding:5px;display:inline-block;" >' + item.text + '</a></div>');

            this.setAlign($link, item.align);
            this.toolBar.append($link);
            $("a", $link).click(function () {
                //alert(1);
                item.click(item);
            });
            return this;
        },
        addDropDown: function (item) {
            var $dropdown = $('<li class="dropitem dropdown lee-toolbar-item"> <a href="#" data-toggle="dropdown" class="lee-panel-btn"  >' + item.text + '<i style="margin-left: 5px;" class="lee-ion-android-arrow-dropdown"></i></a> <ul class="dropdown-menu"></ul></li>');
            this.setAlign($dropdown);
            if (item.icon) {
                $dropdown.find("a").prepend("<i class='icon-img icon-" + item.icon + "' style='margin-right:5px;'></i>");
            } else if (item.iconfont) {
                $dropdown.find("a").prepend("<i class='lee-ion lee-ion-" + item.iconfont + "' style='margin-right:5px;'></i>");
            }
            if (item.childs) {
                this.bulidDropDownMenu(item, $dropdown.find("ul"));
            }
            this.toolBar.append($dropdown);
        },
        addItem: function (item) {
            var g = this,
				p = this.options;
            if (item.line || item.type == "line") {
                this.addLine(item);
                return;
            }
            if (item.type == "text") {
                
                this.addText(item);
                return;
            }
            if (item.type == "searchbox") {
                this.addSearchBox(item);
                return;
            }


            if (item.type == "link") {
                this.addLink(item);
                return this;
            }
            if (item.type == "dropdown") {
                this.addDropDown(item);
                return;
            }
            //普通的按钮 lee-btn 三种模式
            //lee-dropdown
            //lee-date
            var ditem = $('<div class="lee-toolbar-item lee-panel-btn"><span></span></div>');
            if (item.type == "btn") {


                ditem = $('<a class="lee-btn  lee-toolbar-item"><span></span></a>');

                if (item.style) {
                    switch (item.style) {
                        case "1":
                            ditem.addClass("lee-btn-default");
                            break;
                        case "2":
                            ditem.addClass("lee-btn-primary");
                            break;
                        case "3":
                            ditem.addClass("lee-btn-sucess");
                            break;
                        case "4":
                            ditem.addClass("lee-btn-info");
                            break;
                        case "5":
                            ditem.addClass("lee-btn-danger");
                            break;
                        default:
                            break;
                    }
                } else {
                    ditem.addClass("lee-btn-primary");
                }
            }
            g.toolBar.append(ditem);
            g.setAlign(ditem, item.align);
            if (!item.id) item.id = 'item-' + (++g.toolbarItemCount);
            ditem.attr("toolbarid", item.id);
            if (item.img) {
                ditem.append("<img src='" + item.img + "' />");
                ditem.addClass("l-toolbar-item-hasicon");
            } else if (item.icon) {
                ditem.prepend("<i class='icon-img icon-" + item.icon + "'></i>");
                ditem.addClass("l-toolbar-item-hasicon");
            } else if (item.iconfont) {
                ditem.prepend("<i class='lee-ion lee-ion-" + item.iconfont + "'></i>");
                ditem.addClass("l-toolbar-item-hasicon");
            } else if (item.color) {

                ditem.append("<div class='lee-toolbar-item-color' style='background:" + item.color + "'></div>");
                ditem.addClass("l-toolbar-item-hasicon");
            }

            if (item.menu) {
                ditem.append("<i class='right lee-icon lee-angle-down'></i>");
                ditem.addClass("l-toolbar-item-hasicon");
            }
            item.text ? $("span:first", ditem).html(item.text) : $("span:first", ditem).remove();
            item.disable && ditem.addClass("lee-toolbar-item-disable");

            item.click && ditem.click(function () {
                if ($(this).hasClass("lee-toolbar-item-disable"))
                    return;
                var res = item.click(item, g);
                g.trigger('buttonClick', [res, item]);
            });
            if (item.menu) {
                if (item.menu.id) return;
                //item.menu.renderTo=ditem;
                item.menu = $.fn.leeMenu(item.menu);
                ditem.hover(function () {
                    if ($(this).hasClass("lee-toolbar-item-disable")) return;
                    g.actionMenu && g.actionMenu.hide();
                    var left = $(this).offset().left;
                    var top = $(this).offset().top + $(this).height();
                    item.menu.show({
                        top: top + 10,
                        left: left
                    });
                    g.actionMenu = item.menu;
                    $(this).addClass("lee-panel-btn-over");
                }, function () {
                    if ($(this).hasClass("lee-toolbar-item-disable")) return;
                    $(this).removeClass("lee-panel-btn-over");
                });
            } else {
                ditem.hover(function () {
                    if ($(this).hasClass("lee-toolbar-item-disable")) return;
                    $(this).addClass("lee-panel-btn-over");
                }, function () {
                    if ($(this).hasClass("lee-toolbar-item-disable")) return;
                    $(this).removeClass("lee-panel-btn-over");
                });

                ditem.mousedown(function () {
                    if (!item.disable)
                        $(this).addClass("lee-panel-btn-selected");
                });

                ditem.mouseup(function () {
                    if (!item.disable)
                        $(this).removeClass("lee-panel-btn-selected");
                });
            }
        }
    });
})(jQuery);