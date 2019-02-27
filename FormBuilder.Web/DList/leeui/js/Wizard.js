(function ($) {

    $.fn.leeWizard = function (options) {
        return $.leeUI.run.call(this, "leeUIWizard", arguments);
    };

    $.fn.leeGetWizardManager = function () {
        return $.leeUI.run.call(this, "leeUIGetleeUIWizardManager", arguments);
    };

    $.leeUIDefaults.Wizard = {
        toolbar: false,
        onNext: null,
        onPrev: null,
        onConfirm: null,
        fixed: true,
        onBeforeSelectTabItem: null,
        onAfterSelectTabItem: null
    };
    $.leeUIDefaults.WizardString = {

    };

    $.leeUI.controls.Wizard = function (element, options) {
        $.leeUI.controls.Wizard.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.Wizard.leeExtend($.leeUI.core.UIComponent, {
        __getType: function () {
            return 'Wizard';
        },
        __idPrev: function () {
            return 'Wizard';
        },
        _extendMethods: function () {
            return {};
        },
        _render: function () {
            var g = this,
                p = this.options;
            g.tab = $(this.element);
            g.tab.addClass("lee-wizard");
            //内容区
            g.tab.content = $('<div class="lee-wizard-content"></div>');
            $("> div", g.tab).appendTo(g.tab.content); //把元素内容追加到内容区
            g.tab.content.appendTo(g.tab);

            g.tab.links = $('<div class="lee-wizard-step"><ul class="steps"></ul></div>');
            g.tab.links.prependTo(g.tab);
            g.activeTabs = {};
            g.tab.links.ul = $("ul", g.tab.links);
            g.allTabLength = 0;
            $("> div", g.tab.content).each(function (i, box) {
                var li = $('<li class=""><span class="step">' + (i + 1) + '</span><span class="title"></span><span class="chevron"></span></li>');
                var contentitem = $(this);
                if (contentitem.attr("title")) {
                    $("> .title", li).html(contentitem.attr("title"));
                    contentitem.attr("title", "");
                }
                contentitem.attr("tabindex", i);
                li.attr("tabindex", i);
                var tabid = contentitem.attr("tabid");
                if (tabid == undefined) {
                    tabid = g.getNewTabid();
                    contentitem.attr("tabid", tabid);
                }
                li.attr("tabid", tabid);
                var clickFunc = (function (i) {
                    return function () {
                        if (g.activeTabs[i])
                            g.select(i);
                    }
                })(i);
                li.click(clickFunc);
                if (i == 0) g.selectedTabId = tabid;
                $("> ul", g.tab.links).append(li);
                contentitem.addClass("lee-wizard-content-item");
                g.allTabLength++;
            });
            //init 
            g.setToolbar();
            g.select(0);

            //add even 
            // $("li", g.tab.links).each(function () {
            //     g._addTabItemEvent($(this));lee-wizard-content-item
            // });
            g.set(p);

        },
        setStatus: function () {
            var g = this,
                p = this.options;
            if (g.currentIndex == 0) {
                g.btnPrev.attr("disabled", "disabled");
            } else {
                g.btnPrev.removeAttr("disabled");
            }
            if (g.allTabLength == g.currentIndex + 1) {
                g.btnNext.attr("disabled", "disabled");;
                g.btnDone.show();
            } else {
                g.btnNext.removeAttr("disabled");
                g.btnDone.hide();
            }
        },
        setToolbar: function (params) {
            var g = this,
                p = this.options;
            if (!p.toolbar) return;

            g.tab.addClass("hastoolbar")
            //底部工具栏
            g.tab.toolbar = $('<div class="lee-wizard-toolbar"></div>');
            g.tab.append(g.tab.toolbar);
            g.btnGroup = $('<div class="lee-btn-group"></div>')
            g.btnPrev = $("<button class='lee-btn'><i class='icon-Previous' style='margin-right: 3px;float: left;margin-top: 2px;'></i>上一步</button>");
            g.btnNext = $("<button class='lee-btn'>下一步<i class='icon-Next' style='margin-left: 3px;float: right;margin-top: 2px;'></i></i></button>");
            g.btnDone = $("<button class='lee-btn lee-btn-primary'><i class='lee-ion-checkmark' style='margin-right: 3px;'></i>完成</button>");
            g.btnGroup.append(g.btnPrev).append(g.btnNext);
            g.tab.toolbar.append(g.btnGroup).append(g.btnDone);


            g.btnPrev.click(function () {

                if (g.trigger('prev', [g.currentIndex]) == false)
                    return false;
                g.select(g.currentIndex - 1);
            });
            g.btnNext.click(function () {
                if (g.trigger('next', [g.currentIndex]) == false)
                    return false;
                g.select(g.currentIndex + 1);
            });

            g.btnDone.click(function () {
                g.trigger('confirm', [g.currentIndex]);
            });

        },
        select: function (tabid) {
            var g = this,
                p = this.options;
            var $ele;
            if (typeof (tabid) == "number") {

                $ele = $("> .lee-wizard-content-item[tabindex=" + tabid + "]", g.tab.content);
                tabid = $($ele).attr("tabid");
            } else {
                $ele = $("> .lee-wizard-content-item[tabid=" + tabid + "]", g.tab.content);
            }
            var id = $ele[0].id;
            var tabindex = $ele.attr("tabindex");
            if (g.trigger('beforeSelectTabItem', [tabid, id, tabindex]) == false)
                return false;
            g.selectedTabId = tabid;
            g.currentIndex = Number(tabindex);
            $ele.show().siblings().hide();

            g.activeTabs[tabindex] = true;
            $("li[tabid=" + tabid + "]", g.tab.links.ul).addClass("active").siblings().removeClass("active");
            for (var i = 0; i < Number(tabindex); i++) {
                $("li:eq(" + i + ")", g.tab.links.ul).addClass("complete");
                $("li:eq(" + i + ")>.step", g.tab.links.ul).addClass("lee-ion-checkmark");

            }

            for (var i = Number(tabindex); i < g.allTabLength; i++) {
                $("li:eq(" + i + ")", g.tab.links.ul).removeClass("complete");
                $("li:eq(" + i + ")>.step", g.tab.links.ul).removeClass("lee-ion-checkmark");
            }
            g.setStatus();
            g.trigger('afterSelectTabItem', [tabid, id, tabindex]);
        },
        getNewTabid: function () {
            var g = this,
                p = this.options;
            g.getnewidcount = g.getnewidcount || 0;
            return 'tabitem' + (++g.getnewidcount);
        }
    });

})(jQuery);