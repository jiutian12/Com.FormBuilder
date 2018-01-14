/*自定义数据管理*/
fBulider.page.DSInfoController = function (options) {
    fBulider.page.DSInfoController.base.constructor.call(this, options); //父构造函数
};

fBulider.page.DSInfoController.leeExtend(fBulider.page.UIController, {
    init: function () {
    },
    bind: function () {
        $("#btnSave").click($.proxy(this.save, this));
        $("#btnDelete").click($.proxy(this.deleteDS, this));
        $("#btnSearch").click($.proxy(this.search, this));

    },
    render: function () {
        $("#tab").leeTab({
            onAfterSelectTabItem: function (tabid, id) {
                $(window).trigger("resize");
            }
        });
        this.initGrid();
    },
    refresh: function () {
        this.grid1.loadData(true);
        this.grid2.loadData(true);
    },
    initGrid: function () {
        this.grid1 = $("#grid1").leeGrid({
            columns: this.getGridOptions(),
            fixedCellHeight: true,
            alternatingRow: false,
            url: _global.sitePath + "/Form/getDSImport",
            height: "98%",
            usePager: true,
            rownumbers: true,
            parms: this.getParams,
            checkbox: true,
            rowHeight: 30
        });

        this.grid2 = $("#grid2").leeGrid({
            columns: this.getGridOptions(),
            fixedCellHeight: true,
            alternatingRow: false,
            url: _global.sitePath + "/Form/getDSNotImport",
            height: "98%",
            usePager: true,
            parms: this.getParams,
            rownumbers: true,
            checkbox: true,
            rowHeight: 30
        });
    },
    search: function () {
        this.grid2.loadData(true);
    },
    getParams: function () {
        var reobj = [];
        // 增加数据源ID

        var keyword = $("#txtkeyword").val();
        reobj.push({ name: "keyword", value: keyword });
        reobj.push({ name: "frmID", value: fBulider.utils.getQuery("dataid") });
        return reobj;
    },
    getGridOptions: function () {
        return [
            { display: '主键', name: 'ID', align: 'center', width: 250 },
            { display: '编号', name: 'Code', align: 'left', width: 130 },
            { display: '名称', name: 'Name', align: 'left', width: 150 },
            { display: '类型', name: 'DSType', align: 'center', width: 90 }
        ];
    },
    save: function () {
        var self = this;
        var selectrows = this.grid2.getCheckedRows();
        console.log(selectrows);

        var arr = [];
        $.each(selectrows, function (i, obj) {
            arr.push({
                ID: Guid.NewGuid().ToString(),
                FormID: self.getDataID(),
                DSID: obj.ID,
                GroupInfo: "",
                SingleLoad: "1"
            });
        });
        this._saveModel(arr);
    },
    deleteDS: function () {
        var self = this;
        var selectrows = this.grid1.getCheckedRows();
        console.log(selectrows);

        var arr = [];
        $.each(selectrows, function (i, obj) {
            arr.push(obj.ID);
        });
        this._deleteModel(arr.join(","));
    },
    getDataID: function () {
        return fBulider.utils.getQuery("dataid");
    },
    _saveModel: function (model) {
        var self = this;
        model = JSON.stringify(model);
        fBulider.core.dataService.requestApi("/Form/saveDsInfo", { frmID: this.getDataID(), model: model }, "正在保存...").done(function (data) {
            if (data.res) {
                leeUI.Success(data.mes);
                self.refresh();

            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    _deleteModel: function (ids) {
        var self = this;
        fBulider.core.dataService.requestApi("/Form/deleteDSInfo", { frmID: this.getDataID(), ids: ids }, "正在删除...").done(function (data) {
            if (data.res) {
                leeUI.Success(data.mes);
                self.refresh();
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    load: function () {
        var self = this;
        fBulider.core.dataService.requestApi("/DataSource/getModel", { dataid: this.getDataID() }, "正在加载...").done(function (data) {
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
                TableName: "FBDataSource",
                DataID: fBulider.utils.getQuery("dataid"),
                ValidField: "Code",
                ValidValue: element.value,
                Label: "编号",
                KeyField: "ID"
            });
            return $.ajax({
                url: _global.sitePath + '/Common/remoteCheck',
                type: 'post',
                data: { model: data },
                dataType: 'json'
            });
        }
    }
});

function setDSContainer(type) {
    $(".container").hide();
    if (type == "1" || type == "0") {
        $("#con_sql").show();
    } else if (type == "2") {
        $("#con_dll").show();
    }
    else if (type == "3") {
        $("#con_url").show();
    }
}
$(function () {
    $("#layout1").leeTab({
        onAfterSelectTabItem: function (tabid) {

            if (tabid == "grid") {
                $("#grid").leeUI()._onResize();
            }
        }
    });

    $("#txtDsType").leeDropDown({
        data: [
            { id: "0", text: "SQL" },
            { id: "1", text: "Proc" },
            { id: "2", text: "Reflect" },
            { id: "3", text: "远程URL" }
        ],
        onselected: function (value, text) {
            //alert(value);
            setDSContainer(value);
        }
    });



    // 清空表单验证消息
    //$('#form1').validator("cleanUp");

    var mgr = new fBulider.page.DSInfoController();
    //mgr.load();


});