/**
* LeeUI-Radio
* 
*/

(function ($) {

    $.fn.leeRadio = function () {
        return $.leeUI.run.call(this, "leeUIRadio", arguments);
    };

    $.fn.leeUIGetRadioManager = function () {
        return $.leeUI.run.call(this, "leeUIGetRadioManager", arguments);
    };

    $.leeUIDefaults.Radio = { disabled: false };

    $.leeUI.controls.Radio = function (element, options) {
        $.leeUI.controls.Radio.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.Radio.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return 'Radio';
        },
        __idPrev: function () {
            return 'Radio';
        },
        _extendMethods: function () {
            return [];
        },
        _render: function () {

            var g = this, p = this.options;
            g.input = $(this.element);
            g.link = $('<a href="javascript:void(0)" class="lee-radio"></a>');
            g.wrapper = g.input.addClass('lee-hidden').css("display", "none").wrap('<div class="lee-radio-wrapper"></div>').parent();
            g.wrapper.prepend(g.link);
            g.input.change(function () {
                if (this.checked) {
                    g.link.addClass('lee-radio-checked');
                }
                else {
                    g.link.removeClass('lee-radio-checked');
                }
                return true;
            });
            g.link.click(function () {
                g._doclick();
            });
            g.wrapper.hover(function () {
                if (!p.disabled)
                    $(this).addClass("lee-over");
            }, function () {
                $(this).removeClass("lee-over");
            });
            this.element.checked && g.link.addClass('lee-radio-checked');

            if (this.element.id) {
                $("label[for=" + this.element.id + "]").click(function () {
                    g._doclick();
                });
            }
            g.set(p);
        },
        setValue: function (value) {
            var g = this, p = this.options;
            if (!value) {
                g.input[0].checked = false;
                g.link.removeClass('lee-radio-checked');
            }
            else {
                g.input[0].checked = true;
                g.link.addClass('lee-radio-checked');
            }
        },
        getValue: function () {
            return this.input[0].checked;
        },
        setEnabled: function () {
            this.input.attr('disabled', false);
            this.wrapper.removeClass("l-disabled");
            this.options.disabled = false;
        },
        setDisabled: function () {
            this.input.attr('disabled', true);
            this.wrapper.addClass("l-disabled");
            this.options.disabled = true;
        },
        updateStyle: function () {
            if (this.input.attr('disabled')) {
                this.wrapper.addClass("l-disabled");
                this.options.disabled = true;
            }
            if (this.input[0].checked) {
                this.link.addClass('lee-checkbox-checked');
            }
            else {
                this.link.removeClass('lee-checkbox-checked');
            }
        },
        _doclick: function () {
            var g = this, p = this.options;
            if (g.input.attr('disabled')) { return false; }
            g.input.trigger('click').trigger('change');
            var formEle;
            if (g.input[0].form) formEle = g.input[0].form;
            else formEle = document;
            $("input:radio[name=" + g.input[0].name + "]", formEle).not(g.input).trigger("change");
            return false;
        }
    });


})(jQuery);