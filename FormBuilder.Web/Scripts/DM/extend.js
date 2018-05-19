$(function () {


    var mgr = new fBulider.page.ExendController();
    mgr.load();

});
var columngrid;

fBulider.page.ExendController = function (options) {
    fBulider.page.ExendController.base.constructor.call(this, options); //父构造函数
};

fBulider.page.ExendController.leeExtend(fBulider.page.UIController, {
    init: function () {

        this.initGrid();
    },
    addRow: function () {
        this.currentModel = {
            ID: Guid.NewGuid().ToString(),
            ModelID: this.getDataID(),
            Assembly: "",
            ClassName: "",
            IsUsed: "1"
        };
        this.grid.addRow(this.currentModel);
    },
    initGrid: function () {
        var self = this;
        columngrid = this.grid = $("#gridExtend").leeGrid({
            columns: this.getColumns(),
            fixedCellHeight: true,
            alternatingRow: false,
            data: { Rows: [] },
            enabledEdit: true,
            height: "98%",
            usePager: false,
            rownumbers: true,
            rowHeight: 30,
            noDataRender: function () {
                return "暂无数据";
            }
        });
        this.grid._onResize();
    },
    bind: function () {
        var self = this;
        $("#btnAdd").click($.proxy(this.addRow, this));
        $("#btnDelete").click($.proxy(this.deleteRow, this));
        $("#btnSave").click($.proxy(this.save, this));

    },
    getColumns: function () {
        return [
           { display: '命名空间', name: 'Assembly', align: 'left', width: 240, editor: { type: "text" } },
           { display: '方法全称', name: 'ClassName', align: 'left', width: 360, editor: { type: "text" } },
           { display: '是否启用', name: 'IsUsed', width: 80, render: leeUI.gridRender.ToogleRender },
           {
               display: "操作",
               width: 80,
               render: function (g, rowindex, value, column, length) {
                   return "<a  class='rowbtn' onclick=\"delRow('" + g["__id"] + "')\"  href='javascript:void(0)' title='删除'  ><i class='lee-ion-minus-round'></i></a>";
               }
           }
        ];
    },
    save: function () {
        var data = this.grid.getData();
        var self = this;
        fBulider.core.dataService.requestApi("/ModelExtend/saveData", {
            modelID: this.getDataID(),
            data: JSON.stringify(data)
        }, "正在保存...").done(function (data) {
            if (data.res) {
                leeUI.Success("保存成功！");
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    getDataID: function () {
        return fBulider.utils.getQuery("dataid");
    },
    deleteRow: function () {
        var self = this;
        var selected = this.grid.getSelected();
        this.grid.deleteRow(selected);
    },
    loadData: function (data) {
        this.grid.loadData({ Rows: data });
    },
    load: function () {
        //加载列表数据
        var self = this;
        fBulider.core.dataService.requestApi("/ModelExtend/getList", { modelID: this.getDataID() }, "正在加载...").done(function (data) {
            if (data.res) {
                self.loadData(data.data);
            }
        }).fail(function (data) {
            console.log(data);
        });
    }
});

function delRow(rowid) {
    var rowdata = columngrid.getRow(rowid);

    columngrid.remove(rowdata);
}