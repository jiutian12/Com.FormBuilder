(function (window, $) {
    function cardManager() {
        this.init();
    };
    cardManager.prototype = {
        init: function () {
            this.grid = $("#grid");

            $("#addModifyRow").click($.proxy(this.addModifyCheck, this));
            $("#deleteModifyRow").click($.proxy(this.removeModifyCheck, this));
            $("#deleteDeleteRow").click($.proxy(this.removeModifyCheck, this));
            $("#addDeleteRow").click($.proxy(this.addDeleteCheck, this));

        },
        setValue: function (data) {
            this.setCard(data);
            this.setList({ Rows: data.ColList });
            this.setCheckList({ Rows: data.DeleteCheckList });
            this.setModifyCheckList({ Rows: data.ModifyCheckList })
        },
        deleteCol: function () {
            var self = this;
            var selected = this.grid.getSelected();

            if (selected["isPrimary"] == "1") {
                leeUI.Error("主键不能删除");
                return false;
            }
            if (selected["Code"] == $("#txtCondition").val()) {
                leeUI.Error("主从关联键不能删除");
                return false;
            }
            DataService.checkCol(selected["ModelID"], selected["ModelObjectID"], selected["Label"]).done(function (data) {
                if (data.res) {
                    self.grid.remove(selected);
                } else {
                    leeUI.Error(data.mes);
                }
            }).fail(function (data) {
                $.leeDialog.hideLoading();
            });


        },
        addVirtualColumn: function () {


            var obj = {
                "ID": Guid.NewGuid().ToString(),
                "ModelID": BaseManger.getDataModelID(),
                "ModelObjectID": TreeManager.getSelectModelObjectID(),
                "isPrimary": "0",
                "Code": "",
                "Label": "",
                "Name": "",
                "DataType": "varchar",
                "Length": "50",
                "isList": "1",
                "isCard": "1",
                "isReadOnly": "0",
                "isUpdate": "1",
                "isVirtual": "1",
                "VirtualExpress": "",
                "ParentID": "",
                "RelationID": "",
                "isRelated": "0"
            };

            this.grid.addRows(obj);
        },
        existObjectCode: function (code) {
            var data = this.grid.getData();
            return data.find(function (i) {
                return i.Code.toUpperCase() == code.toUpperCase();
            });

        },
        addList: function (data) {
            var arr = [];
            var self = this;
            $.each(data, function (i, obj) {

                if (!self.existObjectCode(obj.Code)) {
                    var row = {
                        "ID": Guid.NewGuid().ToString(),
                        "ModelID": BaseManger.getDataModelID(),
                        "ObjectID": obj.ObjectID,
                        "Code": obj.Code,
                        "Label": obj.Code,
                        "Name": obj.Name,
                        "DataType": obj.DataType,
                        "Length": obj.Length,
                        "isPrimary": obj.IsPrimary ? "1" : "0",
                        "isList": "1",
                        "isCard": "1",
                        "isReadOnly": "0",
                        "isUpdate": "1",
                        "isVirtual": "0",
                        "VirtualExpress": "",
                        "ParentID": "",
                        "RelationID": "",
                        "isRelated": "0"
                    };
                    arr.push(row);
                }
            });
            this.grid.addRows(arr);
        },
        setCard: function (data) {
            //主表赋值
            this.dataModel = data;
            this.arr = $("[data-bind]", "#modelattr");
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
                    }
                }
            }
            //if (this.status == "edit") {
            $("#form").validator("cleanUp");//清除表单验证的全部消息
        },
        setList: function (data) {
            this.grid = $("#grid").leeGrid({
                columns: this.getColumns(),
                fixedCellHeight: true,
                alternatingRow: false,
                data: data,
                height: "99%",
                usePager: false,
                rownumbers: true,
                enabledEdit: true,
                rowHeight: 30,
                onBeforeEdit: function (editParm) {
                    var record = editParm.record;
                    var column = editParm.column;
                    var rowindex = editParm.rowindex;
                    console.log(editParm);
                    if (record.isRelated == "1")
                        return false;

                    if ((column.columnname == "Code") && record.isVirtual != "1") {
                        return false;
                    }
                    return true;

                },
                tree: {
                    columnId: 'id',
                    idField: 'ID',
                    childrenName: "children",
                    parentIDField: "ParentID",
                    isExtend: function (data) {

                        return true;
                    },
                    isParent: function (data) {

                        return data.children && data.children.length > 0;
                    }
                }
            });
            this.grid._onResize();
        },
        setCheckList: function (data) {

            this.gridCheck = $("#gridCheck").leeGrid({
                columns: this.getCheckColumns(),
                fixedCellHeight: true,
                alternatingRow: false,
                data: data,
                height: "99%",
                usePager: false,
                rownumbers: true,
                enabledEdit: true,
                rowHeight: 30,
                onBeforeEdit: function (editParm) {
                    var record = editParm.record;
                    var column = editParm.column;
                    var rowindex = editParm.rowindex;
                    console.log(editParm);
                    return true;

                }
            });
            this.gridCheck._onResize();
        },
        setModifyCheckList: function (data) {

            this.gridModifyCheck = $("#gridModifyCheck").leeGrid({
                columns: this.getModifyCheckColumns(),
                fixedCellHeight: true,
                alternatingRow: false,
                data: data,
                height: "99%",
                usePager: false,
                rownumbers: true,
                enabledEdit: true,
                rowHeight: 30
            });
            this.gridModifyCheck._onResize();
        },
        addModifyCheck: function () {
            this.gridModifyCheck.addRows({
                ID: Guid.NewGuid().ToString(),
                ModelID: BaseManger.getDataModelID(),
                ObjectID: TreeManager.getSelectModelObjectID(),
                RelationID: "",
                RefFilter: "",
                IsUsed: "1",
                TableName: "",
                ExtendFilter: "",
                DeleteTip: ""
            });
        },
        addDeleteCheck: function () {
            this.gridCheck.addRows({
                ID: Guid.NewGuid().ToString(),
                ModelID: BaseManger.getDataModelID(),
                ObjectID: TreeManager.getSelectObjectID(),
                IsUsed: "1",
                TableName: "",
                Filter: "",
                Tips: ""
            });
        },
        removeModifyCheck: function () {

            var selected = this.gridModifyCheck.getSelected();
            if (selected) {
                this.gridModifyCheck.remove(selected);
            } else {
                leeUI.Error("请选择要删除的数据！");
            }


        },
        getValue: function () {
            this.arr = $("[data-bind]", "#modelattr");
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
            this.dataModel["ColList"] = this.grid.getData();
            this.dataModel["DeleteCheckList"] = this.gridCheck.getData();

            this.dataModel["ModifyCheckList"] = this.gridModifyCheck.getData();

            return this.dataModel;
        },
        getCheckColumns: function () {
            return [
             { display: '引用表名', name: 'TableName', id: 'id', align: 'left', width: 130, minWidth: 60, editor: { type: "text" } },
             { display: '启用验证', name: 'IsUsed', width: 80, render: leeUI.gridRender.ToogleRender },
             { display: '关联条件', name: 'RefFilter', align: 'left', width: 200, editor: { type: "text" } },
             { display: '扩展条件', name: 'ExtendFilter', align: 'left', width: 200, editor: { type: "text" } },
             { display: '删除提示', name: 'DeleteTip', width: 290, editor: { type: "text" } }
            ];
        },
        getModifyCheckColumns: function () {
            return [
             { display: '启用验证', name: 'IsUsed', width: 80, render: leeUI.gridRender.ToogleRender },
             { display: '表名', name: 'TableName', id: 'id', align: 'left', width: 130, editor: { type: "text" } },
             { display: '关联条件', name: 'Filter', align: 'left', width: 300, editor: { type: "text" } },
             { display: '提示', name: 'Tips', width: 290, editor: { type: "text" } }
            ];
        },
        getColumns: function () {
            return [
                { display: '编号', name: 'Code', id: 'id', align: 'left', width: 130, minWidth: 60, editor: { type: "text" } },
                { display: '标签', name: 'Label', align: 'left', width: 120, editor: { type: "text" } },
                { display: '名称', name: 'Name', align: 'left', width: 120, editor: { type: "text" } },
                {
                    display: '数据类型', name: 'DataType', width: 100, editor: {
                        type: "dropdown",
                        data: fBulider.defaults.datatype
                    }, render: leeUI.gridRender.DropDownRender
                },
                { display: '长度', name: 'Length', width: 90, editor: { type: "text" } },
                {
                    display: '关联', align: 'center', width: 90, render: function (g) {
                        if (g.isVirtual == "0" && g.isPrimary != "1" && g.isRelated != "1")
                            return '<input  moid="' + g["ModelObjectID"] + '"   cid="' + g["ID"] + '" class="openrelation  lee-btn lee-btn-primary lee-btn-small" type="button" value="配置">';
                    }
                },
                { display: '关联字段', name: 'isRelated', width: 80, render: leeUI.gridRender.CheckboxRender, readonly: true },
                { display: '主键', name: 'isPrimary', width: 80, render: leeUI.gridRender.CheckboxRender, readonly: true },
                { display: '是否卡片', name: 'isCard', width: 80, render: leeUI.gridRender.CheckboxRender },
                { display: '是否列表', name: 'isList', width: 80, render: leeUI.gridRender.CheckboxRender },
                { display: '是否只读', name: 'isReadOnly', width: 80, render: leeUI.gridRender.CheckboxRender },

                { display: '是否更新', name: 'isUpdate', width: 80, render: leeUI.gridRender.CheckboxRender },
                { display: '是否虚字段', name: 'isVirtual', width: 80, render: leeUI.gridRender.CheckboxRender, readonly: true },
                { display: '虚字段表达式', name: 'VirtualExpress', align: 'left', width: 190, editor: { type: "text" } }
            ];
        }

    };
    window.CardManager = new cardManager();
})(window, $);