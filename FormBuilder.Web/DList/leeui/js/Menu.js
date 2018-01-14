/*
 * 下拉菜单插件 contextmenu
 */
(function ($) {
    $.fn.leeMenu = function (options) {
        return $.leeUI.run.call(null, "leeUIMenu", arguments);
    };

    $.leeUIDefaults.Menu = {
        width: 120,
        top: 0,
        left: 0,
        cls: null,
        items: null,
        shadow: true,
        renderTo: "body"
    };
    $.leeUI.controls.Menu = function (options) {
        $.leeUI.controls.Menu.base.constructor.call(this, null, options);
    };
    $.leeUI.controls.Menu.leeExtend($.leeUI.core.UIComponent, {
        __getType: function () {
            return 'Menu';
        },
        __idPrev: function () {
            return 'Menu';
        },
        _extendMethods: function () {
            return {};
        },
        _render: function () {
            var g = this,
				p = this.options;
            g.menuItemCount = 0;
            //全部菜单
            g.menus = {};
            //创建顶级菜单
            g.menu = g.createMenu();
            //记录element
            g.element = g.menu[0];
            //设置位置
            g.menu.css({ top: p.top, left: p.left, width: p.width });
            p.cls && g.menu.addClass(p.cls); //自定义样式

            p.items && $(p.items).each(function (i, item) {
                //循环添加数据
                g.addItem(item);
            });

            $(document).bind('click.menu', function () {
                //隐藏所有的菜单
                for (var menuid in g.menus) {
                    var menu = g.menus[menuid];
                    if (!menu) return;
                    menu.hide();
                }
            });
            g.set(p);
        },
        show: function (options, menu) {
            var g = this,
				p = this.options;
            if (menu == undefined) menu = g.menu;
            if (options && options.left != undefined) {
                menu.css({ left: options.left });
            }
            if (options && options.top != undefined) {
                menu.css({ top: options.top });
            }
            menu.show();

        },
        hide: function (menu) {
            var g = this,
				p = this.options;
            if (menu == undefined) menu = g.menu;
            g.hideAllSubMenu(menu);
            menu.hide();

        },
        toggle: function () {
            var g = this,
				p = this.options;
            g.menu.toggle();

        },
        removeItem: function (itemid) {
            //移除按钮 
            var g = this,
				p = this.options;
            $("> .lee-menu-item[menuitemid=" + itemid + "]", g.menu.items).remove();
        },
        setEnabled: function (itemid) {
            var g = this,
				p = this.options;
            $("> .lee-menu-item[menuitemid=" + itemid + "]", g.menu.items).removeClass("lee-menu-item-disable");
        },
        setMenuText: function (itemid, text) {
            var g = this,
				p = this.options;
            $("> .lee-menu-item[menuitemid=" + itemid + "] >.lee-menu-item-text:first", g.menu.items).html(text);
        },
        setDisabled: function (itemid) {
            var g = this,
				p = this.options;
            $("> .lee-menu-item[menuitemid=" + itemid + "]", g.menu.items).addClass("lee-menu-item-disable");
        },
        isEnable: function (itemid) {
            var g = this,
				p = this.options;
            return !$("> .lee-menu-item[menuitemid=" + itemid + "]", g.menu.items).hasClass("lee-menu-item-disable");
        },
        getItemCount: function () {
            var g = this,
				p = this.options;
            return $("> .lee-menu-item", g.menu.items).length;
        },
        addItem: function (item, menu) {
            var g = this,
				p = this.options;
            if (!item) return;
            if (menu == undefined) menu = g.menu; //顶级菜单

            //添加分隔线
            if (item.line) {
                menu.items.append('<div class="lee-menu-item-line"></div>');
                return;
            }
            //下拉选项
            var ditem = $('<div class="lee-menu-item"><div class="lee-menu-item-text"></div> </div>');
            var itemcount = $("> .lee-menu-item", menu.items).length;
            menu.items.append(ditem);
            ditem.attr("leemenutemid", ++g.menuItemCount); //全局数量ID

            item.id && ditem.attr("menuitemid", item.id);

            item.text && $(">.lee-menu-item-text:first", ditem).html(item.text); //按钮文本

            if (item.icon) {
                item.position = "left" || item.position;
                ditem.append('<i class=" ' + item.position + ' lee-icon lee-' + item.icon + '"></div>');
                menu.addClass("hasicon");
            }
            if (item.img) {
                item.position = "left" || item.position;
                ditem.append('<img class=" ' + item.position + ' lee-menu-item-img " src="' + item.img + '"></img>');
                menu.addClass("hasicon");
            }
            //item.img && ditem.prepend('<div class="l-menu-item-icon"><img style="width:16px;height:16px;margin:2px;" src="' + item.img + '" /></div>');
            if (item.disable || item.disabled)
                ditem.addClass("lee-menu-item-disable"); //只读类
            if (item.children) //如果有子菜单
            {
                ditem.append('<i class="right lee-icon lee-angle-right"></i>'); //右侧图标箭头
                var newmenu = g.createMenu(ditem.attr("leemenutemid")); //创建子菜单
                g.menus[ditem.attr("leemenutemid")] = newmenu; //缓存子菜单
                newmenu.width(p.width); //设置宽度
                newmenu.hover(null, function () {
                    if (!newmenu.showedSubMenu)
                        g.hide(newmenu);
                });
                $(item.children).each(function () {
                    g.addItem(this, newmenu); //添加子菜单
                });
            }
            item.click && ditem.click(function () {
                //点击事件
                if ($(this).hasClass("lee-menu-item-disable")) return;
                item.click(item, itemcount);
            });
            item.dblclick && ditem.dblclick(function () {
                //双击事件
                if ($(this).hasClass("lee-menu-item-disable")) return;
                item.dblclick(item, itemcount);
            });

            var menuover = $("> .lee-menu-over:first", menu);
            ditem.hover(function () {

                if ($(this).hasClass("lee-menu-item-disable")) return;
                var itemtop = $(this).offset().top;
                var top = itemtop - menu.offset().top;
                menuover.css({ top: top });
                g.hideAllSubMenu(menu); //隐藏所有的菜单
                if (item.children) {

                    var leemenutemid = $(this).attr("leemenutemid");
                    if (!leemenutemid) return;
                    if (g.menus[leemenutemid]) {
                        console.log($(this).offset().left);
                        console.log($(this).width());
                        console.log($(this));
                        //显示下级
                        g.show({ top: itemtop - 1, left: $(this).offset().left + $(this).parent().width() }, g.menus[leemenutemid]); //显示下级
                        menu.showedSubMenu = true;
                    }
                }
            }, function () {
                if ($(this).hasClass("lee-menu-item-disable")) return;
                var leemenutemid = $(this).attr("leemenutemid");
                if (item.children) {
                    var leemenutemid = $(this).attr("leemenutemid");

                    if (!leemenutemid) return;
                };
            });
        },
        hideAllSubMenu: function (menu) {
            //隐藏所有的子菜单
            var g = this,
				p = this.options;
            if (menu == undefined) menu = g.menu;
            $("> .lee-menu-item", menu.items).each(function () {
                if ($("> .right", this).length > 0) {
                    var leemenutemid = $(this).attr("leemenutemid");
                    if (!leemenutemid) return;
                    g.menus[leemenutemid] && g.hide(g.menus[leemenutemid]);
                }
            });
            menu.showedSubMenu = false;
        },
        createMenu: function (parentMenuItemID) {
            //父节点ID
            var g = this,
				p = this.options;
            var menu = $('<div class="lee-menu" style="display:none"> <div class="lee-menu-inner"></div></div>');
            //主布局
            parentMenuItemID && menu.attr("leeparentmenuitemid", parentMenuItemID); //这里设置父属性
            menu.items = $("> .lee-menu-inner:first", menu); //按钮区域
            menu.appendTo(p.renderTo);
            menu.hover(null, function () {
                if (!menu.showedSubMenu)
                    $("> .lee-menu-over:first", menu).css({ top: -24 });
            });
            if (parentMenuItemID)
                g.menus[parentMenuItemID] = menu; //缓存当前数据
            else
                g.menus[0] = menu; //如果没有 那么则认为是顶级
            return menu;
        }
    });

})(jQuery);





/* ========================================================================
* Bootstrap: dropdown.js v3.3.5
* http://getbootstrap.com/javascript/#dropdowns
* ========================================================================
* Copyright 2011-2015 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle = '[data-toggle="dropdown"]'
    var Dropdown = function (element) {
        $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.VERSION = '3.3.5'

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }

    function clearMenus(e) {
        if (e && e.which === 3) return
        $(backdrop).remove()
        $(toggle).each(function () {
            var $this = $(this)
            var $parent = getParent($this)
            var relatedTarget = { relatedTarget: this }

            if (!$parent.hasClass('open')) return

            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this.attr('aria-expanded', 'false')
            $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
        })
    }

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
            }

            var relatedTarget = { relatedTarget: this }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

            $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
        }

        return false
    }

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27) $parent.find(toggle).trigger('focus')
            return $this.trigger('click')
        }

        var desc = ' li:not(.disabled):visible a'
        var $items = $parent.find('.dropdown-menu' + desc)

        if (!$items.length) return

        var index = $items.index(e.target)

        if (e.which == 38 && index > 0) index--         // up
        if (e.which == 40 && index < $items.length - 1) index++         // down
        if (! ~index) index = 0

        $items.eq(index).trigger('focus')
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.dropdown')

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.dropdown

    $.fn.dropdown = Plugin
    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
   .unbind('click.bs.dropdown.data-api')
   .unbind('click.bs.dropdown.data-api', '.dropdown form')
   .unbind('click.bs.dropdown.data-api')
   .unbind('keydown.bs.dropdown.data-api')
   .unbind('keydown.bs.dropdown.data-api', '.dropdown-menu')
    $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);