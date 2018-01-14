
(function ($) {
    $.fn.leeCheckList = function () {
        return $.leeUI.run.call(this, "leeUICheckList", arguments);
    };



    $.leeUIDefaults.CheckList = {
        rowSize: 4,            //每行显示元素数   
        url: null,              //数据源URL(需返回JSON)
        data: null,             //json数据
        valueField: 'id',       //保存值字段名
        textField: 'text',      //显示值字段名
        root: null,
        onChangeValue: null,
        onSuccess: null,
        onError: null,
        splitchar: ',',
        absolute: false  //选择框是否在附加到body,并绝对定位
    };

    $.leeUI.controls.CheckList = function (element, options) {
        $.leeUI.controls.CheckList.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.CheckList.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return 'CheckList';
        },
        __idPrev: function () {
            return 'CheckList';
        },
        _extendMethods: function () {
            return {};
        },
        _render: function () {
            var g = this, p = this.options;
            g.data = p.data;
            g.valueField = null; //隐藏域(保存值) 

            if ($(this.element).is(":hidden") || $(this.element).is(":text")) {
                g.valueField = $(this.element);
                if ($(this.element).is(":text")) {
                    g.valueField.hide();
                }
            } else {
                g.valueField = $('<input type="hidden"/>');
                g.valueField[0].id = g.valueField[0].name = g.id + "_val";
            }
            if (g.valueField[0].name == null) g.valueField[0].name = g.valueField[0].id;

            g.valueField.attr("data-leeid", g.id);
            if ($(this.element).is(":hidden") || $(this.element).is(":text")) {
                g.checkList = $('<div></div>').insertBefore(this.element);
            } else {
                g.checkList = $(this.element);
            }


            g.checkList.html('<div class="lee-radiolist-inner"><table cellpadding="0" cellspacing="0" border="0" class="lee-radiolist-table"></table></div>').addClass("lee-radiolist").append(g.valueField);

            g.checkList.table = $("table:first", g.radioList);

            p.value = g.valueField.val() || p.value;

            g.set(p);

            g._addClickEven();

        },
        destroy: function () {
            if (this.checkList) this.checkList.remove();
            this.options = null;
            $.leeUI.remove(this);
        },
        clear: function () {
            this._changeValue("");
            this.trigger('clear');
        },
        _setDisabled: function (value) {
            //禁用样式
            if (value) {
                this.checkList.addClass('lee-checklist-disabled');
                $("input:checkbox", this.checkList).attr("disabled", true);
            } else {
                this.checkList.removeClass('lee-checklist-disabled');
                $("input:checkbox", this.checkList).removeAttr("disabled");
            }
        },
        _setValue: function (value) {
            var g = this, p = this.options;
            g.valueField.val(value);
            p.value = value;
            this._dataInit();
        },
        setValue: function (value) {
            this._setValue(value);
        },
        clearContent: function () {
            var g = this, p = this.options;
            $("table", g.checkList).html("");
        },
        _setData: function (data) {
            this.setData(data);
        },
        setData: function (data) {
            var g = this, p = this.options;
            if (!data || !data.length) return;
            g.data = data;
            g.refresh();
            g.updateStyle();
        },
        refresh: function () {
            var g = this, p = this.options, data = this.data;
            this.clearContent();
            if (!data) return;
            var out = [], rowSize = p.rowSize, appendRowStart = false, name = p.name || g.id;
            for (var i = 0; i < data.length; i++) {
                var val = data[i][p.valueField], txt = data[i][p.textField], id = g.id + "-" + i;
                var newRow = i % rowSize == 0;
                //0,5,10
                if (newRow) {
                    if (appendRowStart) out.push('</tr>');
                    out.push("<tr>");
                    appendRowStart = true;
                }
                out.push("<td><input type='checkbox' name='" + name + "' value='" + val + "' id='" + id + "'/><label for='" + id + "'>" + txt + "</label></td>");
            }
            if (appendRowStart) out.push('</tr>');
            g.checkList.table.append(out.join(''));
            $("input[type='checkbox']", g.checkList).leeCheckBox();
        },
        _getValue: function () {
            var g = this, p = this.options, name = p.name || g.id;

            var arr = $('input:checkbox[name="' + name + '"]:checked');
            var result = [];
            $.each(arr, function (i, ele) {
                var val = $(ele).val();
                result.push(val);
            });
            return result.join(p.splitchar);
        },
        getValue: function () {
            var val = this._getValue();
            if (!val) val = "";
            //获取值
            return val;
        },
        updateStyle: function () {
            var g = this, p = this.options;
            g._dataInit();
            //$(":checkbox", g.element).change(function () {
            //    var value = g.getValue();
            //    g.trigger('select', [{
            //        value: value
            //    }]);
            //});
        },
        _dataInit: function () {
            var g = this, p = this.options, name = p.name || g.id;
            var value = g.valueField.val();
            if (value == "") {
                $("input:checkbox[name='" + name + "']", g.checkList).each(function () {
                    //this.checked = false;

                    $(this).leeUI().setValue(false);
                });
                return;
            }
            var valuearr = value.split(p.splitchar);

            $("input:checkbox[name='" + name + "']", g.checkList).each(function () {
                var flag = false;
                if ($.inArray(this.value, valuearr) != -1) {
                    flag = true;
                }
                $(this).leeUI().setValue(flag);
            });

            //g._changeValue(value);

        },
        _setRequired: function (flag) {
        },
        _changeValue: function (newValue) {
            var g = this, p = this.options, name = p.name || g.id;
            $("input:checkbox[name='" + name + "']", g.checkList).each(function () {
                this.checked = this.value == newValue;
            });
            g.valueField.val(newValue);
            g.selectedValue = newValue;
        },
        _addClickEven: function () {
            var g = this, p = this.options;
            //选项点击
            g.checkList.click(function (e) {
                var value = g.getValue();
                if (value) g.valueField.val(value);
            });
        }
    });


})(jQuery);