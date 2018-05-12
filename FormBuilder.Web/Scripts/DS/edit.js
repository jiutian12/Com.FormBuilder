
fBulider.page.DSCardController = function (options) {
    fBulider.page.DSCardController.base.constructor.call(this, options); //父构造函数
};

fBulider.page.DSCardController.leeExtend(fBulider.page.UIController, {
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

        $("#tipIsUpdate").LeeToolTip();

        this.editor = ace.edit("editor");
        //this.editor.setTheme("ace/theme/twilight");
        this.editor.session.setMode("ace/mode/sql");
    },
    addRow: function () {
        this.gridMgr["grid"].addRow(this.getChildSchema());
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
            { display: '编号', name: 'Code', align: 'left', width: 130, editor: { type: "text" } },
            { display: '名称', name: 'Name', align: 'left', width: 150, editor: { type: "text" } },
            {
                display: '数据类型', name: 'DataType', align: 'center', width: 140, editor: {
                    type: "dropdown",
                    data: fBulider.defaults.datatype
                },
                render: leeUI.gridRender.DropDownRender
            }
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

                if (BindKey == "Tree") {
                    $(item).leeUI().setText(this.dataModel[BindKey]);
                }
            } else {
                var type = $(item).attr("type");
                if (type == "text" || $(item).is("textarea")) {
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
        setDSContainer(this.dataModel["DsType"]);
        this.editor.setValue(this.dataModel["SqlInfo"]);
    },
    setGridValue: function (grid, data) {
        this.gridMgr["grid"].loadData({ Rows: data });
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
                if (type == "text" || $(item).is("textarea")) {
                    BindValue = $(item).val();
                }
                else if (type == "checkbox") {
                    BindValue = $(item).prop("checked") ? "1" : "0";
                }
            }
            this.dataModel[BindKey] = BindValue;
        }
        this.dataModel["ColList"] = this.gridMgr["grid"].getData();
        this.dataModel["SqlInfo"] = this.editor.getValue();
        return this.dataModel;
    },
    bind: function () {
        $("#btnAddRow").click($.proxy(this.addRow, this));
        $("#btnSave").click($.proxy(this.save, this));
        $("#btnDelete").click($.proxy(this.removeRow, this));

    },
    render: function () {

    },
    getDataID: function () {
        return fBulider.utils.getQuery("dataid");
    },
    _saveModel: function () {
        var model = JSON.stringify(this.getValue());

        fBulider.core.dataService.requestApi("/DataSource/SaveData", { model: model }, "正在保存...").done(function (data) {
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
    addRow: function (data) {
        var self = this;
        var arr = [];
        $("#layout1").leeUI().selectTabItem("grid");
        var row = {
            "ID": Guid.NewGuid().ToString(),
            "Code": "",
            "Name": "",
            "DataType": "0"
        };
        arr.push(row);


        this.gridMgr["grid"].addRows(arr);
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
                url: _global.sitePath + '/CommonFB/remoteCheck',
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

    fBulider.core.dataService.requestApi("/Settings/GetDBSource", { keyword: "" }, "正在加载...").done(function (data) {
        if (data.res) {

            var arr = [];
            $.each(data.data, function (i, obj) {
                arr.push({ id: obj["Code"], text: obj["Code"] + "[" + obj["Name"] + "]" });
            });

            $("#txtDsCode").leeDropDown({ data: arr });
        }
    }).fail(function (data) {
        console.log(data);
    });
    //GetDBSource


    var $injector = new $.leeUI.PopUp.TreeEditInjector({
        title: "配置分级信息",
        width: 400, height: 300, getData: function () {
            var arr = [];
            var data = $("#grid").leeUI().getData();
            $.each(data, function (i, val) {
                arr.push({ text: val.Name, id: val.Code });
            });
            return arr;
        }, getValue: function () {
            return $("#txtTree").leeUI().getValue();
        }
    });

    $("#txtTree").leePopup({
        onButtonClick: $.leeUI.PopUp.Lookup($injector),
        onValuechange: function (row) {

        }
    });

    // 清空表单验证消息
    //$('#form1').validator("cleanUp");

    var mgr = new fBulider.page.DSCardController();
    mgr.load();


});





$.leeUI.PopUp.TreeEditInjector = function (options) {
    this.options = options;
    this.init();
}

$.leeUI.PopUp.TreeEditInjector.prototype = {
    init: function () {


    },
    initUI: function () {
        var g = this,
            p = this.options;
        if (!this.initflag) {
            this.tab.leeTab({});

            // this.initflag = true;
            this.tab.find("input[data-toogle='dropdown']").leeDropDown({ data: p.getData() });

        } else {
            this.tab.find("input[data-toogle='dropdown']").leeUI().setData(p.getData());
        }
        var obj = $.parseJSON(p.getValue());
        if (obj) {
            this.arr = this.tab.find("[data-bind]");
            for (var i = 0; i < this.arr.length; i++) {
                var item = this.arr[i];
                var BindKey = $(item).attr("data-bind");
                var BindValue = "";
                if ($(item).leeUI()) {
                    $(item).leeUI().setValue(obj[BindKey]);
                }
            }
        }



    },
    clearSearch: function () {

    },
    getOptions: function () {
        return this.options;
    },
    clear: function () {
        this.tab.find("input").leeUI().clear();
        delete this.tab;
        delete this.wrap;
    },
    getRenderDom: function () {
        this.wrap = $("<div style='font-size:12px;position:absolute;top:1px;left:1px;bottom:1px;right:1px;'></div>");

        var htmlarr = [];

        htmlarr.push("<div class='tabltree' style='overflow:hidden;'>");

        htmlarr.push("  <div title='基础' style='padding:10px;'>");
        htmlarr.push("    <table class='lee-form'>");
        htmlarr.push("      <tr><td>编号字段</td><td><input data-bind='treecode'   type='text' data-toogle='dropdown' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>名称字段</td><td><input data-bind='treename'   type='text' data-toogle='dropdown' class='lee-input'/></td></tr>");
        htmlarr.push("    </table>");
        htmlarr.push("  </div>");

        htmlarr.push("  <div title='分级码' style='padding:10px;'>");
        htmlarr.push("    <table class='lee-form'>");
        htmlarr.push("      <tr><td>分级码字段</td><td><input data-bind='grade' data-toogle='dropdown' type='text' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>级数字段</td><td><input type='text'  data-toogle='dropdown' data-bind='level' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>明细字段</td><td><input data-toogle='dropdown' data-bind='isdetail' type='text' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>分级码格式</td><td><input type='text' data-bind='format' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>起始级数</td><td><input type='text' data-bind='rootlevel' class='lee-input'/></td></tr>");
        htmlarr.push("    </table>");
        htmlarr.push("  </div>");
        htmlarr.push("  <div title='父子' style='padding:10px;'>");
        htmlarr.push("    <table  class='lee-form'>");
        htmlarr.push("      <tr><td>ID</td><td><input data-toogle='dropdown' data-bind='id' type='text' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>ParentID</td><td><input data-toogle='dropdown' data-bind='parentid' type='text' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>明细字段</td><td><input type='text' data-bind='ischild' data-toogle='dropdown' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>根节点值</td><td><input type='text' data-bind='rootvalue' class='lee-input'/></td></tr>");

        htmlarr.push("  </div>");
        htmlarr.push("</div>");

        this.tab = $(htmlarr.join(""));
        this.wrap.append(this.tab);
        return this.wrap;
    },

    onResize: function () { },
    onConfirm: function (popup, dialog, $injector) {
        var p = $injector.options;
        var obj = {};
        //触发选中事件
        this.arr = $injector.tab.find("[data-bind]");
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
            obj[BindKey] = BindValue;//获取选中值
            popup.setText(JSON.stringify(obj));
            popup.setValue(JSON.stringify(obj));
        }


        return true;
    }
};
