(function ($) {
    $.fn.leeDate = function () {
        return $.leeUI.run.call(this, "leeUIDate", arguments);
    };
    $.leeUIDefaults.Date = {
        format: "yyyy-MM-dd",
        showTime: false,
        startDate: "",
        cancelable: true
    };
    $.leeUI.controls.Date = function (element, options) {
        $.leeUI.controls.Date.base.constructor.call(this, element, options);
    };

    $.leeUI.controls.Date.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return 'Date';
        },
        __idPrev: function () {
            return 'Date';
        },
        _render: function () {
            var g = this,
				p = this.options;
            if (p.showTime) {
                p.format = "yyyy-MM-dd HH:mm:ss";
            }
            g.inputText = $(this.element);
            g.textFieldID = this.element.id;


            g.valueField = $('<input type="hidden"/>');
            g.valueField[0].id = g.valueField[0].name = g.textFieldID + "_val";

            g.link = $('<div class="lee-right"><div class="lee-icon lee-ion-android-calendar popup"></div></div>');
            g.wrapper = g.inputText.wrap('<div class="lee-text lee-text-date"></div>').parent();
            g.wrapper.append(g.link);
            g.wrapper.append(g.valueField);

            g.valueField.attr("data-uiid", g.id);
            g.valueField.data("beforeText", "").data("beforeValue", "");
            g.inputText.addClass("lee-text-field");

            //开关 事件 图标绑定
            g.link.hover(function () {
                if (p.disabled) return;
                $(this).addClass("lee-right-hover");
            }, function () {
                if (p.disabled) return;
                $(this).removeClass("lee-right-hover");
            }).mousedown(function () {
                if (p.disabled) return;
                $(this).addClass("lee-right-pressed");
            }).mouseup(function () {
                if (p.disabled) return;
                $(this).removeClass("lee-right-pressed");
            }).click(function () {
                if (p.disabled) return;
                if (g.trigger('beforeOpen', g) == false) return false;
                g.showDate();
                //  g.inputText.trigger("click");
            });

            //文本框增加事件绑定
            g.inputText.click(function () {
                if (p.disabled) return;
                g.showDate();

            }).blur(function () {
                if (p.disabled) return;
                g.wrapper.removeClass("lee-text-focus");
            }).focus(function () {
                if (p.disabled) return;
                g.wrapper.addClass("lee-text-focus");
            }).change(function () {
                g.trigger('change');
            });
            g.set(p);
        },
        showDate: function () {
            var g = this,
               p = this.options;

            WdatePicker({
                el: g.textFieldID,
                dateFmt: p.format
            });
        },
        _toggle: function () {

        },
        _setWidth: function (value) {
            if (value > 20) {
                this.wrapper.css({ width: value });
                //this.inputText.css({ width: value - 4 });
            }
        },
        //取消选择 
        _setCancelable: function (value) {
            var g = this,
                p = this.options;
            if (!value && g.unselect) {
                g.unselect.remove();
                g.unselect = null;
            }
            if (!value && !g.unselect) return;
            g.unselect = $('<div class="lee-clear"><i class="lee-icon lee-icon-close lee-clear-achor"></i></div>').hide();
            g.wrapper.hover(function () {
                if (!p.disabled)
                    g.unselect.show();
            }, function () {
                g.unselect.hide();
            })
            if (!p.disabled && !p.readonly && p.cancelable) {
                g.wrapper.append(g.unselect);
            }
            g.unselect.click(function () {
                g._setValue("");
            });
        },
        _setValue: function (value) {
            this.inputText.val(value);
            this.valueField.val(value);//值掩码 需要格式化
        },
        _getValue: function () {
            return this.inputText.val();
        },
        _setDisabled: function (flag) {

            //禁用样式
            if (flag) {
                this.options.disabled = true;
                this.wrapper.addClass('lee-text-disabled');
                this.inputText.attr("readonly", "readonly").attr("disabled", "disabled");
            } else {
                this.options.disabled = false;
                this.wrapper.removeClass('lee-text-disabled');
                this.inputText.removeAttr("readonly").removeAttr("disabled");
            }

        },
        _setRequired: function (value) {
            if (value) {
                this.wrapper.addClass('lee-text-required');
            } else {
                this.wrapper.removeClass('lee-text-required');
            }
        },
    });
})(jQuery);