
fBulider.page.CMPCardController = function (options) {
    fBulider.page.CMPCardController.base.constructor.call(this, options); //父构造函数
};


fBulider.page.CMPCardController.leeExtend(fBulider.page.UIController, {
    init: function () {
        var self = this;
        $("#layout1").leeLayout({ rightWidth: 440, centerBottomHeight: 300 });
        this.dataModel = {
        };
        this.gridMgr = {};
        this.selectrow = null;
        this.grid1 = $("#grid").leeGrid({
            columns: self.getGridMethodOptions(),
            fixedCellHeight: true,
            alternatingRow: false,
            data: { Rows: [] },
            height: "100%",
            inWindow: false,
            usePager: false,
            rownumbers: true,
            enabledEdit: true,
            heightDiff: -2,
            rowHeight: 30,
            onBeforeSelectRow: function (rowdata, rowid, rowobj) {

                if (self.selectrow)
                    self.selectrow.ParaList = self.grid2.getData();
            },
            onSelectRow: function (rowdata) {
                //
                self.selectrow = rowdata;
                self.gridMethodChange(rowdata.ParaList);
            }
        });
        this.grid1._onResize();
        this.grid2 = $("#grid2").leeGrid({
            columns: self.getGridParaOptions(),
            fixedCellHeight: true,
            alternatingRow: false,
            data: { Rows: [] },
            height: "100%",
            usePager: false,
            rownumbers: true,
            enabledEdit: true,
            heightDiff: -2,
            rowHeight: 30
        });

        this.initUpload();

    },

    initUpload: function () {
        var self = this;
        var BASE_URL = _global.sitePath + "/DList/webupload";
        var uploader = WebUploader.create({
            auto: true,
            duplicate: true,
            swf: BASE_URL + '/Uploader.swf',
            server: _global.sitePath + "/CMP/getMethodList",
            pick: $("#btnUpload")
        });

        uploader.on('uploadSuccess', function (file, response) {
            if (response.res) {
                self.openDialog(response.data);

            } else {
                leeUI.Error(response.mes)
            }
        });
    },

    openDialog: function (assData) {

        var self = this;
        this.hashData = {};
        this.hashMethod = {};
        var data = [];


        $.each(assData, function (i, obj) {
            if (!self.hashData[obj.AssemblyName]) {
                self.hashData[obj.AssemblyName] = {
                    ID: obj.AssemblyName, Name: obj.AssemblyName, ParentID: "", children: []
                };
            }
            self.hashData[obj.AssemblyName].children.push({
                ID: obj.ClassName,
                Name: obj.ClassName,
                ParentID: obj.AssemblyName,
                isSelect: true
            });
            self.hashMethod[obj.AssemblyName + "." + obj.ClassName] = obj;
        });


        $.each(this.hashData, function (key, value) {
            data.push(value);
        });


        //$("#treeInfo").leeUI().destroy();
        $("#treeInfo").leeTree({
            data: data,
            idFieldName: 'ID',
            textFieldName: "Name",
            parentIDFieldName: "ParentID",
            checkbox: false,
            onSelect: function (data) {
                return false;
                // self.onSelect(data);
            },
            onBeforeSelect: function (data) {
                return data.data.isSelect ? true : false;

            },
            onCancelselect: function (data, treeitem) {
                //console.log(data.data);
                //console.log(data.target);
            }
        });

        this.dialog = $.leeDialog.open({
            title: "选择导入的类",
            width: "400",
            height: '355',
            target: $("#dialog_create"),
            targetBody: true,
            isResize: true,
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    var selected = $("#treeInfo").leeUI().getSelected();
                    if (selected) {
                        self.confirmAdd(selected.data);
                        dialog.close();
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

    },
    confirmAdd: function (selected) {

        var data = this.hashMethod[selected.ParentID + "." + selected.ID].MethodList;
        $("#txtAssemblyName").val(selected.ParentID);
        $("#txtClassName").val(selected.ID);
        this.setGridValue(data);


    },
    addRow: function () {
        //this.gridMgr["grid"].addRow(this.getChildSchema());
    },
    removeRow: function () {
        //var selected = this.gridMgr["grid"].getSelected();
        //this.gridMgr["grid"].remove(selected);
    },
    getModel: function () {

    },
    getGridMethodOptions: function () {
        return [
            { display: '方法名', name: 'MethodName', align: 'left', width: 180, editor: { type: "text" } },
            {
                display: '返回类型', name: 'ReturnType', align: 'left', width: 180, editor: {
                    type: "dropdown",
                    data: [
                        { id: "0", "text": "void" },
                        { id: "1", "text": "System.String" },
                        { id: "2", "text": "Dictionnary<string,object>" },
                        { id: "3", "text": "System.Data.DataSet" },
                        { id: "4", "text": "System.Data.DataTable" }
                    ]
                }, render: leeUI.gridRender.DropDownRender
            },
            { display: '备注', name: 'Note', align: 'left', width: 120, editor: { type: "text" } }
        ];
    },
    getGridParaOptions: function () {
        return [
            { display: '参数名称', name: 'ParamName', align: 'left', width: 130, editor: { type: "text" } },
            {
                display: '参数类型', name: 'ParamType', align: 'left', width: 150, editor: {
                    type: "dropdown",
                    data: [
                        { id: "1", "text": "System.String" },
                        { id: "2", "text": "Dictionnary<string,object>" },
                        { id: "3", "text": "System.Data.DataSet" },
                        { id: "4", "text": "System.Data.DataTable" }
                    ]
                }, render: leeUI.gridRender.DropDownRender
            },
            { display: '备注', name: 'Note', align: 'left', width: 150, editor: { type: "text" } }
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
        this.setGridValue(data.MethodList);

    },
    setGridValue: function (data) {
        this.grid1.loadData({ Rows: data });
        if (data.length > 0) {
            this.grid1.select(0);
        }
    },
    setGridParaValue: function (data) {
        this.grid2.loadData({ Rows: data });
    },
    gridMethodChange: function (data) {

        this.setGridParaValue(data);
    },
    getGridParaData: function (id) {
        return [];
    },
    getChildSchema: function () {
        return {
        };
    },
    getValue: function () {
        this.selectrow.ParaList = this.grid2.getData();//保存当前数据
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

        this.dataModel["MethodList"] = this.grid1.getData();
        console.log(this.dataModel);
        //this.dataModel["SqlInfo"] = this.editor.getValue();
        return this.dataModel;
    },
    bind: function () {
        $("#btnAddRow").click($.proxy(this.addRow, this));
        $("#btnAddPara").click($.proxy(this.addPara, this));
        $("#btnSave").click($.proxy(this.save, this));
        //$("#btnDelete").click($.proxy(this.removeRow, this));

    },
    render: function () {

    },
    getDataID: function () {
        return fBulider.utils.getQuery("dataid");
    },
    _saveModel: function () {
        var model = JSON.stringify(this.getValue());

        fBulider.core.dataService.requestApi("/CMP/SaveData", { model: model }, "正在保存...").done(function (data) {
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
    addRow: function () {
        var self = this;
        var arr = [];

        var row = {
            "ID": Guid.NewGuid().ToString(),
            "CMPID": this.dataModel.ID,
            "MethodName": "",
            "ReturnType": "",
            "Note": "",
            "ParaList": []
        };
        arr.push(row);


        this.grid1.addRows(arr);
        var data = this.grid1.getData();
        this.grid1.select(data.length - 1);
    },
    addPara: function (data) {
        if (!this.selectrow) {
            leeUI.Error("请选中方法列表！");
            return;
        }
        var self = this;
        var arr = [];

        var row = {
            "ID": Guid.NewGuid().ToString(),
            "CMPID": this.selectrow.ID,
            "MethodID": "",
            "ParamName": "",
            "ParamType": "",
            "Note": ""
        };
        arr.push(row);


        this.grid2.addRows(arr);
    },
    load: function () {
        var self = this;
        fBulider.core.dataService.requestApi("/CMP/getModel", { dataid: this.getDataID() }, "正在加载...").done(function (data) {
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





    // 清空表单验证消息
    //$('#form1').validator("cleanUp");

    var mgr = new fBulider.page.CMPCardController();
    mgr.load();


});




