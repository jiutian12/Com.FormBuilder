/*属性编辑器 包括column control tab*/
function ColumnManager() {

}
$(function () {
    $("#col_onBeforeInit").popup();
    $("#col_onAfterInit").popup();

    $("#button_onClick").popup();
});
ColumnManager.prototype = {
    setValue: function (id, obj) {
        this.set(id);
        this.setCtrl(obj);
    },
    set: function (id) {
        this.id = id;
    },
    _getDefault: function () {

    },
    get: function (id) {

    },
    bind: function () {


        var self = this;
        var inputArr = [
            "#col_height",
            "#col_title",
            "#col_auto",
            "#col_minheight",
            "#col_border",
            "#col_fill",
            "#col_formstyle",
            "#col_showtitle",
            "#col_isqry"
        ];
        $(inputArr.join(",")).change(function () {
            //alert($(this).attr("id"));

            self.onPropChanged();
        });

        $("#col_onBeforeInit,#col_onAfterInit").change(function () {
            self.onPropChanged();
        });


        $("#col_dsid").leeDropDown({
            data: [],
            onselected: function (value, text) {
                self.onPropChanged();
            }
        });
    },
    setCtrl: function (obj) {
        this.obj = obj;
        $("#col_id").html(this.id);
        $("#col_height").val(obj.height);
        $("#col_title").val(obj.title);
        $("#col_dsid").val(obj.dsid);


        $("#col_formstyle").val(obj.formstyle);
        $("#col_minheight").val(obj.minheight);
        $("#col_auto").prop("checked", obj.auto);
        $("#col_border").prop("checked", obj.border);
        $("#col_fill").prop("checked", obj.fill);
        $("#col_showtitle").prop("checked", obj.showtitle);
        $("#col_isqry").prop("checked", obj.isqry ? true : false);


        //事件
        $("#col_onBeforeInit").data("code", "");
        $("#col_onAfterInit").data("code", "");
        $("#col_onBeforeInit").data("code", obj.onBeforeInit);
        $("#col_onAfterInit").data("code", obj.onAfterInit);

        var sourcedata = leeDataSourceManager.getDataSource();
        $("#col_dsid").leeUI().setData(sourcedata);
        $("#col_dsid").leeUI().setValue(obj.dsid);
        //刷新layout布局
    },
    onPropChanged: function () {
        //组件属性改变
        this.obj.height = $("#col_height").val();
        this.obj.title = $("#col_title").val();
        this.obj.dsid = $("#col_dsid").val();
        this.obj.auto = $("#col_auto").prop("checked");
        this.obj.isqry = $("#col_isqry").prop("checked");

        this.obj.border = $("#col_border").prop("checked");
        this.obj.formstyle = $("#col_formstyle").val();
        this.obj.fill = $("#col_fill").prop("checked");

        this.obj.showtitle = $("#col_showtitle").prop("checked");

        this.obj.minheight = $("#col_minheight").val();
        this.obj.onAfterInit = $("#col_onAfterInit").data("code");
        this.obj.onBeforeInit = $("#col_onBeforeInit").data("code");


        this.obj.dsid = $("#col_dsid").leeUI().getValue();
        //alert(this.id);
        leeManger.refreshColumn(this.id);
    }
};
var CompFactory = (function () {
    var cache = {};
    var cachefunc = {};
    return {
        factory: function (key) {
            cache[key] || this.register(key, cachefunc[key]);
            return cache[key];
        },
        add: function (key, func) {
            cachefunc[key] = func;
        },
        register: function (key, instance) {
            //alert("用的时候在加载");
            cache[key] = new instance();
            cache[key].bind(); //绑定事件
        }
    }
})();
CompFactory.add("column", ColumnManager);
//布局元素的管理类 基本空间属性
function InputManager() {

}
InputManager.prototype = {
    setValue: function (id, obj, gid) {
        this.set(id);
        this.gridid = gid;
        this.setCtrl(obj);
        this.setCheckRules(obj);

    },
    set: function (id) {
        this.id = id;
    },
    _getDefault: function () {

    },
    get: function (id) {

    },
    isGridModel: function () {
        return leeManger.controls[this.id] ? false : true;
    },
    bind: function () {
        var self = this;
        var ctrlArr = [
            "#txt_id,#txt_type,#txt_label,#txt_colspan",
            "#txt_width,#txt_height,#txt_top,#txt_left",
            "#txt_required,#txt_readonly,#txt_placeholder,#txt_filter",
            "#txt_filtertype,#txt_filterfield,#txt_filterexp"
        ];

        $(ctrlArr.join(",")).change(function () {
            self.onPropChanged();
        });
        $("#txt_width,#txt_height").leeSpinner({});
        $("#txt_top,#txt_left").leeSpinner({ width: 50, inline: true });

        this.calcEditor = ace.edit("txt_calcexpress");
        this.calcEditor.renderer.setShowGutter(false);
        this.calcEditor.getSession().on('change', function (e) {
            // e.type, etc
            self.onPropChanged();
        });

        function getLookUpContext() {
            return document.getElementById('expresswindow').contentWindow.expressManger;
        }

        $("#txt_openCalcDetail").click(function () {
            var value = self.calcEditor.getValue();

            var $openDg = $.leeDialog.open({
                title: "表达式编辑器",
                name: 'expresswindow',
                isHidden: false,
                showMax: true,
                width: 800,
                slide: false,
                height: 400,
                url: _global.sitePath + "/Form/Express?modelID=" + leeManger.dataModel.ModelID,
                onLoaded: function () {
                    getLookUpContext().setValue(value);
                },
                buttons: [
                    {
                        id: "dialog_lookup_ok",
                        text: '确定',
                        cls: 'lee-btn-primary lee-dialog-btn-ok',
                        onclick: function (item, dialog) {
                            // leeUI.Error("请选中要操作的数据！");
                            var res = getLookUpContext().getValue();
                            self.calcEditor.setValue(res);
                            $openDg.close();
                        }
                    },
                    {
                        text: '取消',
                        cls: 'lee-dialog-btn-cancel ',
                        onclick: function (item, dialog) {
                            $openDg.close();
                        }
                    }
                ]
            });
        });

        function getFormatUpContext() {
            return document.getElementById('formatwindow').contentWindow.GridFormatMgr;
        }

        $("#txt_openFormat").click(function () {
            var value = self.getFormat();
            var urlEnd = "";
            if (!self.gridmodel) {
                urlEnd += "?isinput=true";
            }
            var $openDg = $.leeDialog.open({
                title: "格式化编辑器",
                name: 'formatwindow',
                isHidden: false,
                showMax: true,
                width: 800,
                slide: false,
                height: 400,
                url: _global.sitePath + "/Form/GridFormat" + urlEnd,
                onLoaded: function () {
                    getFormatUpContext().setValue(value);
                },
                buttons: [
                    {
                        id: "dialog_lookup_ok",
                        text: '确定',
                        cls: 'lee-btn-primary lee-dialog-btn-ok',
                        onclick: function (item, dialog) {
                            // leeUI.Error("请选中要操作的数据！");
                            var res = getFormatUpContext().getValue();
                            self.setFormat(res);
                            $openDg.close();
                        }
                    },
                    {
                        text: '取消',
                        cls: 'lee-dialog-btn-cancel ',
                        onclick: function (item, dialog) {
                            $openDg.close();
                        }
                    }
                ]
            });
        });
        $("#txt_type").change(function () {
            var type = $("#txt_type").val();
            var editorExtension =
				EditorFactory.factory(type);
            if (!self.obj["editor_" + type]) {
                self.obj["editor_" + type] = {};
            }
            if (editorExtension) {
                editorExtension.setID(this.id, this.gridid);
                editorExtension.setValue(self.obj["editor_" + type]);
                editorExtension.show();
            }
        });
        $("#txt_onBlur,#txt_onFocus").change(function () {
            self.onPropChanged();
        });

        $("#txt_bindtable").leeDropDown({
            data: [],
            onselected: function (value, text) {

                var data = leeDataSourceManager.getDataFieldBySource(value);
                $("#txt_bindfield").leeUI().setData(data);
                self.onPropChanged();
            }
        });
        $("#txt_bindfield").leeDropDown({
            data: [],
            onselected: function (value, text) {

                self.onPropChanged();
            }
        });
    },
    getGridTable: function () {
        return leeManger.controls[this.gridid].bindtable || "";
    },
    setCheckRules: function (obj) {
        var data = obj.rules ? obj.rules : [];
        ruleManger.setValue(data).initList().setOnChangeListener($.proxy(this.changeRules, this));
    },
    changeRules: function (data) {
        this.obj.rules = data;
    },
    setCtrl: function (obj) {
        this.obj = obj;

        $("#txt_id").html(this.id);
        $("#txt_type").val(obj.type);
        if (!obj["editor_" + obj.type]) {
            obj["editor_" + obj.type] = {};
        }
        var editorExtension =
            EditorFactory.factory(obj.type);

        if (editorExtension) {
            editorExtension.setID(this.id, this.gridid);
            editorExtension.setValue(obj["editor_" + obj.type]);
            editorExtension.setBaseObj(obj);
            editorExtension.show();
        }
        $("#txt_label").val(obj.label);
        $("#txt_filtertype").val(obj.filtertype);

        $("#txt_filterexp").val(obj.filterexp);

        $("#txt_width").val(obj.width);
        $("#txt_height").val(obj.height);
        $("#txt_left").val(obj.left);
        $("#txt_top").val(obj.top);
        $("#txt_placeholder").val(obj.placeholder);




        $("#txt_filterfield").val(obj.filterfield);
        $("#txt_colspan").val(obj.colspan);

        $("#txt_filter").prop("checked", obj.filter ? true : false);
        $("#txt_required").prop("checked", obj.required);
        $("#txt_readonly").prop("checked", obj.readonly);

        $("#txt_onBlur").data("code", "");
        $("#txt_onFocus").data("code", "");
        $("#txt_onBlur").data("code", obj.onBlur);
        $("#txt_onFocus").data("code", obj.onFocus);

        var table = obj.bindtable;
        if (this.isGridModel()) {
            $(".tr_main").hide();
            $("#txt_bindtable").leeUI().setDisabled();
            this.gridmodel = true;
            //$("#txt_type").leeUI().setEnabled();
            table = this.getGridTable();
        } else {
            $(".tr_main").show();
            this.gridmodel = false;
            $("#txt_bindtable").leeUI().setEnabled();
            //$("#txt_type").leeUI().setDisabled();
        }
        //如果是表格模式的话 绑定数据表不能编辑
        var sourcedata = leeDataSourceManager.getDataSource();
        $("#txt_bindtable").leeUI().setData(sourcedata);
        $("#txt_bindtable").leeUI().setValue(table);

        //赋值的时候清空选项 赋值新的选项
        var data = leeDataSourceManager.getDataFieldBySource(table);
        $("#txt_bindfield").leeUI().setData(data);
        $("#txt_bindfield").leeUI().setValue(obj.bindfield);

        //事件
        if (obj.calc)
            this.calcEditor.setValue(obj.calc);
        else
            this.calcEditor.setValue("");

    },
    getGridBindTable: function () {

    },
    refreshSource: function () {
        var sourcedata = leeDataSourceManager.getDataSource();
        $("#txt_bindtable").leeUI().setData(sourcedata);
    },
    getFormat: function () {
        return this.obj.format || {};
    },
    setFormat: function (format) {
        this.obj.format = format;
    },
    onPropChanged: function () {
        //组件属性改变
        this.obj.type = $("#txt_type").val();
        this.obj.label = $("#txt_label").val();
        this.obj.colspan = $("#txt_colspan").val();
        this.obj.filtertype = $("#txt_filtertype").val();
        this.obj.placeholder = $("#txt_placeholder").val();


        this.obj.filterfield = $("#txt_filterfield").val();
        this.obj.filterexp = $("#txt_filterexp").val();
        this.obj.calc = this.calcEditor.getValue();
        this.obj.required = $("#txt_required").prop("checked");
        this.obj.filter = $("#txt_filter").prop("checked");
        this.obj.readonly = $("#txt_readonly").prop("checked");

        this.obj.onAfterInit = $("#txt_onBlur").data("code");
        this.obj.onBeforeInit = $("#txt_onFocus").data("code");

        this.obj.bindfield = $("#txt_bindfield").leeUI().getValue();

        this.obj.width = $("#txt_width").val();
        this.obj.height = $("#txt_height").val();
        this.obj.left = $("#txt_left").val();
        this.obj.top = $("#txt_top").val();



        //非grid模式下才更新绑定表数据
        if (!this.isGridModel()) {
            this.obj.bindtable = $("#txt_bindtable").leeUI().getValue();
            leeManger.refreshControl(this.id);
        }

        if (this.obj.calc) {
            this.obj.calcinfo = this.praseExp(this.obj.calc);
            this.obj.calcinfo.field = this.obj.bindfield;
            CalcManger.add(this.id, this.obj.calcinfo);
        } else {
            CalcManger.remove(this.id);
        }
    },
    praseExp: function (express) {

        var dep = [];
        var matchExpression = /\{Data:(\w+).(\w+)\}/;
        var matchKeys, sessionKey, parsedResult = express;
        if (typeof express === "string") {
            matchKeys = express.match(matchExpression);
            while (matchKeys && matchKeys.length === 3) {
                dep.push(matchKeys[1] + "." + matchKeys[2]);
                var value = "";
                if (matchKeys[1] == leeDataSourceManager.getMainTable()) {//这里改成动态取
                    //主表
                    value = "self.getMainValue('" + matchKeys[2] + "')";
                } else {
                    value = "self.getGridValue(rowdata,index,'" + matchKeys[1] + "','" + matchKeys[2] + "')";
                }
                express = express.replace(matchExpression, value);// 替换表达式的数据
                matchKeys = express.match(matchExpression);
            }

        }

        // 列表聚合函数


        return { express: express, dep: dep };
    }
};
CompFactory.add("input", InputManager);

/*GRID组件属性*/
function GridManager() {

}
GridManager.prototype = {
    setValue: function (id, obj) {
        this.set(id);
        this.setCtrl(obj);
    },
    set: function (id) {
        this.id = id;
    },
    _getDefault: function () {

    },
    get: function (id) {

    },
    bind: function () {
        var self = this;
        var ctlrArr = [
            "#grid_label,#grid_colspan,#grid_readonly,#grid_onAfterShowData",
            "#grid_border,#grid_rownumber,#grid_checkbox,#grid_pager,#grid_margin,#grid_async,#grid_alt",
            "#grid_tree,#grid_treefield,#grid_height,#grid_qrycmptype,#grid_isqry,#grid_qryexp",
            "#grid_height,#grid_top,#grid_left,#grid_width,#grid_pagesize", "#grid_diff"
        ]; $(ctlrArr.join(",")).change(function () {
            //alert($(this).attr("id"));
            self.onPropChanged();
        });

        $("#grid_checkbox").leeCheckBox({ labelText: "复选" });

        $("#grid_readonly").leeCheckBox({ labelText: "只读" });


        $("#grid_alt").leeCheckBox({ labelText: "隔行换色" });
        $("#grid_border").leeCheckBox({ labelText: "显示边框" });
        $("#grid_rownumber").leeCheckBox({ labelText: "行号" });
        $("#grid_pager").leeCheckBox({ labelText: "分页" });

        $("#grid_width,#grid_left,#grid_top,#grid_height").leeSpinner({ inline: true, width: 50 });

        $("#grid_columns").click(function () {
            self.openColumnsSets();
        });

        $("#grid_bindtable").leeDropDown({
            data: [],
            onselected: function (value, text) {
                self.onPropChanged();

            }
        });

        var fieldsarr = ["#grid_qrytreefield"];

        var fieldsarrExt = ["#grid_qrydsfield"];
        $("#grid_qryds").leeDropDown({
            data: [],
            onselected: function (value, text) {
                var data = leeDataSourceManager.getDataFieldBySource(value);
                $.each(fieldsarrExt, function (i, key) {
                    $(key).leeUI().setData(data);
                });
                self.onPropChanged();

            }
        });

        $.each(fieldsarr, function (i, key) {
            $(key).leeDropDown({
                data: [],
                onselected: function (value, text) {

                    self.onPropChanged();
                }
            });
        });

        $.each(fieldsarrExt, function (i, key) {
            $(key).leeDropDown({
                data: [],
                onselected: function (value, text) {

                    self.onPropChanged();
                }
            });
        });

        var $injector2 = new $.leeUI.PopUp.FilterEditorInjector({
            width: 800, height: 350, getValue: function () {
                return $("#grid_filter").leeUI().getValue();
            }, getFields: function () {


                return leeDataSourceManager.getDataFieldBySource($("#grid_bindtable").leeUI().getValue());
            },
            onConfirm: function () {

                self.onPropChanged();
            }
        });
        $("#grid_filter").leePopup({
            onButtonClick: $.leeUI.PopUp.Lookup($injector2),
            onValuechange: function (row) {
                self.onPropChanged();

            }
        });


        $("#grid_barid").leeDropDown({
            data: [],
            valueField: "ID",
            textField: "Text",
            onselected: function (value, text) {
                self.onPropChanged();
            }
        });

        DataService.getToolBar(leeManger.getFrmID()).done(function (data) {
            if (data.res) {
                $("#grid_barid").leeUI().setData(data.data);
            }
        });

    },
    refreshSource: function () {
        var sourcedata = leeDataSourceManager.getDataSource();
        $("#grid_bindtable").leeUI().setData(sourcedata);
    },
    setCtrl: function (obj) {
        this.obj = obj;
        $("#grid_id").html(this.id);
        $("#grid_label").val(obj.label);
        $("#grid_margin").val(obj.margin);
        $("#grid_colspan").val(obj.colspan);
        $("#grid_treefield").val(obj.treefield);
        $("#grid_diff").val(obj.diff);


        $("#grid_height").val(obj.height);

        $("#grid_width").val(obj.width);
        $("#grid_height").val(obj.height);
        $("#grid_top").val(obj.top);
        $("#grid_left").val(obj.left);


        $("#grid_readonly").prop("checked", obj.readonly);
        $("#grid_readonly").leeCheckBox().setValue(obj.readonly);

        $("#grid_border").prop("checked", obj.border);
        $("#grid_border").leeCheckBox().setValue(obj.border);


        $("#grid_alt").prop("checked", obj.alt);
        $("#grid_alt").leeCheckBox().setValue(obj.alt);

        $("#grid_rownumber").prop("checked", obj.rownumber);
        $("#grid_rownumber").leeCheckBox().setValue(obj.rownumber);

        $("#grid_checkbox").prop("checked", obj.checkbox);
        $("#grid_checkbox").leeCheckBox().setValue(obj.checkbox);

        $("#grid_pager").prop("checked", obj.pager);
        $("#grid_pager").leeCheckBox().setValue(obj.pager);



        $("#grid_async").prop("checked", obj.async);
        $("#grid_tree").prop("checked", obj.tree);

        //事件
        var sourcedata = leeDataSourceManager.getDataSource();
        $("#grid_bindtable").leeUI().setData(sourcedata);
        $("#grid_bindtable").leeUI().setValue(obj.bindtable);

        $("#grid_filter").leeUI().setValue(obj.filter);
        $("#grid_filter").leeUI().setText(obj.filter);
        $("#grid_barid").leeUI().setValue(obj.barid);
        //$("#grid_bindtable").val(obj.bindtable);
        $("#grid_onAfterShowData").data("code", "");
        $("#grid_onAfterShowData").data("code", obj.onAfterShowData);


        $("#grid_qryds").leeUI().setData(sourcedata);
        $("#grid_qryds").leeUI().setValue(obj.qryds);

        $("#grid_qrycmptype").val(obj.qrycmptype);
        $("#grid_pagesize").val(obj.pagesize);



        $("#grid_qryexp").val(obj.qryexp);

        $("#grid_isqry").prop("checked", obj.isqry);

        $("#grid_qrydsfield").leeUI().setValue(obj.qrydsfield);

        $("#grid_qrytreefield").leeUI().setValue(obj.qrytreefield);

        var fieldsarr = ["#grid_qrytreefield"];
        var fieldsarrExt = ["#grid_qrydsfield"];
        var data = leeDataSourceManager.getDataFieldBySource(obj.bindtable);

        $.each(fieldsarr, function (i, key) {
            $(key).leeUI().setData(data);
        });
        var dataExt = leeDataSourceManager.getDataFieldBySource(obj.qryds);
        $.each(fieldsarrExt, function (i, key) {
            $(key).leeUI().setData(dataExt);
        });



        this.grid = $(".columnsset");
        var data = leeManger.getColumns(this.id);

        for (var item in data) {
            if (!data[item]["pid"]) {
                data[item]["pid"] = "";
            }
        }
        var columnData = {
            Rows: data
        }
        this.girdm = this.grid.leeGrid({
            columns: [{
                display: '列ID',
                name: 'colid',
                width: 120,
                align: 'left',
                id: "id"
            }, {
                display: '显示名',
                name: 'colname',
                width: 150,
                align: 'left',
                editor: {
                    type: 'text'
                }
            }, {
                display: '宽度',
                name: 'colwidth',
                width: 80,
                align: 'left',
                editor: {
                    type: 'text'
                }
            }, {
                display: '对齐方式',
                name: 'align',
                width: 80,
                align: 'center', editor: {
                    type: "dropdown",
                    data: [
                        { id: "left", text: "left" },
                        { id: "center", text: "center" },
                        { id: "right", text: "right" }
                    ]
                }, render: leeUI.gridRender.DropDownRender
            }, {
                display: '隐藏',
                name: 'hidden',
                width: 60,
                align: 'center',
                render: leeUI.gridRender.CheckboxRender
            }, {
                display: '合计',
                name: 'sum',
                width: 60,
                align: 'center',
                render: leeUI.gridRender.CheckboxRender
            }, {
                display: '分组',
                name: 'group',
                width: 60,
                align: 'center',
                render: leeUI.gridRender.CheckboxRender
            },
             {
                 display: '是否排序',
                 name: 'issort',
                 width: 60,
                 align: 'center',
                 render: leeUI.gridRender.CheckboxRender
             },
             {
                display: '格式化',
                name: 'fomart',
                width: 80,
                align: 'left',
                editor: {
                    type: 'text'
                }
            }, {
                display: "操作",
                width: 80,
                render: function (g, rowindex, value, column, length) {

                    return "<a class='rowbtn' onclick=\"addRow('" + g["__id"] + "')\" href='javascript:void(0)' title='添加'  ><i class='lee-ion-plus-round'></i></a><a  class='rowbtn' onclick=\"delRow('" + g["__id"] + "')\"  href='javascript:void(0)' title='删除'  ><i class='lee-ion-minus-round'></i></a><a class='rowbtn' onclick=\"addDown('" + g["__id"] + "')\" href='javascript:void(0)'   title='添加下级'><i class='lee-ion-android-share'></i></a>";
                }
            }, {
                display: "顺序",
                width: 60,
                render: function (g, rowindex, value, column, length) {
                    var html = [];
                    if (rowindex != 0) {
                        html.push("<a class='rowbtn' onclick=\"upRow('" + g["__id"] + "')\" href='javascript:void(0)'  ><i class='lee-ion-arrow-up-c'></i></a>");
                    }

                    if (rowindex != length - 1) {
                        html.push("<a class='rowbtn' onclick=\"downRow('" + g["__id"] + "')\"  href='javascript:void(0)'  ><i class='lee-ion-arrow-down-c'></i></a>");
                    }
                    return html.join("");
                }
            }],
            enabledEdit: true,
            rowHeight: 32,
            rownumbers: true,
            usePager: false,
            checkbox: false,
            inWindow: false,
            height: "100%",
            data: columnData,
            tree: {
                columnId: 'id',
                idField: 'colid',
                childrenName: "children",
                parentIDField: "pid",
                isExtend: function (data) {
                    return true;
                },
                isParent: function (data) {

                    return data.children && data.children.length > 0;
                }
            },
            noDataRender: function (g) {
                return "<a onclick=\"addNewRow()\"  href='javascript:void(0)' style='color:rgba(0, 0, 0, 0.8);margin:0 3px;'><i class='fa fa-plus'></i>增加行</a>";
            }
        });
        window.columngrid = this.girdm;
    },
    setColumns: function () {
        leeManger.setColumns(this.id, this.girdm.getData(null, "children"));
    },
    openColumnsSets: function () {
        var self = this;
        this.dialog = layer.open({
            type: 1,
            content: self.grid,
            area: ['900px', '450px'],
            maxmin: true,
            title: "列表属性配置",
            btn: ['确认'],
            resizing: function () {
                self.girdm._onResize();
            },
            yes: function (index, layero) {
                self.setColumns();
                layer.close(self.dialog)
                return true;
            }
        });
        this.girdm._onResize();
    },
    onPropChanged: function () {
        //组件属性改变

        this.obj.label = $("#grid_label").val();
        this.obj.colspan = $("#grid_colspan").val();
        this.obj.margin = $("#grid_margin").val();
        this.obj.treefield = $("#grid_treefield").val();
        this.obj.height = $("#grid_height").val();
        this.obj.width = $("#grid_width").val();
        this.obj.height = $("#grid_height").val();
        this.obj.top = $("#grid_top").val();
        this.obj.left = $("#grid_left").val();
        this.obj.pagesize = $("#grid_pagesize").val();
        this.obj.diff = $("#grid_diff").val();

        //this.obj.readonly = $("#grid_readonly").prop("checked");
        this.obj.readonly = $("#grid_readonly").leeUI().getValue();
        //this.obj.border = $("#grid_border").prop("checked");
        this.obj.border = $("#grid_border").leeUI().getValue();
        this.obj.alt = $("#grid_alt").leeUI().getValue();


        //this.obj.rownumber = $("#grid_rownumber").prop("checked");
        this.obj.rownumber = $("#grid_rownumber").leeUI().getValue();

        //this.obj.pager = $("#grid_pager").prop("checked");
        this.obj.pager = $("#grid_pager").leeUI().getValue();

        //this.obj.checkbox = $("#grid_checkbox").prop("checked");
        this.obj.checkbox = $("#grid_checkbox").leeUI().getValue();

        this.obj.async = $("#grid_async").prop("checked");
        this.obj.tree = $("#grid_tree").prop("checked");



        this.obj.filter = $("#grid_filter").leeUI().getValue();
        this.obj.barid = $("#grid_barid").leeUI().getValue();
        this.obj.bindtable = $("#grid_bindtable").leeUI().getValue();
        this.obj.onAfterShowData = $("#grid_onAfterShowData").data("code");


        this.obj.qryds = $("#grid_qryds").leeUI().getValue();
        this.obj.qrydsfield = $("#grid_qrydsfield").leeUI().getValue();
        this.obj.qrytreefield = $("#grid_qrytreefield").leeUI().getValue();
        this.obj.isqry = $("#grid_isqry").prop("checked");
        this.obj.qrycmptype = $("#grid_qrycmptype").val();

        this.obj.qryexp = $("#grid_qryexp").val();



        //leeManger.refreshControl(this.id);
    }
};
CompFactory.add("grid", GridManager);



/*Toolbar组件属性*/
function BarManager() {

}
BarManager.prototype = {
    setValue: function (id, obj) {
        this.set(id);
        this.setCtrl(obj);
    },
    set: function (id) {
        this.id = id;
    },
    _getDefault: function () {

    },
    get: function (id) {

    },
    bind: function () {
        var self = this;
        $("#bar_barid").leeDropDown({
            data: [],
            valueField: "ID",
            textField: "Text",
            onselected: function (value, text) {
                self.onPropChanged();
                //alert(1);
            }
        });




        DataService.getToolBar(leeManger.getFrmID()).done(function (data) {
            if (data.res) {
                $("#bar_barid").leeUI().setData(data.data);
            }
        });
    },
    setCtrl: function (obj) {
        this.obj = obj;
        $("#bar_id").html(this.id);
        $("#bar_barid").leeUI().setValue(obj.barid);
        $("#bar_height").val(obj.height);
        $("#bar_width").val(obj.width);
        $("#bar_top").val(obj.top);
        $("#bar_left").val(obj.left);

        //$("#grid_bindtable").val(obj.bindtable);

    },
    onPropChanged: function () {
        //组件属性改变
        this.obj.barid = $("#bar_barid").leeUI().getValue();


        this.obj.height = $("#bar_height").val();
        this.obj.width = $("#bar_width").val();
        this.obj.top = $("#bar_top").val();
        this.obj.left = $("#bar_left").val();


        //leeManger.refreshControl(this.id);
    }
};
CompFactory.add("bar", BarManager);



/*Button件属性*/
function ButtonManager() {

}
ButtonManager.prototype = {
    setValue: function (id, obj) {
        this.set(id);
        this.setCtrl(obj);
    },
    set: function (id) {
        this.id = id;
    },
    _getDefault: function () {

    },
    get: function (id) {

    },
    bind: function () {
        var self = this;

        var ctrlArr = [
            "#button_top",
            "#button_left",
            "#button_height",
            "#button_width",
            "#button_style",
            "#button_text",
            "#button_icon",
            "#button_onClick",
            "#button_colspan",
            "#button_align"
        ];
        $(ctrlArr.join(",")).change(function () {
            self.onPropChanged();
        });

    },
    setCtrl: function (obj) {
        this.obj = obj;
        $("#button_id").html(this.id);
        $("#button_colspan").val(obj.colspan);

        $("#button_top").val(obj.top);
        $("#button_left").val(obj.left);
        $("#button_height").val(obj.height);
        $("#button_width").val(obj.width);

        $("#button_style").val(obj.style);
        $("#button_align").val(obj.align);
        $("#button_text").val(obj.text);
        $("#button_icon").val(obj.icon);



        $("#button_onClick").val(obj.onClick);

        $("#button_onClick").data("code", "");

        $("#button_onClick").data("code", obj.onClick);

    },
    onPropChanged: function () {
        //组件属性改变
        this.obj.style = $("#button_style").val();
        //alert(1);
        this.obj.text = $("#button_text").val();
        this.obj.colspan = $("#button_colspan").val();
        this.obj.width = $("#button_width").val();
        this.obj.top = $("#button_top").val();
        this.obj.left = $("#button_left").val();
        this.obj.height = $("#button_height").val();


        this.obj.align = $("#button_align").val();
        this.obj.icon = $("#button_icon").val();
        //this.obj.onClick = $("#button_onClick").val();

        this.obj.onClick = $("#button_onClick").data("code");
        leeManger.refreshControl(this.id);
    }
};
CompFactory.add("button", ButtonManager);





/*Tree组件属性*/
function TreeManager() {

}
TreeManager.prototype = {
    setValue: function (id, obj) {
        this.set(id);
        this.setCtrl(obj);
    },
    set: function (id) {
        this.id = id;
    },
    _getDefault: function () {

    },
    get: function (id) {

    },
    bind: function () {


        var self = this;
        $("#tree_async,#tree_ismain,#tree_title,#tree_checkbox,#tree_filter,#tree_onClick,#tree_height,#tree_showbar,#tree_isqry,#tree_qrycmptype,#tree_qryexp,#tree_filterexp").change(function () {
            self.onPropChanged();
        });



        var $injector2 = new $.leeUI.PopUp.FilterEditorInjector({
            width: 800, height: 350, getValue: function () {
                return $("#tree_filterexp").leeUI().getValue();
            }, getFields: function () {


                return leeDataSourceManager.getDataFieldBySource($("#tree_datasource").leeUI().getValue());
            },
            onConfirm: function () {

                self.onPropChanged();
            }
        });
        $("#tree_filterexp").leePopup({
            onButtonClick: $.leeUI.PopUp.Lookup($injector2),
            onValuechange: function (row) {
                self.onPropChanged();

            }
        });
        var fieldsarr = ["#tree_nameField", "#tree_IDField", "#tree_parentIDField", "#tree_iconField", "#tree_qrytreefield"];
        var fieldsarrExt = ["#tree_qrydsfield"];
        $("#tree_datasource").leeDropDown({
            data: [],
            onselected: function (value, text) {
                var data = leeDataSourceManager.getDataFieldBySource(value);
                $.each(fieldsarr, function (i, key) {
                    $(key).leeUI().setData(data);
                });
                self.onPropChanged();

            }
        });

        $("#tree_qryds").leeDropDown({
            data: [],
            onselected: function (value, text) {
                var data = leeDataSourceManager.getDataFieldBySource(value);
                $.each(fieldsarrExt, function (i, key) {
                    $(key).leeUI().setData(data);
                });
                self.onPropChanged();

            }
        });

        $.each(fieldsarr, function (i, key) {
            $(key).leeDropDown({
                data: [],
                onselected: function (value, text) {

                    self.onPropChanged();
                }
            });
        });

        $.each(fieldsarrExt, function (i, key) {
            $(key).leeDropDown({
                data: [],
                onselected: function (value, text) {

                    self.onPropChanged();
                }
            });
        });
    },
    setCtrl: function (obj) {
        this.obj = obj;
        $("#tree_id").html(this.id);
        $("#tree_title").val(obj.title);
        $("#tree_qryexp").val(obj.qryexp);


        $("#tree_checkbox").prop("checked", obj.checkbox ? true : false);
        $("#tree_showbar").prop("checked", obj.showbar ? true : false);

        $("#tree_ismain").prop("checked", obj.ismain ? true : false);
        $("#tree_async").prop("checked", obj.async ? true : false);

        $("#tree_filter").prop("checked", obj.filter ? true : false);


        var sourcedata = leeDataSourceManager.getDataSource();
        $("#tree_datasource").leeUI().setData(sourcedata);
        $("#tree_datasource").leeUI().setValue(obj.datasource);


        $("#tree_qryds").leeUI().setData(sourcedata);
        $("#tree_qryds").leeUI().setValue(obj.qryds);

        $("#tree_filterexp").leeUI().setValue(obj.filterexp);
        $("#tree_filterexp").leeUI().setText(obj.filterexp);

        //var fieldsarr = "#tree_nameField,#tree_IDField,#tree_parentIDField,#tree_iconField";

        var fieldsarr = ["#tree_nameField", "#tree_IDField", "#tree_parentIDField", "#tree_iconField", "#tree_qrytreefield"];
        var fieldsarrExt = ["#tree_qrydsfield"];
        var data = leeDataSourceManager.getDataFieldBySource(obj.datasource);

        $.each(fieldsarr, function (i, key) {
            $(key).leeUI().setData(data);
        });
        var dataExt = leeDataSourceManager.getDataFieldBySource(obj.qryds);
        $.each(fieldsarrExt, function (i, key) {
            $(key).leeUI().setData(dataExt);
        });

        $("#tree_nameField").leeUI().setValue(obj.nameField);
        $("#tree_IDField").leeUI().setValue(obj.IDField);
        $("#tree_parentIDField").leeUI().setValue(obj.parentIDField);
        $("#tree_iconField").leeUI().setValue(obj.iconField);



        $("#tree_qrydsfield").leeUI().setValue(obj.qrydsfield);
        $("#tree_qrytreefield").leeUI().setValue(obj.qrytreefield);

        $("#tree_isqry").prop("checked", obj.isqry ? true : false);
        $("#tree_qrycmptype").val(obj.qrycmptype);
        //$("#tree_datasource").val(obj.datasource);
        //$("#tree_nameField").val(obj.nameField);
        //$("#tree_IDField").val(obj.IDField);
        //$("#tree_parentIDField").val(obj.parentIDField);
        //$("#tree_iconField").val(obj.iconField);




        $("#tree_height").val(obj.height);

        $("#tree_onClick").val(obj.onClick);
        $("#tree_onLoad").val(obj.onLoad);
        $("#tree_onExpand").val(obj.onExpand);



    },
    onPropChanged: function () {
        //组件属性改变
        this.obj.title = $("#tree_title").val();
        this.obj.height = $("#tree_height").val();
        this.obj.datasource = $("#tree_datasource").leeUI().getValue();
        this.obj.nameField = $("#tree_nameField").leeUI().getValue();
        this.obj.IDField = $("#tree_IDField").leeUI().getValue();
        this.obj.parentIDField = $("#tree_parentIDField").leeUI().getValue();
        this.obj.iconField = $("#tree_iconField").leeUI().getValue();

        this.obj.checkbox = $("#tree_checkbox").prop("checked");
        this.obj.filter = $("#tree_filter").prop("checked");
        this.obj.showbar = $("#tree_showbar").prop("checked");


        this.obj.async = $("#tree_async").prop("checked");
        this.obj.ismain = $("#tree_ismain").prop("checked");


        this.obj.qryds = $("#tree_qryds").leeUI().getValue();
        this.obj.qrydsfield = $("#tree_qrydsfield").leeUI().getValue();
        this.obj.qrytreefield = $("#tree_qrytreefield").leeUI().getValue();

        this.obj.filterexp = $("#tree_filterexp").leeUI().getValue();

        this.obj.isqry = $("#tree_isqry").prop("checked");
        this.obj.qrycmptype = $("#tree_qrycmptype").val();



        this.obj.onClick = $("#tree_onClick").val();
        this.obj.onLoad = $("#tree_onLoad").val();
        this.obj.onExpand = $("#tree_onExpand").val();

        this.obj.qryexp = $("#tree_qryexp").val();


    }
};
CompFactory.add("tree", TreeManager);



/*图表组件属性*/
function ChartManager() {

}
ChartManager.prototype = {
    setValue: function (id, obj) {
        this.set(id);
        this.setCtrl(obj);
    },
    set: function (id) {
        this.id = id;
    },
    _getDefault: function () {

    },
    get: function (id) {

    },
    bind: function () {
        var self = this;

        $("#chart_colspan,#chart_title,#chart_height,#chart_width,#chart_top,#chart_left,#chart_ctype").change(function () {
            self.onPropChanged();
        });
        $("#chart_top,#chart_left").leeSpinner({ width: 60, inline: true });
        $("#chart_datasource").leeDropDown({
            data: [],
            onselected: function (value, text) {
                var data = leeDataSourceManager.getDataFieldBySource(value);
                $("#chart_xfield").leeUI().setData(data);
                self.onPropChanged();
            }
        });

        $("#chart_xfield").leeDropDown({
            data: [],
            onselected: function (value, text) {

                self.onPropChanged();
            }
        });

        $("#btnAddSeries").click(function () {
            self.addSeries();
        });

        // 删除按钮
        $(".setSeries").on("click", ".item .handle", function (e) {
            self.removeSeries(e);
        });

        $(".setSeries").on("change", ".item .input", function (e) {
            self.onPropChanged();
        });

    },
    addSeries: function () {
        var self = this;
        //增加一行枚举
        var htmlarr =
             '<div class="item">'
           + '  <i href="#" class="handle lee-ion-minus-round remove" style="font-size:14px;"></i>'
           + '  <input type="text" class="input" value="" data-bind="id" placeholder="字段" style="margin-left:4px;" />'
           + ' <input type="text" class="input" value="" data-bind="text" placeholder="显示值" />'
           + '  <input type="text" class="input" value="" style="display:none;" data-bind="color" placeholder="颜色值" />'
           + ' </div>';
        // 绑定dropdown
        $(".setSeries").append($(htmlarr));
        self.onPropChanged();
    },
    removeSeries: function (e) {
        var self = this;
        $(e.target).closest(".item").remove();
        self.onPropChanged();
    },
    setCtrl: function (obj) {
        this.obj = obj;
        $("#chart_id").html(this.id);
        $("#chart_colspan").val(obj.colspan);
        $("#chart_title").val(obj.title);

        $("#chart_height").val(obj.height);
        $("#chart_width").val(obj.width);
        $("#chart_top").val(obj.top);
        $("#chart_left").val(obj.left);

        $("#chart_ctype").val(obj.ctype);
        var sourcedata = leeDataSourceManager.getDataSource();
        $("#chart_datasource").leeUI().setData(sourcedata);
        $("#chart_datasource").leeUI().setValue(obj.datasource);//获取数据源

        var data = leeDataSourceManager.getDataFieldBySource(obj.datasource);

        $("#chart_xfield").leeUI().setData(data);
        $("#chart_xfield").leeUI().setValue(obj.xfield);
        this.setList(obj.series);
        //$("#grid_bindtable").val(obj.bindtable);

    },
    setList: function (data) {
        var arr = [];
        for (var item in data) {
            arr.push('<div class="item">'
           + '  <i href="#" class="handle lee-ion-minus-round " style="font-size:14px;"></i>'
           + '  <input type="text" class="input" data-bind="field" value="'
           + (data[item].field ? data[item].field : "") + '" placeholder="字段" style="margin-left:4px;" />'
           + '  <input type="text" class="input" data-bind="text" value="'
           + (data[item].text ? data[item].text : "") + '" placeholder="文本" />'
           + '  <input type="text" class="input" style="display:none;" data-bind="color" value="'
           + (data[item].color ? data[item].color : "") + '" placeholder="颜色值" />'
           + ' </div>');
            // 绑定dropdown
        }

        $(".setSeries").html(arr.join(""));
        //清空HTML
        //初始化数据 绑定下拉框 和属性
    },
    getList: function () {
        //循环获取数据

        var $items = $(".setSeries .item");
        var arr = [];
        $.each($items, function (i, ele) {
            var field = $(ele).find("input[data-bind='field']").val();
            var color = $(ele).find("input[data-bind='color']").val();
            var text = $(ele).find("input[data-bind='text']").val();
            arr.push({ field: field, color: color, text: text });
        });
        return arr;
    },
    onPropChanged: function () {
        //组件属性改变


        this.obj.height = $("#chart_height").val();
        this.obj.width = $("#chart_width").val();
        this.obj.top = $("#chart_top").val();
        this.obj.left = $("#chart_left").val();
        this.obj.title = $("#chart_title").val();
        this.obj.colspan = $("#chart_colspan").val();

        this.obj.ctype = $("#chart_ctype").val();
        this.obj.datasource = $("#chart_datasource").leeUI().getValue();
        this.obj.xfield = $("#chart_xfield").leeUI().getValue();
        this.obj.series = this.getList();


        leeManger.refreshControl(this.id);

    }
};
CompFactory.add("chart", ChartManager);

/*处理列配置grid的相关信息*/
function delRow(rowid) {
    var rowdata = columngrid.getRow(rowid);

    columngrid.remove(rowdata);
}

function addRow(rowid) {
    var rowData = columngrid.getRow(rowid);
    var addobj = leeManger.getDefaultColumn();
    addobj.align = "left";
    addobj.colwidth = "200";
    columngrid.add(addobj, rowData, false);
}
function addDown(rowid) {
    var rowData = columngrid.getRow(rowid);
    var addobj = leeManger.getDefaultColumn();
    addobj.pid = rowData.colid;
    addobj.align = "left";
    addobj.colwidth = "200";
    columngrid.add(addobj, null, false, rowData);
}


function addNewRow() {

    columngrid.add(leeManger.getDefaultColumn());
}

function upRow(rowid) {
    var rowData = columngrid.getRow(rowid);
    columngrid.up(rowData);
}

function downRow(rowid) {
    var rowData = columngrid.getRow(rowid);
    columngrid.down(rowData);
}