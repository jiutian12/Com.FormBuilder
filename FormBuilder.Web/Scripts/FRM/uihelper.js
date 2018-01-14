
/*常见组件封装 脚本弹窗编辑器 帮助映射等组件 tab页属性配置 过滤条件配置*/
var PopUp = function (ele, options) {
    this.$ele = $(ele);
    this.options = $.extend({},
		PopUp.DEFAULTS,
		$.isPlainObject(options) && options);
    this.init();
}
PopUp.DEFAULTS = {};
PopUp.prototype = {
    init: function () {
        //构造界面样式
        this.$ele.attr("readonly", "readonly");
        this.main = this.$ele.wrap("<div class='ui-popup'></div>").parent();
        this.linkbtn = $("<i class='fa fa-cog helper'></i>")
        this.main.append(this.linkbtn);
        this.bind();
    },
    bind: function () {
        var self = this;
        this.linkbtn.on("click", function () {
            self.openEditor();
        });
        this.$ele.on("click", function () {
            self.openEditor();
        })
    },
    openEditor: function () {
        //$("#editor").show();
        var self = this;
        AceEditor.setValue(this.getValue());
        this.dialog = layer.open({
            type: 1,
            content: $("#editor"),
            area: ['700px', '395px'],
            maxmin: true,
            title: "脚本编辑器",
            btn: ['确认'],
            yes: function (index, layero) {
                var data = AceEditor.getValue();
                self.setValue(data);
                layer.close(self.dialog)
                return true;
            }
        });
        layer.full(this.dialog);
    },
    setValue: function (val) {
        this.$ele.data("code", val);
        this.$ele.val(val);
        this.$ele.trigger("change");
    },
    getValue: function () {

        if (this.$ele.data("code")) {
            return this.$ele.data("code");
        }
        return "";

    }
};

$.fn.popup = function (option) {
    var args = [].slice.call(arguments, 1);

    return this.each(function () {
        var $this = $(this);
        var data = $this.data("PopUp");
        var options;
        var fn;
        if (!data) {
            if (/destroy/.test(option)) {
                return;
            }
            options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
            $this.data("PopUp", (data = new PopUp(this, options)));
        }

        if (typeof option === 'string' && $.isFunction(fn = data[option])) {
            fn.apply(data, args);
        }
    });
};

$.fn.popup.Constructor = PopUp;

var AceCodeEditor = function (id) {
    this.init(id);
}
AceCodeEditor.prototype = {
    init: function (id) {
        this.ele = $("#" + id);
        this.editor = ace.edit("editor");
        this.editor.setTheme("ace/theme/twilight");
        this.editor.session.setMode("ace/mode/javascript");
    },
    bind: function () {

    },
    setValue: function (value) {
        this.editor.setValue(value);
    },
    getValue: function () {
        return this.editor.getValue();
    }
};

//实例化
var AceEditor = new AceCodeEditor("editor");
/*tab页属性编辑器*/
var TabSetManger = function () { }

TabSetManger.prototype = {
    init: function () { },
    setValue: function (layoutid) {
        //获取layout里边的column 进行数据初始
        this.id = layoutid;
        this.initGrid();
    },
    initGrid: function () {
        var options = leeManger.getTabOptions(this.id);
        this.grid = $(".tabset");
        var columnData = {
            Rows: options
        }
        //this.girdm.destory();
        this.girdm = this.grid.leeGrid({
            columns: [{
                display: 'ID',
                name: 'id',
                width: 160,
                align: 'left'
            },
				{
				    display: '显示名',
				    name: 'label',
				    width: 200,
				    align: 'left',
				    editor: {
				        type: 'text'
				    }
				},
				{
				    display: "操作",
				    width: 80,
				    render: function (g, rowindex, value, column, length) {
				        return "</a><a onclick=\"delTabRow('" + g["__id"] + "')\"  href='javascript:void(0)' style='color:rgba(0, 0, 0, 0.8);margin:0 3px;'><i class='fa fa-minus'></i></a>";
				    }
				},
				{
				    display: "顺序",
				    width: 80,
				    render: function (g, rowindex, value, column, length) {
				        var html = [];
				        if (rowindex != 0) {
				            html.push("<a onclick=\"upTabRow('" + g["__id"] + "')\" href='javascript:void(0)' style='color:rgba(0, 0, 0, 0.8);margin:0 3px;'><i class='fa fa-chevron-up'></i></a>");
				        }

				        if (rowindex != length - 1) {
				            html.push("<a onclick=\"downTabRow('" + g["__id"] + "')\"  href='javascript:void(0)' style='color:rgba(0, 0, 0, 0.8);margin:0 3px;'><i class='fa fa-chevron-down'></i></a>");
				        }
				        return html.join("");
				    }
				}
            ],
            enabledEdit: true,
            rowHeight: 32,
            rownumbers: true,
            usePager: false,
            checkbox: false,
            inWindow: false,
            height: "100%",
            data: columnData
        });
        window.tabgrid = this.girdm;
    },
    openModal: function () {
        //打开配置信息 Grid编辑

        var self = this;
        this.dialog = layer.open({
            type: 1,
            content: self.grid,
            area: ['600px', '450px'],
            maxmin: true,
            title: "tab属性配置",
            btn: ['确认'],
            resizing: function () {
                self.girdm._onResize();
            },
            yes: function (index, layero) {
                self.refresh();
                layer.close(self.dialog)
                return true;
            }
        });
        this.girdm._onResize();
    },
    refresh: function () {
        //获取grid 列表 
        //获取到删除的column 移除
        //重新生成tab布局 
        var data = this.girdm.getData();
        var childs = leeManger.layout[this.id].childs;
        var newLayouts = [];
        var removeLayouts = [];

        $.each(data, function (i, row) {
            newLayouts.push(row["id"]);
            leeManger.columns[row.id].label = row.label;

        });
        $.each(childs, function (i, obj) {
            var id = obj.id;
            if ($.inArray(id, newLayouts) == -1) {
                removeLayouts.push(id);

            }
        });
        leeManger.refreshTabLayout(this.id, newLayouts, removeLayouts);

    }
};

var TabSet = new TabSetManger();

/*处理列tab页配置的grid的相关信息*/

function delTabRow(rowid) {
    var rowdata = tabgrid.getRow(rowid);
    tabgrid.remove(rowdata);
}

function upTabRow(rowid) {
    var rowData = tabgrid.getRow(rowid);
    tabgrid.up(rowData);
}

function downTabRow(rowid) {
    var rowData = tabgrid.getRow(rowid);
    tabgrid.down(rowData);
}
/*弹窗管理类 字符 映射等内容*/
//*字符串枚举编辑器*
var DropDownStringEditor = function () {

    return function () {
        var g = this;
        var sourcedata = [];
        var value = g.getValue();
        if (value != "") {
            sourcedata = eval(value);
        }

        var grid = $("<div></div>");
        var gridm;
        $.leeDialog.open({
            title: "请配置枚举字符",
            width: "500",
            height: '300',
            target: grid,
            overflow: "hidden",
            isResize: true,
            onContentHeightChange: function (height) {

                //return false;
            },
            onStopResize: function () {
                gridm._onResize();
            },
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    //toSelect();

                    var selected = gridm.getData();
                    if (selected.length > 0) {
                        g.setText(JSON.stringify(selected));
                        g.setValue(JSON.stringify(selected));
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
                display: 'key',
                name: 'key',
                align: 'left',
                width: 100,
                minWidth: 60,
                editor: {
                    type: 'text'
                }

            },
				{
				    display: 'value',
				    name: 'value',
				    align: 'left',
				    width: 100,
				    minWidth: 60,
				    editor: {
				        type: 'text'
				    }
				}
            ],
            toolbar: {
                items: [{
                    text: '添加',
                    click: function () {
                        gridm.addRow({
                            key: "",
                            value: ""
                        });
                    }
                }, {
                    line: true
                },
					{
					    text: '删除',
					    click: function () {
					        gridm.deleteRow(gridm.getSelected());
					    }
					}
                ]
            },
            alternatingRow: false,
            method: "get",
            data: {
                Rows: sourcedata
            },
            enabledEdit: true,
            usePager: false,
            inWindow: false,
            height: "100%",
            rownumbers: true,
            rowHeight: 30
        });
        gridm._onResize();
    }
}
/*弹出过滤条件编辑器*/



//帮助的字典变化后需要清空映射  映射管理类
var HelpMapEditor = function ($injector) {

    function openMap() {
        var grid = $("<div></div>");
        var HFields = $injector.getHFields();
        var FFields = $injector.getFFields();
        var sourcedata = $injector.getData();
        var gridm;
        $.leeDialog.open({
            title: "请配置映射字段",
            width: "600",
            height: '400',
            target: grid,
            overflow: "hidden",
            isResize: true,
            onContentHeightChange: function (height) {

                //return false;
            },
            onStopResize: function () {
                //grid.parent().css("overflow", "hidden");
                gridm.refreshSize();
            },
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    //toSelect();

                    var data = gridm.getData();
                    $injector.setData(data);
                    dialog.close();
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
                display: '返回字段',
                name: 'HField',
                textField: "HField_text",
                align: 'left',
                width: 180,
                minWidth: 60,
                editor: {
                    type: 'dropdown',
                    data: HFields,
                    autocomplete: true
                },
                render: leeUI.gridRender.DropDownRender

            },
				{
				    display: '赋值字段',
				    name: 'FField',
				    textField: "FField_text",
				    align: 'left',
				    width: 180,
				    minWidth: 60,
				    editor: {
				        type: 'dropdown',
				        data: FFields,
				        autocomplete: true
				    },
				    render: leeUI.gridRender.DropDownRender
				}
            ],
            toolbar: {
                items: [{
                    text: '添加',
                    click: function () {
                        gridm.addRow({
                            HField: "",
                            FField: ""
                        });
                    }
                }, {
                    line: true
                },
					{
					    text: '删除',
					    click: function () {
					        gridm.endEdit();
					        gridm.deleteRow(gridm.getSelected());
					    }
					}
                ]
            },
            alternatingRow: false,
            method: "get",
            data: {
                Rows: sourcedata
            },
            enabledEdit: true,
            usePager: false,
            inWindow: false,
            height: "100%",
            rownumbers: true,
            rowHeight: 30
        });
        //grid.parent().css("overflow", "hidden");
        gridm.refreshSize();
    }
    return {
        show: openMap
    }
}









$.leeUI.PopUp.FilterEditorInjector = function (options) {

    this.options = options;
    this.init();
    this.getFields = this.options.getFields;
}



$.leeUI.PopUp.FilterEditorInjector.prototype = {
    init: function () {
    },
    initUI: function () {
        var g = this,
            p = this.options;
        var data = [];
        var value = p.getValue();
        if (value) {
            data = $.parseJSON(p.getValue());
        }

        var ret = g.getFields();
        if (ret.then) {
            ret.then(function (res) {
                if (res) {
                    g.initGrid(res, data);
                }
            }, function (res) {
            });
        }
        else {
            g.initGrid(ret, data);
        }
    },
    initGrid: function (fields, data) {
        var operateData = [
            { text: "=", "id": "=" },
            { text: ">=", "id": ">=" },
            { text: "<=", "id": "<=" },
            { text: "<>", "id": "<>" },
            { text: ">", "id": ">" },
            { text: "<", "id": "<" },
            { text: "like", "id": "like" },
            { text: "left like", "id": "leftlike" },
            { text: "right like", "id": "rightlike " },
            { text: "is", "id": "is" },
            { text: "is not", "id": "isnot" },
            { text: "in", "id": "in" },
            { text: "not in", "id": "notin" }
        ];
        var g = this,
          p = this.options;
        p.gridm = g.grid.leeGrid({
            columns: [
                {
                    display: '左括号', name: 'LeftBrace', align: 'left', width: 80,
                    editor: {
                        type: "dropdown",
                        data: [
                            { text: "(", "id": "(" },
                            { text: "((", "id": "((" },
                            { text: "(((", "id": "(((" }
                        ]
                    }, render: leeUI.gridRender.DropDownRender
                },
                {
                    display: '字段', name: 'ParamName', align: 'left', width: 180, editor: {
                        type: "dropdown",
                        data: fields
                    }, render: leeUI.gridRender.DropDownRender
                },
                {
                    display: '比较字符', name: 'Operate', align: 'left', width: 100, editor: {
                        type: "dropdown",
                        data: operateData
                    }, render: leeUI.gridRender.DropDownRender
                },
                {
                    display: '是否表达式', name: 'IsExpress', align: 'center', width: 80, render: leeUI.gridRender.ToogleRender
                },
                { display: '值', name: 'ExpressValue', align: 'left', width: 100, editor: { type: 'text' } },
                {
                    display: '右括号', name: 'RightBrace', align: 'left', width: 80, editor: {
                        type: "dropdown",
                        data: [{ text: ")", "id": ")" }, { text: "))", "id": "))" }, { text: ")))", "id": ")))" }]
                    }, render: leeUI.gridRender.DropDownRender
                },
                {
                    display: '关系', name: 'Logic', align: 'left', width: 80, editor: {
                        type: "dropdown",
                        data: [{ text: "并且", "id": "AND" }, { text: "或者", "id": "OR" }]
                    }, render: leeUI.gridRender.DropDownRender
                }
            ],
            toolbar: {
                items: [{
                    text: '添加', click: function () {
                        p.gridm.addRow({ LeftBrace: "", ParamName: "", Operate: "", IsExpress: false, ExpressValue: "", RightBrace: "", Logic: "" });
                    }, iconfont: "plus"
                }, {
                    line: true
                },
					{
					    text: '删除',
					    click: function () {
					        p.gridm.endEdit();

					        p.gridm.deleteRow(p.gridm.getSelected());
					    },
					    iconfont: "minus"
					}
                ]
            },
            alternatingRow: false,
            data: {
                Rows: data
            },
            enabledEdit: true,
            usePager: false,
            inWindow: false,
            height: "100%",
            rownumbers: true,
            rowHeight: 30
        });
        p.gridm._onResize();
    },
    clearSearch: function () {

    },
    getOptions: function () {
        return this.options;
    },
    clear: function () {
    },
    getRenderDom: function () {
        if (!this.grid) {
            this.grid = $("<div></div>");
        }
        return this.grid;
    },

    onResize: function () { },
    onConfirm: function (popup, dialog, $injector) {
        var p = $injector.options;
        var obj = {};
        var data = p.gridm.getData();
        popup.setText(JSON.stringify(data));
        popup.setValue(JSON.stringify(data));

        p.onConfirm();
        return true;
    }
};
