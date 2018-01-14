(function ($) {

    $.leeDialog = function () {
        return $.leeUI.run.call(null, "leeUIDialog", arguments, {
            isStatic: true
        });
    };

    $.leeUIDefaults.Dialog = {
        cls: null, //给dialog附加css class
        contentCls: null,
        id: null, //给dialog附加id
        buttons: null, //按钮集合 
        width: 280, //宽度
        height: null, //高度，默认自适应 
        content: '', //内容
        target: null, //目标对象，指定它将以appendTo()的方式载入
        targetBody: false, //载入目标是否在body上
        url: null, //目标页url，默认以iframe的方式载入
        urlParms: null, //传参
        coverMode: true,
        load: false, //是否以load()的方式加载目标页的内容 
        type: 'none', //类型 warn、success、error、question
        left: null, //位置left
        top: null, //位置top
        modal: true, //是否模态对话框
        data: null, //传递数据容器
        name: null, //创建iframe时 作为iframe的name和id 
        opener: null,
        isDrag: true, //是否拖动
        isResize: true, // 是否调整大小
        overflow: null, //弹窗内容是否允许有滚动条
        allowClose: true, //允许关闭
        timeParmName: null, //是否给URL后面加上值为new Date().getTime()的参数，如果需要指定一个参数名即可
        closeWhenEnter: null, //回车时是否关闭dialog
        isHidden: false, //关闭对话框时是否只是隐藏，还是销毁对话框
        show: true, //初始化时是否马上显示
        title: '提示', //头部 
        showMax: true, //是否显示最大化按钮 
        showToggle: false, //是否显示收缩窗口按钮
        showMin: false, //是否显示最小化按钮
        slide: true, //是否以动画的形式显示 
        fixedType: null, //在固定的位置显示, 可以设置的值有n, e, s, w, ne, se, sw, nw
        showType: null, //显示类型,可以设置为slide(固定显示时有效) 
        layoutMode: 1, //1 九宫布局, 2 上中下布局
        onLoaded: null,
        onExtend: null,
        onExtended: null,
        onCollapse: null,
        onCollapseed: null,
        onContentHeightChange: null,
        onClose: null,
        onClosed: null,
        onStopResize: null,
        minIsHide: false //最小化仅隐藏
    };
    $.leeUIDefaults.DialogString = {
        titleMessage: '提示',
        ok: '确定',
        yes: '是',
        no: '否',
        cancel: '取消',
        waittingMessage: '正在等待中,请稍候...'
    };

    $.leeUI.controls.Dialog = function (options) {
        $.leeUI.controls.Dialog.base.constructor.call(this, null, options);
    };
    $.leeUI.controls.Dialog.leeExtend($.leeUI.core.Win, {
        __getType: function () {
            return 'Dialog';
        },
        __idPrev: function () {
            return 'Dialog';
        },
        _extendMethods: function () {
            return {};
        },
        _render: function () {
            var g = this,
				p = this.options;
            var tmpId = "";

            if (p.modal && p.coverMode) {
                g.maskid = leeUI.win.getMaskID();
            }
            //alert(p.maskid);
            g.set(p, true);
            var dialog = $('<div class="lee-dialog"><table class="lee-dialog-table" cellpadding="0" cellspacing="0" border="0"><tbody><tr> <td class="lee-dialog-tc"><div class="lee-dialog-tc-inner"><div class="lee-dialog-icon"></div><div class="lee-dialog-title"></div><div class="lee-dialog-winbtns"><div class="lee-icon lee-dialog-winbtn lee-dialog-close"></div></div></div></td></tr><tr><td class="lee-dialog-cc"><div class="lee-dialog-body"><div class="lee-dialog-image lee-icon"></div> <div class="lee-dialog-content"></div><div class="lee-dialog-buttons"><div class="lee-dialog-buttons-inner"></div></td></tr><tr><td class="lee-dialog-bc"></td></tr></tbody></table></div>');
            $('body').append(dialog); //创建布局
            g.dialog = dialog;

            g.element = dialog[0];

            g.dialog.body = $(".lee-dialog-body:first", g.dialog);
            g.dialog.header = $(".lee-dialog-tc-inner:first", g.dialog);
            g.dialog.winbtns = $(".lee-dialog-winbtns:first", g.dialog.header);
            g.dialog.buttons = $(".lee-dialog-buttons:first", g.dialog);
            g.dialog.content = $(".lee-dialog-content:first", g.dialog);
            g.set(p, false);

            if (p.allowClose == false) $(".lee-dialog-close", g.dialog).remove();
            if (p.target || p.url || p.type == "none") {

                p.type = null;
                g.dialog.addClass("lee-dialog-win");
                if (p.target) {
                    p.target.data("display", p.target.css("display"));
                }

            }
            if (p.cls) g.dialog.addClass(p.cls);
            if (p.id) g.dialog.attr("id", p.id);

            //设置锁定屏幕、拖动支持 和设置图片 如果每个弹窗是单独modal需要特殊处理

            g.mask(g.maskid);
            if (p.isDrag)
                g._applyDrag();
            if (p.isResize)
                g._applyResize();
            if (p.type)
                g._setImage();
            else {
                $(".lee-dialog-image", g.dialog).remove();
                g.dialog.content.addClass("lee-dialog-content-noimage");
                if (p.overflow) {
                    g.dialog.content.css("overflow", p.overflow)
                }
            }
            if (p.contentCls)
                g.dialog.content.addClass(p.contentCls);
            if (!p.show) {
                g.unmask(g.maskid);
                g.dialog.hide();
            }
            //设置主体内容
            if (p.target) {
                g.dialog.content.prepend(p.target);
                $(p.target).show();
            } else if (p.url) {
                var url = $.isFunction(p.url) ? p.url.call(g) : p.url;
                var urlParms = $.isFunction(p.urlParms) ? p.urlParms.call(g) : p.urlParms;
                if (p.timeParmName) {
                    urlParms = urlParms || {};
                    urlParms[p.timeParmName] = new Date().getTime();
                }
                if (urlParms) {
                    for (var name in urlParms) {
                        url += url.indexOf('?') == -1 ? "?" : "&";
                        url += name + "=" + urlParms[name];
                    }
                }
                if (p.load) {
                    g.dialog.body.load(url, function () {
                        g._saveStatus();
                        g.trigger('loaded');
                    });
                } else {
                    g.jiframe = $("<iframe frameborder='0'></iframe>");
                    var framename = p.name ? p.name : "ligerwindow" + new Date().getTime();
                    g.jiframe.attr("name", framename);
                    g.jiframe.attr("id", framename);
                    g.dialog.content.prepend(g.jiframe);
                    g.dialog.content.addClass("lee-dialog-content-nopadding lee-dialog-content-frame");

                    setTimeout(function () {
                        if (g.dialog.body.find(".lee-dialog-loading:first").length == 0)
                            g.dialog.body.append("<div class='lee-dialog-loading' style='display:block;'></div>");
                        var iframeloading = $(".lee-dialog-loading:first", g.dialog.body);
                        g.jiframe[0].dialog = g; //增加窗口对dialog对象的引用
                        /*
						可以在子窗口这样使用：
						var dialog = frameElement.dialog;
						var dialogData = dialog.get('data');//获取data参数
						dialog.set('title','新标题'); //设置标题
						dialog.close();//关闭dialog 
						*/
                        g.jiframe.attr("src", url).bind('load.dialog', function () {
                            iframeloading.hide();
                            g.trigger('loaded');
                        });
                        g.frame = window.frames[g.jiframe.attr("name")];
                    }, 0);
                    // 为了解决ie下对含有iframe的div窗口销毁不正确，进而导致第二次打开时焦点不在当前图层的问题
                    // 加入以下代码 
                    tmpId = 'jquery_ligerui_' + new Date().getTime();
                    g.tmpInput = $("<input></input>");
                    g.tmpInput.attr("id", tmpId);
                    g.dialog.content.prepend(g.tmpInput);
                }
            }
            if (p.opener) g.dialog.opener = p.opener;
            //设置按钮
            if (p.buttons) {
                $(p.buttons).each(function (i, item) {

                    var btn =
						$('<a  href = "javascript:void(0);" class="lee-btn" id="' + item.id + '" style="width: auto;"><span>' + item.text + '</span></a>');
                    //$('<div class="lee-dialog-btn"><div class="lee-dialog-btn-l"></div><div class="lee-dialog-btn-r"></div><div class="lee-dialog-btn-inner"></div></div>');
                    //$(".lee-dialog-btn-inner", btn).html(item.text);
                    $(".lee-dialog-buttons-inner", g.dialog.buttons).append(btn);
                    item.width && btn.width(item.width);
                    item.onclick && btn.click(function () {
                        item.onclick(item, g, i);
                    });
                    if (item.cls) {
                        btn.addClass(item.cls);
                    } else {
                        btn.addClass("lee-btn-primary")
                    }

                });
            } else {
                g.dialog.buttons.remove();
            }
            $(".lee-dialog-buttons-inner", g.dialog.buttons).append("<div class='lee-clear'></div>");

            $(".lee-dialog-title", g.dialog)
				.bind("selectstart", function () {
				    return false;
				});
            g.dialog.click(function () {
                $.leeUI.win.setFront(g);
            });
            //设置事件
            $(".lee-dialog-tc .lee-dialog-close", g.dialog).click(function () {
                if (p.isHidden)
                    g.hide();
                else
                    g.close();
            });
            if (!p.fixedType) {
                if (p.width == 'auto') {
                    setTimeout(function () {
                        resetPos()
                    }, 100);
                } else {
                    resetPos();
                }
            }

            function resetPos() {
                //位置初始化
                var left = 0;
                var top = 0;
                var width = p.width || g.dialog.width();
                if (p.slide == true) p.slide = 'fast';
                if (p.left != null) left = p.left;
                else p.left = left = 0.5 * ($(window).width() - width);
                if (p.top != null) top = p.top;
                else p.top = top = 0.5 * ($(window).height() - g.dialog.height()) + $(window).scrollTop() - 10;
                if (left < 0) p.left = left = 0;
                if (top < 0) p.top = top = 0;
                g.dialog.css({
                    left: left,
                    top: top
                });
            }
            g.show();
            $('body').bind('keydown.dialog', function (e) {
                var key = e.which;
                if (key == 13) {
                    g.enter();
                } else if (key == 27) {
                    g.esc();
                }
            });

            g._updateBtnsWidth();
            g._saveStatus();
            g._onReisze();
            if (tmpId != "") {
                $("#" + tmpId).focus();
                $("#" + tmpId).remove();
            }
        },
        _borderX: 6,
        _borderY: 38,
        doMax: function (slide) {
            var g = this,
				p = this.options;
            $("body").addClass("lee-body-max-dialog")
            var width = $(window).width(),
				height = $(window).height(),
				left = 2,
				top = 2;

            if ($.leeUI.win.taskbar) {
                height -= $.leeUI.win.taskbar.outerHeight();
                if ($.leeUI.win.top) top += $.leeUI.win.taskbar.outerHeight();
            }
            //有工具栏的话
            if (slide) {
                g.dialog.body.animate({
                    width: width - g._borderX
                }, p.slide);
                g.dialog.animate({
                    left: left,
                    top: top
                }, p.slide);
                g.dialog.content.animate({
                    height: height - g._borderY - g.dialog.buttons.outerHeight()
                }, p.slide, function () {
                    g._onReisze();
                });
            } else {

                g.set({
                    width: width,
                    height: height - 2,
                    left: left,
                    top: top
                });
                g._onReisze();
            }
            g.maximum = true;
        },
        //最大化
        max: function () {
            var g = this,
				p = this.options;
            if (g.winmax) {
                g.winmax.addClass("lee-dialog-recover");
                g.doMax(p.slide);
                if (g.wintoggle) {
                    if (g.wintoggle.hasClass("lee-dialog-extend"))
                        g.wintoggle.addClass("lee-dialog-toggle-disabled lee-dialog-extend-disabled");
                    else
                        g.wintoggle.addClass("lee-dialog-toggle-disabled lee-dialog-collapse-disabled");
                }
                if (g.resizable) g.resizable.set({
                    disabled: true
                });
                if (g.draggable) g.draggable.set({
                    disabled: true
                });

                $(window).bind('resize.dialogmax', function () {
                    g.doMax(false);
                });
            }
        },

        //恢复
        recover: function () {
            var g = this,
				p = this.options;
            $("body").removeClass("lee-body-max-dialog")
            if (g.winmax) {
                g.winmax.removeClass("lee-dialog-recover");
                if (p.slide) {
                    g.dialog.body.animate({
                        width: g._width - g._borderX
                    }, p.slide);
                    g.dialog.animate({
                        left: g._left,
                        top: g._top
                    }, p.slide);
                    g.dialog.content.animate({
                        height: g._height - g._borderY - g.dialog.buttons.outerHeight()
                    }, p.slide, function () {
                        g._onReisze();
                    });
                } else {
                    g.set({
                        width: g._width,
                        height: g._height,
                        left: g._left,
                        top: g._top
                    });
                    g._onReisze();
                }
                if (g.wintoggle) {
                    g.wintoggle.removeClass("lee-dialog-toggle-disabled lee-dialog-extend-disabled lee-dialog-collapse-disabled");
                }

                $(window).unbind('resize.dialogmax');
            }
            if (this.resizable) this.resizable.set({
                disabled: false
            });
            if (g.draggable) g.draggable.set({
                disabled: false
            });
            g.maximum = false;
        },

        //最小化
        min: function () {
            var g = this,
				p = this.options;
            if (p.minIsHide) {
                g.dialog.hide();
            } else {
                var task = $.leeUI.win.getTask(this);
                if (p.slide) {
                    g.dialog.body.animate({
                        width: 1
                    }, p.slide);
                    task.y = task.offset().top + task.height();
                    task.x = task.offset().left + task.width() / 2;
                    g.dialog.animate({
                        left: task.x,
                        top: task.y
                    }, p.slide, function () {
                        g.dialog.hide();
                    });
                } else {
                    g.dialog.hide();
                }
            }
            g.unmask(g.maskid);
            g.minimize = true;
            g.actived = false;
        },

        active: function () {
            var g = this,
				p = this.options;
            if (g.minimize) {
                var width = g._width,
					height = g._height,
					left = g._left,
					top = g._top;
                if (g.maximum) {
                    width = $(window).width();
                    height = $(window).height();
                    left = top = 0;
                    if ($.leeUI.win.taskbar) {
                        height -= $.leeUI.win.taskbar.outerHeight();
                        if ($.leeUI.win.top) top += $.leeUI.win.taskbar.outerHeight();
                    }
                }
                if (p.slide) {
                    g.dialog.body.animate({
                        width: width - g._borderX
                    }, p.slide);
                    g.dialog.animate({
                        left: left,
                        top: top
                    }, p.slide);
                } else {
                    g.set({
                        width: width,
                        height: height,
                        left: left,
                        top: top
                    });
                }
            }
            g.actived = true;
            g.minimize = false;
            $.leeUI.win.setFront(g);
            g.show();
        },

        //展开 收缩
        toggle: function () {

            var g = this,
				p = this.options;
            if (!g.wintoggle) return;
            if (g.wintoggle.hasClass("lee-dialog-extend"))
                g.extend();
            else
                g.collapse();
        },

        //收缩
        collapse: function (slide) {
            var g = this,
				p = this.options;
            if (!g.wintoggle) return;
            if (p.slide && slide != false)
                g.dialog.content.animate({
                    height: 1
                }, p.slide);
            else
                g.dialog.content.height(1);
            if (this.resizable) this.resizable.set({
                disabled: true
            });

            g.wintoggle.addClass("lee-dialog-extend");
        },

        //展开
        extend: function () {
            var g = this,
				p = this.options;
            if (!g.wintoggle) return;
            var contentHeight = g._height - g._borderY - g.dialog.buttons.outerHeight();
            if (p.slide)
                g.dialog.content.animate({
                    height: contentHeight
                }, p.slide);
            else
                g.dialog.content.height(contentHeight);
            if (this.resizable) this.resizable.set({
                disabled: false
            });

            g.wintoggle.removeClass("lee-dialog-extend");
        },
        _updateBtnsWidth: function () {
            var g = this;
            var btnscount = $(">div", g.dialog.winbtns).length;
            g.dialog.winbtns.width(22 * btnscount);
        },
        _setLeft: function (value) {
            if (!this.dialog) return;
            if (value != null)
                this.dialog.css({
                    left: value
                });
        },
        _setTop: function (value) {
            if (!this.dialog) return;
            if (value != null)
                this.dialog.css({
                    top: value
                });
        },
        _setWidth: function (value) {
            if (!this.dialog) return;
            if (value >= this._borderX) {
                this.dialog.body.width(value - this._borderX);
            }
        },
        _setHeight: function (value) {
            var g = this,
				p = this.options;
            if (!this.dialog) return;
            if (value == "auto") {
                g.dialog.content.height('auto');
            } else if (value >= this._borderY) {
                var height = value - this._borderY - g.dialog.buttons.outerHeight();
                if (g.trigger('ContentHeightChange', [height]) == false) return;
                if (p.load) {
                    g.dialog.body.height(height);
                } else {
                    g.dialog.content.height(height);
                }
                g.trigger('ContentHeightChanged', [height]);
            }
        },
        _setShowMax: function (value) {
            var g = this,
				p = this.options;
            if (value) {
                if (!g.winmax) {
                    g.winmax = $('<div class="lee-dialog-winbtn lee-icon lee-dialog-max"></div>').appendTo(g.dialog.winbtns)
						.hover(function () {
						    if ($(this).hasClass("lee-dialog-recover"))
						        $(this).addClass("lee-dialog-recover-over");
						    else
						        $(this).addClass("lee-dialog-max-over");
						}, function () {
						    $(this).removeClass("lee-dialog-max-over lee-dialog-recover-over");
						}).click(function () {
						    if ($(this).hasClass("lee-dialog-recover"))
						        g.recover();
						    else
						        g.max();
						});
                }
            } else if (g.winmax) {
                g.winmax.remove();
                g.winmax = null;
            }
            g._updateBtnsWidth();
        },
        _setShowMin: function (value) {
            var g = this,
				p = this.options;
            if (value) {
                if (!g.winmin) {
                    g.winmin = $('<div class="lee-icon lee-dialog-winbtn lee-dialog-min"></div>').appendTo(g.dialog.winbtns)
						.hover(function () {
						    $(this).addClass("lee-dialog-min-over");
						}, function () {
						    $(this).removeClass("lee-dialog-min-over");
						}).click(function () {
						    g.min();
						});
                    if (!p.minIsHide) {
                        $.leeUI.win.addTask(g);
                    }
                }
            } else if (g.winmin) {
                g.winmin.remove();
                g.winmin = null;
            }
            g._updateBtnsWidth();
        },
        _setShowToggle: function (value) {
            var g = this,
				p = this.options;
            if (value) {
                if (!g.wintoggle) {
                    g.wintoggle = $('<div class="lee-icon lee-dialog-winbtn lee-dialog-collapse"></div>').appendTo(g.dialog.winbtns)
						.hover(function () {
						    if ($(this).hasClass("lee-dialog-toggle-disabled")) return;
						    if ($(this).hasClass("lee-dialog-extend"))
						        $(this).addClass("lee-dialog-extend-over");
						    else
						        $(this).addClass("lee-dialog-collapse-over");
						}, function () {
						    $(this).removeClass("lee-dialog-extend-over lee-dialog-collapse-over");
						}).click(function () {
						    if ($(this).hasClass("lee-dialog-toggle-disabled")) return;
						    if (g.wintoggle.hasClass("lee-dialog-extend")) {
						        if (g.trigger('extend') == false) return;
						        g.wintoggle.removeClass("lee-dialog-extend");
						        g.extend();
						        g.trigger('extended');
						    } else {
						        if (g.trigger('collapse') == false) return;
						        g.wintoggle.addClass("lee-dialog-extend");
						        g.collapse();
						        g.trigger('collapseed')
						    }
						});
                }
            } else if (g.wintoggle) {
                g.wintoggle.remove();
                g.wintoggle = null;
            }
        },
        //按下回车
        enter: function () {
            var g = this,
				p = this.options;
            var isClose;
            if (p.closeWhenEnter != undefined) {
                isClose = p.closeWhenEnter;
            } else if (p.type == "warn" || p.type == "error" || p.type == "success" || p.type == "question") {
                isClose = true;
            }
            if (isClose) {
                g.close();
            }
        },
        esc: function () {

        },
        _removeDialog: function () {
            var g = this,
				p = this.options;
            if (p.showType && p.fixedType) {
                g.dialog.animate({
                    bottom: -1 * p.height
                }, function () {
                    remove();
                });
            } else {
                remove();
            }

            function remove() {
                var jframe = $('iframe', g.dialog);
                if (jframe.length) {
                    var frame = jframe[0];
                    frame.src = "about:blank";
                    if (frame.contentWindow && frame.contentWindow.document) {
                        try {
                            frame.contentWindow.document.write('');
                        } catch (e) { }
                    }
                    $.browser.msie && CollectGarbage();
                    jframe.remove();
                }

                if (p.targetBody) {
                    p.target.appendTo("body").css("display", p.target.data("display"));
                }
                g.dialog.remove();
            }
        },
        close: function () {
            var g = this,
				p = this.options;
            if (g.trigger('Close') == false) return;
            g.doClose();
            if (g.trigger('Closed') == false) return;
        },
        doClose: function () {
            var g = this;
            $.leeUI.win.removeTask(this);
            $.leeUI.remove(this);
            g.unmask(g.maskid);
            // 是否取消当前id的mask
            g._removeDialog();
            $('body').unbind('keydown.dialog');
            $("body").removeClass("lee-body-max-dialog")
        },
        _getVisible: function () {
            return this.dialog.is(":visible");
        },
        _setUrl: function (url) {
            var g = this,
				p = this.options;
            p.url = url;
            if (p.load) {
                g.dialog.body.html("").load(p.url, function () {
                    g.trigger('loaded');
                });
            } else if (g.jiframe) {
                g.jiframe.attr("src", p.url);
            }
        },
        _setContent: function (content) {
            this.dialog.content.html(content);
        },
        _setTitle: function (value) {
            var g = this;
            var p = this.options;
            if (value) {
                $(".lee-dialog-title", g.dialog).html(value);
            }
        },
        _hideDialog: function () {
            var g = this,
				p = this.options;
            if (p.showType && p.fixedType) {
                g.dialog.animate({
                    bottom: -1 * p.height
                }, function () {
                    g.dialog.hide();
                });
            } else {
                g.dialog.hide();
            }
        },
        hidden: function () {
            var g = this;
            $.leeUI.win.removeTask(g);
            g.dialog.hide();
            g.unmask(g.maskid);
        },
        show: function () {
            var g = this,
				p = this.options;
            g.mask(g.maskid);
            if (p.fixedType) {
                if (p.showType) {
                    g.dialog.css({
                        bottom: -1 * p.height
                    }).addClass("lee-dialog-fixed");
                    g.dialog.show().animate({
                        bottom: 0
                    });
                } else {
                    g.dialog.show().css({
                        bottom: 0
                    }).addClass("lee-dialog-fixed");
                }
            } else {
                g.dialog.show();
            }
            //前端显示 
            if (p.coverMode) {
                g.dialog.css("z-index", g.maskid + 9005);
            } else {
                $.leeUI.win.setFront.leeDefer($.leeUI.win, 100, [g]);
            }
        },
        setUrl: function (url) {
            this._setUrl(url);
        },
        _saveStatus: function () {
            var g = this;
            g._width = g.dialog.body.width();
            g._height = g.dialog.body.height();
            var top = 0;
            var left = 0;
            if (!isNaN(parseInt(g.dialog.css('top'))))
                top = parseInt(g.dialog.css('top'));
            if (!isNaN(parseInt(g.dialog.css('left'))))
                left = parseInt(g.dialog.css('left'));
            g._top = top;
            g._left = left;
        },
        _applyDrag: function () {
            var g = this,
				p = this.options;
            if ($.fn.leeDrag) {
                g.draggable = g.dialog.leeDrag({
                    handler: '.lee-dialog-title',
                    animate: false,
                    onStartDrag: function () {

                        $.leeUI.win.setFront(g);
                        var mask = $("<div class='lee-dragging-mask' style='display:block'></div>").height(g.dialog.height());
                        g.dialog.append(mask);
                        g.dialog.content.addClass('lee-dialog-content-dragging');
                    },
                    onDrag: function (current, e) {

                        var pageY = e.pageY || e.screenY;
                        if (pageY < 0) return false;
                    },
                    onStopDrag: function () {

                        g.dialog.find("div.lee-dragging-mask:first").remove();
                        g.dialog.content.removeClass('lee-dialog-content-dragging');
                        if (p.target) {
                            var triggers1 = $.leeUI.find($.leeUI.controls.DateEditor);
                            var triggers2 = $.leeUI.find($.leeUI.controls.ComboBox);
                            //更新所有下拉选择框的位置
                            $($.merge(triggers1, triggers2)).each(function () {
                                if (this.updateSelectBoxPosition)
                                    this.updateSelectBoxPosition();
                            });
                        }
                        g._saveStatus();
                    }
                });
            }
        },
        _onReisze: function () {
            var g = this,
				p = this.options;
            if (p.target || p.url) {
                var manager = $(p.target).leeUI();
                if (!manager) manager = $(p.target).find(":first").leeUI();
                if (!manager) return;
                var contentHeight = g.dialog.content.height();
                var contentWidth = g.dialog.content.width();
                manager.trigger('resize', [{
                    width: contentWidth,
                    height: contentHeight
                }]);
            }
        },
        _applyResize: function () {
            var g = this,
				p = this.options;
            if ($.fn.leeResizable) {
                g.resizable = g.dialog.leeResizable({
                    onStopResize: function (current, e) {
                        var top = 0;
                        var left = 0;
                        if (!isNaN(parseInt(g.dialog.css('top'))))
                            top = parseInt(g.dialog.css('top'));
                        if (!isNaN(parseInt(g.dialog.css('left'))))
                            left = parseInt(g.dialog.css('left'));
                        if (current.diffLeft) {
                            g.set({
                                left: left + current.diffLeft
                            });
                        }
                        if (current.diffTop) {
                            g.set({
                                top: top + current.diffTop
                            });
                        }
                        if (current.newWidth) {
                            g.set({
                                width: current.newWidth
                            });
                            g.dialog.body.css({
                                width: current.newWidth - g._borderX
                            });
                        }
                        if (current.newHeight) {
                            g.set({
                                height: current.newHeight
                            });
                        }
                        g._onReisze();
                        g._saveStatus();
                        g.trigger('stopResize');
                        return false;
                    },
                    animate: false
                });
            }
        },
        _setImage: function () {
            var g = this,
				p = this.options;
            if (p.type) {
                var alertCss = {
                    paddingLeft: 60,
                    paddingRight: 15,
                    paddingBottom: 30
                };
                if (p.type == 'success' || p.type == 'donne' || p.type == 'ok') {
                    $(".lee-dialog-image", g.dialog).addClass("lee-dialog-image-donne").show();
                    g.dialog.content.css(alertCss);
                } else if (p.type == 'error') {
                    $(".lee-dialog-image", g.dialog).addClass("lee-dialog-image-error").show();
                    g.dialog.content.css(alertCss);
                } else if (p.type == 'warn') {
                    $(".lee-dialog-image", g.dialog).addClass("lee-dialog-image-warn").show();
                    g.dialog.content.css(alertCss);
                } else if (p.type == 'question') {
                    $(".lee-dialog-image", g.dialog).addClass("lee-dialog-image-question").show();
                    g.dialog.content.css(alertCss);
                }
            }
        }
    });

    $.leeUI.controls.Dialog.prototype.hide = $.leeUI.controls.Dialog.prototype.hidden;

    $.leeDialog.open = function (p) {
        return $.leeDialog(p);
    };
    $.leeDialog.close = function () {
        var dialogs = $.leeUI.find($.leeUI.controls.Dialog.prototype.__getType());
        for (var i in dialogs) {
            var d = dialogs[i];
            d.destroy.leeDefer(d, 5);
        }
        $.leeUI.win.unmask();
    };
    $.leeDialog.show = function (p) {
        var dialogs = $.leeUI$.leeUI.find($.leeUI.controls.Dialog.prototype.__getType());
        if (dialogs.length) {
            for (var i in dialogs) {
                dialogs[i].show();
                return;
            }
        }
        return $.leeDialog(p);
    };
    $.leeDialog.hide = function () {
        var dialogs = $.leeUI.find($.leeUI.controls.Dialog.prototype.__getType());
        for (var i in dialogs) {
            var d = dialogs[i];
            d.hide();
        }
    };
    $.leeDialog.tip = function (options) {
        options = $.extend({
            showType: 'slide',
            width: 240,
            modal: false,
            height: 100
        }, options || {});

        $.extend(options, {
            fixedType: 'se',
            type: 'none',
            isDrag: false,
            isResize: false,
            showMax: false,
            showToggle: false,
            showMin: false
        });
        return $.leeDialog.open(options);
    };
    $.leeDialog.alert = function (content, title, type, callback, options) {
        content = content || "";
        if (typeof (title) == "function") {
            callback = title;
            type = null;
        } else if (typeof (type) == "function") {
            callback = type;
        }
        var btnclick = function (item, Dialog, index) {
            Dialog.close();
            if (callback)
                callback(item, Dialog, index);
        };
        p = {
            content: content,
            buttons: [{
                text: $.leeUIDefaults.DialogString.ok,
                onclick: btnclick
            }]
        };
        if (typeof (title) == "string" && title != "") p.title = title;
        if (typeof (type) == "string" && type != "") p.type = type;
        $.extend(p, {
            showMax: false,
            showToggle: false,
            showMin: false
        }, options || {});
        return $.leeDialog(p);
    };

    $.leeDialog.confirm = function (content, title, callback) {
        if (typeof (title) == "function") {
            callback = title;
            type = null;
        }
        var btnclick = function (item, Dialog) {
            Dialog.close();
            if (callback) {
                callback(item.type == 'ok');
            }
        };
        p = {
            type: 'question',
            content: content,
            buttons: [{
                text: $.leeUIDefaults.DialogString.yes,
                onclick: btnclick,
                type: 'ok',
                cls: 'lee-btn-primary lee-dialog-btn-ok'
            }, {
                text: $.leeUIDefaults.DialogString.no,
                onclick: btnclick,
                type: 'no',
                cls: 'lee-dialog-btn-no'
            }]
        };
        if (typeof (title) == "string" && title != "") p.title = title;
        $.extend(p, {
            showMax: false,
            showToggle: false,
            showMin: false
        });
        return $.leeDialog(p);
    };
    $.leeDialog.warning = function (content, title, callback, options) {
        if (typeof (title) == "function") {
            callback = title;
            type = null;
        }
        var btnclick = function (item, Dialog) {
            Dialog.close();
            if (callback) {
                callback(item.type);
            }
        };
        p = {
            type: 'question',
            content: content,
            buttons: [{
                text: $.leeUIDefaults.DialogString.yes,
                onclick: btnclick,
                type: 'yes'
            }, {
                text: $.leeUIDefaults.DialogString.no,
                onclick: btnclick,
                type: 'no'
            }, {
                text: $.leeUIDefaults.DialogString.cancel,
                onclick: btnclick,
                type: 'cancel'
            }]
        };
        if (typeof (title) == "string" && title != "") p.title = title;
        $.extend(p, {
            showMax: false,
            showToggle: false,
            showMin: false
        }, options || {});
        return $.leeDialog(p);
    };

    $.leeDialog.loading = function (title, modal) {
        if (window.top != window && window.top.$.leeDialog) {
            window.top.$.leeDialog.loading(title, modal);
            return;
        }
        var html = [];
        title = title || "正在加载中....";

        if ($("#lee-global-loading").length > 0) {
            if (modal) {
                $("#lee-global-mask").show();
            }
            $("#lee-global-loading .message").html(title);
            $("#lee-global-loading").show();
        } else {
            html.push("<div id='lee-global-mask' class='lee-modal-mask'></div>");
            html.push('<div  id="lee-global-loading" class="lee-loading"><div class="lee-grid-loading-inner"><div class="loader"></div><div class="message">' + title + '</div></div></div>');
            var $loading = $(html.join(""));
            $("body").append($loading);
            $loading.show();
        }
    }
    $.leeDialog.hideLoading = function () {
        if (window.top != window && window.top.$.leeDialog) {
            window.top.$.leeDialog.hideLoading();
            return;
        }
        $("#lee-global-mask").hide();
        $("#lee-global-loading").hide();
    }
    $.leeDialog.waitting = function (title) {
        title = title || $.leeUIDefaults.Dialog.waittingMessage;
        return $.leeDialog.open({
            cls: 'lee-dialog-waittingdialog',
            type: 'none',
            content: '<div style="padding:4px">' + title + '</div>',
            allowClose: false
        });
    };
    $.leeDialog.closeWaitting = function () {
        var dialogs = $.leeUI.find($.leeUI.controls.Dialog);
        for (var i in dialogs) {
            var d = dialogs[i];
            if (d.dialog.hasClass("lee-dialog-waittingdialog"))
                d.close();
        }
    };
    $.leeDialog.success = function (content, title, onBtnClick, options) {
        if (window.top != window && window.top.$.leeDialog) {
            return window.top.$.leeDialog.alert(content, title, 'success', onBtnClick, options);

        }
        return $.leeDialog.alert(content, title, 'success', onBtnClick, options);
    };
    $.leeDialog.error = function (content, title, onBtnClick, options) {
        if (window.top != window && window.top.$.leeDialog) {
            return window.top.$.leeDialog.alert(content, title, 'error', onBtnClick, options);
        }
        return $.leeDialog.alert(content, title, 'error', onBtnClick, options);
    };
    $.leeDialog.warn = function (content, title, onBtnClick, options) {
        if (window.top != window && window.top.$.leeDialog) {
            return window.top.$.leeDialog.alert(content, title, 'warn', onBtnClick, options);
        }
        return $.leeDialog.alert(content, title, 'warn', onBtnClick, options);
    };
    $.leeDialog.question = function (content, title, options) {
        if (window.top != window && window.top.$.leeDialog) {
            return window.top.$.leeDialog.alert(content, title, 'question', onBtnClick, options);
        }
        return $.leeDialog.alert(content, title, 'question', null, options);
    };

    $.leeDialog.prompt = function (title, value, multi, callback) {
        var target = $('<input type="text" class="lee-dialog-inputtext"/>');
        if (typeof (multi) == "function") {
            callback = multi;
        }
        if (typeof (value) == "function") {
            callback = value;
        } else if (typeof (value) == "boolean") {
            multi = value;
        }
        if (typeof (multi) == "boolean" && multi) {
            target = $('<textarea class="lee-dialog-textarea"></textarea>');
        }
        if (typeof (value) == "string" || typeof (value) == "int") {
            target.val(value);
        }
        var btnclick = function (item, Dialog, index) {
            Dialog.close();
            if (callback) {
                callback(item.type == 'yes', target.val());
            }
        }
        p = {
            title: title,
            target: target,
            width: 320,
            buttons: [{
                text: $.leeUIDefaults.DialogString.ok,
                onclick: btnclick,
                type: 'yes'
            }, {
                text: $.leeUIDefaults.DialogString.cancel,
                onclick: btnclick,
                type: 'cancel'
            }]
        };
        return $.leeDialog(p);
    };

})(jQuery);
//bug问题记录
//1.关闭弹窗  最大化时候的取消滚动样式要取消