
/*表单工具栏定义类*/
fBulider.page.ToolBarController = function (options) {
    fBulider.page.ToolBarController.base.constructor.call(this, options); //父构造函数
};
fBulider.page.ToolBarController.leeExtend(fBulider.page.UIController, {
    init: function () {
        this.dataModel = {
            ID: "", FormID: "", BarID: "",
            IsRoot: "", BarType: "", TypeOptions: "",
            Icon: "", Func: "", ParentID: "", Ord: "",
            IsUsed: "", IsSys: "", BizObject: "",
            Text: "", IsFixed: "0", PropName: ""
        };
    },
    setWrap: function (selected) {

        if (selected.indexOf("lee-ion") != -1) {
            $(".preview").html('<i style="font-size:18px;" class="' + selected + '"></i>');
        }
        else {
            $(".preview").html('<i style="font-size:18px;height:16px;width:16px;display:block;margin: 0 auto;margin-top: 6px;" class="' + selected + '"></i>');
        }
    },
    openIconSelect: function () {
        var self = this;
        var dialog = $.leeDialog.open({
            title: '选择图标',
            name: 'winselector',
            isHidden: false,
            showMax: true,
            width: "900",
            slide: false,
            height: "380",
            url: _global.sitePath + "/Common/icons",
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    var selected = window.frames["winselector"].getSelectIcon();
                    if (selected) {
                        self.setWrap(selected);
                        $("#txtIcon").val(selected);
                        dialog.close();
                    } else {
                        leeUI.Error("请选中图标");
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
        })
    },
    getSysModuleFunc: function () {
        //获取系统按钮 以及方法
        //字典 增加 修改 删除 增加同级 增加下级 
        //卡片 保存
        //列表 新增 修改 删除 查看 
    },
    addToolBar: function () {
        var self = this;
        var schema = this.dataModel;
        schema.IsRoot = "1";
        schema.BarID = "";
        schema.FormID = this.getDataID();
        schema.Text = "工具条";
        schema.IsUsed = "1";
        fBulider.core.dataService.requestApi("/Form/addToolBar", { model: JSON.stringify(schema) }, "正在添加...").done(function (data) {
            if (data.res) {
                self.load();
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    addToolBarItem: function () {
        var selected = $("#toolbartree").leeUI().getSelected().data;
        this.currentModel = {
            ID: "", FormID: this.getDataID(), BarID: "",
            IsRoot: "0", BarType: "1", TypeOptions: "{}",
            Icon: "", Func: "", ParentID: "", Ord: "",
            IsUsed: "1", IsSys: "", BizObject: "",
            Text: "", IsFixed: "0", PropName: ""
        };
        if (selected.IsRoot == "1") {
            this.currentModel.BarID = selected.ID;
        }
        else {
            this.currentModel.BarID = selected.BarID;
        }
        this.currentModel.ParentID = selected.ID;
        this.setValue(this.currentModel);
    },
    refreshTree: function (data) {
        var self = this;
        $("#toolbartree").leeTree({
            data: $.extend(true, [], data),
            idFieldName: 'ID',
            needCancel: false,
            parentIcon: "folder",
            childIcon: "leaf",
            textFieldName: "Text",
            parentIDFieldName: "ParentID",
            iconClsFieldName: "Icon",
            checkbox: false,
            onSelect: function (data) {
                self.onSelect(data);
            },
            onCancelselect: function (data, treeitem) {
            }
        });


        if (this.LastSelected)
            $("#toolbartree").leeUI().selectNode(this.LastSelected);
        else if (data.length > 0) {
            $("#toolbartree").leeUI().selectNode(data[0]["ID"]);
        }
        $("#txtParentID").leeUI().setTree({
            data: $.extend(true, [], data),
            idFieldName: 'ID',
            needCancel: false,
            textFieldName: "Text",
            parentIDFieldName: "ParentID",
            checkbox: false
        });


    },
    setEnable: function (value) {

        if (value == "3") {
            $("#btnStyle").show();
        } else {
            $("#btnStyle").hide();
        }

    },
    bind: function () {
        var self = this;
        $("#btnAddToolbar").click($.proxy(this.addToolBar, this));
        $("#btnAddItem").click($.proxy(this.addToolBarItem, this));
        $("#btnSave").click($.proxy(this.save, this));

        $("#btnOpenIconSelect").click($.proxy(this.openIconSelect, this));
        $("#btnRemoveToolbar").click($.proxy(this.deleteToolBar, this));
        $("#txtBarType").leeDropDown({
            data: [
                { id: "0", text: "分隔条" },
                { id: "1", text: "工具项" },
                { id: "2", text: "下拉菜单" },
                { id: "7", text: "下拉菜单（分组标题）" },
                { id: "3", text: "按钮" },
                { id: "4", text: "搜索框" },
                { id: "5", text: "超链接" },
                { id: "9", text: "标题" }

            ],
            onselected: function (value, text) {

                self.setEnable(value);
            }
        });

        $("#txtBtnStyle").leeDropDown({
            data: [
                { id: "1", text: "default" },
                { id: "2", text: "primary" },
                { id: "3", text: "sucess" },
                { id: "4", text: "info" },
                { id: "5", text: "danger" }

            ]
        });


        $("#txtAlign").leeDropDown({
            data: [
                { id: "0", text: "左对齐" },
                { id: "1", text: "右对齐" }
            ]
        });


        var fsmid = $("#txtFSMID").val();
        var data = [];
        if (fsmid) {
            data = _FSM[fsmid].actions;
            $("#FSMName").html(_FSM[fsmid].name);
        }
        $("#txtAction").leeDropDown({
            data: data
        });


        this.editor = ace.edit("editor");

        this.editor.session.setMode("ace/mode/javascript");


        $("#txtParentID").leeDropDown({
            valueField: "ID",
            textField: "Text",
            treeLeafOnly: false,
            tree: {}
        });

        $(".addToolbar li a").click(function () {

            var type = $(this).attr("data-id");
            self.openImportBtn(type)
        });
    },
    openImportBtn: function (type) {
        var node = $("#toolbartree").leeUI().getSelected();
        var self = this;
        if (node && node.data.BarType.trim() == "") {
            var id = node.data.ID;

            $.leeDialog.confirm("确认要引入改模板下的按钮吗？", "提示", function (result) {
                if (result) {
                    var modeldata = toolbarBaiscList[type];
                    for (var i = 0; i < modeldata.length; i++) {
                        modeldata[i].FormID = self.getDataID();
                        modeldata[i].BarID = id;
                        modeldata[i].ParentID = id;
                    }
                    fBulider.core.dataService.requestApi("/Form/saveToolBarList", { model: JSON.stringify(modeldata) }, "正在导入....").done(function (data) {
                        if (data.res) {
                            leeUI.Success(data.mes);
                            self.load();
                        }
                    }).fail(function (data) {
                        console.log(data);
                    });
                }
            });
        } else {
            leeUI.Error("请选择要左侧导入的工具条");
        }

    },
    onSelect: function (data) {
        this.setValue(data.data);

    },
    render: function () {
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

        this.editor.setValue(this.dataModel["Func"]);
        this.setWrap(data["Icon"]);
        this.setEnable(data["BarType"])
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
        this.dataModel["Func"] = this.editor.getValue();
        return this.dataModel;
    },
    getDataID: function () {
        return fBulider.utils.getQuery("dataid");
    },
    _saveModel: function () {
        var self = this;
        var model = JSON.stringify(this.getValue());
        fBulider.core.dataService.requestApi("/Form/saveToolBar", { model: model }, "正在保存...").done(function (data) {
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
    deleteToolBar: function () {
        var self = this;
        var selected = $("#toolbartree").leeUI().getSelected().data;
        id = selected.ID;
        $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
            if (type) {
                fBulider.core.dataService.requestApi("/Form/removeToolBar", { ID: id }, "正在删除....").done(function (data) {
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
    load: function () {
        //初始化加载左侧树数据
        var self = this;
        fBulider.core.dataService.requestApi("/Form/getToolBarTree", { dataid: this.getDataID() }, "正在加载...").done(function (data) {
            if (data.res) {
                self.refreshTree(data.data);
            }
        }).fail(function (data) {
            console.log(data);
        });
    }
});
$(function () {
    $("#layout1").leeLayout({
        leftWidth: 250
    });
    var mgr = new fBulider.page.ToolBarController();
    mgr.load();


});


// 标准的按钮
var toolbarBaiscList = {
    "0": [
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "icon-add ", "Func": "return Page.UI.instance.add()", "ParentID": "", "Ord": "0", "IsUsed": "0", "IsSys": " ", "BizObject": "", "Text": "增加", "IsFixed": "0", "PropName": "btnAddSame", "Align": " ", "Action": "adddown" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "icon-add ", "Func": "return Page.UI.instance.addSame()", "ParentID": "", "Ord": "5", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "增加同级", "IsFixed": "0", "PropName": "btnAddSame", "Align": " ", "Action": "adddown" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "lee-ion-arrow-down-c", "Func": "return Page.UI.instance.addChild()", "ParentID": "", "Ord": "10", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "增加下级", "IsFixed": "0", "PropName": "btnAddDown", "Align": " ", "Action": "adddown" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "lee-ion-plus-round", "Func": "return  true;", "ParentID": "", "Ord": "15", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "编辑", "IsFixed": "0", "PropName": "btnEdit", "Align": " ", "Action": "modify" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "", "Func": "return Page.UI.instance.cancel();\nreturn  true;", "ParentID": "", "Ord": "20", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "取消", "IsFixed": "0", "PropName": "btnCancel", "Align": " ", "Action": "cancel" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "", "Func": "return Page.UI.instance.deleteData()", "ParentID": "", "Ord": "25", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "删除", "IsFixed": "0", "PropName": "btnDelete", "Align": " ", "Action": "delete" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "", "Func": "return Page.UI.instance.saveData()", "ParentID": "", "Ord": "30", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "保存", "IsFixed": "0", "PropName": "btnSave", "Align": " ", "Action": "save" }
    ],
    "1": [

         { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "lee-ion-plus-round", "Func": "return Page.UI.instance.addRow();", "ParentID": "", "Ord": "5", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "增加行", "IsFixed": "0", "PropName": "btnAddRow", "Align": " ", "Action": null },
         { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "lee-ion-minus", "Func": "return Page.UI.instance.deleteRow();", "ParentID": "", "Ord": "10", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "删除行", "IsFixed": "0", "PropName": "btnDeleteRow", "Align": " ", "Action": "" },
         { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "lee-ion-document", "Func": "return Page.UI.instance.openForm(\"\",\"表单ID\",\"card\",\"add\",\"\");\n", "ParentID": "", "Ord": "15", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "增加", "IsFixed": "0", "PropName": "btnAddCard", "Align": " ", "Action": "" },
         { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "lee-ion-android-done", "Func": "return Page.UI.instance.saveData();", "ParentID": "", "Ord": "20", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "保存", "IsFixed": "0", "PropName": "btnSave", "Align": " ", "Action": null },
         { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "lee-ion-edit", "Func": "return Page.UI.instance.editCard(\"表单ID\",\"\");", "ParentID": "", "Ord": "25", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "修改", "IsFixed": "0", "PropName": "btnEdit", "Align": " ", "Action": "" },
         { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "lee-ion-backspace", "Func": "return Page.UI.instance.close();", "ParentID": "", "Ord": "30", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "关闭", "IsFixed": "0", "PropName": "btnClose", "Align": " ", "Action": null }
    ],
    "2": [
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "lee-ion-arrow-up-a", "Func": "return Page.UI.instance.add()", "ParentID": "", "Ord": "0", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "新增", "IsFixed": "0", "PropName": "btnAdd", "Align": " ", "Action": "add" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "icon-tfs-tcm-edit-test ", "Func": "return Page.UI.instance.edit()", "ParentID": "", "Ord": "5", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "编辑", "IsFixed": "0", "PropName": "btnEdit", "Align": " ", "Action": "modify" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "icon-undo ", "Func": "return Page.UI.instance.cancel()", "ParentID": "", "Ord": "15", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "取消", "IsFixed": "0", "PropName": "btnCancel", "Align": " ", "Action": "cancel" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "icon-save ", "Func": "return Page.UI.instance.saveData()", "ParentID": "", "Ord": "20", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "保存", "IsFixed": "0", "PropName": "btnSave", "Align": " ", "Action": "save" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "icon-delete ", "Func": "return Page.UI.instance.close()", "ParentID": "", "Ord": "25", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "关闭", "IsFixed": "0", "PropName": "btnClose", "Align": " ", "Action": "" }
    ],
    "3": [
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "", "Func": "return Page.UI.instance.addGridRow(g.options.gridid);", "ParentID": "", "Ord": "0", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "添加行", "IsFixed": "0", "PropName": "addGridRow", "Align": " ", "Action": "edit" },
        { "ID": "", "FormID": "", "BarID": "", "IsRoot": "0", "BarType": "1", "Icon": "", "Func": "return Page.UI.instance.deleteGridRow(g.options.gridid);", "ParentID": "", "Ord": "10", "IsUsed": "1", "IsSys": " ", "BizObject": "", "Text": "删除行", "IsFixed": "0", "PropName": "deleteGridRow", "Align": " ", "Action": "edit" },
    ]

}

