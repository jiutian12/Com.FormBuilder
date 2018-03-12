/*
 * CheckBox Plugin
 */

(function ($) {
    $.fn.leeCheckBox = function (opitons) {
        return $.leeUI.run.call(this, "leeUICheckBox", arguments);
    }
    $.fn.leeGetCheckBoxManager = function () {
        return $.leeUI.run.call(this, "leeUIGetCheckBoxManager", arguments);
    };
    //初始化checkbox的默认配置
    $.leeUIDefaults.CheckBox = {
        disabled: false,
        readonly: false, //只读
        hasLabel: true,
        labelText: null,
        data: [],
        isMul: false
    };
    //扩展UIControl
    $.leeUI.controls.CheckBox = function (element, options) {
        //执行父构造函数
        $.leeUI.controls.CheckBox.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.CheckBox.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return "CheckBox";
        },
        __idPrev: function () {
            return "CheckBox";
        },
        _extendMethods: function () {

        },
        _render: function () {
            //渲染html
            var g = this;
            p = this.options;
            g.input = $(g.element);
            g.link = $("<span class='lee-checkbox'></span>");
            g.wrapper = g.input.addClass("lee-hidden").wrap("<div class='lee-checkbox-wrapper'></div>").parent();

            g.wrapper.prepend(g.link);


            if (p.labelText) {
                
                g.labelwrap = g.wrapper.wrap("<div class='lee-checkbox-label'></div>").parent();
                g.labelspan = $("<span class='lee-checkbox-label-span' style='font-size:12px;'>" + p.labelText + "</span>");
                g.labelwrap.append(g.labelspan);
                g.labelspan.bind("click", function () {
                    g.link.trigger("click");
                });
            }
            g.link.click(function () {
                if (g.input.attr('disabled') || g.input.attr('readonly')) { return false; }
                if (p.disabled || p.readonly) return false;
                if (g.trigger('beforeClick', [g.element]) == false) return false;
                if ($(this).hasClass("lee-checkbox-checked")) {
                    g._setValue(false);
                } else {
                    g._setValue(true);
                }

                g.input.trigger("change");
            });

            g.input.change(function () {
                if (this.checked) {
                    g.link.addClass('lee-checkbox-checked');
                }
                else {
                    g.link.removeClass('lee-checkbox-checked');
                }
                return true;
            });
            g.wrapper.hover(function () {
                if (!p.disabled)
                    $(this).addClass("lee-over");
            }, function () {
                $(this).removeClass("lee-over");
            });
            this.set(p);
            this.updateStyle();
        },
        _setCss: function () {
            this.wrapper.css(value);
        },
        _setValue: function (value) {
            var g = this,
				p = this.options;


            if (!value) {

                g.input[0].checked = false;
                g.link.removeClass('lee-checkbox-checked');
            } else {

                g.input[0].checked = true;

                g.link.addClass('lee-checkbox-checked');
            }
        },
        _setDisabled: function (value) {
            if (value) {
                this.input.attr('disabled', true);
                this.wrapper.addClass("lee-disabled");
            } else {
                this.input.attr('disabled', false);
                this.wrapper.removeClass("lee-disabled");
            }
        },
        _getValue: function () {
            if (this.options.notbit) {
                //alert(1);
                return (this.element.checked ? "1" : "0");
            }
            return this.element.checked;
        },
        updateStyle: function () {
            if (this.input.attr('disabled')) {
                this.wrapper.addClass("lee-disabled");
                this.options.disabled = true;
            }
            if (this.input[0].checked) {
                this.link.addClass('lee-checkbox-checked');
            } else {
                this.link.removeClass('lee-checkbox-checked');
            }
        }

    });
})(jQuery);