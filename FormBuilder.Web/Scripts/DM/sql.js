$(function () {
    $("#layout1").leeLayout({
        leftWidth: 350
    });

    var mgr = new fBulider.page.ModelSQLController();
    mgr.load();

});


fBulider.page.ModelSQLController = function (options) {
    fBulider.page.ModelSQLController.base.constructor.call(this, options); //父构造函数
};

fBulider.page.ModelSQLController.leeExtend(fBulider.page.UIController, {
    init: function () {
        this.dataModel = {

        };
    },
    addRow: function () {
        this.currentModel = {
            ID: Guid.NewGuid().ToString(),
            ModelID: this.getDataID(),
            ActionType: "1", IsUsed: "1", SQLInfo: "", Tips: "说明"
        };
        this.lastID = this.currentModel.ID;
        var selected = this.grid.getSelected();
        if (selected)
            this.grid.unselect(selected);
        this.setValue(this.currentModel);
    },
    refreshGrid: function (data) {
        var self = this;
        this.grid = $("#gridList").leeGrid({
            columns: this.getColumns(),
            fixedCellHeight: true,
            alternatingRow: false,
            data: { Rows: data },
            height: "100%",
            usePager: false,
            rownumbers: true,
            rowHeight: 30,
            onSelectRow: function (g) {
                self.loadModel(g.ID);
                self.lastID = g.ID;
            },
            noDataRender: function () {
                return "暂无数据";
            }
        });
        var index = 0;
        if (this.lastID) {
            for (var item in data) {
                if (data[item].ID == this.lastID) {
                    index = item;
                    break;
                }
            }

        }



        this.grid.select(index);
        this.grid._onResize();
    },
    bind: function () {
        var self = this;
        $("#btnAdd").click($.proxy(this.addRow, this));
        $("#btnDelete").click($.proxy(this.deleteRow, this));
        $("#btnSave").click($.proxy(this.save, this));




        $("#txtActionType").leeDropDown({
            data: this.getActionTypeList()
        });


        this.editor = ace.edit("editor");

        this.editor.session.setMode("ace/mode/sql");
    },
    getActionTypeList: function () {
        return [
                { id: "0", text: "新增前" },
                { id: "1", text: "新增后" },
                { id: "2", text: "修改前" },
                { id: "3", text: "修改后" },
                { id: "4", text: "删除前" },
                { id: "5", text: "删除后" }

        ];
    },
    getColumns: function () {
        return [
           {
               display: '执行时机', name: 'ActionType', id: 'id', align: 'center', editor: {
                   type: "dropdown",
                   data: this.getActionTypeList()
               }, render: leeUI.gridRender.DropDownRender, width: 90
           },
           { display: '说明', name: 'Tips', align: 'left', width: 120 },
           { display: '是否启用', name: 'IsUsed', width: 80, render: leeUI.gridRender.ToogleRender, readonly: true }
        ];
    },
    setValue: function (data) {
        this.LastSelected = data.ID;
        this.dataModel = data;
        this.arr = $("[data-bind]");
        for (var i = 0; i < this.arr.length; i++) {
            var item = this.arr[i];
            var BindKey = $(item).attr("data-bind");
            var BindValue = "";
            if ($(item).leeUI()) {
                $(item).leeUI().setValue(this.dataModel[BindKey]);
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

        this.editor.setValue(this.dataModel["SQLInfo"]);
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
        this.dataModel["SQLInfo"] = this.editor.getValue();
        return this.dataModel;
    },
    getDataID: function () {
        return fBulider.utils.getQuery("dataid");
    },
    _saveModel: function () {
        var self = this;
        var model = JSON.stringify(this.getValue());
        fBulider.core.dataService.requestApi("/DataModelSQL/saveData", { data: model }, "正在保存...").done(function (data) {
            if (data.res) {
                leeUI.Success(data.mes);
                self.load();
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
                    mes.push(val.err);
                });
                leeUI.Error(mes.join("</br>"));
            }
        });
    },
    deleteRow: function () {
        var self = this;
        var selected = this.grid.getSelected();
        id = selected.ID;
        $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
            if (type) {
                fBulider.core.dataService.requestApi("/DataModelSQL/deleteData", { ID: id }, "正在删除....").done(function (data) {
                    if (data.res) {
                        leeUI.Success(data.mes);
                        self.load();
                    }
                }).fail(function (data) {
                    console.log(data);
                });
            }
        });
    },
    loadModel: function (id) {
        var self = this;
        fBulider.core.dataService.requestApi("/DataModelSQL/getModel", { id: id }, "正在加载...").done(function (data) {
            if (data.res) {
                self.setValue(data.data);
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    load: function () {
        //加载列表数据
        var self = this;
        fBulider.core.dataService.requestApi("/DataModelSQL/getList", { modelID: this.getDataID() }, "正在加载...").done(function (data) {
            if (data.res) {
                self.refreshGrid(data.data);
            }
        }).fail(function (data) {
            console.log(data);
        });
    }
});