(function ($) {

    $.fn.leePopup = function (options) {
        return $.leeUI.run.call(this, "leeUIPopup", arguments);
    };
    $.leeUIDefaults.Popup = {
        valueFieldID: null, //生成的value input:hidden 字段名
        onButtonClick: null, //利用这个参数来调用其他函数，比如打开一个新窗口来选择值 
        nullText: null, //不能为空时的提示
        disabled: false, //是否无效
        cancelable: true,
        width: null,
        heigth: null,
        onValuechange: null,
        render: null, //显示函数   
        split: ';',
        data: [],
        condition: null, // 条件字段,比如 {fields:[{ name : 'Title' ,op : 'like', vt : 'string',type:'text' }]}
        valueField: 'id', //值字段
        textField: 'text', //显示字段
        parms: null
    };

    $.leeUI.controls.Popup = function (element, options) {
        $.leeUI.controls.Popup.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.Popup.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return 'Popup';
        },
        _init: function () {
            $.leeUI.controls.Popup.base._init.call(this);
        },
        _render: function () {
            var g = this,
				p = this.options;
            g.inputText = null;
            //文本框初始化
            if (this.element.tagName.toLowerCase() == "input") {
                this.element.readOnly = true;
                g.inputText = $(this.element);
                g.textFieldID = this.element.id;
            }
            if (g.inputText[0].name == undefined) g.inputText[0].name = g.textFieldID;
            //隐藏域初始化
            g.valueField = null;
            if (p.valueFieldID) {
                g.valueField = $("#" + p.valueFieldID + ":input");
                if (g.valueField.length == 0) g.valueField = $('<input type="hidden"/>');
                if (g.valueField[0].name == undefined) g.valueField[0].id = g.valueField[0].name = p.valueFieldID;
            } else {
                g.valueField = $('<input type="hidden"/>');
                g.valueField[0].id = g.valueField[0].name = g.textFieldID + "_val";
            }
            if (g.valueField[0].name == undefined) g.valueField[0].name = g.valueField[0].id;
            //开关

            g.link = $('<div class="lee-right"><div class="lee-icon lee-icon-search popup"></div></div>');
            //外层
            g.wrapper = g.inputText.wrap('<div class="lee-text lee-text-popup"></div>').parent();

            g.wrapper.append(g.link);
            g.wrapper.append(g.valueField);
            //修复popup控件没有data-ligerid的问题
            g.valueField.attr("data-ligerid", g.id);
            g.inputText.addClass("lee-text-field");
            //开关 事件
            g.link.hover(function () {
                if (p.disabled) return;
                $(this).addClass("lee-right-hover");
                //this.className = "lee-right-hover";
            }, function () {
                if (p.disabled) return;
                $(this).removeClass("lee-right-hover");
                //this.className = "lee-right-hover";
            }).mousedown(function () {
                if (p.disabled) return;
                $(this).addClass("lee-right-pressed");
                //this.className = "lee-right-pressed";
            }).mouseup(function () {
                if (p.disabled) return;
                $(this).removeClass("lee-right-pressed");
                //this.className = "lee-right-pressed"";
            }).click(function () {
                if (p.disabled) return;
                if (g.trigger('buttonClick', g) == false) return false;
            });

            g.inputText.click(function () {
                if (p.disabled) return;
            }).blur(function () {
                if (p.disabled) return;
                g.wrapper.removeClass("lee-text-focus");
            }).focus(function () {
                if (p.disabled) return;
                g.wrapper.addClass("lee-text-focus");
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
        destroy: function () {
            if (this.wrapper) this.wrapper.remove();
            this.options = null;
            $.leeUI.remove(this);
        },
        clear: function () {
            var g = this,
				p = this.options;
            if (g.getValue() == "") {
                return; //如果是空的话不触发值值改变事件
            }
            g.inputText.val("");
            g.valueField.val("");
            g.trigger("valuechange", {});
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
                this.wrapper.addClass('lee-text-disabled');
            } else {
                this.wrapper.removeClass('lee-text-disabled');
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
        getData: function () {
            var g = this,
				p = this.options;
            var data = [];
            var v = $(g.valueField).val(),
				t = $(g.inputText).val();
            var values = v ? v.split(p.split) : null,
				texts = t ? t.split(p.split) : null;
            $(values).each(function (i) {
                var o = {};
                o[p.textField] = texts[i];
                o[p.valueField] = values[i];
                data.push(o);
            });
            return data;
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
                return;
            }
            g.valueField.val(value);
            //g.setTextByVal(value);
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
        },
        addValue: function (value, text) {
            var g = this,
				p = this.options;
            if (!value) return;
            var v = g.getValue(),
				t = g.getText();
            if (!v) {
                g.setValue(value);
                g.setText(text);
            } else {
                var arrV = [],
					arrT = [],
					old = v.split(p.split),
					value = value.split(p.split),
					text = text.split(p.split);
                for (var i = 0, l = value.length; i < l; i++) {
                    if ($.inArray(value[i], old) == -1) {
                        arrV.push(value[i]);
                        arrT.push(text[i]);
                    }
                }
                if (arrV.length) {
                    g.setValue(v + p.split + arrV.join(p.split));
                    g.setText(t + p.split + arrT.join(p.split));
                }
            }
        },
        removeValue: function (value, text) {
            var g = this,
				p = this.options;
            if (!value) return;
            var v = g.getValue(),
				t = g.getText();
            if (!v) return;
            var oldV = v.split(p.split),
				oldT = t.split(p.split),
				value = value.split(p.split);
            for (var i = 0, index = -1, l = value.length; i < l; i++) {
                if ((index = $.inArray(value[i], oldV)) != -1) {
                    oldV.splice(index, 1);
                    oldT.splice(index, 1);
                }
            }
            g.setValue(oldV.join(p.split));
            g.setText(oldT.join(p.split));
        }
    });

    //*帮助分两种模式 一种是简单帮助 一种是 iframe帮助*
    $.leeUI.PopUpHelp = function (options) {
        var url = options.url;
        var textField = options.textField;
        var valueField = options.valueField;
        var filedList = []; //字段列表

        var title = options.title || "请选择";
        return function () {
            var g = this;
            var grid = $("<div></div>");
            var gridm;
            $.leeDialog.open({
                title: "选择数据源",
                width: "600",
                height: '400',
                target: grid,
                isResize: true,
                onContentHeightChange: function (height) {

                    //return false;
                },
                onStopResize: function () {

                },
                buttons: [{
                    text: '选择',
                    cls: 'lee-btn-primary lee-dialog-btn-ok',
                    onclick: function (item, dialog) {
                        //toSelect();

                        var selected = gridm.getSelected();
                        if (selected) {
                            g.setText(selected.name);
                            g.setValue(selected.name);
                            g.trigger("valuechange", selected);
                            dialog.close();
                        } else {
                            leeUI.Error("请选中要操作的数据！");
                        }
                        //alert(selected.name);

                    }
                },
					{
					    text: '取消',
					    cls: 'lee-dialog-btn-cancel ',
					    onclick: function (item, dialog) {
					        dialog.close();
					    }
					}
                ]
            });
            gridm = grid.leeGrid({
                columns: [{
                    display: '编号',
                    name: 'code',
                    align: 'left',
                    width: 100,
                    minWidth: 60
                },
					{
					    display: '名称',
					    name: 'name',
					    align: 'left',
					    width: 100,
					    minWidth: 60
					}
                ],
                alternatingRow: false,
                method: "get",
                url: 'data/datamodel.json',
                dataAction: 'server', //服务器排序
                usePager: true, //服务器分页
                pageSize: 20,
                inWindow: false,
                height: "100%",
                rownumbers: true,
                rowHeight: 30
            });
        }
    }

    $.leeUI.PopUp = {};
    //$injector 需要实现的接口有 

    $.leeUI.PopUp.LookupInjector = function (options) {
        this.options = options;
        this.init();
    }

    $.leeUI.PopUp.LookupInjector.prototype = {
        init: function () {
            var g = this,
				p = this.options;
            var self = this;
            this.wrap = $("<div style='position:absolute;top:1px;left:1px;bottom:1px;right:1px;'></div>");
            this.search = $("<div class='lee-text'></div>");
            this.grid = $("<div class='helpgrid' ></div>");


            //this.wrap.append(this.search).append(this.grid);

            if (p.filter) {
                this.$searchwrap = $('<div class="lee-search-wrap" style="float:none;margin:5px;"><input style="width:100%;" class="lee-search-words" type="text"   placeholder="请输入查询关键字"><button class="search lee-ion-search" type="button" style="position: absolute;right: 0;"></button></div>');
                this.wrap.append(this.$searchwrap);
                this.$input = $(this.$searchwrap.find("input"));
                this.$btn = $(this.$searchwrap.find("button"));

                this.$btn.click(function () {
                    self.gridm.loadData(true);
                });
                this.$input.keydown(function (event) {
                    if (event.keyCode == 13) {
                        self.gridm.loadData(true);
                    }

                });
            }

            this.wrap.append(this.grid);

        },
        getParams: function () {
            var res = [];
            res.push({ name: "keyword", value: this.$input.val() });
            return res;
        },
        initUI: function () {
            var g = this,
				p = this.options;
            if (!this.gridm) {
                this.gridm = this.grid.leeGrid({
                    columns: p.column,
                    alternatingRow: false,
                    method: p.method,
                    url: p.url,
                    dataAction: 'server', //服务器排序
                    usePager: true, //服务器分页
                    pageSize: 50,
                    inWindow: false,
                    height: "100%",
                    parms: $.proxy(this.getParams, this),
                    rownumbers: true,
                    rowHeight: 30,
                    checkbox: p.checkbox || false
                });
            } else {
                this.gridm.loadData(true);
            }

        },
        clearSearch: function () {

        },
        getOptions: function () {
            return this.options;
        },
        clear: function () {

        },
        getRenderDom: function () {
            return this.wrap;
        },

        onResize: function () { },
        onConfirm: function (popup, dialog, $injector) {
            var p = $injector.options;
            var selected = $injector.gridm.getSelectedRows();
            if (selected.length > 0) {
                if (p.checkbox) {

                } else {
                    var beforvalue = popup.getValue();
                    popup.setText(selected[0][p.textfield || "text"]);
                    popup.setValue(selected[0][p.valuefield || "id"]);
                    if (beforvalue !== selected[0][p.valuefield || "id"]) {
                        popup.trigger("valuechange", selected[0]);
                    }


                }
                return true;
            }
            leeUI.Warning("没有选中记录");
            return false;
        }
    };

    $.leeUI.PopUp.Lookup = function ($injector) {
        var options = $injector.getOptions();
        var title = options.title || "请选择";

        return function () {
            var g = this;
            $.leeDialog.open({
                title: title,
                width: options.width || 600,
                height: options.height || 400,
                target: $injector.getRenderDom(),
                isResize: true,
                overflow: "hidden",
                onContentHeightChange: function (height) {
                    $injector.onResize.call(this, g);
                },
                onStopResize: function () {
                    $injector.onResize.call(this, g);
                },
                buttons: [{
                    text: '确定',
                    cls: 'lee-btn-primary lee-dialog-btn-ok',
                    onclick: function (item, dialog) {

                        if ($injector.onConfirm.call(this, g, dialog, $injector)) {
                            dialog.close();
                        }
                    }
                },
					{
					    text: '取消',
					    cls: 'lee-dialog-btn-cancel ',
					    onclick: function (item, dialog) {
					        dialog.close();
					    }
					}
                ]
            });
            $injector.initUI();

        }
    }

    //  
    //  $.leeUI.getPopupFn = function (p,master)
    //  {
    //      p = $.extend({
    //          title: '选择数据',     //窗口标题
    //          width: 700,            //窗口宽度     
    //          height: 320,           //列表高度
    //          top: null,
    //          left: null,
    //          split: ';',
    //          valueField: null,    //接收表格的value字段名
    //          textField: null,     //接收表格的text字段名
    //          grid: null,          //表格的参数 同ligerGrid
    //          condition: null,     //搜索表单的参数 同ligerForm
    //          onSelect: function (p) { },   //选取函数 
    //          searchClick : p.searchClick,
    //          selectInit: function (rowdata) { return false }  //选择初始化
    //      }, p);
    //      if (!p.grid) return;
    //      var win, grid, condition, lastSelected = p.lastSelected || [];
    //      return function ()
    //      {
    //          show();
    //          return false;
    //      };
    //      function show()
    //      {
    //          function getGridHeight(height)
    //          {
    //              height = height || p.height;
    //              height -= conditionPanel.height();
    //              return height;
    //          }
    //          if (win)
    //          {
    //              grid._showData();
    //              win.show();
    //              grid.refreshSize();
    //              lastSelected = grid.selected.concat();
    //              return;
    //          }
    //          var panle = $("<div></div>");
    //          var conditionPanel = $("<div></div>");
    //          var gridPanel = $("<div></div>");
    //          panle.append(conditionPanel).append(gridPanel);
    //          
    //          if (p.condition)
    //          { 
    //              var conditionParm = $.extend({
    //                  labelWidth: 60,
    //                  space: 20
    //              }, p.condition);
    //              setTimeout(function ()
    //              {
    //                  condition = conditionPanel.ligerForm(conditionParm);
    //              }, 50);
    //          } else
    //          {
    //              conditionPanel.remove();
    //          }
    //          var gridParm = $.extend({
    //              columnWidth: 120,
    //              alternatingRow: false,
    //              frozen: true,
    //              rownumbers: true
    //          }, p.grid, {
    //              width: "100%",
    //              height: getGridHeight(),
    //              isChecked: p.selectInit,
    //              isSelected: p.selectInit,
    //              inWindow: false
    //          });
    //          //grid
    //          grid = gridPanel.ligerGrid(gridParm);
    //          //搜索按钮
    //          if (p.condition)
    //          {
    //             
    //              setTimeout(function ()
    //              {
    //                  var containerBtn1 = $('<li style="margin-right:9px"><div></div></li>');
    //                  $("ul:first", conditionPanel).append(containerBtn1).after('<div class="l-clear"></div>');
    //                  $("div", containerBtn1).ligerButton({
    //                      text: '搜索',
    //                      click: function ()
    //                      { 
    //                          var rules = condition.toConditions();
    //                          if (p.searchClick)
    //                          {
    //                              p.searchClick({
    //                                  grid: grid,
    //                                  rules: rules
    //                              });
    //                          } else
    //                          {
    //                              if (grid.get('url'))
    //                              {
    //                                  grid.setParm(grid.conditionParmName || 'condition', $.ligerui.toJSON(rules));
    //                                  grid.reload();
    //                              } else
    //                              {
    //                                  grid.loadData($.ligerFilter.getFilterFunction(rules));
    //                              }
    //                          }
    //                      }
    //                  });
    //              }, 100);
    //          }
    //          //dialog
    //          win = $.ligerDialog.open({
    //              title: p.title,
    //              width: p.width,
    //              height: 'auto',
    //              top: p.top,
    //              left: p.left,
    //              target: panle,
    //              isResize: true,
    //              cls: 'l-selectorwin',
    //              onContentHeightChange: function (height)
    //              {
    //                  grid.set('height', getGridHeight(height));
    //                  return false;
    //              },
    //              onStopResize: function ()
    //              {
    //                  grid.refreshSize();
    //              },
    //              buttons: [
    //               { text: '选择', onclick: function (item, dialog) { toSelect(); dialog.hide(); } },
    //               { text: '取消', onclick: function (item, dialog) { dialog.hide(); } }
    //              ]
    //          });
    //
    //          if (master)
    //          {
    //              master.includeControls = master.includeControls || [];
    //              master.includeControls.push(win);
    //          }
    //          grid.refreshSize();
    //      }
    //      function exist(value, data)
    //      {
    //          for (var i = 0; data && data[i]; i++)
    //          {
    //              var item = data[i];
    //              if (item[p.valueField] == value) return true;
    //          }
    //          return false;
    //      }
    //      function toSelect()
    //      {
    //          var selected = grid.selected || [];
    //          var value = [], text = [], data = [];
    //          $(selected).each(function (i, rowdata)
    //          {
    //              p.valueField && value.push(rowdata[p.valueField]);
    //              p.textField && text.push(rowdata[p.textField]);
    //              var o = $.extend(true, {}, this);
    //              grid.formatRecord(o, true);
    //              data.push(o);
    //          });
    //          var unSelected = [];
    //          $(lastSelected).each(function (i, item)
    //          {
    //              if (!exist(item[p.valueField], selected) && exist(item[p.valueField], grid.rows))
    //              {
    //                  unSelected.push(item);
    //              }
    //          });
    //          var removeValue = [], removeText = [], removeData = [];
    //          $(unSelected).each(function (i, rowdata)
    //          {
    //              p.valueField && removeValue.push(rowdata[p.valueField]);
    //              p.textField && removeText.push(rowdata[p.textField]);
    //              var o = $.extend(true, {}, this);
    //              grid.formatRecord(o, true);
    //              removeData.push(o);
    //          });
    //          p.onSelect({
    //              value: value.join(p.split),
    //              text: text.join(p.split),
    //              data: data,
    //              remvoeValue: removeValue.join(p.split),
    //              remvoeText: removeText.join(p.split),
    //              removeData: removeData
    //          });
    //      }
    //  };

})(jQuery);