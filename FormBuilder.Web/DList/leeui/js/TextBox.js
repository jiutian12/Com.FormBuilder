
(function ($) {
    $.fn.leeTextBox = function () {
        return $.leeUI.run.call(this, "leeUITextBox", arguments);
    };

    $.fn.leeGetTextBoxManager = function () {
        return $.leeUI.run.call(this, "leeUIGetTextBoxManager", arguments);
    };

    $.leeUIDefaults.TextBox = {
        onChangeValue: null,
        onMouseOver: null,
        onMouseOut: null,
        onBlur: null,
        onFocus: null,
        width: "auto",
        disabled: false,
        initSelect: false,
        value: null, //初始化值 
        precision: 2, //保留小数位(仅currency时有效)
        nullText: null, //不能为空时的提示
        digits: false, //是否限定为数字输入框
        number: false, //是否限定为浮点数格式输入框
        currency: false, //是否显示为货币形式
        readonly: false //是否只读
    };

    $.leeUI.controls.TextBox = function (element, options) {
        $.leeUI.controls.TextBox.base.constructor.call(this, element, options);
    };

    $.leeUI.controls.TextBox.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return 'TextBox'
        },
        __idPrev: function () {
            return 'TextBox';
        },
        _init: function () {
            $.leeUI.controls.TextBox.base._init.call(this);
            var g = this,
				p = this.options;
            if (!p.width) {
                p.width = $(g.element).width();
            }
            if ($(this.element).attr("readonly")) {
                p.readonly = true;
            } else if (p.readonly) {
                $(this.element).attr("readonly", true);
            }
        },
        _render: function () {
            var g = this,
				p = this.options;
            g.inputText = $(this.element);
            //外层
            g.wrapper = g.inputText.wrap('<div class="lee-text"></div>').parent();

            if (!g.inputText.hasClass("lee-text-field"))
                g.inputText.addClass("lee-text-field");
            this._setEvent();
            if (p.digits || p.number || p.currency) {
                g.inputText.addClass("lee-text-field-number");
            }
            if (p.placeholder) {
                g.inputText.attr("placeholder", p.placeholder);
            }
            g.set(p);
            g.formatValue();
        },
        destroy: function () {
            var g = this;
            if (g.wrapper) {
                g.wrapper.remove();
            }
            g.options = null;
            leeUI.remove(this);
        },
        _getValue: function () {
            var g = this,
				p = this.options;

            if (g.inputText.hasClass("lee-text-field-null")) {
                return "";
            }
            if (p.digits || p.number || p.currency) {
                return g.parseNumber();
            }
            return g.inputText.val();
        },
        _setNullText: function () {
            this.checkNotNull();
        },
        formatValue: function () {
            var g = this,
				p = this.options;
            var v = g.inputText.val() || "";
            if (v == "") return "";
            if (p.currency) {
                g.inputText.val(currencyFormatter(v, p.precision));
            } else if (p.number && p.precision && v) {
                var value = parseFloat(g.inputText.val()).toFixed(p.precision);
                g.inputText.val(value);
            }
        },
        checkNotNull: function () {
            var g = this,
				p = this.options;

            if (p.nullText && p.nullText != "null" && !p.disabled && !p.readonly) {
                if (!g.inputText.val()) {
                    g.inputText.addClass("lee-text-field-null").val(p.nullText);
                    return;
                }
            } else {
                g.inputText.removeClass("lee-text-field-null");
            }
        },
        _setEvent: function () {
            var g = this,
				p = this.options;

            function validate() {
                var value = g.inputText.val();
                if (!value || value == "-") return true;

                var r = (p.digits ? /^-?\d+$/ : /^(-?\d+)(\.)?(\d+)?$/).test(value);
                return r;
            }

            function keyCheck() {
                if (!validate()) {
                    g.inputText.val(g.parseNumber());
                }
            }
            if (p.digits || p.number || p.currency) {
                g.inputText.keyup(keyCheck).bind("paste", keyCheck);
            }
            g.inputText.bind('blur.textBox', function () {
                g.trigger('blur');
                g.checkNotNull();
                g.formatValue();
                g.wrapper.removeClass("lee-text-focus");
            }).bind('focus.textBox', function () {
                if (p.readonly) return;
                g.trigger('focus');
                if (p.nullText) {
                    if ($(this).hasClass("lee-text-field-null")) {
                        $(this).removeClass("lee-text-field-null").val("");
                    }
                }
                g.wrapper.addClass("lee-text-focus");

                if (p.digits || p.number || p.currency) {
                    $(this).val(g.parseNumber());
                    if (p.initSelect) {
                        setTimeout(function () {
                            g.inputText.select();
                        }, 150);
                    }
                }
            }).change(function () {
                g.trigger('change', [this.value]);
                g.trigger('changeValue', [this.value]);
            });
            g.wrapper.hover(function () {
                g.trigger('mouseOver');
                g.wrapper.addClass("lee-text-over");
            }, function () {
                g.trigger('mouseOut');
                g.wrapper.removeClass("lee-text-over");
            });
        },

        //将value转换为有效的数值
        //1,去除无效字符 2,小数点保留
        parseNumber: function (value) {
            var g = this,
				p = this.options;
            var isInt = p.digits ? true : false;
            value = value || g.inputText.val();
            if (value == null || value == "") return "";
            if (!(p.digits || p.number || p.currency)) return value;
            if (typeof (value) != "string") value = (value || "").toString();
            var sign = /^\-/.test(value);
            if (isInt) {
                if (value == "0") return value;
                value = value.replace(/\D+|^[0]+/g, '');
            } else {
                value = value.replace(/[^0-9.]/g, '');
                if (/^[0]+[1-9]+/.test(value)) {
                    value = value.replace(/^[0]+/, '');
                }
            }
            if (!isInt && p.precision) {
                value = parseFloat(value).toFixed(p.precision);
                if (value == "NaN") return "0";
            }
            if (sign) value = "-" + value;
            return value;
        },

        _setDisabled: function (value) {
            var g = this,
				p = this.options;
            if (value) {
                this.inputText.attr("readonly", "readonly");
                this.wrapper.addClass("lee-text-disabled");
            } else if (!p.readonly) {
                this.inputText.removeAttr("readonly");
                this.wrapper.removeClass('lee-text-disabled');
            }
        },
        _setRequired: function (value) {
            if (value) {
                this.wrapper.addClass('lee-text-required');
            } else {
                this.wrapper.removeClass('lee-text-required');
            }
        },
        _setWidth: function (value) {
            if (value > 20) {
                this.wrapper.css({ width: value });
                //this.inputText.css({ width: value - 4 });
            }
        },
        _setHeight: function (value) {
            if (value > 10) {
                //this.wrapper.height(value);
                //this.inputText.height(value - 2);
            }
        },
        _setValue: function (value) {
            if (value != null)
                this.inputText.val(value);
            this.checkNotNull();
        },
        _setLabel: function (value) {
            var g = this,
				p = this.options;
            if (!g.labelwrapper) {
                g.labelwrapper = g.wrapper.wrap('<div class="lee-labeltext"></div>').parent();
                var lable = $('<div class="lee-text-label" style="float:left;">' + value + ':&nbsp</div>');
                g.labelwrapper.prepend(lable);
                g.wrapper.css('float', 'left');
                if (!p.labelWidth) {
                    p.labelWidth = lable.width();
                } else {
                    g._setLabelWidth(p.labelWidth);
                }
                lable.height(g.wrapper.height());
                if (p.labelAlign) {
                    g._setLabelAlign(p.labelAlign);
                }
                g.labelwrapper.append('<br style="clear:both;" />');
                g.labelwrapper.width(p.labelWidth + p.width + 2);
            } else {
                g.labelwrapper.find(".lee-text-label").html(value + ':&nbsp');
            }
        },
        _setLabelWidth: function (value) {
            var g = this,
				p = this.options;
            if (!g.labelwrapper) return;
            g.labelwrapper.find(".lee-text-label").width(value);
        },
        _setLabelAlign: function (value) {
            var g = this,
				p = this.options;
            if (!g.labelwrapper) return;
            g.labelwrapper.find(".lee-text-label").css('text-align', value);
        },
        updateStyle: function () {
            var g = this,
				p = this.options;
            if (g.inputText.attr('readonly')) {
                g.wrapper.addClass("lee-text-readonly");
                p.disabled = true;
            } else {
                g.wrapper.removeClass("lee-text-readonly");
                p.disabled = false;
            }
            if (g.inputText.attr('disabled')) {
                g.wrapper.addClass("lee-text-disabled");
                p.disabled = true;
            } else {
                g.wrapper.removeClass("lee-text-disabled");
                p.disabled = false;
            }
            if (g.inputText.hasClass("lee-text-field-null") && g.inputText.val() != p.nullText) {
                g.inputText.removeClass("lee-text-field-null");
            }
            g.formatValue();
        },
        setValue: function (value) {
            this._setValue(value);
            //this.trigger('changeValue', [value]);
        }
    });

    function currencyFormatter(num, precision) {
        var cents, sign;
        if (!num) num = 0;
        num = num.toString().replace(/\$|\,/g, '').replace(/[a-zA-Z]+/g, '');
        if (num.indexOf('.') > -1) num = num.replace(/[0]+$/g, '');
        if (isNaN(num))
            num = 0;
        sign = (num == (num = Math.abs(num)));

        if (precision == null) {
            num = num.toString();
            cents = num.indexOf('.') != -1 ? num.substr(num.indexOf('.') + 1) : '';
            if (cents) {
                num = Math.floor(num * 1);
                num = num.toString();
            }
        } else {
            precision = parseInt(precision);
            var r = Math.pow(10, precision);
            num = Math.floor(num * r + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / r).toString();
            while (cents.toString().length < precision) {
                cents = "0" + cents;
            }
        }
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
			num.substring(num.length - (4 * i + 3));
        var numStr = "" + (((sign) ? '' : '-') + '' + num);
        if (cents) numStr += ('.' + cents);
        return numStr;
    }

})(jQuery);