
fBulider.page.BaseCardController = function (options) {
    fBulider.page.BaseCardController.base.constructor.call(this, options); //父构造函数
};

fBulider.page.BaseCardController.leeExtend(fBulider.page.UIController, {
    init: function () {
        var self = this;
        this.dataModel = {
        };
        this.gridMgr = {};
        $.each(this.getGrid(), function (i, val) {
            var grid = $("#" + val.id).leeGrid({
                columns: self.getGridOptions(val.id),
                fixedCellHeight: true,
                alternatingRow: false,
                data: { Rows: [] },
                height: "100%",
                usePager: false,
                rownumbers: true,
                enabledEdit: true,
                rowHeight: 30
            });
            self.gridMgr[val.id] = grid;
        });

        $("#txtCode").change(function () {
            $("#txtTableName").val($("#txtCode").val());
        });
    },
    addRow: function () {
        this.gridMgr["grid"].addRow(this.getChildSchema());
    },
    removeRow: function () {
        var selected = this.gridMgr["grid"].getSelected();
        var code = selected["Code"];
        var self = this;
        if (!code) {
            self.gridMgr["grid"].remove(selected);
            return;
        }

        fBulider.core.dataService.requestApi("/DataObject/CheckCol", { objectID: this.getDataID(), colname: code }, "正在验证...").done(function (data) {
            if (data.res) {
                self.gridMgr["grid"].remove(selected);
            }
        }).fail(function (data) {
            console.log(data);
        });

    },
    downRow: function () {
        var selected = this.gridMgr["grid"].getSelected();
        this.gridMgr["grid"].down(selected);
    },
    upRow: function () {
        var selected = this.gridMgr["grid"].getSelected();
        this.gridMgr["grid"].up(selected);
    },
    getModel: function () {

    },
    getGrid: function () {
        return [
            { id: "grid", bindTable: "cols" }
        ];
    },
    getGridOptions: function (id) {
        return [
            { display: '编号', name: 'Code', id: 'id', align: 'left', width: 130, minWidth: 60, editor: { type: "text" } },
            { display: '名称', name: 'Name', align: 'left', width: 120, editor: { type: "text" } },
            {
                display: '数据类型', name: 'DataType', align: 'left', width: 130, editor: {
                    type: "dropdown",
                    data: fBulider.defaults.datatype
                }, render: leeUI.gridRender.DropDownRender
            },
            { display: '长度', name: 'Length', width: 90, editor: { type: "text" } },
            { display: '精度', name: 'Decimal', width: 90, editor: { type: "text" } },
            { display: '默认值', name: 'DefaultValue', width: 90, editor: { type: "text" } },
            { display: '主键', name: 'IsPrimary', width: 80, render: leeUI.gridRender.CheckboxRender },
            { display: '是否必须', name: 'IsRequired', width: 80, render: leeUI.gridRender.CheckboxRender },
            //{ display: '是否唯一', name: 'IsUninque', width: 80, render: leeUI.gridRender.ToogleRender },
            { display: '备注', name: 'Note', align: 'left', width: 120, editor: { type: "text" } }
        ];
    },
    setValue: function (data) {
        this.dataModel = data;
        this.arr = $("[data-bind]");
        for (var i = 0; i < this.arr.length; i++) {
            var item = this.arr[i];
            var BindKey = $(item).attr("data-bind");
            var BindValue = "";
            if ($(item).leeUI()) {
                $(item).leeUI().setValue(this.dataModel[BindKey]);

                if ($(item).leeUI().setText) {
                    $(item).leeUI().setText(this.dataModel[BindKey]);
                }
            } else {
                var type = $(item).attr("type");
                if (type == "text") {
                    $(item).val(this.dataModel[BindKey]);
                }
                else if (type == "checkbox") {
                    $(item).prop("checked", this.dataModel[BindKey] == "1");
                } else {
                    $(item).html(this.dataModel[BindKey]);
                }
            }
        }
        this.setGridValue("grid", data.ColList);
    },
    setGridValue: function (grid, data) {
        this.gridMgr["grid"].loadData({ Rows: data });
    },
    getSchema: function () {
        this.Model = {
            ID: "", Code: "",
            TableName: "", AiasName: "",
            DataSource: "", Note: "",
            CreateUser: "", CreateTime: "",
            LastModifyUser: "", LastModifyTime: "",
            ColList: []
        };
    },
    getChildSchema: function () {
        return {
        };
    },
    getValue: function () {
        this.arr = $("[data-bind]");
        for (var i = 0; i < this.arr.length; i++) {
            var item = this.arr[i];
            var BindKey = $(item).attr("data-bind");
            var BindValue = "";
            if ($(item).leeUI()) {
                BindValue = $(item).leeUI().getValue();
            } else {
                var type = $(item).attr("type");
                if (type == "text") {
                    BindValue = $(item).val();
                }
                else if (type == "checkbox") {
                    BindValue = $(item).prop("checked") ? "1" : "0";
                } else {
                    BindValue = $(item).html();
                }
            }
            this.dataModel[BindKey] = BindValue;
        }
        this.dataModel["ColList"] = this.gridMgr["grid"].getData();
        return this.dataModel;
    },
    bind: function () {
        $("#btnAddRow").click($.proxy(this.addRow, this));
        $("#btnSave").click($.proxy(this.save, this));
        $("#btnDelete").click($.proxy(this.removeRow, this));
        $("#btnUp").click($.proxy(this.upRow, this));
        $("#btnDown").click($.proxy(this.downRow, this));
        $("#btnImport").click($.proxy(this.openDB, this));
        $("#btnSearchList").click($.proxy(this.refreshGrid, this));





        var arr = [];

        for (var item in list_schema) {
            arr.push({ id: list_schema[item], text: list_schema[item] });
        }
        var self = this;
        $("#txtSchema").leeDropDown({
            data: arr, onselected: function (value, text) {
                self.refreshGrid();
            }
        }).setValue(arr[0].id);

    },
    openDB: function () {
        var self = this;
        this.dialog = $.leeDialog.open({
            title: "从数据库引入",
            width: "600",
            height: '364',
            target: $("#dialog_create"),
            targetBody: true,
            isResize: true,
            showMax: false,
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    self.confirmImport(dialog);
                }
            }, {
                text: '取消',
                cls: 'lee-dialog-btn-cancel ',
                onclick: function (item, dialog) {
                    dialog.close();
                }
            }]
        });

        $("#gridinfo").leeGrid({
            columns: this.bulidTableColumns(),
            fixedCellHeight: true,
            alternatingRow: false,
            url: _global.sitePath + "/DataObject/getDBTables",
            parms: $.proxy(this.getParamCreate, this),
            dataAction: 'server', //服务器排序
            usePager: true,       //服务器分页
            height: "306",
            checkbox: false,
            rownumbers: true,
            rowHeight: 30
        });
    },
    refreshGrid: function () {
        $("#gridinfo").leeGrid().loadData(true);
    },
    getParamCreate: function () {
        var res = [];
        res.push({ name: "keyword", value: $("#txtkeywordList").val() });
        res.push({ name: "schema", value: $("#txtSchema").leeUI().getValue() });
        return res;
    },
    bulidTableColumns: function () {
        return [
          { display: '表名称', name: 'TABLE_NAME', align: 'left', width: 260, minWidth: 60 },
          { display: '类型', name: 'TABLE_TYPE', align: 'left', width: 140 }
        ];
    },
    confirmImport: function (dialog) {
        var self = this;
        var selected = $("#gridinfo").leeUI().getSelected();
        if (selected) {

            var table = selected["TABLE_NAME"];
            var schema = $("#txtSchema").leeUI().getValue()


            fBulider.core.dataService.requestApi(
                "/DataObject/getDBColumnList",
                {
                    table: table,
                    schema: schema
                },
                "正在引入....").done(function (data) {
                    if (data.res) {
                        dialog.close();
                        console.log(data.data);
                        self.refreshColList(data.data);
                    }
                }).fail(function (data) {
                    console.log(data);
                });
        } else {
            leeUI.Error("请选中参照的主表数据对象！");
        }

    },
    getEnumType: function (value) {
        var res = '';
        switch (value) {
            case "varchar":
                res = "0";
                break;
            case "char":
                res = "5";
                break;
            case "int":
                res = "1";
                break;
            case "demcimal":
                res = "2";
            case "date":
                res = "3";
            case "text":
                res = "4";
                break;
            case "bit":
                res = "6";
                break;
            default:
                break;
        }
        return res;
    },
    refreshColList: function (data) {
        var arr = [];
        var self = this;
        $.each(data, function (i, obj) {
            var model = {};
            model.Code = obj.COLUMN_NAME;

            model.Name = obj.COLUMN_NAME;
            model.DataType = self.getEnumType(obj.DATA_TYPE);

            model.IsRequired = obj.IS_NULLABLE == "YES" ? "0" : "1";
            model.Length = obj.LENGTH;
            if (obj.DATA_TYPE == "int" || obj.DATA_TYPE == "decimal") {
                model.Length = obj.NLENGTH;
            }
            model.Decimal = obj.PREC;
            arr.push(model);
        });
        $("#grid").leeUI().loadData({ Rows: arr });
    },
    render: function () {

    },
    getDataID: function () {
        return fBulider.utils.getQuery("dataid");
    },
    _saveModel: function () {
        var model = JSON.stringify(this.getValue());

        fBulider.core.dataService.requestApi("/DataObject/SaveModel", { data: model }, "正在保存...").done(function (data) {
            if (data.res) {
                leeUI.Success(data.mes);

            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    save: function () {
        var self = this;
        $("#form").isValid(function (flag, error) {
            if (flag) {
                self._saveModel();
            } else {
                var mes = [];
                $.each(error, function (i, val) {
                    mes.push(val.err)
                });
                leeUI.Error(mes.join("</br>"));
                //leeUI.Error(error);
            }
        });
    },
    load: function () {
        var self = this;
        fBulider.core.dataService.requestApi("/DataObject/GetModel", { dataid: this.getDataID() }, "正在加载...").done(function (data) {
            if (data.res) {
                //leeUI.Success(data.mes);
                self.setValue(data.data);
            }
        }).fail(function (data) {
            console.log(data);
        });
    }
});
$.validator.config({
    rules: {
        mobile: [/^1[3-9]\d{9}$/, "请填写有效的手机号"],
        chinese: [/^[\u0391-\uFFE5]+$/, "请填写中文字符"],
        checkExits: function (element) {
            var data = JSON.stringify({
                TableName: "FBDataObject",
                DataID: fBulider.utils.getQuery("dataid"),
                ValidField: "Code",
                ValidValue: element.value,
                Label: "编号",
                KeyField: "ID"
            });
            return $.ajax({
                url: _global.sitePath + '/CommonFB/remoteCheck',
                type: 'post',
                data: { model: data },
                dataType: 'json'
            });
        }
    }
});

function changeRules() {

}
$(function () {
    $("#layout1").leeLayout({
        rightWidth: 300
    });

    $('#form').validator({});

    //$('#form').validator("setField", {
    //    "#txtCode": {
    //        rule: "required;checkExits"
    //    },
    //    "#txtAiasName": "chinese"
    //});

    $('#form').validator("setField", {
        "#txtAiasName": "chinese"
    });
    $('#form').on('validation', function (e, form) {

    });
    $('#form').on('valid.form', function (e, form) {

    });
    $('#form').on('invalid.form', function (e, form, errors) {

    });

    // 清空表单验证消息
    //$('#form1').validator("cleanUp");

    var mgr = new fBulider.page.BaseCardController();
    mgr.load();


});