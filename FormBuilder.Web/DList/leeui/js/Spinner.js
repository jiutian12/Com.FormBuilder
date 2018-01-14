
(function ($) {
    $.fn.leeSpinner = function () {
        return $.leeUI.run.call(this, "leeUISpinner", arguments);
    };
    $.fn.leeGetSpinnerManager = function () {
        return $.leeUI.run.call(this, "leeUIGetSpinnerManager", arguments);
    };

    $.leeUIDefaults.Spinner = {
        type: 'int',     //类型 float:浮点数 int:整数 time:时间
        isNegative: true, //是否负数
        decimalplace: 2,   //小数位 type=float时起作用
        step: 0.1,         //每次增加的值
        interval: 50,      //间隔，毫秒
        value: null,
        onChangeValue: false,    //改变值事件
        minValue: null,        //最小值
        maxValue: null,         //最大值
        disabled: false,
        inline: false,
        readonly: false              //是否只读
    };

    $.leeUI.controls.Spinner = function (element, options) {
        $.leeUI.controls.Spinner.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.Spinner.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return 'Spinner';
        },
        __idPrev: function () {
            return 'Spinner';
        },
        _extendMethods: function () {
            return {};
        },
        _init: function () {
            $.leeUI.controls.Spinner.base._init.call(this);
            var p = this.options;
            if (p.type == 'float') {
                //p.step = 0.1;
                p.interval = 50;
            } else if (p.type == 'int') {
                p.step = 1;
                p.interval = 100;
            } else if (p.type == 'time') {
                p.step = 1;
                p.interval = 100;
            } else {
                p.type = "int";
                p.step = 1;
                p.interval = 100;
            }
        },
        _render: function () {
            var g = this, p = this.options;
            g.interval = null;
            g.inputText = null;
            g.value = null;
            g.textFieldID = "";
            if (this.element.tagName.toLowerCase() == "input" && this.element.type && this.element.type == "text") {
                g.inputText = $(this.element);
                if (this.element.id)
                    g.textFieldID = this.element.id;
            }
            else {
                g.inputText = $('<input type="text"/>');
                g.inputText.appendTo($(this.element));
            }
            if (g.textFieldID == "" && p.textFieldID)
                g.textFieldID = p.textFieldID;

            g.link = $('<div class="lee-right"><div class="lee-spinner-up lee-icon lee-angle-up"></div><div class="lee-spinner-split"></div><div class="lee-spinner-down  lee-icon lee-angle-down"></div></div>');
            g.wrapper = g.inputText.wrap('<div class="lee-text lee-text-spinner"></div>').parent();
            //g.wrapper.append('<div class="lee-text-l"></div><div class="lee-text-r"></div>');
            g.wrapper.append(g.link).after(g.selectBox).after(g.valueField);
            g.link.up = $(".lee-spinner-up", g.link);
            g.link.down = $(".lee-spinner-down", g.link);
            g.inputText.addClass("lee-text-field");

            if (p.disabled) {
                g.wrapper.addClass("lee-text-disabled");
            }
            //初始化
            if (!g._isVerify(g.inputText.val())) {
                g.value = g._getDefaultValue();
                g._showValue(g.value);
            }

            g.inputText.on('keydown.spinner', function (e) {
                var dir = {
                    38: 'up',
                    40: 'down'
                }[e.which];
                if (p.disabled) return;
                if (e.which == 38) {
                    g._uping.call(g);

                    //不让选中？
                    $(document).bind("selectstart.spinner", function () { return false; });

                } else if (e.which == 40) {
                    g._downing.call(g);
                    $(document).bind("selectstart.spinner", function () { return false; });
                }

            }).on("keyup.spinner", function (e) {

                g.inputText.trigger("change").focus();
            });
            //事件
            g.link.up.hover(function () {
                if (!p.disabled)
                    $(this).addClass("lee-spinner-up-over");
            }, function () {
                clearInterval(g.interval);
                $(document).unbind("selectstart.spinner");
                $(this).removeClass("lee-spinner-up-over");
            }).mousedown(function () {
                if (!p.disabled) {
                    g._uping.call(g);
                    g.interval = setInterval(function () {
                        g._uping.call(g);
                    }, p.interval);
                    //不让选中？
                    $(document).bind("selectstart.spinner", function () { return false; });
                }
            }).mouseup(function () {
                clearInterval(g.interval);
                g.inputText.trigger("change").focus();
                $(document).unbind("selectstart.spinner");
            });
            g.link.down.hover(function () {
                if (!p.disabled)
                    $(this).addClass("lee-spinner-down-over");
            }, function () {
                clearInterval(g.interval);
                $(document).unbind("selectstart.spinner");
                $(this).removeClass("lee-spinner-down-over");
            }).mousedown(function () {
                if (!p.disabled) {
                    g.interval = setInterval(function () {
                        g._downing.call(g);
                    }, p.interval);
                    $(document).bind("selectstart.spinner", function () { return false; });
                }
            }).mouseup(function () {
                clearInterval(g.interval);
                g.inputText.trigger("change").focus();
                $(document).unbind("selectstart.spinner");
            });

            g.inputText.change(function () {
                var value = g.inputText.val();
                g.value = g._getVerifyValue(value);
                g.trigger('changeValue', [g.value]);
                // 这里需要出发
                g._showValue(g.value);
            }).blur(function () {
                g.wrapper.removeClass("lee-text-focus");
            }).focus(function () {
                g.wrapper.addClass("lee-text-focus");
            });
            g.wrapper.hover(function () {
                if (!p.disabled)
                    g.wrapper.addClass("lee-text-over");
            }, function () {
                g.wrapper.removeClass("lee-text-over");
            });
            g.set(p);
        },
        _setValue: function (value) {
            if (value != null)
                this.inputText.val(value);
        },
        _setWidth: function (value) {
            var g = this;
            if (value > 20) {
                g.wrapper.css({ width: value });
                //g.inputText.css({ width: value});
            }
        },
        _setInline: function (value) {
            var g = this;
            if (value) {

                g.wrapper.css({ "display": "inline-block" });
            }
        },
        _setHeight: function (value) {
            var g = this;
            if (value > 10) {
                g.wrapper.height(value);
                g.inputText.height(value - 2);
                g.link.height(value - 4);
            }
        },
        _setDisabled: function (value) {
            var g = this, p = this.options;
            p.disabled = value ? true : false;
            if (value) {

                this.inputText.attr("readonly", "readonly");
                this.wrapper.addClass("lee-text-disabled");
            }
            else {
                this.inputText.removeAttr("readonly");
                this.wrapper.removeClass("lee-text-disabled");
            }
        },
        _showValue: function (value) {
            var g = this, p = this.options;
            if (!value || value == "NaN") value = 0;
            if (p.type == 'float') {
                value = parseFloat(value).toFixed(p.decimalplace);
            }
            this.inputText.val(value)
        },
        _setValue: function (value) {
            this._showValue(value);
        },
        setValue: function (value) {
            this._showValue(value);
        },
        getValue: function () {
            return this.inputText.val();
        },
        _round: function (v, e) {
            var g = this, p = this.options;
            var t = 1;
            for (; e > 0; t *= 10, e--) { }
            for (; e < 0; t /= 10, e++) { }
            return Math.round(v * t) / t;
        },
        _isInt: function (str) {
            var g = this, p = this.options;
            var strP = p.isNegative ? /^-?\d+$/ : /^\d+$/;
            if (!strP.test(str)) return false;
            if (parseFloat(str) != str) return false;
            return true;
        },
        _isFloat: function (str) {
            var g = this, p = this.options;
            var strP = p.isNegative ? /^-?\d+(\.\d+)?$/ : /^\d+(\.\d+)?$/;
            if (!strP.test(str)) return false;
            if (parseFloat(str) != str) return false;
            return true;
        },
        _isTime: function (str) {
            var g = this, p = this.options;
            var a = str.match(/^(\d{1,2}):(\d{1,2})$/);
            if (a == null) return false;
            if (a[1] > 24 || a[2] > 60) return false;
            return true;

        },
        _isVerify: function (str) {
            var g = this, p = this.options;
            if (p.type == 'float') {
                if (!g._isFloat(str)) return false;
                var value = parseFloat(str);
                if (p.minValue != undefined && p.minValue > value) return false;
                if (p.maxValue != undefined && p.maxValue < value) return false;
                return true;
            } else if (p.type == 'int') {
                if (!g._isInt(str)) return false;
                var value = parseInt(str);
                if (p.minValue != undefined && p.minValue > value) return false;
                if (p.maxValue != undefined && p.maxValue < value) return false;
                return true;
            } else if (p.type == 'time') {
                return g._isTime(str);
            }
            return false;
        },
        _getVerifyValue: function (value) {
            var g = this, p = this.options;
            var newvalue = null;
            if (p.type == 'float') {
                newvalue = g._round(value, p.decimalplace);
            }
            else if (p.type == 'int') {
                newvalue = parseInt(value);
            } else if (p.type == 'time') {
                newvalue = value;
            }
            if (!g._isVerify(newvalue)) {
                return g.value;
            } else {
                return newvalue;
            }
        },
        _isOverValue: function (value) {
            var g = this, p = this.options;
            if (p.minValue != null && p.minValue > value) return true;
            if (p.maxValue != null && p.maxValue < value) return true;
            return false;
        },
        _getDefaultValue: function () {
            var g = this, p = this.options;
            if (p.type == 'float' || p.type == 'int') { return 0; }
            else if (p.type == 'time') { return "00:00"; }
        },
        _addValue: function (num) {
            var g = this, p = this.options;
            var value = g.inputText.val();
            value = parseFloat(value) + num;
            if (g._isOverValue(value)) return;
            g._showValue(value);
            g.inputText.trigger("change");
        },
        _addTime: function (minute) {
            var g = this, p = this.options;
            var value = g.inputText.val();
            var a = value.match(/^(\d{1,2}):(\d{1,2})$/);
            newminute = parseInt(a[2]) + minute;
            if (newminute < 10) newminute = "0" + newminute;
            value = a[1] + ":" + newminute;
            if (g._isOverValue(value)) return;
            g._showValue(value);
            g.inputText.trigger("change");
        },
        _uping: function () {
            var g = this, p = this.options;
            if (p.type == 'float' || p.type == 'int') {
                g._addValue(p.step);
            } else if (p.type == 'time') {
                g._addTime(p.step);
            }
        },
        _downing: function () {
            var g = this, p = this.options;
            if (p.type == 'float' || p.type == 'int') {
                g._addValue(-1 * p.step);
            } else if (p.type == 'time') {
                g._addTime(-1 * p.step);
            }
        },
        _isDateTime: function (dateStr) {
            var g = this, p = this.options;
            var r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (r == null) return false;
            var d = new Date(r[1], r[3] - 1, r[4]);
            if (d == "NaN") return false;
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
        },
        _isLongDateTime: function (dateStr) {
            var g = this, p = this.options;
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
            var r = dateStr.match(reg);
            if (r == null) return false;
            var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6]);
            if (d == "NaN") return false;
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6]);
        }
    });


})(jQuery);