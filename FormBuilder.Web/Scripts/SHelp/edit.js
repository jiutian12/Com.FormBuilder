
fBulider.page.HelpCardController = function (options) {
    fBulider.page.HelpCardController.base.constructor.call(this, options); //父构造函数
};

fBulider.page.HelpCardController.leeExtend(fBulider.page.UIController, {
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
    },
    addRow: function () {
        this.gridMgr["grid"].addRow(this.getChildSchema());
    },
    downRow: function () {
        var selected = $("#grid").leeUI().getSelected();
        $("#grid").leeUI().down(selected);
    },
    upRow: function () {
        var selected = $("#grid").leeUI().getSelected();
        $("#grid").leeUI().up(selected);
    },
    removeRow: function () {
        var selected = this.gridMgr["grid"].getSelected();
        this.gridMgr["grid"].remove(selected);
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
            { display: '编号', name: 'ColCode', id: 'id', align: 'left', width: 130, minWidth: 60, editor: { type: "text" } },
            { display: '名称', name: 'ColName', align: 'left', width: 150, editor: { type: "text" } },
            {
                display: '对齐方式', name: 'Align', width: 90, editor: {
                    type: "dropdown",
                    data: [{ text: "左对齐", "id": "0" }, { text: "居中", "id": "1" }, { text: "右对齐", "id": "2" }]
                }, render: leeUI.gridRender.DropDownRender
            },
            { display: '宽度', name: 'Width', width: 90, editor: { type: "text" } },
            { display: '是否显示', name: 'Visible', width: 90, render: leeUI.gridRender.ToogleRender }
        ];
    },
    openModel: function () {
        if ($("#txtModelID").val() == "") {
            leeUI.Error("没有模型信息");
            return;
        }
        window.open(_global.sitePath + "/DataModel/Edit?dataid=" + $("#txtModelID").val());
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

                //if ($(item).leeUI().setText) {
                //    $(item).leeUI().setText(this.dataModel[BindKey]);
                //}
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
                }
            }
            this.dataModel[BindKey] = BindValue;
        }
        this.dataModel["ColList"] = this.gridMgr["grid"].getData();
        return this.dataModel;
    },
    bind: function () {
        $("#btnImport").click($.proxy(this.selectFields, this));
        $("#btnSave").click($.proxy(this.save, this));
        $("#btnDelete").click($.proxy(this.removeRow, this));


        $(".upwrap").click($.proxy(this.upRow, this));

        $(".openModel").click($.proxy(this.openModel, this));

        $(".downwrap").click($.proxy(this.downRow, this));

    },
    render: function () {

    },
    getDataID: function () {
        return fBulider.utils.getQuery("dataid");
    },
    _saveModel: function () {
        var model = JSON.stringify(this.getValue());

        fBulider.core.dataService.requestApi("/SmartHelp/SaveData", { model: model }, "正在保存...").done(function (data) {
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
    selectFields: function () {
        var self = this;
        this.importColumns(function (data) {
            self.appenRows(data);
        });
    },
    existObjectCode: function (code) {
        var data = this.gridMgr["grid"].getData();
        return data.find(function (i) {
            return i.ColCode.toUpperCase() == code.toUpperCase();
        });

    },
    appenRows: function (data) {
        var self = this;
        var arr = [];
        $.each(data, function (i, obj) {
            if (!self.existObjectCode(obj.Code)) {
                var row = {
                    "ID": Guid.NewGuid().ToString(),
                    "ColCode": obj.Code,
                    "ColName": obj.Name,
                    "Align": "0",
                    "Width": "120",
                    "Ord": String(i)
                };
                arr.push(row);
            }
        });
        this.gridMgr["grid"].addRows(arr);
    },
    importColumns: function (callback) {
        //引入字段
        var self = this;
        this.grid = $("<div></div>");
        var dialog = $.leeDialog.open({
            title: "请选择要导入的字段",
            width: "400",
            height: '380',
            target: this.grid,
            overflow: "hidden",
            isResize: true,
            onStopResize: function () {
                self.gridm._onResize();
            },
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    var selected = self.gridm.getCheckedRows();
                    if (selected.length > 0) {
                        callback.call(this, selected);
                        dialog.close();
                    } else {
                        leeUI.Error("请选中要引入的列信息！");
                    }
                }
            }, {
                text: '取消',
                cls: 'lee-dialog-btn-cancel ',
                onclick: function (item, dialog) {
                    dialog.close();
                }
            }]
        });
        this.gridm = this.grid.leeGrid({
            columns: [{
                display: '编号',
                name: 'Code',
                align: 'left',
                width: 100

            },
                {
                    display: '名称',
                    name: 'Name',
                    align: 'left',
                    width: 100
                }
            ],
            alternatingRow: false,
            usePager: true,
            parms: self.getColumnsParam(),
            url: _global.sitePath + '/DataModel/GetMainColumns',
            inWindow: false,
            height: "100%",
            checkbox: true,
            rownumbers: true,
            rowHeight: 30
        });
    },
    getColumnsParam: function () {
        var arr = [];

        arr.push({
            name: "modelid",
            value: this.dataModel.ModelID
        })


        return arr;
    },
    load: function () {
        var self = this;
        fBulider.core.dataService.requestApi("/SmartHelp/getModel", { dataid: this.getDataID() }, "正在加载...").done(function (data) {
            if (data.res) {
                self.setValue(data.data);
            }
        }).fail(function (data) {
            console.log(data);
        });
    }
});
$.validator.config({
    rules: {
        chinese: [/^[\u0391-\uFFE5]+$/, "请填写中文字符"],
        checkExits: function (element) {
            var data = JSON.stringify({
                TableName: "FBSmartHelp",
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


$(function () {
    $("#layout1").leeLayout({
        rightWidth: 300
    });

    $("#txtViewType").leeDropDown({
        data: [{ id: "0", text: "列表" }, { id: "1", text: "树列表" }, { id: "2", text: "树" }]
    });

    // 清空表单验证消息
    //$('#form1').validator("cleanUp");

    var mgr = new fBulider.page.HelpCardController();
    mgr.load();


});