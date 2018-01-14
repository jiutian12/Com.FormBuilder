/* 默认值管理器器 */

(function ($, window) {
    var DefaultValueManger = function () {

    }
    DefaultValueManger.prototype = {
        init: function () {
            if (!this.status) {
                this.initGrid();
                this.intToolbar();
                this.status = true;
            }
            this.bind();
            this.load($.proxy(this.loadCallBack, this));
        },
        loadCallBack: function () {
            var firstCode = this.model[0]["id"];
            $("#selectObject").leeUI().setData(this.model);
            $("#selectObject").leeUI().setValue(firstCode);
            this.currentCode = firstCode;
            this.setGrid();
        },
        intToolbar: function () {
            var self = this;
            $("#selectObject").leeDropDown({
                width: 250,
                cancelable: false, data: [],
                onselected: function (value) {
                    alert(value);
                    self.change(value);
                }
            });
        },
        initGrid: function () {
            //初始化grid信息
            this.grid = $("#defval_grid").leeGrid({
                columns: this.getColumns(),
                fixedCellHeight: true,
                alternatingRow: false,
                data: { Rows: [] },
                height: "100%",
                usePager: false,
                rownumbers: true,
                enabledEdit: true,
                rowHeight: 30,
                inWindow: false,
                onBeforeEdit: function (editParm) {
                    console.log(editParm);
                    if (editParm.record.pkcol)
                        return false;
                    return true;
                }

                //,
                //tree: {
                //    columnId: 'id',
                //    idField: 'id',
                //    childrenName: "children",
                //    parentIDField: "pid",
                //    isExtend: function (data) {
                //        return true;
                //    },
                //    isParent: function (data) {
                //        return data.children && data.children.length > 0;
                //    }
                //}
            });
            this.grid._onResize();

        },
        getColumns: function () {
            return [
                { display: '编号', name: 'code', align: 'left', width: 100, minWidth: 60 },
                { display: '标签', name: 'label', align: 'left', width: 140 },
                { display: '名称', name: 'name', align: 'left', width: 140 },
                { display: '默认值', name: 'defval', align: 'left', width: 300, editor: { type: "text" } }
            ];
        },
        initDropDown: function () {
            // 循环绑定下拉列表
            $.each(this.model, function () { });
        },
        change: function (code) {
            this.grid.endEdit();
            this.saveCurrent(); //保存当前
            this.currentCode = code;// 当前数据对象编号
            this.setGrid();
        },
        saveCurrent: function () {
            var self = this;
            var code = self.currentCode;
            $.each(this.model, function (i, obj) {
                if (obj.id == code)
                    self.model[i].columns = self.grid.getData();
            });
        },
        getCurrent: function () {

        },
        setModelID: function (id) {
            this.modelID = id;
            return this;
        },
        setFormID: function (id) {
            this.formID = id;
            return this;
        },
        setDefaultJSON: function (model) {
            this.model = model;
            return this;
        },
        bind: function () {
            $("#btnRefreshDef").bind("click", $.proxy(this.reload, this));
        },
        setGrid: function () {
            var data = this.getDataByCode(this.currentCode);
            this.grid.loadData({ Rows: data.columns });
        },
        getDataByCode: function (code) {
            var res;
            $.each(this.model, function (i, obj) {
                if (obj.id == code)
                    res = obj;
            });
            return res;
        },
        open: function () {
            this.init();
            var self = this;
            this.dialog = $.leeDialog.open({
                title: "设置默认值",
                width: "900",
                height: '450',
                target: $("#dialog_defval"),
                targetBody: true,
                isResize: true,
                buttons: [{
                    text: '保存',
                    cls: 'lee-btn-primary lee-dialog-btn-ok',
                    onclick: function (item, dialog) {
                        // 校验
                        self.save();
                    }
                }, {
                    text: '取消',
                    cls: 'lee-dialog-btn-cancel ',
                    onclick: function (item, dialog) {
                        self.dialog.close();
                    }
                }]
            });
            this.grid._onResize();
        },
        getDefultValue: function (code, column) {
            var res = "";
            for (var i = 0; i < this.model.length; i++) {
                if (this.model[i]["id"] == code) {
                    for (var k = 0; k < this.model[i].columns.length; k++) {
                        if (this.model[i].columns[k]["label"] == column) {
                            res = this.model[i].columns[k]["defval"];
                        }
                    }
                    break;
                }
            }
            return res;
        },
        reload: function () {

            this.grid.endEdit(); // grid结束编辑
            this.saveCurrent(); // 保存当前grid数据
            this.load($.proxy(this.loadCallBack, this), true);
        },
        load: function (callback, isDiff) {
            var self = this;
            if (!this.model || isDiff) {
                DataService.getModelSchema(this.modelID).done(function (data) {
                    if (data.res) {
                        var modelInfo = [];
                        $.each(data.data, function (i, obj) {
                            var model = {
                                id: obj.tableName, code: obj.tableName, name: obj.tableName,
                                text: obj.tableName, columns: obj.cols
                            };

                            $.each(model.columns, function (k, row) {
                                if (isDiff) {
                                    var defvalue = self.getDefultValue(obj.tableName, row.label);
                                    model.columns[k]["defval"] = defvalue;
                                }
                                // 删除无关属性
                                delete model.columns[k]["isUnique"];
                                delete model.columns[k]["unique"];
                                delete model.columns[k]["isPkCol"];
                                delete model.columns[k]["pkcol"];
                                delete model.columns[k]["related"];
                                delete model.columns[k]["id"];

                            });


                            modelInfo.push(model);
                        });
                        self.model = modelInfo;
                        callback.call(self, self.model);
                    }
                });
                return;
            }
            callback.call(this, this.model);

        },
        save: function () {
            var self = this;
            this.grid.endEdit(); // grid结束编辑
            this.saveCurrent(); // 保存当前grid数据
            // 发送请求保存模型
            DataService.saveDefaultValue(JSON.stringify(this.model), this.formID).done(function (data) {
                if (data.res) {
                    self.dialog.close();
                }
                leeUI.Success(data.mes);
            });
        }
    };
    window.defaultValueManger = new DefaultValueManger();

}).call(this, $, window);


/*
遗留问题 
    1.主键不能设置默认值 √
      从表关联建不能设置
      列表允许锁定行 增加锁定行样式和条件

    2.远程获取数据模型 √

    3.重新刷新方法比较差异 √

    4.数据库增加字段进行保存 √
*/