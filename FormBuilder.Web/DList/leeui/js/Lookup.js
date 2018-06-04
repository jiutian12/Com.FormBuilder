(function ($) {

    $.fn.leeLookup = function (options) {
        return $.leeUI.run.call(this, "leeUILookup", arguments);
    };
    $.leeUIDefaults.Lookup = {
        helpID: "", //帮助ID
        modelID: "",
        valueField: 'Code', //值字段
        textField: "Name",//显示字段
        codeField: "",//检索字段
        returnFields: [],//返回字段
        mapFields: [],//赋值字段
        dgHeight: "380",
        title: "请选择",
        dgWidth: "550",
        type: "", //类型 1.页面内 2.新页面 
        nameSwitch: true,
        dockType: "", //1.下拉 2.侧边栏
        isTree: "", //是否树形
        childOnly: false,// 只选明细
        isMul: false, //是否多选
        checkbox: false,
        isMulGrid: false,// 多选你分为两种模式、1.多条，2.子表回弹
        isAuto: true, //启用检索
        url: _global.sitePath + "/Runtime/ListLookup?dataid=",//帮助预览地址
        cancelable: true,
        render: null, //显示函数   
        split: ',', //多选分隔符
        condition: null, // 条件字段,比如 {fields:[{ name : 'Title' ,op : 'like', vt : 'string',type:'text' }]}
        onBeforeOpen: null,
        textmode: false
    };
    $.leeUI.controls.Lookup = function (element, options) {
        $.leeUI.controls.Popup.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.Lookup.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return 'Lookup';
        },
        _init: function () {
            $.leeUI.controls.Lookup.base._init.call(this);
        },
        _render: function () {
            var g = this,
				p = this.options;
            g.inputText = null;
            //文本框初始化
            if (this.element.tagName.toLowerCase() == "input") {
                //this.element.readOnly = true;
                g.inputText = $(this.element); //记录初始控件
                g.textFieldID = this.element.id;
            }
            //g.valueField = null;
            g.defer = null;
            g.valueField = $('<input type="hidden"/>');
            g.valueField[0].id = g.valueField[0].name = g.textFieldID + "_val";


            g.link = $('<div class="lee-right"><div class="lee-icon lee-ion-android-more-horizontal popup"></div></div>');
            //外层
            g.wrapper = g.inputText.wrap('<div class="lee-text lee-text-popup"></div>').parent();

            g.wrapper.append(g.link);
            g.wrapper.append(g.valueField);
            //修复popup控件没有data-ligerid的问题
            g.valueField.attr("data-uiid", g.id);

            g.valueField.data("beforeText", "").data("beforeValue", "");
            g.inputText.addClass("lee-text-field");

            if (!p.nameSwitch) {
                g.inputText.attr("readonly", "readonly");
            }
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
                g.openLookup();
            });
            g.inputText.data("otext", "");
            g.inputText.data("ovalue", "");
            //文本框增加事件绑定
            g.inputText.click(function () {
                if (p.disabled) return;
            }).blur(function () {
                if (p.disabled) return;
                g.wrapper.removeClass("lee-text-focus");
            }).focus(function () {
                if (p.disabled) return;
                g.wrapper.addClass("lee-text-focus");
            });
            g.inputText.bind("keydown", function (e) {

                if (e.keyCode == "13") {
                    g.inputText.trigger("change");
                }

            });
            g.inputText.on("change", function (e) {
                if (!p.nameSwitch) return;
                var otext = g.valueField.data("beforeText");//原来的名称
                var ovalue = g.valueField.data("beforeValue");//原来的value


                g.onTextSearch.call(g, e, otext, ovalue);

            });

            g.wrapper.hover(function () {
                if (p.disabled) return;
                g.wrapper.addClass("lee-text-over");
            }, function () {
                if (p.disabled) return;
                g.wrapper.removeClass("lee-text-over");
            });

            g.set(p);
            //g.setTextByVal(g.getValue());
            //alert(g.getValue());
        },
        setAchorLoading: function () {
            var g = this, p = this.options;
            g.link.addClass("loading");
            g.link.find(".popup").addClass("lee-ion-load-d");
        },
        setAchorNormal: function () {
            var g = this, p = this.options;
            g.link.removeClass("loading");
            g.link.find(".popup").removeClass("lee-ion-load-d");
        },
        onTextSearch: function (e, otext, ovalue) {
            var g = this, p = this.options;

            if (g.inputText.val() == "") {
                g.setValue("", "");
                return;
            }
            if (g.inputText.val() == otext) return;
            g.defer = $.Deferred();//创建一个异步promise
            g.getQueryResult(g.inputText.val());
            //var res = { Code: "0101", Name: "哈哈哈" };//查询结果
            //g.setValue(res[p.valueField], res[p.textField]);
            //g.trigger("valuechange", res); // 触发值改变事件
            ////如果没有匹配 那么则把text改成原来的 并给予提示
        },
        getDefer: function () {
            var g = this;
            if (g.defer) {
                return g.defer.promise();
            }
            return null;
        },
        getQueryResult: function (value) {
            //getModelDataByDataID
            var g = this;
            if (g.query) return;
            g.query = true;
            var g = this, p = this.options;
            if (p.service) {
                g.setAchorLoading();
                var filter = "";
                if (p.getFilter) {
                    filter = JSON.stringify(p.getFilter());
                }
                p.service.getQueryHelpSwitch(p.helpID, value, p.codeField, p.textField, filter, false).done(function (data) {
                    if (g.defer)
                        g.defer.resolve(data);
                    if (data.res) {
                        var arr = data.data;

                        if (arr.length > 1 || arr.length == 0) {

                            if (p.textmode && arr.length == 0) {
                                var obj = {};
                                obj[p.textField] = obj[p.valueField] = value;
                                g.inputText.val(value);
                                g.valueField.val(value);
                                g.confirmSelect([obj]);
                                g.query = false;
                            } else {
                                g.setKeyword(value);
                                g.openLookup();
                            }
                        }
                        else {
                            g.confirmSelect(arr);// 触发选中事件 
                            g.query = false;
                        }
                    }
                    else {
                        g.query = false;
                    }
                    g.defer = null;
                }).fail(function (data) {
                    console.log("失败");

                }).always(function () {
                    g.setAchorNormal();
                });
            }
        },
        destroy: function () {
            if (this.wrapper) this.wrapper.remove();
            this.options = null;
            $.leeUI.remove(this);
        },
        clear: function () {
            var g = this,
				p = this.options;
            g.inputText.val("");
            g.valueField.val("");
            g.curData = null;
            g.trigger("valuechange", {}); // 清空触发值改变事件

            var srcCtrl = g.textFieldID;
            if (p.gridEditParm) srcCtrl = p.gridEditParm.column.columnname;

            g.trigger('clearValue', [g, p, {}, srcCtrl]);
        },
        getLookUpContext: function () {

            // 如果parent有dialog对象则用parentdialog

            var dgContext = this.getContext().document.getElementById('lookupwindow').contentWindow;
            return dgContext.lookupHelper;
        },
        getContext: function () {
            if (window.parent && window.parent.$ && window.parent.$.leeDialog) {
                return window.parent;
            }
            return window;
        },
        setKeyword: function (value) {
            this.keyword = value;
        },
        getKeyword: function (value) {
            return this.keyword;
        },
        dealcolse: function () {
            var g = this, p = this.options;
            g.setKeyword("");
            if (g.inputText.data("otext") !== g.inputText.val()) {
                //alert(1);
                g.inputText.val(g.inputText.data("otext"));
            }
            g.query = false;
        },
        openLookup: function () {
            var g = this, p = this.options;
            // 如果parent页面有dialog对象 则采用parent
            if (g.isopen) return; //如果已经弹出则不允许弹出了
            g.isopen = true;
            var $openDg = this.getContext().$.leeDialog.open({
                title: p.title,
                name: 'lookupwindow',
                isHidden: false,
                showMax: true,
                width: p.dgWidth,
                slide: false,
                height: p.dgHeight,
                onclose: function () {
                    g.dealcolse();
                    g.isopen = false;
                },
                url: p.url + p.helpID,
                onLoaded: function () {
                    //alert(1);
                    var lookupHelper = g.getLookUpContext();
                    lookupHelper.init();
                    lookupHelper.setOptions({
                        textField: p.textField,
                        codeField: p.codeField,
                        checkbox: p.checkbox,
                        isMul: p.isMul || p.isMulGrid,
                        isChildOnly: p.isChildOnly,
                        async: p.async,
                        filter: p.getFilter(),//获取帮助的过滤条件
                        keyword: g.getKeyword()
                    });
                    lookupHelper.showView();
                },
                buttons: [
                    {
                        id: "dialog_lookup_ok",
                        text: '选择',
                        cls: 'lee-btn-primary lee-dialog-btn-ok',
                        onclick: function (item, dialog) {
                            // leeUI.Error("请选中要操作的数据！");


                            var res = g.getLookUpContext().getReturnValue();
                            if (!res) {
                                if (res === false) {

                                } else {
                                    g.getContext().leeUI.Error("请选中要操作的数据！");
                                }
                            }
                            else {

                                g.confirmSelect(res);

                                //单选 多选 触发值改变事件
                                //alert(value);
                                $openDg.close();
                                g.dealcolse();
                                g.isopen = false;
                                g.setKeyword("");
                            }
                        }
                    },
                    {
                        text: '取消',
                        cls: 'lee-dialog-btn-cancel ',
                        onclick: function (item, dialog) {
                            g.dealcolse();
                            g.isopen = false;
                            $openDg.close();

                        }
                    }
                ]
            });
        },
        confirmSelect: function (data) {
            var g = this, p = this.options;
            //触发选中值事件

            var srcCtrl = g.textFieldID;
            if (p.gridEditParm) srcCtrl = p.gridEditParm.column.columnname;
            if (p.isMul && !p.gridEditParm) {
                //批量赋值
                var namearr = [];
                var textarr = [];
                for (var item in data) {
                    textarr.push(data[item][p.textField]);
                    namearr.push(data[item][p.valueField]);
                }
                g.setValue(namearr.join(";"), namearr.join(";"));
            }
            else {
                //单行赋值
                var value = data[0][p.valueField];
                var text = data[0][p.textField];
                g.setValue(value, text);
            }
            g.curData = data;
            g.trigger('change');
            //
            g.trigger('confirmSelect', [g, p, data, srcCtrl]);

        },
        getCurData: function () {
            return this.curData;
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
                g.clear();
            });
        },
        _setDisabled: function (value) {
            if (value) {
                this.options.disabled = true;
                this.wrapper.addClass('lee-text-disabled');
                this.inputText.attr("readonly", "readonly");
            } else {
                this.options.disabled = false;
                this.wrapper.removeClass('lee-text-disabled');
                if (this.options.nameSwitch)
                    this.inputText.removeAttr("readonly");
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
            var g = this;
            if (value > 20) {
                g.wrapper.css({
                    width: value
                });
                //g.inputText.css({ width: value - 20 });
            }
        },
        _setHeight: function (value) {
            var g = this;
            if (value > 10) {
                g.wrapper.height(value);
                //g.inputText.height(value - 2);
            }
        },
        _getText: function () {
            return $(this.inputText).val();
        },
        _getValue: function () {
            return $(this.valueField).val();
        },
        getValue: function () {
            return this._getValue();
        },
        getText: function () {
            return this._getText();
        },
        //设置值到  隐藏域
        setValue: function (value, text) {
            //if (value == '') return;
            var g = this,
                p = this.options;
            if (arguments.length >= 2) {
                g.setValue(value);
                g.setText(text);
                g.inputText.data("otext", text);
                g.inputText.data("ovalue", value);
                return;
            }
            g.valueField.val(value);
        },
        //设置值到 文本框 
        setText: function (text) {
            var g = this,
                p = this.options;
            if (p.render) {
                g.inputText.val(p.render(text));
            } else {
                g.inputText.val(text);
            }
        }
    });

})(jQuery);