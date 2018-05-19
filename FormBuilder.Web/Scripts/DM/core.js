(function (window, $) {
    function dataService() {
        this.init();
    };
    dataService.prototype = {
        init: function () {
            this.setParams();
        },
        RequestApi: function (api, api_params) {
            var defer = $.Deferred();
            $.ajax({ url: this.baseUrl + api, data: api_params })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        setParams: function () {
            this.baseUrl = _global.sitePath;//"/FormBuilder.Web";
            $.ajaxSetup({
                type: "post", // 默认使用POST方式
                error: function (jqXHR, textStatus, errorMsg) { // 出错时默认的处理函数
                    // jqXHR 是经过jQuery封装的XMLHttpRequest对象
                    // textStatus 可能为： null、"timeout"、"error"、"abort"或"parsererror"
                    // errorMsg 可能为： "Not Found"、"Internal Server Error"等

                    // 提示形如：发送AJAX请求到"/index.html"时出错[404]：Not Found
                    console.log('发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg);
                },
                success: function (data) {
                    console.log("请求状态成功");
                    console.log(data);
                }

            });
        },
        saveAttr: function (model) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/SaveAttr", { model: model })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        getAttr: function (dataid) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/GetModel", { dataid: dataid })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        addObject: function (modelID, objectID) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/AddObject", { modelID: modelID, objectID: objectID })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        deleteObject: function (modelID, objectID, modelobjid) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/DeleteObject", { modelID: modelID, objectID: objectID, modelObjectID: modelobjid })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        saveObject: function (model) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/SaveObject", { model: model })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        GetDBSource: function (keyword) {
            var defer = $.Deferred();
            this.RequestApi("/Settings/GetDBSource", { keyword: keyword })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },

        getObjectList: function (modelid) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/GetObjectList", { modelid: modelid })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        getRelation: function (modelid, modelobjectid, modelobjectidcolid) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/GetRelationInfo", { modelid: modelid, modelobjectid: modelobjectid, modelobjectidcolid: modelobjectidcolid })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        saveRelation: function (model) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/SaveRelation", { model: model })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        deleteRelation: function (modeID, relationID) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/deleteRelation", { modeID: modeID, relationID: relationID })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        getObjectModel: function (modelid, objectid, hasdetail) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/GetObjectModel", { modelid: modelid, objectid: objectid, hasdetail: hasdetail })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        },
        checkCol: function (modelid, objectid, colname) {
            var defer = $.Deferred();
            this.RequestApi("/DataModel/CheckCol", { modelid: modelid, objectid: objectid, colname: colname })
                .done(function (data) {
                    defer.resolve(data);
                })
                .fail(function (data) {
                    defer.reject(data);
                });
            return defer.promise();
        }

    };
    window.DataService = new dataService();
})(window, $);




(function (window, $) {
    function CommonManger() {
        this.init();
    }
    CommonManger.prototype = {
        init: function () {
            this.bind();
            this.intMainAttr();
            this.loadAttr();
        },
        intMainAttr: function () {
            $("#txtDetailSaveMode").leeDropDown({
                data: [{ id: "0", text: "先删后增" }, { id: "1", text: "判断更新" }]
            });

            DataService.GetDBSource("").done(function (data) {
                if (data.res) {

                    var arr = [];
                    $.each(data.data, function (i, obj) {
                        arr.push({ id: obj["Code"], text: obj["Code"] + "[" + obj["Name"] + "]" });
                    });

                    $("#txtDataSource").leeDropDown({ data: arr });
                }
            }).fail(function (data) {
                console.log(data);
            });
        },
        getDataModelID: function () {
            return this.getQuery("dataid")
        },
        getQuery: function (key) {
            var search = location.search.slice(1); //得到get方式提交的查询字符串
            var arr = search.split("&");
            for (var i = 0; i < arr.length; i++) {
                var ar = arr[i].split("=");
                if (ar[0] == key) {
                    if (unescape(ar[1]) == 'undefined') {
                        return "";
                    } else {
                        return unescape(ar[1]);
                    }
                }
            }
            return "";
        },
        showAttr: function () {
            $(".formattr").addClass("active");
        },
        hideAttr: function () {
            $(".formattr").removeClass("active");
        },
        saveAttr: function () {
            var self = this;
            $.leeDialog.loading("正在保存....");
            var model = JSON.stringify(this.getAttrValue());
            DataService.saveAttr(model).done(function (data) {
                $.leeDialog.hideLoading();
                if (data.res) {
                    leeUI.Success(data.mes);
                }
            }).fail(function (data) {
                $.leeDialog.hideLoading();
            });
        },
        loadAttr: function () {
            var self = this;
            DataService.getAttr(this.getDataModelID()).done(function (data) {
                $.leeDialog.hideLoading();
                if (data.res) {
                    self.setAttrValue(data.data);
                } else {
                    leeUI.Error(data.mes);
                }
            }).fail(function (data) {
                $.leeDialog.hideLoading();
            });
        },
        getAttrValue: function () {
            this.arr = $(".formattr [data-bind]");
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
                // if (BindValue != "")
                this.dataModel[BindKey] = BindValue;
            }
            return this.dataModel;
        },
        setAttrValue: function (data) {
            this.dataModel = data;
            this.arr = $(".formattr [data-bind]");
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
        },
        bind: function () {
            var self = this;
            $("#btnImport").click($.proxy(this.importObjectColumns, this));
            $("#btnShowAttr").click($.proxy(this.showAttr, this));
            $("#btnHideAttr").click($.proxy(this.hideAttr, this));
            $("#btnImportRel").click($.proxy(this.importRelationColumns, this));
            $("#btnImportRelObj").click($.proxy(this.chooseRelationObject, this));
            $("#btnSaveAttr").click($.proxy(this.saveAttr, this));


            $("#btnSave").click($.proxy(this.saveObject, this));

            $("#btnOpenSQL").click($.proxy(this.openSQLExtend, this));



            $("#btnaddChild").click($.proxy(this.chooseChildObject, this));
            $("#btndelChild").click($.proxy(this.deleteChildObject, this));
            $("#btnAddVCol").click($.proxy(this.addVCol, this));
            $("#btndelCol").click($.proxy(this.deleteCol, this));
            $(".upwrap").click($.proxy(this.upRow, this));
            $(".downwrap").click($.proxy(this.downRow, this));
            $("#btndeleteRelationCol").click($.proxy(this.deleteRelationCol, this));

            $("body").on("click", ".lee-grid-row-cell-inner .openrelation", function (e) {
                self.openRelation($(this).attr("moid"), $(this).attr("cid"));
            });
        },
        openSQLExtend: function () {
            var modelid = this.getDataModelID();
            fBulider.core.window.open("", "SQL动作管理", _global.sitePath + "/DataModelSQL/Index?dataid=" + modelid);

        },
        downRow: function () {
            var selected = $("#grid").leeUI().getSelected();
            $("#grid").leeUI().down(selected);
        },
        upRow: function () {
            var selected = $("#grid").leeUI().getSelected();
            $("#grid").leeUI().up(selected);
        },
        openRelation: function (modelobjectid, colid) {
            var self = this;
            this.modelid = this.getDataModelID();
            this.modelobjectid = modelobjectid;
            this.colid = colid;
            this.dialog = $.leeDialog.open({
                title: "关联字段设置", width: "900", height: '430',
                target: $("#RelationEdit"), targetBody: true, isResize: true,
                buttons: [{
                    text: '保存',
                    cls: 'lee-btn-primary lee-dialog-btn-ok',
                    onclick: function (item, dialog) {
                        self.saveRelation();
                        TreeManager.refeshSelected();
                        dialog.close();
                    }
                },
                {
                    text: '删除关联',
                    cls: 'lee-btn-danger lee-dialog-btn-ok',
                    onclick: function (item, dialog) {
                        self.deleteRelation(dialog);

                    }
                }, {
                    text: '取消',
                    cls: 'lee-dialog-btn-cancel ',
                    onclick: function (item, dialog) {
                        dialog.close();
                    }
                }]
            });
            this.getValue();
        },
        getValue: function () {
            var self = this;
            DataService.getRelation(this.modelid, this.modelobjectid, this.colid).done(function (data) {
                $.leeDialog.hideLoading();
                if (data.res) {
                    RelationMannger.setValue(data.data);
                } else {
                    leeUI.Error(data.mes);
                }
            }).fail(function (data) {
                $.leeDialog.hideLoading();
            });
        },
        deleteCol: function () {
            CardManager.deleteCol();
        },
        deleteRelationCol: function () {
            RelationMannger.deleteCol();
        },
        addVCol: function () {
            CardManager.addVirtualColumn();
        },
        chooseRelationObject: function () {
            this.addChildObject(function (row) {
                RelationMannger.setObject(row);
            });
        },
        chooseChildObject: function () {
            var self = this;
            this.addChildObject(function (row) {
                self.addObjectConfirm(row.ID);
            });
        },
        addChildObject: function (callback) {
            var self = this;
            this.mainwrap = $("<div></div>");
            this.gridwrap = $("<div style='position:absolute;top:40px;bottom:0px;left:0px;right:0px;'></div>");
            this.gridobject = $("<div ></div>");
            this.gridwrap.append(this.gridobject);

            this.$searchwrap = $('<div class="lee-search-wrap lee-toolbar-item" style="float:none;margin:5px;"><input style="width:100%;" class="lee-search-words" type="text"  placeholder="请输入查询关键字"><button class="search lee-ion-search" type="button" style="position: absolute;right: 0;"></button></div>');
            this.$input = this.$searchwrap.find("input");
            this.$sbtn = this.$searchwrap.find("button");

            this.$input.bind('keypress', function (event) {
                if (event.keyCode == "13") self.gridobjectm.loadData(true);
            });
            this.$sbtn.click(function () {
                self.gridobjectm.loadData(true);
            })
            this.mainwrap.append(this.$searchwrap).append(this.gridwrap);
            var dialog = $.leeDialog.open({
                title: "选择数据对象",
                width: "800",
                height: '380',
                target: this.mainwrap,
                overflow: "hidden",
                isResize: true,
                onStopResize: function () {
                    self.gridobjectm._onResize();
                },
                buttons: [{
                    text: '确定',
                    cls: 'lee-btn-primary lee-dialog-btn-ok',
                    onclick: function (item, dialog) {
                        var selected = self.gridobjectm.getCheckedRows();
                        if (selected.length > 0) {
                            //var id = selected[0]["ID"];
                            callback.call(this, selected[0]);
                            dialog.close();
                        } else {
                            leeUI.Error("请选择关联的数据对象！");
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
            });
            this.gridobjectm = this.gridobject.leeGrid({
                columns: [
                    { display: 'ID', name: 'ID', align: 'left', width: 200 },
                    { display: '编号', name: 'Code', align: 'left', width: 140 },
                    { display: '名称', name: 'AiasName', align: 'left', width: 160 },
                    { display: '修改人', name: 'LastModifyUser', align: 'left', width: 80 },
                    { display: '修改时间', name: 'LastModifyTime', align: 'left', width: 130 },
                ],
                alternatingRow: false,
                usePager: true,
                pageSize: 50,
                parms: $.proxy(this.getParamCreate, this),
                url: _global.sitePath + '/DataModel/GetObjects',
                inWindow: false,
                height: "100%",
                checkbox: false,
                rownumbers: true,
                rowHeight: 30
            });
        },
        getParamCreate: function () {
            var res = [];

            res.push({ name: "keyword", value: this.$input.val() });
            return res;
        },
        deleteChildObject: function () {
            var objectid = TreeManager.getSelectObjectID();
            var modelobjectid = TreeManager.getSelectModelObjectID();
            var self = this;
            $.leeDialog.confirm("确认要删除子对象吗？", "提示", function (type) {
                if (type) {
                    $.leeDialog.loading("正在删除....");
                    DataService.deleteObject(self.getDataModelID(), objectid, modelobjectid).done(function (data) {
                        if (data.res) {
                            leeUI.Success(data.mes);
                            TreeManager.refresh();
                        } else {
                            leeUI.Error(data.mes);
                        }
                        $.leeDialog.hideLoading();
                    }).fail(function (data) {
                        console.log(data);
                    });
                }
            });
        },
        saveRelation: function () {
            $.leeDialog.loading("正在保存....");
            var model = JSON.stringify(RelationMannger.getValue());
            DataService.saveRelation(model).done(function (data) {
                if (data.res) {
                    leeUI.Success(data.mes);
                } else {
                    leeUI.Error(data.mes);
                }
                $.leeDialog.hideLoading();
            }).fail(function (data) {
                console.log(data);
            });
        },
        deleteRelation: function (dialog) {
            var self = this;

            var model = RelationMannger.getValue();
            var modelID = self.getDataModelID();

            if (model.ObjectID) {

                $.leeDialog.confirm("确认要删除关联吗？", "提示", function (type) {
                    if (type) {
                        $.leeDialog.loading("正在删除....");
                        DataService.deleteRelation(modelID, model.ID).done(function (data) {
                            if (data.res) {
                                leeUI.Success(data.mes);
                                TreeManager.refeshSelected();
                                dialog.close();
                            } else {
                                leeUI.Error(data.mes);
                            }
                            $.leeDialog.hideLoading();
                        }).fail(function (data) {
                            console.log(data);
                        });
                    }
                });

            } else {
                leeUI.Error("请先进行保存才能删除！");
            }

        },
        addObjectConfirm: function (objectid) {
            var self = this;
            $.leeDialog.loading("正在添加....");
            DataService.addObject(self.getDataModelID(), objectid).done(function (data) {
                if (data.res) {
                    TreeManager.refresh();
                    leeUI.Success(data.mes);
                } else {
                    leeUI.Error(data.mes);
                }
                $.leeDialog.hideLoading();
            }).fail(function (data) {
                console.log(data);
            });
        },
        getColumnsParam: function (isrelation) {
            var arr = [];
            var res = "";

            if (isrelation) {
                res = RelationMannger.getSelectObjectID();
            } else {
                var data = $("#modeltree").leeUI().getSelected();
                res = data.data["ObjectID"];
            }
            if (res) {
                arr.push({
                    name: "objectid",
                    value: res
                })
            }

            return arr;
        },

        importRelationColumns: function () {
            if (RelationMannger.getSelectObjectID()) {
                this.importColumns(function (data) {
                    RelationMannger.addList(data);
                }, true);
            }
        },
        importObjectColumns: function () {
            this.importColumns(function (data) {
                CardManager.addList(data);
            }, false);
        },
        importColumns: function (callback, isrelation) {
            //引入字段
            var self = this;
            this.grid = $("<div></div>");
            var dialog = $.leeDialog.open({
                title: "请选择要导入的列信息",
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
                    width: 130

                },
                    {
                        display: '名称',
                        name: 'Name',
                        align: 'left',
                        width: 150
                    }
                ],
                alternatingRow: false,
                usePager: true,
                parms: self.getColumnsParam(isrelation),
                url: _global.sitePath + '/DataModel/GetObjectColumns',
                inWindow: false,
                height: "100%",
                pageSize: 50,
                checkbox: true,
                rownumbers: true,
                rowHeight: 30
            });
        },
        saveObject: function () {
            var model = JSON.stringify(CardManager.getValue());
            $.leeDialog.loading("正在保存....");
            DataService.saveObject(model).done(function (data) {
                $.leeDialog.hideLoading();
                if (data.res) {
                    leeUI.Success(data.mes);
                } else {
                    leeUI.Error(data.mes);
                }
            }).fail(function (data) {
                $.leeDialog.hideLoading();
            });
            //getValue
        }

    };
    window.BaseManger = new CommonManger();
})(window, $);



(function (window, $) {

    function relationMannger() {
        this.init();
    }
    relationMannger.prototype = {
        init: function () {

        },
        bind: function () {

        },
        initLayout: function () {
            $("#txtJoinType").leeDropDown({
                data: [{ id: "0", text: "Left Join" }, { id: "2", text: "Right Join " }, { id: "3", text: "Inner Join" }]
            });


            this.grid = $("#gridrelation").leeGrid({
                columns: this.getColumns(),
                fixedCellHeight: true,
                alternatingRow: false,
                data: { Rows: [] },
                height: 220,
                usePager: false,
                rownumbers: true,
                enabledEdit: true,
                rowHeight: 30
            });
        },
        getColumns: function () {
            return [
                { display: '编号', name: 'Code', align: 'left', width: 100, minWidth: 60 },
                { display: '名称', name: 'Name', align: 'left', width: 120 },
                { display: '标签', name: 'Label', align: 'left', width: 90, editor: { type: "text" } },
                {
                    display: '数据类型', name: 'DataType', width: 100, editor: {
                        type: "dropdown",
                        data: fBulider.defaults.datatype
                    }, render: leeUI.gridRender.DropDownRender
                },
                { display: '长度', name: 'Length', width: 90 },
                { display: '是否卡片', name: 'isCard', width: 80, render: leeUI.gridRender.ToogleRender },
                { display: '是否列表', name: 'isList', width: 80, render: leeUI.gridRender.ToogleRender },
                { display: '是否只读', name: 'isReadOnly', width: 80, render: leeUI.gridRender.ToogleRender },
                { display: '是否关联', name: 'isRelated', width: 80, render: leeUI.gridRender.ToogleRender, readonly: true }
            ];
        },
        existObjectCode: function (code) {
            var data = this.grid.getData();
            return data.find(function (i) {
                return i.Code.toUpperCase() == code.toUpperCase();
            });

        },
        appenRows: function (data) {
            var self = this;
            var arr = [];
            $.each(data, function (i, obj) {
                if (!self.existObjectCode(obj.Code)) {
                    var row = {
                        "ID": Guid.NewGuid().ToString(),
                        "ModelID": BaseManger.getDataModelID(),
                        "ModelObjectID": self.dataModel.ModelObjectID,
                        "isPrimary": "0",
                        "Code": obj.Code,
                        "Label": self.dataModel["ModelObjectColCode"] + "_" + obj.Code,
                        "Name": obj.Name,
                        "DataType": obj.DataType,
                        "Length": obj.Length,
                        "isList": "1",
                        "isCard": "1",
                        "isReadOnly": "0",
                        "isUpdate": "0",
                        "isVirtual": "0",
                        "VirtualExpress": "",
                        "ParentID": self.dataModel.ModlelObjectCol,
                        "RelationID": self.dataModel.ID,
                        "isRelated": "1"
                    };
                    arr.push(row);
                }
            });
            this.grid.addRows(arr);
        },
        deleteCol: function () {
            var selected = this.grid.getSelected();
            this.grid.remove(selected);
        },
        getSelectObjectID: function () {
            return this.dataModel.ObjectID;
        },
        setObject: function (row) {
            if (row.ID !== this.dataModel["ObjectID"]) {
                this.setList([]);
            }
            this.dataModel["ObjectID"] = row.ID;
            this.dataModel["ObjectLabel"] = row.Code;
            this.dataModel["ObjectCode"] = row.Code;
            this.dataModel["ObjectName"] = row.AiasName;
            this.setCard(this.dataModel);
        },
        setValue: function (data) {
            this.dataModel = data;
            this.setCard(data);
            this.setList(data.ColList);
        },
        setCard: function (data) {
            this.arr = $("[data-bind]", "#RelationEdit");
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
                    }
                }
            }
        },
        setList: function (list) {
            this.grid.loadData({ Rows: list });
        },
        addList: function (rows) {
            this.appenRows(rows);
        },
        getValue: function () {
            this.arr = $("[data-bind]", "#RelationEdit");
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
            this.dataModel.ColList = this.grid.getData();
            return this.dataModel;
        }
    };

    window.RelationMannger = new relationMannger();
})(window, $);







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
                } else {
                    var type = $(item).attr("type");
                    if (type == "text") {
                        $(item).val(obj[BindKey]);
                    }

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



$.leeUI.PopUp.TimeEditInjector = function (options) {
    this.options = options;
    this.init();
}

$.leeUI.PopUp.TimeEditInjector.prototype = {
    init: function () {


    },
    initUI: function () {
        var g = this,
            p = this.options;
        if (!this.initflag) {
            //this.tab.leeTab({});

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

        htmlarr.push("<div class='tabtimeStamp' style='overflow:hidden;'>");
        htmlarr.push("  <div title='' style='padding:10px;'>");
        htmlarr.push("    <table class='lee-form'>");
        htmlarr.push("      <tr><td style='width: 100px;'>创建人</td><td><input data-toogle='dropdown' data-bind='createUser' type='text' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>创建时间</td><td><input type='text'  data-toogle='dropdown' data-bind='createTime' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>最后修改人</td><td><input data-toogle='dropdown' data-bind='lastModifyUser' type='text' class='lee-input'/></td></tr>");
        htmlarr.push("      <tr><td>最后修改时间</td><td><input type='text'  data-toogle='dropdown' data-bind='lastModifyTime' class='lee-input'/></td></tr>");
        htmlarr.push("    </table>");
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
