//初始化界面的所有元素信息
//获取数据进行绑定

//defalutInstance //供卡片、字典、列表、使用，当前页面数据模型

/*界面控制器Core*/
window.Page.UI = (function (ui, service, model, win, $) {

    var frmid = "";//当前页面表单ID

    ui.getFrmID = function () {
        return ui.instance.getQuery("frmid");
    }
    function UIController(page) {
        //this.layout = layout;
        this.page = page;

    }
    UIController.prototype = {
        init: function () {
        },
        initAction: function () {
        },
        bind: function () {

        },
        setStatus: function (status) {
            this.status = status;
        },
        setFormType: function (formType) {
            this.formType = formType;
        },
        setPage: function () {
            //if (this.getStatus() == "edit" || this.getStatus() == "add") {
            //    this.setPageNormal();

            //} else {
            //    this.setPageReadOnly();
            //}
        },
        edit: function () {
            //if (this.getStatus() == "view") {
            //    this.setPageNormal();
            //    
            //}
            this.setStatus("edit");
            return true;
        },
        cancel: function () {
            //if (this.getStatus() != "view") {
            //    this.setPageReadOnly();
            //   
            //}
            if (this.lastID) {
                this.setDataID(this.lastID);

            }
            this.loadData();//查看和修改则加载数据
            this.setStatus("view");
            $('#form').validator("cleanUp");
            return true;
        },
        modify: function () {
            this.setStatus("edit");
            return true;
        },
        getStatus: function () {
            return this.status;
        },
        setPageReadOnly: function () {
            // 把当前表单设置成只读
            $.each(this.controls, function (type, ctrls) {
                $.each(ctrls, function (ctrlid, ctrleditor) {
                    var $ele = $("#" + ctrlid);
                    if (!$ele.attr("data-bindfield") && !$ele.attr("data-bindtable") || $ele.attr("data-bindfield") == "undefined") return true;
                    if ($ele.leeUI()) {
                        $ele.leeUI()._setDisabled(true);
                        // 如果是子表  需要把按钮设置为只读
                    }
                    else {
                        var type = $ele.attr("type");
                        if (type == "text" || $ele.is("textarea")) {
                            $ele.attr("readonly", "readonly");
                        }
                        else if (type == "checkbox" || type == "radio" || type == "select") {
                            $ele.attr("disabled", "disabled");
                        }
                    }
                });
            });

        },
        setPageNormal: function () {
            // 把表单设置成初始的编辑状态
            $.each(this.controls, function (type, ctrls) {
                $.each(ctrls, function (ctrlid, ctrleditor) {
                    var $ele = $("#" + ctrlid);

                    if (!ctrleditor.readonly) {
                        if ($ele.leeUI()) {
                            $ele.leeUI()._setDisabled(false);
                        }
                        else {
                            var type = $ele.attr("type");
                            if (type == "text" || $ele.is("textarea")) {
                                $ele.removeAttr("readonly", "readonly");
                            }
                            else if (type == "checkbox" || type == "radio" || type == "select") {
                                $ele.removeAttr("disabled");
                            }
                        }
                    }
                });
            });
        },
        getDataID: function () {
            // 获取当前页面的主键信息
            return this.dataID;
        },
        getAction: function () {
            // 获取当前页面的主键信息
            return this.status;
        },
        setDataID: function (id) {
            this.dataID = id;
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
        getAddObj: function () {
            //新增的时候获取初始默认值
            //初始化schema  
            //赋值
            //解析绑定默认值表达式

        },
        setValue: function (data) {
            //获取当前界面的所有绑定
            //进行主表赋值
            //进行子表赋值
        },
        getValue: function () {
            //找到所有绑定的主表信息
            //根据当前dataModel 进行构造处理
            //然后找到所有绑定的子表信息
            //形成字表数据源data
            //构造完成后返回给datamodle模块
        },
        bindMainData: function (key, value) {
            var $ele_arr = $("[data-bindfield='" + key + "']");
            $.each($ele_arr, function (i, ele) {
                var $ele = $(ele);
                if ($ele.leeUI()) {
                    var type = $ele.leeUI().type;
                    if (type.toLowerCase() == "lookup")
                        $ele.leeUI().setValue(value, value);
                    else {
                        $ele.leeUI().setValue(value);
                    }
                } else {
                    var type = $ele.attr("type");
                    if (type == "text" || $ele.is("textarea")) {
                        $ele.val(value);
                    }
                    else if (type == "checkbox") {
                        $ele.prop("checked", value == "1");
                    }
                }

            });
        },
        resetQry: function (colid) {
            var cols = ui.params.qrycols;

            $.each(cols, function (i, obj) {
                if (obj.id == colid) {
                    var childs = obj.childs;
                    $.each(childs, function (i, ctrl) {
                        if (ctrl.type != "grid" && ctrl.type != "bar" && ctrl.type != "button" && ctrl.type != "tree") {
                            var ctrlManager = $("#" + ctrl.id).leeUI();
                            if (ctrlManager) {
                                ctrlManager.setValue("");
                                if (ctrlManager.setText)
                                    ctrlManager.setText("");
                            }

                        }
                    });
                }
            });

        },
        initWidget: function () {
            var self = this;
            $.each(this.page, function (key, obj) {
                if ($("#" + key)) {
                    self.initLayout(obj);
                }
            });
        },
        initLayout: function (layout) {
            var self = this;
            var childs = layout.childs;
            //如果是tab页需要初始化tab并且修正高度
            $.each(childs, function (i, col) {
                self.initColumn(col);
            });
        },
        initColumn: function (column) {
            var self = this;
            var childs = column.childs;


            if (childs.length == 1 && (childs[0].type == "grid" || childs[0].type == "tree" || childs[0].type == "bar")) {
                $("#" + column.id + " .lee-table-form").removeClass("lee-table-form");
                if (!childs[0].border)
                    $("#" + childs[0].id).css("border", "0");
                if (childs[0].margin)

                    $("#" + childs[0].id).css("margin", childs[0].margin ? childs[0].margin : "0");
            }

            if (column.isqry) {
                ui.params.pushQryZone(column);
            }
            $.each(childs, function (i, ctrl) {
                self.initControl(ctrl);
            });

        },
        initControl: function (ctrl) {
            switch (ctrl.type) {
                case "grid":
                    ui.gridController.init(ctrl);
                    break;
                case "bar":
                    ui.toolbarController.init(ctrl);
                    break;
                case "button":
                    ui.buttonController.init(ctrl);
                    break;
                case "tree":
                    ui.treeController.init(ctrl);
                    break;
                case "chart":
                    ui.chartController.init(ctrl);
                    break;
                default:
                    ui.CtrlFactory.factory(ctrl.type, ctrl, true);
                    break;
            }
            this.addControl(ctrl.type, ctrl);
            this.addControlLabel(ctrl.id, ctrl.label);
        },
        openCard: function (frmID, action, opts) {
            var formState = opts.formState || "";
            var title = opts.title;
            var height = opts.height;
            var width = opts.width;
            if (action == "modify") {
                this.editCard(frmID, formState, title, opts.gridid, opts.isrefresh, height, width)
            }
            if (action == "add") {
                this.addCard(frmID, formState, title, opts.isrefresh, height, width)
            }
            if (action == "addsame") {
                this.addSameCard(frmID, opts.gridid, formState, title, opts.isrefresh, height, width)
            }
            if (action == "addchild") {
                this.addChildCard(frmID, opts.gridid, formState, title, opts.isrefresh, height, width)
            }
            if (action == "view") {
                //this.addChildCard(frmID, opts.gridid, formState, title, opts.isrefresh, height, width)
            }
        },
        copyCard: function (frmID, formState, title, gridid, isrefresh, height, width) {
            var grid = ui.gridController.mainGrid;
            if (gridid)
                grid = $("#" + gridid).leeUI();
            var selected = grid.getSelected();
            if (selected) {
                var dataID = selected[model.pkCol];
                this.openForm(dataID, frmID, "card", "copy", formState, title, isrefresh, height, width)
            } else {
                $.leeUI.Error("请选中要复制的记录");
            }
        },
        editCard: function (frmID, formState, title, gridid, isrefresh, height, width) {
            var grid = ui.gridController.mainGrid;
            if (gridid)
                grid = $("#" + gridid).leeUI();
            var selected = grid.getSelected();
            if (selected) {
                var dataID = selected[model.pkCol];
                this.openForm(dataID, frmID, "card", "modify", formState, title, isrefresh, height, width)
            } else {
                $.leeUI.Error("请选中要编辑的记录");
            }
        },
        addCard: function (frmID, formState, title, isrefresh, height, width) {
            this.openForm("", frmID, "card", "add", formState, title, isrefresh);
        },
        addSameCard: function (frmID, gridid, formState, title, isrefresh, height, width) {
            var grid = $("#" + gridid).leeUI();
            var selected = grid.getSelected();

            var dataID = "";
            this.openForm(dataID, frmID, "card", "addsame", formState, title, isrefresh, height, width, function () {
                var dgContext = parent.document.getElementById('frmView' + dataID).contentWindow;
                dgContext.Page.UI.instance.initTreeInfo(selected);
            });

        },
        addChildCard: function (frmID, gridid, formState, title, isrefresh, height, width) {
            var grid = $("#" + gridid).leeUI();
            var selected = grid.getSelected();
            if (selected) {
                var dataID = "";
                this.openForm(dataID, frmID, "card", "addchild", formState, title, isrefresh, height, width, function () {

                    var dgContext = parent.document.getElementById('frmView' + dataID).contentWindow;
                    dgContext.Page.UI.instance.initTreeInfo(selected);
                })
            } else {
                $.leeUI.Error("请选中一行数据");
            }
        },
        deleteCard: function () {
            var self = this;
            var grid = ui.gridController.mainGrid;
            var selected = grid.getSelected();
            if (selected) {
                var dataID = selected[model.pkCol];
                $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
                    if (type) {
                        service.deleteModel(modelID, dataID).done(function (data) {


                            if (data.res) {
                                self.reload();
                                leeUI.Success(data.mes);
                            }

                        }).fail(function (data) {
                            console.log("失败");
                        });
                    }
                });
                //this.openForm(dataID, frmID, "card", "modify", formState)
            } else {
                $.leeUI.Error("请选中要删除的记录");
            }
        },
        close: function () {
            var dialog = frameElement.dialog; //调用页面的dialog对象(ligerui对象)            if (dialog)                dialog.close();//关闭dialog 
            else
                window.close();
        },
        exportExcel: function (gridid) {
            var grid = $("#" + gridid).leeUI();
            var self = this;
            var data = grid.getData();
            var cols = grid.options.columns;
            var datacols = [];
            $.each(cols, function (i, row) {
                datacols.push({
                    name: row["name"],
                    display: row["display"],
                    width: row["width"],
                    checked: 1
                });
            });
            var gridnew = $("<div></div>");
            var gridm;
            $.leeDialog.open({
                title: "请选择导出配置",
                width: "500",
                height: '300',
                target: gridnew,
                overflow: "hidden",
                isResize: true,
                onStopResize: function () {
                    gridm._onResize();
                },
                buttons: [{
                    text: '导出当前',
                    cls: 'lee-btn-primary lee-dialog-btn-ok',
                    onclick: function (item, dialog) {
                        confrimExport("");
                    }
                }, {
                    text: '导出所有',
                    cls: ' lee-dialog-btn-ok',
                    onclick: function (item, dialog) {
                        confrimExport("all");
                    }
                }]
            });


            gridm = gridnew.leeGrid({
                columns: [
                    { display: '列名', name: 'display', align: 'left', width: 100, },
                    { display: '列宽', name: 'width', align: 'left', width: 100, },
                    { display: '是否导出', name: 'checked', align: 'center', width: 80, render: leeUI.gridRender.CheckboxRender }
                ],
                alternatingRow: false,
                data: {
                    Rows: datacols
                },
                enabledEdit: true,
                usePager: false,
                inWindow: false,
                height: "100%",
                rownumbers: true,
                rowHeight: 30
            });
            gridm._onResize();



            function confrimExport(type) {
                var datacolsgrid = gridm.getData();
                var arr = [];
                $.each(datacolsgrid, function (i, row) {
                    if (row.checked == "1") {
                        arr.push({
                            name: row["name"],
                            display: row["display"],
                            width: row["width"]
                        });
                    }
                });
                if (arr.length == 0) {
                    leeUI.Error("请选中要导出的列");
                    return;
                }
                var url = _global.sitePath + "/DataModel/getExcel";
                var obj = {};
                if (type == "all") {

                    var ctrl = ui.gridController.grids[gridid].ctrl;
                    var isDataModel = model.isMainSource(ctrl.bindtable);


                    var filter = ui.params.getFilterDataSource(ctrl.bindtable).serialize();
                    url = _global.sitePath + "/DataModel/getExcelServer";
                    obj = {
                        cols: JSON.stringify(arr),
                        modelID: (isDataModel ? modelID : ctrl.bindtable),
                        keyword: "",
                        filter: filter,
                        order: "",
                        isCustom: !isDataModel
                    };
                } else {
                    obj = {
                        cols: JSON.stringify(arr),
                        data: JSON.stringify(data)
                    };
                }

                self.createPostForm(url, obj);
            }
        },
        createPostForm: function (url, obj) {

            function getiframeDocument($iframe) {
                var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
                if (iframeDoc.document) {
                    iframeDoc = iframeDoc.document;
                }
                return iframeDoc;
            }
            var $iframe = $("<iframe style='display: none' src='about:blank'></iframe>").appendTo("body");
            $iframe.ready(function () {
                var formDoc = getiframeDocument($iframe);
                var arr = [];
                arr.push("<html><head></head><body><form method='Post' action='" + url + "'>");
                //formDoc.write("<html><head></head><body><form method='Post' action='" + url + "'><input type='hidden' name='data' value='" + JSON.stringify(data) + "'/><input type='hidden' name='cols' value='" + JSON.stringify(datacols) + "'/></form></body></html>");

                for (var key in obj) {
                    arr.push("<input type='hidden' name='" + key + "' value='" + obj[key] + "'/>")
                }
                arr.push("</form></body></html>");
                formDoc.write(arr.join(""));
                var $form = $(formDoc).find('form');
                $form.submit();


            });
        },
        openForm: function (dataID, frmID, type, action, formState, title, isrefresh, height, width, callback) {
            // 表单
            //window.open(url);
            height = height || "480";

            width = width || "800";
            title = title || "详情";
            var self = this;
            var context = window;

            if (window.top.$ && window.top.$.leeDialog) {
                context = window.top;
            }

            context.$.leeDialog.open({
                title: title,
                name: 'frmView' + dataID,
                isHidden: false,
                showMax: true,
                width: width,
                slide: false,
                height: height,
                overflow: "hidden",
                onLoaded: function () {
                    if (callback) callback();
                },
                onClose: function () {
                    //alert(1);
                    if (isrefresh)
                        self.reload(true);
                },
                url: _global.sitePath + "/Runtime/" + type
                    + "?frmid=" + frmID
                    + "&dataid=" + dataID
                    + "&action=" + action
                    + "&formstate=" + formState,
            });
        },
        addControl: function (type, ctrl) {
            //管理界面上所有的控件信息
            this.controls = this.controls || {};
            this.controls[type] = this.controls[type] || {};
            if (!this.controls[type][ctrl.id]) {
                this.controls[type][ctrl.id] = ctrl;
            }
        },
        addControlLabel: function (key, label) {
            this.controlLabel = this.controlLabel || {};
            this.controlLabel["#" + key] = label;
        },
        isValid: function (callback) {
            var self = this;
            this.validMain(function (flag, error) {
                if (flag) {
                    self.validGrid(callback);

                } else {
                    callback(flag, "", error);
                }
            });
        },
        validGrid: function (callback) {
            var self = this;
            var detailctrls = ui.gridController.grids;
            var grididarr = [];
            for (var gridid in detailctrls) {
                if (gridid != ui.gridController.mainGridID || this.formType == "2") {//如果不是主表 这里得判断 //如果是listcontroller 那么都判断
                    grididarr.push(gridid);
                }
            }
            if (grididarr.length > 0) {
                var currentGrid = grididarr[0];
                var bindtable = detailctrls[currentGrid].ctrl.bindtable;
                var grid = detailctrls[currentGrid].grid;
                var griddata = grid.getData();
                if (griddata.length == 0)
                    callback.call(this, true);
                else
                    Page.Validate.validate(currentGrid, griddata, function (flag, index, message, gridid) {
                        if (flag) {
                            if (grididarr.length > 1) {
                                self.validGridLoop(grididarr, 1, callback);
                                //验证下一个

                            }
                            else {
                                //直接回调结束
                                callback.call(this, true);
                            }
                        } else {
                            callback.call(this, flag, index, message, gridid);
                        }
                    });
            } else {
                callback.call(this, true);
            }
        },
        validGridLoop: function (grididarr, index, callback) {
            var self = this;
            var detailctrls = ui.gridController.grids;
            var currentGrid = grididarr[index];

            var bindtable = detailctrls[currentGrid].ctrl.bindtable;
            var grid = detailctrls[currentGrid].grid;
            var griddata = grid.getData();
            if (griddata.length == 0)
                callback.call(this, true);
            else
                Page.Validate.validate(currentGrid, griddata, function (flag, rowindex, message, gridid) {
                    if (flag) {
                        if (grididarr.length > index + 1) {
                            self.validGridLoop(index + 1);//验证下一个
                        }
                        else {
                            //直接回调结束
                            callback.call(this, flag, rowindex, message, gridid);
                        }
                    } else {
                        callback.call(this, flag, rowindex, message, gridid);
                    }
                });

        },
        validMain: function (callback) {
            var self = this;
            // 清空表单验证消息
            $('#form').validator("cleanUp");

            $("#form").isValid(function (flag, error) {
                if (flag) {
                    // 验证明细
                    callback(true);
                } else {
                    var mes = [];
                    $.each(error, function (i, val) {
                        mes.push("<div style='font-size:13px;'><span style='font-weight:bold;color:red;'>" + self.controlLabel[val.ele] + " </span>  " + val.err.replace("此处", "") + "</div>");
                        $(val.ele).trigger("showmsg", ["error", val.err]);
                    });


                    callback(flag, mes);
                    //leeUI.Error(mes.join("</br>"));
                    //leeUI.Error(error);
                }
            });
        },
        /*获取界面上控件的值 并赋给模型*/
        getCtrl: function () {
            //
            this.bindfields = this.bindfields || $("[data-bindfield]");
            for (var i = 0; i < this.bindfields.length; i++) {
                var $ele = $(this.bindfields[i]);
                var BindKey = $ele.attr("data-bindfield");
                if (BindKey == "") continue;
                if ($ele.leeUI()) {
                    var type = $ele.leeUI().type;

                    if (type == "Upload") {
                        BindValue = $ele.leeUI().getSingleValue();
                    } else {
                        BindValue = $ele.leeUI().getValue();
                    }

                } else {
                    var type = $ele.attr("type");
                    if (type == "text" || $ele.is("textarea")) {
                        BindValue = $ele.val();
                    }
                    else if (type == "checkbox") {
                        BindValue = $ele.prop("checked") ? "1" : "0";
                    }
                }
                model.setMainModelObject(BindKey, BindValue);
            }

            var detailctrls = ui.gridController.grids;


            for (var gridid in detailctrls) {
                if (gridid != ui.gridController.mainGridID) {
                    var bindtable = detailctrls[gridid].ctrl.bindtable;

                    if (!model.isDataModelSource(bindtable)) return;
                    var grid = detailctrls[gridid].grid;
                    var griddata = grid.getData();
                    model.setModelObject(bindtable, griddata);//把明细表的值赋给模型  
                }
            }
            //给明细model赋值
        },
        bindCtrl: function () {
            var data = model.getModel();
            var mainModel = data[0].data[0];
            this.bindfields = this.bindfields || $("[data-bindfield]");

            for (var i = 0; i < this.bindfields.length; i++) {
                var item = this.bindfields[i];
                var $ele = $(item);
                //if (i == 0) $ele.focus();
                var bindKey = $ele.attr("data-bindfield");
                var bindTable = $ele.attr("data-bindtable");
                if (bindKey == "" || bindTable == "") continue;
                if ($ele.leeUI()) {
                    $ele.leeUI().setValue(mainModel[bindKey]);
                } else {
                    var type = $ele.attr("type");
                    if (type == "text" || $ele.is("textarea")) {
                        $ele.val(mainModel[bindKey]);
                    }
                    else if (type == "checkbox") {
                        $ele.prop("checked", mainModel[bindKey] == "1");
                    }
                }
            }

            // 绑定明细表
            var detailctrls = ui.gridController.grids;
            for (var gridid in detailctrls) {
                if (gridid != ui.gridController.mainGridID) {
                    var bindtable = detailctrls[gridid].ctrl.bindtable;

                    if (!model.isDataModelSource(bindtable)) return;
                    var grid = detailctrls[gridid].grid;
                    var griddata = [];
                    for (var item in data) {
                        if (data[item]["id"] == bindtable) {
                            griddata = data[item].data;
                        }
                    }
                    grid.loadData({ Rows: griddata });
                }
            }

        }
    };

    ui.UIController = UIController;//暴露给外层

    function DictUIController(page) {
        DictUIController.base.constructor.call(this, page); //父构造函数
    };

    DictUIController.leeExtend(UIController, {
        init: function () {
            this.setStatus("view");//初始状态为查看
        },
        getValue: function () {
        },
        isTreeMode: function () {
            if (ui.gridController.mainGrid) return false;
            return true;
        },
        getSelected: function () {
            if (this.isTreeMode()) {

                var tree = ui.treeController.mainTree;
                var selected = tree.getSelected().data;
                return selected;

            } else {
                var grid = ui.gridController.mainGrid;
                var selected = grid.getSelected();
                return selected;
            }
        },
        add: function () {
            return this.addRow();
        },
        addRow: function () {
            //this.lastID = "";
            //this.lastID = this.getDataID();//记住新增前的ID
            var grid = ui.gridController.mainGrid;
            var row = grid.getSelected();
            if (row)
                grid.unselect(row);


            model.setMainModel([model.getDefaultDataRow("", false)]);
            model.clearDetailModel();
            // 如果有明细表需清空明细表
            //this.setValue([{ data: [model.getDefaultDataRow()] }]);
            //model.setModel([{ data: [model.getMainModel()] }]);
            this.bindCtrl();
            this.setStatus("add");
            ui.fileManager.initParamsEmpty();//刷新file
            return true;
            //获取默认值模型
            //界面赋值
            //设置控件状态 可编辑
        },
        addChild: function () {
            //var grid = ui.gridController.mainGrid;
            //var selected = grid.getSelected();
            var selected = this.getSelected();
            if (selected) {

                var data = model.getDefaultDataRow("", true, selected, false);

                model.setMainModel([data]);
                model.clearDetailModel();
                this.bindCtrl();
                ui.fileManager.initParamsEmpty();
                this.setStatus("addchild");
                return true;
            } else {
                $.leeUI.Error("请选中父节点数据！");
            }
        },
        addSame: function () {
            //var grid = ui.gridController.mainGrid;
            //var selected = grid.getSelected();
            var selected = this.getSelected();
            var data = model.getDefaultDataRow("", true, selected, true);
            model.setMainModel([data]);
            model.clearDetailModel();
            this.bindCtrl();
            ui.fileManager.initParamsEmpty();
            this.setStatus("addsame");
            return true;
        },
        setValue: function (data) {
            //获取界面上主表绑定进行赋值
            model.setModel(data);
            this.bindCtrl();
        },
        loadData: function () {
            //如果不是分页模式则手工取数加载数据

        },

        cancel: function () {
            if (this.lastID) {
                this.selectRow(this.lastID);
            }
            return true;
        },
        selectRow: function (id) {
            var index = 0;
            if (this.isTreeMode()) {
                ui.treeController.mainTree.selectNode(id);
                return;
            } else {
                // 判断是否树形
                var data = ui.gridController.mainGrid.getData();
                for (var i = 0; i < data.length; i++) {
                    if (data[i][model.pkCol] == id) {
                        index = i;
                    }
                }
                ui.gridController.mainGrid.select(index);
            }
        },
        /*刷新界面数据*/
        reload: function () {
            //判断是否树形
            if (this.isTreeMode()) {

                ui.treeController.load(ui.treeController.mainTreeID);
                //更新所有 or 指刷新节点
            } else {
                ui.gridController.reloadMain(); // 刷新主表



            }
            //ui.gridController.mainGrid.loadData(true);
        },
        /*字典单行编辑方法*/
        deleteData: function () {
            var self = this;
            this.getCtrl();
            var dataID = model.getMainDataID();
            $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
                if (type) {
                    service.deleteModel(modelID, dataID).done(function (data) {
                        self.lastID = "";
                        self.saveExpandStatus();
                        self.reload();
                        if (data.res)
                            leeUI.Success(data.mes);
                    }).fail(function (data) {
                        console.log("失败");
                    });
                }
            });
        },
        saveExpandStatus: function () {
            this.expandrows = [];
            var self = this;
            var grid = ui.gridController.mainGrid;
            var lnks = $(".lee-grid-tree-link-open");
            $.each(lnks, function (i, ele) {
                var domid = $(ele).closest("tr").attr("id");
                var idField = model.pkCol;
                var rowkey = grid._getRowByDomId(domid)[idField];
                self.expandrows.push(rowkey);
            });
        },
        /*字典类保存方法*/
        _saveData: function (callback) {
            //validate 
            var self = this;
            this.getCtrl();
            var data = model.getSaveData();

            data["FBFileSave"] = ui.fileManager.getAllData();//绑定附件数据
            var tmpid = model.getMainDataID();
            var treeCurrent = model.getCurrentTreeObj();
            this.saveExpandStatus();
            //模型id 数据
            service.saveModel(
                modelID,
                JSON.stringify(data),
                this.status,
                JSON.stringify(treeCurrent)
            ).done(function (data) {
                self.lastID = tmpid;
                self.reload();
                if (data.res) {
                    leeUI.Success(data.mes);
                }
                callback(data.res);


            })
            .fail(function (data) {
                console.log("失败");
            });
        },
        saveData: function () {

            var defer = $.Deferred();

            var self = this;
            this.isValid(function (flag, index, mes, gridid) {
                if (flag) {
                    self._saveData(function (data) {
                        defer.resolve(data);
                    });
                }
                else {
                    if (gridid) {
                        var tips = "表【"
                                + ui.gridController.grids[gridid].ctrl.label
                                + "】的第【"
                                + String(index + 1) + "】行数据校验失败 <br/>";

                        for (var item in mes) {
                            tips += "<b>" + ui.rules[gridid + "." + mes[item].key].title + "</b>"
                                + mes[item].mes + "";
                        }
                        $.leeUI.Error(tips);
                        defer.resolve(false);
                    } else {
                        $.leeUI.Error(mes.join("</br>"));
                    }
                }
                //alert(flag);
                //alert(index);
                //alert(mes + gridid);
            })
            return defer.promise();
        },
        /*获取界面上控件的值 并赋给模型*/
        getCtrl: function () {
            //
            this.bindfields = this.bindfields || $("[data-bindfield]");
            for (var i = 0; i < this.bindfields.length; i++) {
                var $ele = $(this.bindfields[i]);
                var BindKey = $ele.attr("data-bindfield");
                if (BindKey == "") continue;
                if ($ele.leeUI()) {
                    var type = $ele.leeUI().type;

                    if (type == "Upload") {
                        BindValue = $ele.leeUI().getSingleValue();
                    } else {
                        BindValue = $ele.leeUI().getValue();
                    }

                } else {
                    var type = $ele.attr("type");
                    if (type == "text" || $ele.is("textarea")) {
                        BindValue = $ele.val();
                    }
                    else if (type == "checkbox") {
                        BindValue = $ele.prop("checked") ? "1" : "0";
                    }
                }
                model.setMainModelObject(BindKey, BindValue);
            }

            var detailctrls = ui.gridController.grids;


            for (var gridid in detailctrls) {
                if (gridid != ui.gridController.mainGridID) {
                    var bindtable = detailctrls[gridid].ctrl.bindtable;
                    var grid = detailctrls[gridid].grid;
                    var griddata = grid.getData();
                    model.setModelObject(bindtable, griddata);//把明细表的值赋给模型  
                }
            }
            //给明细model赋值
        },
        bindCtrl: function () {
            var data = model.getModel();
            var mainModel = data[0].data[0];
            this.bindfields = this.bindfields || $("[data-bindfield]");

            for (var i = 0; i < this.bindfields.length; i++) {
                var item = this.bindfields[i];
                var $ele = $(item);
                //if (i == 0) $ele.focus();
                var bindKey = $ele.attr("data-bindfield");
                var bindTable = $ele.attr("data-bindtable");
                if ($ele.leeUI()) {
                    $ele.leeUI().setValue(mainModel[bindKey]);
                } else {
                    var type = $ele.attr("type");
                    if (type == "text" || $ele.is("textarea")) {
                        $ele.val(mainModel[bindKey]);
                    }
                    else if (type == "checkbox") {
                        $ele.prop("checked", mainModel[bindKey] == "1");
                    }
                }
            }

            // 绑定明细表
            var detailctrls = ui.gridController.grids;
            for (var gridid in detailctrls) {
                if (gridid != ui.gridController.mainGridID) {
                    var bindtable = detailctrls[gridid].ctrl.bindtable;
                    var grid = detailctrls[gridid].grid;
                    var griddata = [];
                    for (var item in data) {
                        if (data[item]["id"] == bindtable) {
                            griddata = data[item].data;
                        }
                    }
                    grid.loadData({ Rows: griddata });
                }
            }

        },
        bind: function () {
            // 字典类控制器绑定事件
            // 选中行的操作
            var self = this;
            if (this.controls["grid"]) {
                $.each(this.controls["grid"], function (id, ctrl) {
                    if (id == ui.gridController.mainGridID) {
                        ui.event.register(id, "selectRow", function (e, rowdata, rowid, rowobj) {
                            var id = this.id
                            var idField = model.pkCol;
                            var modelID = model.ID;
                            var dataID = rowdata[idField];
                            self.lastID = dataID;//记录上一次选中值


                            //发起请求获取数据 调用service
                            service.getModelByDataID(modelID, dataID).done(function (data) {
                                console.log(data);
                                if (data.res) {
                                    //model.setModel(data.data);
                                    //self.bindCtrl();
                                    self.setValue(data.data);
                                    self.setStatus("edit");
                                } else {
                                    $.leeUI.Warn(data.mes);
                                }
                            })
                            .fail(function (data) {
                                console.log("失败");
                            });
                        });
                        ui.event.register(id, "afterShowData", function (e, data) {
                            var grid = $("#" + id).leeUI();
                            if (grid.treeload) return;

                            if (data.Rows.length > 0) {
                                var index = 0;
                                var selrow;
                                if (self.lastID) {
                                    for (var i = 0; i < data.Rows.length; i++) {
                                        if (data.Rows[i][model.pkCol] == self.lastID) {
                                            index = i;
                                            selrow = data.Rows[i];
                                            break;
                                        } else if (data.Rows[i].__hasChildren) {
                                            loop(data.Rows[i].children)
                                        }
                                    }
                                }
                                function loop(childrens) {
                                    for (var i = 0; i < childrens.length; i++) {
                                        if (childrens[i][model.pkCol] == self.lastID) {
                                            index = i;
                                            selrow = childrens[i];
                                            break;
                                        } else if (childrens[i].__hasChildren) {
                                            loop(childrens[i].children)
                                        }

                                    }
                                }
                                if (selrow) {
                                    grid.select(selrow);
                                } else {
                                    grid.select(0);
                                }
                                //alert(index); 树形grid的时候 这里记录索引有问题 todo

                            }
                            var rows = self.expandrows;
                            var data = grid.rows;
                            for (var i = 0; i < data.length; i++) {
                                if ($.inArray(data[i][model.pkCol], rows) != -1) {
                                    grid.expand(data[i]);
                                }
                            }
                            self.expandrows = [];

                        });


                    }
                });

            }
            // 树形控件绑定点击事件


            if (this.controls["tree"]) {
                $.each(this.controls["tree"], function (id, ctrl) {
                    if (ctrl.ismain) {
                        ui.event.register(id, "selectRow", function (e, data) {
                            var id = this.id
                            var idField = model.pkCol;
                            var modelID = model.ID;
                            var dataID = data.data[idField];
                            self.lastID = dataID;//记录上一次选中值
                            //alert(dataID);
                            //发起请求获取数据 调用service
                            service.getModelByDataID(modelID, dataID).done(function (data) {
                                console.log(data);
                                if (data.res) {
                                    //model.setModel(data.data);
                                    //self.bindCtrl();
                                    self.setValue(data.data);
                                    self.setStatus("edit");
                                } else {
                                    $.leeUI.Warn(data.mes);
                                }
                            })
                            .fail(function (data) {
                                console.log("失败");
                            });
                        });

                        ui.event.register(id, "afterShowData", function (e, data) {
                            if (data.length > 0) {
                                var index = 0;
                                if (self.lastID) {
                                    $("#" + this.id).leeUI().selectNode(self.lastID);
                                }
                                else {
                                    $("#" + this.id).leeUI().selectNode(data[0][model.pkCol]);
                                }
                            }

                        });

                    }



                });

            }
        }
    });



    function ListUIController(page) {
        ListUIController.base.constructor.call(this, page); //父构造函数
    };

    ListUIController.leeExtend(UIController, {
        init: function () {
            //this.setStatus("view");//初始状态为查看

            this.deleteData = [];//记录删除的列表数据
        },
        loadData: function () {
            //如果主grid 不是分页 手动加载数据
            //过滤条件
        },
        setValue: function (data) {
            //获取界面上主表绑定进行赋值
            model.setModel(data);
            this.bindCtrl();
        },
        getValue: function () {
            //树形列表 
            //1.非异步加载，常规处理。保存后则刷新列表并且记录滚动条位置 删除亦如此
            //2.异步加载，addChild 需从远程判断？ //保存后刷新当前行即可 //删除也是删除当前行

            //树形字典

        },
        addChild: function () {
            //父子结构  直接取上级ID作为ParentID
            //是否明细 上级更新为非明细 本级别暂定明细
            //分级码 ajax 计算出最大分级码 级数  fomart出来父子结构 addRow
            //保存后更新上级是否明细 本级明细
        },
        addSame: function () {
            //父子结构  直接取上级ID作为ParentID
            //是否明细 上级更新为非明细 本级别暂定明细

            //分级码 ajax 计算出最大分级码 级数  fomart出来父子结构 addRow
            //保存后更新上级是否明细 本级明细
        },
        addRow: function () {
            ui.gridController.mainGrid.addRow(model.getDefaultDataRow("", false));
        },
        _saveData: function (callback) {
            var self = this;
            model.setMainModel(ui.gridController.mainGrid.getData());
            var data = model.getSaveData();//获取保存数据
            data["FBFileSave"] = ui.fileManager.getAllData();//绑定附件数据
            //模型id 数据
            service.saveModelList(modelID, JSON.stringify(data), JSON.stringify(this.deleteData)).done(function (data) {
                //self.reload();
                if (data.res) {
                    leeUI.Success(data.mes);
                    self.loadData();
                    console.log(data);
                }
                callback(data.res);
                //成功后刷新列表
                //触发保存成功事件
            })
            .fail(function (data) {
                console.log("失败");
            });
        },
        saveData: function () {
            var defer = $.Deferred();
            var self = this;
            this.isValid(function (flag, index, mes, gridid) {
                if (flag) {
                    self._saveData(function (data) {
                        defer.resolve(data);
                    });
                }
                else {
                    if (gridid) {
                        var tips = "表【"
                                + ui.gridController.grids[gridid].ctrl.label
                                + "】的第【"
                                + String(index + 1) + "】行数据校验失败 <br/>";

                        for (var item in mes) {
                            tips += "<b>" + ui.rules[gridid + "." + mes[item].key].title + "</b>"
                                + mes[item].mes + "";
                        }
                        $.leeUI.Error(tips);
                        defer.resolve(false);
                    } else {
                        $.leeUI.Error(mes.join("</br>"));
                    }

                }
            });
            return defer.promise();

        },
        deleteRow: function () {
            var grid = ui.gridController.mainGrid;
            var selected = grid.getSelected();
            if (selected) {
                grid.endEdit();
                grid.remove(selected);
                this.pushDelete(selected);
            } else {
                $.leeUI.Error("请选中要删除的数据！");
            }
        },
        pushDelete: function (data) {
            this.deleteData.push(data);
        },
        /*刷新界面数据*/
        reload: function (iscustom) {
            ui.gridController.reloadMain(); // 刷新主表

            if (iscustom)
                ui.gridController.reloadOther();
            //ui.gridController.mainGrid.loadData(true);
        },
        bind: function () {
            // 字典类控制器绑定事件
            // 选中行的操作

        }
    });


    function CardUIController(page) {
        CardUIController.base.constructor.call(this, page); //父构造函数
    };

    CardUIController.leeExtend(UIController, {
        init: function () {
            //alert(this.getQuery("dataid"));
            this.setDataID(this.getQuery("dataid"));//设置dataid


        },
        initAction: function () {
            var action = this.getQuery("action");
            this.setStatus(action == "" ? "view" : action); // 默认是查看状态
            if (action == "") return;
            if (action == "modify") {
                this.setStatus("edit"); // 设置当前状态是修改状态
            }
            if (action.toLowerCase() == "add") {
                this.add();
                //ui.stateMachine.action("add"); // 
            } else if (action.toLowerCase() == "addsame" || action.toLowerCase() == "addchild") {
                action = "add";
            } else if (action.toLowerCase() == "copy") {
                this.copy(this.getDataID());
                action = "modify";
            } else {
                this.loadData();//查看和修改则加载数据               
            }
            // 状态机设置当前动作
            ui.stateMachine.action(action.toLowerCase());
        },
        copy: function (dataid) {
            var self = this;
            service.getModelByDataID(modelID, dataid).done(function (data) {
                if (data.res) {
                    //self.setStatus("edit");
                    //console.log(data);
                    // 处理主表  处理明细表字段
                    var newid = Guid.NewGuid().ToString();
                    model.setModel(data.data);
                    model.setMainModelObject(model.pkCol, newid);
                    self.setDataID(newid);
                    self.bindCtrl();
                    self.setStatus("add");
                } else {
                    $.leeUI.Warn(data.mes);
                }

            })
            .fail(function (data) {
                console.log("失败");
            });
        },
        bind: function () {
            this.setPageReadOnly();
        },
        initTreeInfo: function (row) {
            this.setQueryTreeSelect(row);
            var status = this.getStatus();
            if (status == "addchild") {
                this.addChild();
            } else if (status == "addsame") {
                this.addSame();
            }
        },
        setQueryTreeSelect: function (row) {
            this.selected = row;
        },
        getQueryTreeSelect: function () {
            return this.selected;
        },
        addSame: function () {
            var selected = this.getQueryTreeSelect();
            model.setMainModel([model.getDefaultDataRow("", true, selected, true)]);
            model.clearDetailModel();

            this.setDataID(model.getMainDataID());
            this.bindCtrl();
            ui.fileManager.initParamsEmpty();
            return true;
        },
        addChild: function () {
            var selected = this.getQueryTreeSelect();

            model.setMainModel([model.getDefaultDataRow("", true, selected, false)]);

            model.clearDetailModel();
            this.setDataID(model.getMainDataID());
            this.bindCtrl();
            ui.fileManager.initParamsEmpty();

            return true;
        },
        add: function () {
            // 卡片新增方法
            this.lastID = this.getDataID();//记住新增前的ID

            model.setMainModel([model.getDefaultDataRow()]);

            model.clearDetailModel();
            this.setDataID(model.getMainDataID());
            this.bindCtrl();
            ui.fileManager.initParamsEmpty();
            return true;

        },
        getGridBindData: function (gridid) {

            return ui.gridController.grids[gridid];
        },
        deleteGridRow: function (gridid) {
            var bindings = this.getGridBindData(gridid);
            var bindtable = bindings.ctrl.bindtable;
            var grid = bindings.grid;

            var selected = grid.getSelected();
            if (selected) {
                grid.endEdit();
                grid.remove(selected);
                model.deleteDetailRow(bindtable, selected);
                // 这里是否要告知模型
            }
            return true;
            // 触发行公式
            // 刷新整个模型

        },
        addGridRow: function (gridid) {
            var bindings = this.getGridBindData(gridid);
            var bindtable = bindings.ctrl.bindtable;
            var grid = bindings.grid;
            grid.addRow(model.getDefaultGridRow(bindtable, this.getDataID()));
            return true;
        },
        getValue: function () {

        },
        setValue: function (data) {

        },
        loadData: function (flag) {
            // 加载数据 含主表子表信息
            var self = this;
            service.getModelByDataID(modelID, this.getDataID()).done(function (data) {

                if (data.res) {
                    //self.setStatus("edit");
                    //console.log(data);
                    model.setModel(data.data);
                    self.bindCtrl();
                    ui.event.trigger("", "onload", [data.data]);
                } else {
                    $.leeUI.Warn(data.mes);
                }

            })
            .fail(function (data) {
                console.log("失败");
            });
            if (!flag)
                ui.fileManager.loadData();

        },
        _saveData: function (callback) {
            var self = this;
            this.getCtrl();
            var data = model.getSaveData();
            data["FBFileSave"] = ui.fileManager.getAllData();//绑定附件数据
            //获取到树形
            var treeCurrent = model.getCurrentTreeObj();

            //模型id 数据
            service.saveModelALL(
                modelID,
                this.getDataID(),
                JSON.stringify(data),
                this.status,
                JSON.stringify(treeCurrent)
            ).done(function (data) {
                //self.reload();
                if (data.res) {
                    leeUI.Success(data.mes);
                    self.loadData(true);
                    self.setStatus("edit");//保存后状态改为修改
                    //callback(data.res);
                }
                callback(data.res);
                //成功后刷新列表
                //触发保存成功事件
            }).fail(function (data) {
                console.log("失败");
            });
        },
        saveData: function (callback) {
            var defer = $.Deferred();
            var self = this;
            this.isValid(function (flag, index, mes, gridid) {
                if (flag) {
                    self._saveData(function (data) {
                        defer.resolve(data);
                    });
                }
                else {

                    if (gridid) {
                        var tips = "表【"
                                + ui.gridController.grids[gridid].ctrl.label
                                + "】的第【"
                                + String(index + 1) + "】行数据校验失败 <br/>";

                        for (var item in mes) {
                            tips += "<b>" + ui.rules[gridid + "." + mes[item].key].title + "</b>"
                                + mes[item].mes + "";
                        }
                        $.leeUI.Error(tips);
                        defer.resolve(false);
                    } else {
                        $.leeUI.Error(mes.join("</br>"));
                    }
                }

            })
            return defer.promise();

        },
        getCtrl: function () {
            // 获取界面上的绑定值
            this.bindfields = this.bindfields || $("[data-bindfield]");
            for (var i = 0; i < this.bindfields.length; i++) {
                var $ele = $(this.bindfields[i]);
                var BindKey = $ele.attr("data-bindfield");
                if (BindKey == "") continue;
                if ($ele.leeUI()) {
                    var type = $ele.leeUI().type;
                    if (type == "Upload") {
                        BindValue = $ele.leeUI().getSingleValue();
                    } else {
                        BindValue = $ele.leeUI().getValue();
                    }
                } else {
                    var type = $ele.attr("type");
                    if (type == "text" || $ele.is("textarea")) {
                        BindValue = $ele.val();
                    }
                    else if (type == "checkbox") {
                        BindValue = $ele.prop("checked") ? "1" : "0";
                    }
                }
                model.setMainModelObject(BindKey, BindValue);
            }


            var detailctrls = ui.gridController.grids;


            for (var gridid in detailctrls) {


                var bindtable = detailctrls[gridid].ctrl.bindtable;
                var grid = detailctrls[gridid].grid;
                var griddata = grid.getData();
                model.setModelObject(bindtable, griddata);//把明细表的值赋给模型  
            }


        },
        bindCtrl: function () {
            // 绑定数据
            var data = model.getModel();
            var index = model.getMainIndex();
            var mainModel = data[index].data[0];
            this.bindfields = this.bindfields || $("[data-bindfield]");

            for (var i = 0; i < this.bindfields.length; i++) {
                var item = this.bindfields[i];
                var $ele = $(item);
                //if (i == 0) $ele.focus();
                var bindKey = $ele.attr("data-bindfield");
                var bindTable = $ele.attr("data-bindtable");
                if ($ele.leeUI()) {
                    var type = $ele.leeUI().type;
                    if (type.toLowerCase() == "lookup")
                        $ele.leeUI().setValue(mainModel[bindKey], mainModel[bindKey]);
                    else if (type.toLowerCase() == "upload") {
                        // 附件有单独的方法处理赋值事件
                    }
                    else {
                        $ele.leeUI().setValue(mainModel[bindKey]);
                    }
                } else {
                    var type = $ele.attr("type");
                    if (type == "text" || $ele.is("textarea")) {
                        $ele.val(mainModel[bindKey]);
                    }
                    else if (type == "checkbox") {
                        $ele.prop("checked", mainModel[bindKey] == "1");
                    }
                }
            }
            //处理明细表
            var detailctrls = ui.gridController.grids;
            for (var gridid in detailctrls) {
                var bindtable = detailctrls[gridid].ctrl.bindtable;
                var grid = detailctrls[gridid].grid;
                var griddata = [];
                for (var item in data) {
                    if (data[item]["id"] == bindtable) {
                        griddata = data[item].data;
                    }
                }
                grid.loadData({ Rows: griddata });
            }
            //处理附件控件

        }
    });


    /*setpup 启动*/
    ui.run = function () {

        if (ui.instance) return;
        var formtype = formConfig.formtype;
        // 这里应该动态区分一下 factory工厂创建
        if (formtype == 1) {
            ui.instance = new DictUIController(pageConfig);
        } else if (formtype == "2") {
            ui.instance = new ListUIController(pageConfig)
        } else if (formtype == "3") {
            ui.instance = new CardUIController(pageConfig);
        }
        ui.instance.setFormType(formtype);
        ui.instance.init();
        ui.instance.initWidget();
        ui.instance.bind();//绑定UI级别的事件
        ui.fileManager.initParams();//初始化附件参数
        ui.stateMachine.init();
        ui.stateMachine.action("begin");
        ui.stateMachine.action("view");
        Page.Validate.setRules(ui.rules);
        ui.instance.initAction();//绑定动作
        ui.event.trigger("", "onPageReady", []);
    }

    // 附件管理
    ui.fileManager = {
        initParams: function () {
            for (var item in ui.instance.controls["file"]) {
                var ctrl = ui.instance.controls["file"][item];
                var $ele = $("#" + item).leeUI();
                $ele.updateParams({
                    frmID: ui.getFrmID(),
                    dataID: ui.instance.getDataID(),
                    field: "",
                    typecode: ctrl.options.typecode
                });
            }
            //updateParams
        },
        getAllData: function () {
            // 获取界面上所有的附件数据集合
            var arr = [];
            for (var item in ui.instance.controls["file"]) {
                var ctrl = ui.instance.controls["file"][item];
                var $ele = $("#" + item).leeUI();
                arr = arr.concat($ele.getValue());
            }
            return arr;
        },
        initParamsEmpty: function () {
            for (var item in ui.instance.controls["file"]) {
                var ctrl = ui.instance.controls["file"][item];
                var $ele = $("#" + item).leeUI();
                $ele.updateParams({
                    frmID: ui.getFrmID(),
                    dataID: ui.instance.getDataID(),
                    field: ""
                });
                $ele.setValue([]);
            }
        },
        loadData: function () {
            for (var item in ui.instance.controls["file"]) {

                var ctrl = ui.instance.controls["file"][item];
                var $ele = $("#" + item);
                service.getFileList(ui.getFrmID(), ui.instance.getDataID()).done(function (data) {
                    if (data.res) {
                        $ele.leeUI().setValue(data.data);
                    } else {
                        leeUI.Error(data.mes);
                    }
                }).fail(function (data) {
                    console.log("失败");
                });
            }
        }
    };

    // 设置必填
    ui.setRequired = function (ctrl) {
        if (ctrl.required) {
            var $ele = $("#" + ctrl.id);
            if ($ele.leeUI()) {
                $ele.leeUI()._setRequired(true);
            }
            else {
                $ele.addClass("required");
            }
        }
    };

    // 重新计算布局
    ui.refreshColumn = function (id) {

        var grids = $(".lee-ui-grid", $("#" + id));
        if (grids.length > 0) {
            grids.leeUI()._onResize();

        }

    }

    ui.chartController = {
        init: function (ctrl) {
            var id = ctrl.id;
            // 获取数据 
            // 生成脚本渲染
            var self = this;
            this.load(ctrl.datasource, function (data) {
                self.callBack(data, ctrl);
            })


        },
        callBack: function (data, ctrl) {
            if (ctrl.ctype == "line" || ctrl.ctype == "bar" || ctrl.ctype == "area") {
                this.callBackLine(data, ctrl);
            } else if (ctrl.ctype == "pie") {
                this.callBackPie(data, ctrl);

            } else if (ctrl.ctype == "dot") {
                this.callBackDot(data, ctrl);
            }
        },
        load: function (bindtable, callback) {
            var isDataModel = model.isMainSource(bindtable);
            var filter = ui.params.getFilterDataSource(bindtable).serialize();
            service.getModelTreeDataALL((isDataModel ? modelID : bindtable), filter, "", "", !isDataModel).done(function (data) {
                if (data.res) {
                    callback(data.data);
                }
                $.leeDialog.hideLoading();
            }).fail(function (data) {
                console.log("失败");
            });

        },
        callBackDot: function (data, ctrl) {
            var chart = new G2.Chart({
                container: ctrl.id,
                forceFit: true,
                height: ctrl.height - 5
            });

            chart.source(data);
            chart.tooltip({
                showTitle: false,
                crosshairs: {
                    type: 'cross'
                },
                itemTpl: '<li data-index={index} style="margin-bottom:4px;">'
                  + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
                  + '{name}<br/>'
                  + '{value}'
                  + '</li>'
            });
            chart.point().position('height*weight').color('gender').size(4).opacity(0.65).shape('circle').tooltip(
                'gender*height*weight', function (dim, height, weight) {
                    return {
                        name: dim,
                        value: height + ', ' + weight + ''
                    };
                });
            chart.render();
        },
        callBackPie: function (data, ctrl) {
            var fields = ctrl.series[0].field;
            var ds = new DataSet();

            var dv = ds.createView();
            dv.source(data).transform({
                type: 'percent',
                field: fields,
                dimension: ctrl.xfield,
                as: 'percent'
            });

            var chart = new G2.Chart({
                container: ctrl.id,
                forceFit: true,
                height: ctrl.height - 5


            });

            chart.source(dv, {

            });
            chart.coord('theta', {
                radius: 0.8
            });
            // 辅助文本
            //chart.guide().html({
            //    position: ['50%', '50%'],
            //    html: '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">主机<br><span style="color:#8c8c8c;font-size:20px">200</span>台</div>',
            //    alignX: 'middle',
            //    alignY: 'middle'
            //});

            chart.tooltip({
                showTitle: false,
                itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            });
            chart.intervalStack().position('percent').color(ctrl.xfield).label('percent', {
                //offset: -40,
                // autoRotate: false,
                textStyle: {
                    rotate: 0,
                    textAlign: 'center',
                    //shadowBlur: 2,
                    //shadowColor: 'rgba(0, 0, 0, .45)'
                },
                formatter: function (val, item) {
                    return item.point[ctrl.xfield] + ': ' + val;
                }
            }).tooltip(ctrl.xfield + '*percent', function (item, percent) {
                percent = percent * 100 + '%';

                return {
                    name: item,
                    value: percent
                };
            }).style({
                lineWidth: 1,
                stroke: '#fff'
            });
            chart.render();
            //chart.tooltip({
            //    showTitle: false,
            //    itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            //});
        },
        callBackLine: function (data, ctrl) {
            var ds = new DataSet();
            var dv = ds.createView().source(data);
            var fields = ctrl.series;
            var hastSeries = {};
            var arr = [];
            $.each(fields, function (i, obj) {
                arr.push(obj.field);
                hastSeries[obj.field] = obj.text ? obj.text : obj.field;
            });

            dv.transform({
                type: 'fold',
                fields: arr, // 展开字段集
                key: 'key', // key字段
                value: 'value', // value字段
            });

            var chart = new G2.Chart({
                container: ctrl.id,
                forceFit: true,
                height: ctrl.height - 5
            });




            chart.tooltip({
                crosshairs: {
                    type: 'line'
                }
            });
            var opts = {};
            if (ctrl.ctype == "line" || ctrl.ctype == "area") {
                opts[ctrl.xfield] = { range: [0, 1] };
                chart.line().position(ctrl.xfield + '*value').color('key').shape('smooth');
                if (ctrl.ctype == "line")
                    chart.point().position(ctrl.xfield + '*value').size(4).shape('circle').style({
                        stroke: '#fff',
                        lineWidth: 1
                    });
                else
                    chart.area().position(ctrl.xfield + '*value').shape('smooth');
            }
            else {
                chart.interval().position(ctrl.xfield + '*value').color('key').adjust([{
                    type: 'dodge',
                    marginRatio: 1 / 32
                }]);

            }


            chart.source(dv, opts);
            //chart.legend(false);

            chart.legend("key", {
                itemFormatter: function (val) {
                    var text = hastSeries[val];

                    return text;
                }
            });
            //chart.legend('count', {
            //    useHtml: true,
            //    containerTpl: "发布次数"
            //});
            chart.render();
        }
    };
    //grid控件操作控制器
    ui.gridController = {
        // 获取过滤条件
        getFilter: function (table, gridid) {
            var self = this;
            return function () {
                return self.getFilterExpress(table, gridid);
            }
        },
        getFilterExpress: function (table, gridid) {
            // 这里引入filter管理器 to-do
            var list = ui.params.getFilterList(table, gridid);

            return JSON.stringify(list);
        },
        // 刷新数据源 采用 事件订阅的方式是不是好点？
        refreshDS: function (table) {
            var self = this;
            if (!ui.gridController.hashTableGrid || !ui.gridController.hashTableGrid[table]) return;
            $.each(ui.gridController.hashTableGrid[table], function (i, val) {
                var res = self.load(val);
                if (res) {
                    $("#" + val).leeUI().loadData(true);
                }
            });
        },
        // 刷新摸一个grid控件
        refreshGrid: function (id) {
            var res = this.load(id);
            if (res) {
                var mgr = $("#" + id).leeUI();
                mgr.options.newPage = 1;
                mgr.loadData(true);
            }
        },
        // 缓存grid绑定的数据源信息
        addTableGridHash: function (table, id) {
            this.hashTableGrid[table] = this.hashTableGrid[table] || [];
            this.hashTableGrid[table].push(id);
        },
        init: function (ctrl) {
            var id = ctrl.id;
            this.id = ctrl.id;
            this.ctrl = ctrl;
            this.hashTableGrid = this.hashTableGrid || {};

            this.cacheFilter(id, ctrl.filter);
            var grid = $("#" + id).leeGrid(this.bulidOptions(ctrl));

            if (ctrl.height == "auto") {
                $("#" + id).addClass("lee-auto-grid");
            }
            this.addTableGridHash(ctrl.bindtable, id);
            //如果不是分页的话 则给代理发消息 加入加载数据队列

            if (model.isMainSource(ctrl.bindtable)) {
                this.addMainSource(grid);
                this.mainGridID = ctrl.id;
                this.mainSourceID = ctrl.bindtable;
            }

            else if (model.isDetailSoucre(ctrl.bindtable))
                this.addDetailSource(id, grid);
            // 查询条件联动
            if (ctrl.isqry) {
                ui.params.pushGridZone({
                    id: ctrl.id,
                    dsid: ctrl.qryds,
                    treefield: ctrl.qrytreefield,
                    dsfield: ctrl.qrydsfield,
                    cmptype: ctrl.qrycmptype,
                    exp: ctrl.qryexp
                });
            }
            // 加入管理类
            this.add(id, { ctrl: ctrl, grid: grid });
            //grid初始化完成处理异步加载
            this.load(id);//这里需要引入parms 获取界面条件
        },
        addMainSource: function (grid) {
            if (!this.mainGrid) this.mainGrid = grid;//添加主表数据源 只能添加一次
        },
        addDetailSource: function (id, grid) {
            this.deatalGrids = this.deatalGrids || {};
            this.deatalGrids[id] = grid;
        },
        add: function (id, grid) {
            //缓存grid对象信息
            this.grids = this.grids || {};
            this.grids[id] = grid;
        },
        cacheFilter: function (id, filter) {
            this.gridFilters = this.gridFilters || {};
            this.gridFilters[id] = filter;
        },

        getCacheFilter: function (id) {
            return this.gridFilters[id];
        },
        setGridExtFilter: function (id, filter) {
            //动态的设置grid的实时查询条件
            this.gridExtFilters = this.gridExtFilters || {};
            this.gridExtFilters[id] = filter;
        },
        getGridExtFilter: function (id) {
            this.gridExtFilters = this.gridExtFilters || {};
            return this.gridExtFilters[id];
        },
        reloadMain: function () {
            // 刷新界面主对象 Grid
            if (this.load(this.mainGridID)) {
                this.mainGrid.loadData(true);
            }
        },
        reloadOther: function () {
            var self = this;
            $.each(this.grids, function (key, obj) {
                if (key != self.mainGridID)
                    obj.grid.loadData(true);
            });
        },
        load: function (gridid, filter, keyword) {
            var self = this;
            var flag = false;
            if (!gridid) return;
            var bindtable = this.grids[gridid].ctrl.bindtable;


            if (this.isAsync()) {
                // 如果异步加载的话
                filter = this.getFilterExpress(bindtable, gridid); //获取查询条件
                this.asyncLoadFirst(bindtable, filter);
            }
            else if (!this.isPager(gridid) && !model.isDetailSoucre(bindtable)) {  // 如果不是明细表 而且没分页
                filter = this.getFilterExpress(bindtable, gridid); //获取查询条件
                var isDataModel = model.isMainSource(bindtable);// 是否是数据模型主表
                service.getModelTreeDataALL((isDataModel ? modelID : bindtable), filter, "", keyword, !isDataModel).done(function (data) {
                    if (data.res) {
                        self.setGridData(gridid, data.data);
                    }
                    $.leeDialog.hideLoading();
                }).fail(function (data) {
                    console.log("失败");
                });
            } else {
                flag = true;
            }
            return flag;
        },
        setGridData: function (gridid, data) {
            $("#" + gridid).leeUI().loadData({ Rows: data });
        },
        isPager: function (gridid) {
            return this.grids[gridid].ctrl.pager;
        },
        isAsync: function () {
            //主grid是否异步加载
            if (!this.mainGridID) return false;
            return this.grids[this.mainGridID].ctrl.async;
        },
        loadLocalData: function (filter) {
            // 加载数据源数据
        },
        asyncLoadFirst: function (bindtable, filter) {
            var self = this;
            var isDataModel = model.isMainSource(bindtable);
            self.treeInfo = model.getTreeInfo(bindtable, !isDataModel);
            service.getTreeAsyncLoadData(isDataModel ? modelID : bindtable, "", "", "", "", filter, "", !isDataModel).done(function (data) {
                if (data.res) {
                    for (var item in data.data) {
                        if (data.data[item][self.treeInfo.ischild] == "0") {
                            data.data[item].children = [];
                        }
                    }
                    self.mainGrid.loadData({ Rows: data.data }); //添加数据
                }
                $.leeDialog.hideLoading();
            }).fail(function (data) {
                console.log("失败");
            });
        },
        buildTreeOptions: function (ctrl) {
            this.treeInfo = model.getTreeInfo(ctrl.bindtable);
            var self = this;
            var treeOpts = {
                columnId: ctrl.treefield,
                idField: this.treeInfo.id,
                childrenName: "children",
                parentIDField: this.treeInfo.parentid,
                isExtend: function (data) {
                    if (!data._loaded) {
                        //return false;
                    }
                    return true;//是否展开？
                },
                isParent: function (data) {
                    //异步加载
                    return data[self.treeInfo.ischild] == '0' ? true : false;
                }
            }
            return treeOpts;
        },
        bulidTreeAsyncOptions: function (ctrl) {
            // 树点击节点事件
            var self = this;
            this.treeInfo = model.getTreeInfo(ctrl.bindtable);
            //var modelID = "";
            var self = this;
            var onTreeExpand = function (rowdata, e) {
                var grid = this;
                if (rowdata._loaded || (rowdata.children && rowdata.children.length > 0)) return;
                if (!rowdata._loaded && !rowdata.children) {
                    grid.toggleLoading(true);
                }
                var levelField = self.treeInfo.level;
                var gradeField = self.treeInfo.grade;
                var parentIDField = self.treeInfo.id;
                // 获取下级数据

                var filter = self.getFilterExpress(ctrl.bindtable, ctrl.id);

                var isDataModel = model.isMainSource(ctrl.bindtable);
                service.getTreeAsyncLoadData((isDataModel ? modelID : bindtable), rowdata[levelField], rowdata[gradeField], rowdata[parentIDField], "", filter, "", !isDataModel).done(function (data) {
                    if (data.res) {
                        for (var item in data.data) {
                            if (data.data[item][self.treeInfo.ischild] == "0") {
                                data.data[item].children = [];
                            }
                        }
                        grid.treeload = true;
                        grid.append(data.data, rowdata); //添加数据    
                        e.update();
                        grid.treeload = false;
                        ui.event.trigger(grid.id, "afterShowData", grid.currentData);
                        rowdata._loaded = true;
                    }
                    grid.toggleLoading(false);
                }).fail(function (data) {
                    console.log("失败");
                });
            };
            return onTreeExpand;
        },
        bulidOptions: function (ctrl) {
            //当前绑定的是否是模型对象 是的话标记为系统grid
            // 循环生成columns 内容 editors等内容
            // grid 事件扩展

            var opts = {
                columns: this.buildColumns(ctrl.columns),
                fixedCellHeight: true,//固定行高
                alternatingRow: false,
                usePager: ctrl.pager ? true : false,
                height: ctrl.height ? ctrl.height : "100%",
                checkbox: ctrl.checkbox ? true : false,
                rownumbers: ctrl.rownumber ? true : false,
                alternatingRow: ctrl.alt,
                rowHeight: 30,
                onAfterShowData: this.onAfterShowData,
                onSelectRow: this.onSelectRow,
                enabledEdit: true,
                heightDiff: ctrl.border ? 0 : 1
            };


            $.each(ctrl.columns, function (i, obj) {
                if (obj.group) {

                    opts.groupColumnName = obj.bindfield;
                    opts.groupColumnDisplay = obj.colname;
                    return false;
                }
                return true;
            })
            if (ctrl.readonly) {
                opts.enabledEdit = false;
            }
            if (ctrl.barid) {
                opts.toolbar = ui.toolbarController.getOptions(ctrl.barid, ctrl.id);
                ui.toolbarController.add(ctrl.barid, { id: ctrl.barid });
            }

            if (ctrl.pager) {
                opts.url = this.bulidRequestUrl(ctrl);
                opts.parms = this.bulidParams(ctrl);
                opts.dataAction = 'server';

                opts.pageSize = ctrl.pagesize ? ctrl.pagesize : "50";
                //opts.scrollToPage = true;
                //opts.scroll = true;
                //opts.pageSize = 5;
                //opts.scrollToAppend = true;

                //opts.pagerRender = function () {

                //    var html = [];
                //    html.push('<div style="line-height:32px;padding-right:10px;float:right;">');
                //    if (this.get('newPage') == this.get('pageCount')) {
                //        html.push('<span>总共：' + this.get('pageCount') + '页</span> ');
                //    } else {
                //        html.push('<span>已加载：' + this.get('newPage') + '页</span> ');
                //        html.push('<span>,</span> ');
                //        html.push('<span>总共：' + this.get('pageCount') + '页</span> ');

                //    } html.push('</div>');
                //    return html.join('');
                //};
            }
            //树形列表配置信息
            if (ctrl.tree) {
                opts.tree = this.buildTreeOptions(ctrl);
                opts.treeIconRender = function (rowdata, status) {
                    // console.log(rowdata); 给tree增加点色彩
                    if (rowdata.__hasChildren)
                        return "<i class='tree-grid-icon icon-img icon-folder'></i>";
                    else
                        return "<i class='tree-grid-icon icon-img icon-document'></i>";
                }
                if (ctrl.async) {
                    opts.onTreeExpand = this.bulidTreeAsyncOptions(ctrl);
                    delete opts.url;
                    opts.data = [];
                    opts.dataAction = "local";
                    opts.usePager = false;
                } else {
                    delete opts.tree.isParent;
                }
            }
            return opts;
        },
        columnsToTree: function (data) {
            // 把columns转换为树形结构
            var childrenName = "columns";
            if (!data || !data.length) return [];
            var targetData = []; //存储数据的容器(返回) 
            var records = {};
            var itemLength = data.length; //数据集合的个数
            for (var i = 0; i < itemLength; i++) {
                var o = data[i];
                var key = getKey(o["colid"]);
                records[key] = o;
            }
            for (var i = 0; i < itemLength; i++) {
                var currentData = data[i];
                var key = getKey(currentData["pid"]);
                var parentData = records[key];
                if (!parentData) {
                    targetData.push(currentData);
                    continue;
                }
                parentData[childrenName] = parentData[childrenName] || [];
                parentData[childrenName].push(currentData);
            }
            return targetData;

            function getKey(key) {
                if (typeof (key) == "string") key = key.replace(/[.]/g, '').toLowerCase();
                return key;
            }
        },
        buildColumns: function (columns) {
            var self = this;
            var arr = [];
            $.each(columns, function (i, obj) {

                var columninfo = {
                    id: obj.bindfield,
                    ctrlid: obj.id,
                    colid: obj.colid,
                    pid: obj.pid,
                    name: obj.bindfield,
                    display: obj.colname,
                    required: obj.required,
                    width: obj.colwidth,
                    readonly: obj.readonly,
                    align: obj.align ? obj.align : "left",
                    hide: obj.hidden == "1" ? true : false
                };

                columninfo.editor = self.bulidColumnsEditor(obj);

                if (obj.sum == "1") {
                    // 汇总列
                    columninfo.totalSummary = { type: 'sum' };

                }
                if (obj.type == "dropdown") {
                    columninfo.render = leeUI.gridRender.DropDownRender;

                }
                else if (obj.format) {

                    if (obj.format.type == "0") {
                        columninfo.render = self.bulidColumnRender(obj.format.custom, obj.bindfield);
                    } else if (obj.format.type == "1") {

                        if (format.islink) {

                        }
                        columninfo.render = new Function("rowdata", "rowindex", "value", "column", "return (" + obj.format.render + ")(rowdata, rowindex, value, column)");

                    }
                }

                arr.push(columninfo);
                ui.formatRules(obj, obj.colname, self.id + "." + obj.bindfield, false);
            });

            arr = this.columnsToTree(arr);
            //editor
            return arr;
        },
        bulidColumnRender: function (format, columnname) {
            var userfunc = new Function("rowdata", "rowindex", "value", "column", "return (" + format.func + ")(rowdata, rowindex, value, column)");

            var func = function (rowdata, rowindex, value, column) {
                if (format.type == "number") {
                    if (!isNaN(value)) {
                        value = value.toFixed(format.decimal);
                    }
                    if (format.isthousand) {
                        value = "千分位 todo实现";
                    }
                } else if (format.type == "date") {


                } else if (format.type == "enum") {
                    var data = format.enum;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]["id"] == value) {
                            var icon = data[i]["icon"];
                            if (icon) {
                                if (icon.indexOf("lee-ion") == -1) {
                                    value = "<i  class='icon-img " + icon + "'></i>";
                                } else {
                                    value = "<i class='" + icon + "'></i>"
                                }
                            } else {
                                value = data[i]["text"];
                            }
                        }
                    }
                }
                else if (format.type == "func") {
                    value = userfunc(rowdata, rowindex, value, column);
                }
                if (format.islink) {
                    value = "<a href='javascript:void(0);' class='" + column.name + "'>" + value + "</a>";
                }
                return value;
            }


            //绑定超链接点击事件
            if (format.islink && format.linkclick) {
                var funclink = new Function("rowdata", "column", "(" + format.linkclick + ")(rowdata,column)");
                $(document).on("click", "." + columnname, function () {
                    var grid = $(this).closest(".lee-ui-grid").leeUI();
                    var cell = $(this).closest(".lee-grid-row-cell");
                    var row = $(this).closest(".lee-grid-row");
                    var rowobj = grid.getRow(row.attr("id").split("|")[2]);
                    var column = grid.getColumn(cell.attr("id").split("|")[3]);
                    funclink.call(this, rowobj, column);
                })
            }


            return func;
        },
        bulidColumnsEditor: function (column) {
            var obj = {};
            var ctrlInstance = ui.CtrlFactory.factory(column.type, column);
            var tablename = "";
            obj = ctrlInstance.getOptions(true);
            var modelObject = model.getDetailObject(this.ctrl.bindtable);
            if (modelObject) {
                tablename = modelObject.tableName;
            }
            obj.type = ctrlInstance.getType();

            obj.onChanged = function (editParm, g) {
                console.log(editParm);
                console.log(g);
                // 触发计算公式

                Page.Calc.trigger(tablename, editParm.column.name, g.id, editParm.rowindex, editParm.record, editParm.column);
            };
            return obj;

        },
        bulidRequestUrl: function (ctrl) {
            var url = _global.sitePath + "/DataModel/getModelPageList";// 默认是模型取数sql
            if (!model.isDataModelSource(ctrl.bindtable))
                url = _global.sitePath + "/DataModel/getDSPageList";// 数据源取数地址
            return url;
        },
        bulidParams: function (ctrl) {
            //var sourceid = model.ID;
            //如果是从模型取数 
            if (model.isDataModelSource(ctrl.bindtable)) {
                return function () {
                    var reobj = [];
                    reobj.push({ name: "modelID", value: model.ID });
                    reobj.push({ name: "objectID", value: ctrl.bindtable });
                    reobj.push({ name: "filter", value: ui.gridController.getFilter(ctrl.bindtable, ctrl.id) });
                    return reobj;
                };
            } else {
                return function () {
                    var reobj = [];
                    reobj.push({ name: "dsID", value: ctrl.bindtable });//数据源ID 
                    reobj.push({ name: "filter", value: ui.gridController.getFilter(ctrl.bindtable, ctrl.id) });
                    return reobj;
                };
            }
            //获取查询参数信息
        },
        setData: function (gridid) {
            // 非分页模式的赋值
            // 取数
            // 赋值
        },
        onSelectRow: function () {
            var id = this.id;
            ui.event.trigger(id, "selectRow", arguments);
            var ctrl = ui.gridController.grids[id].ctrl;

            if (ctrl.isqry) {

                ui.gridController.refreshDS(ctrl.qryds);//刷新列表数据
            }
        },
        onAfterShowData: function () {
            var id = this.id;

            ui.event.trigger(id, "afterShowData", arguments);
        },
        onLookUpReturn: function () {
            //帮助返回值后 处理映射关系？
            //给grid赋值
            //并且更新模型
        },
        onAfterSubmit: function () {
            //编辑后
        },
        onBeforeSubmit: function () {
            //提交前
        }
    };

    // 树控件控制器
    ui.treeController = {
        init: function (ctrl) {
            var id = ctrl.id;
            this.id = ctrl.id;
            var tree = $("#" + id).leeTree(this.bulidOptions(ctrl));
            if (ctrl.filter) {
                this.addSearchBox(id);
            }
            this.cacheFilter(id, ctrl.filterexp);

            if (ctrl.showbar) {
                this.addColapse(id);
            }
            if (ctrl.ismain) {
                //字典模式下单机行要处理 保存刷新要进行处理 缓存控件对象
                this.mainTree = tree;
                this.mainTreeID = ctrl.id;
            }
            if (ctrl.isqry) {
                ui.params.pushTreeZone({
                    id: ctrl.id,
                    dsid: ctrl.qryds,
                    treefield: ctrl.qrytreefield,
                    dsfield: ctrl.qrydsfield,
                    cmptype: ctrl.qrycmptype,
                    exp: ctrl.qryexp
                });
            }
            this.add(id, { ctrl: ctrl, tree: tree });
            this.load(id);//这里需要引入parms 获取界面条件
        },
        cacheFilter: function (id, filter) {
            // 缓存树的默认过滤查询条件
            this.treeFilters = this.treeFilters || {};
            this.treeFilters[id] = filter;
        },
        getCacheFilter: function (id) {
            return this.treeFilters[id];
        },
        getTreeFilterExpress: function (treeid) {

            var list = ui.params.getTreeFilter(treeid);

            return JSON.stringify(list);
        },
        addSearchBox: function (id) {
            var self = this;
            var $searchwrap = $('<div class="lee-search-wrap lee-toolbar-item" style="float:none;margin:5px;"><input style="width:100%;" class="lee-search-words" type="text" id="' + id + '_qry" placeholder="请输入查询关键字"><button class="search lee-ion-search" type="button" style="position: absolute;right: 0;"></button></div>');
            $("#" + id).before($searchwrap);
            var $input = $($searchwrap.find("input"));
            var $btn = $($searchwrap.find("button"));

            $input.keydown(function (event) {
                if (event.keyCode == 13) {
                    self.load(id, $input.val());
                }
                showClose();
            });
            $btn.click(function () {
                //alert(id);
                self.load(id, $input.val());
            })



        },
        addColapse: function (id) {
            if ($("#" + id).closest(".lee-layout-content").length <= 0) return;
            var html = [];
            html.push('<div style="z-index: 200000;bottom: 5px;right: 15px;position:absolute;">');
            html.push('<div class="lee-btn-group" data-toggle="buttons">');
            html.push(' <label class="lee-btn  expand" style="padding: 2px 6px; border-radius: 0; ">');
            html.push('   <i class="lee-ion-plus-round "></i>');
            // html.push('       <input type="radio" name="' + id + '" value="0" autocomplete="off">');
            html.push('  </label>');
            html.push('  <label class="lee-btn colapse" style="padding: 2px 6px; border-radius: 0;">');
            html.push('    <i class="lee-ion-minus-round"></i>');
            // html.push('        <input type="radio" name="' + id + '"value="1" autocomplete="off">');
            html.push('  </label>');
            html.push('  </div>');
            html.push('  </div>');
            var $dom = $(html.join(""));
            $dom.find(".colapse").click(function () {
                $("#" + id).leeUI().collapseAll();
            });
            $dom.find(".expand").click(function () {
                $("#" + id).leeUI().expandAll();
            });
            $("#" + id).closest(".lee-layout-content").append($dom);

        },
        bulidOptions: function (ctrl) {
            var self = this;
            var opt = {
                data: [],
                idFieldName: ctrl.IDField ? ctrl.IDField : "ID",
                textFieldName: ctrl.nameField ? ctrl.nameField : "Name",
                parentIDFieldName: ctrl.parentIDField ? ctrl.parentIDField : "ParentID",
                checkbox: ctrl.checkbox ? true : false,
                onSelect: function () {
                    var id = ctrl.id;
                    if (ctrl.isqry) {
                        ui.gridController.refreshDS(ctrl.qryds);//刷新列表数据
                    }
                    ui.event.trigger(id, "selectRow", arguments);
                },
                onBeforeCancelSelect: function () {
                    return false;
                },
                onCancelselect: function (data, treeitem) {
                    console.log(data.data);
                    console.log(data.target);
                },
                render: function (g, text) {
                    if (g["_istarget"] == "1") {
                        return "<i  style='color: red; font-weight: bold;font-style: normal;'>" + text + "</i>";
                    } else {
                        return text;
                    }
                }
            };
            if (ctrl.async) {
                opt.onBeforeExpand = this.bulidTreeAsyncOptions(ctrl);
            }
            return opt;
        },
        add: function (id, tree) {
            //缓存tree对象信息
            this.trees = this.trees || {};
            this.trees[id] = tree;
        },
        searchData: function () {

        },
        bulidTreeAsyncOptions: function (ctrl) {
            var self = this;
            var bindtable = ctrl.datasource;
            var isDataModel = model.isMainSource(bindtable);
            var treeInfo = model.getTreeInfo(bindtable, !isDataModel);
            var levelfield = treeInfo.level;
            var pathfield = treeInfo.grade;
            var parentidfield = treeInfo.id;


            //var filter = ctrl.filterexp ? ctrl.filterexp : "";
            //var filter = "";
            var onBeforeExpand = function (node) {
                var keyword = $("#" + ctrl.id + "_qry").val();
                var filter = self.getTreeFilterExpress(ctrl.id);//获取树形结构的查询条件

                if (node.data.children && node.data.children.length == 0) {

                    self.getAsyncLoadData(isDataModel ? modelID : bindtable, !isDataModel, node.data[levelfield], node.data[pathfield], node.data[parentidfield], filter, keyword, function (data) {
                        $("#" + ctrl.id).leeUI().append(node.target, data);
                        self.asyncLoop(ctrl.id, treeInfo, data);
                        // 找到第一个节点继续展开
                    });
                }
            }
            return onBeforeExpand;
        },
        asyncLoop: function (id, treeInfo, data) {
            //
            var g = $("#" + id).leeUI();

            var loopend = true;
            for (var i = 0; i < data.length; i++) {
                if (data[i]["_istarget"] == "1") {
                    var val = data[i][g.options.idFieldName];
                    g.selectNode(val);
                    $("li[data-id='" + val + "'] .lee-expandable-close", g.tree).get(0).click();
                    loopend = false;
                    break;
                }
            }
            if (loopend) {
            }

        },
        isAsync: function (id) {
            return this.trees[id].ctrl.async;
        },
        getNoAsynData: function (sourceID, isCustom, filter, keyword, callback) {
            service.getModelTreeDataALL(sourceID, filter, "", keyword, isCustom).done(function (data) {
                if (data.res) {

                    callback(data.data);
                }
                $.leeDialog.hideLoading();
            }).fail(function (data) {
                console.log("失败");
            });
        },
        getAsyncLoadData: function (sourceID, isCustom, level, path, parentid, filter, keyword, callback) {
            $.leeDialog.loading("加载中...");
            service.getTreeAsyncLoadData(sourceID, level, path, parentid, keyword, filter, "", isCustom).done(function (data) {
                if (data.res) {
                    var treeInfo = model.getTreeInfo(sourceID, isCustom);

                    for (var item in data.data) {
                        //处理是否明细字段？
                        data.data[item].isexpand = false;

                        if (data.data[item][treeInfo.isdetail] == "0") {
                            data.data[item].children = [];
                        }


                    }
                    callback(data.data);
                }
                $.leeDialog.hideLoading();
            }).fail(function (data) {
                console.log("失败");
            });

        },
        load: function (id, keyword) {
            //alert(keyword);
            var flag = false;
            var bindtable = this.trees[id].ctrl.datasource;
            var self = this;
            var filter = this.getTreeFilterExpress(id);//获取树形结构的查询条件
            keyword = keyword || "";
            //var filter = "";//this.getFilterExpress(bindtable, id);
            var isDataModel = model.isMainSource(bindtable);

            var treeInfo = model.getTreeInfo(bindtable, !isDataModel);
            if (this.isAsync(id)) {
                var level = "";
                var path = "";
                var parentid = "";
                this.getAsyncLoadData((isDataModel ? modelID : bindtable), !isDataModel, "", "", "", filter, keyword, function (data) {
                    $("#" + id).leeUI()._setData(data);
                    self.asyncLoop(id, treeInfo, data)
                    ui.event.trigger(id, "afterShowData", [data]);
                });
            }
            else {
                // 异步加载数据
                this.getNoAsynData((isDataModel ? modelID : bindtable), !isDataModel, filter, keyword, function (data) {
                    $("#" + id).leeUI()._setData(data);
                    ui.event.trigger(id, "afterShowData", [data]);
                });
            }
            return flag;

        }
    };
    //工具条控制器
    ui.toolbarController = {
        getItem: function (obj) {
            var item = {};
            var func;
            if (obj.Func.indexOf("function") == 0) {
                func = new Function("item", "g", "keyword", "(" + obj.Func + ")(item,keyword)");
            } else {
                if (obj.Func.indexOf("return") == -1 && obj.Func != "" && obj.Action != "") {
                    obj.Func = "return " + obj.Func;
                }
                func = new Function("item", "g", "keyword", obj.Func);
            }
            if (obj.BarType == "0") {
                item.line = true;
            } else if (obj.BarType == "1") {
                item = { text: obj.Text, id: obj.ID, click: func }
            } else if (obj.BarType == "2") {
                item = { type: "dropdown", text: obj.Text, id: obj.ID, click: func }
            } else if (obj.BarType == "3") {
                item = { type: "btn", text: obj.Text, id: obj.ID, click: func, style: obj.BtnStyle }
            } else if (obj.BarType == "4") {
                item = { type: "searchbox", text: obj.Text, id: obj.ID, click: func }
            } else if (obj.BarType == "7") {
                item = { header: true, text: obj.Text };
            } else if (obj.BarType == "5") {
                item = { type: "link", text: obj.Text, id: obj.ID, click: func };
            }
            else if (obj.BarType == "9") {
                item = { type: "text", text: obj.Text, id: obj.ID, click: func };
            }
            item.action = obj.Action;
            item.align = obj.Align;
            item._id = obj.ID;
            item._pid = obj.ParentID;
            this.getIcon(obj, item);
            return item;
        },
        getIcon: function (obj, config) {
            if (obj.Icon.indexOf("lee-ion") != -1) {
                config.iconfont = obj.Icon.replace("lee-ion-", "");
            } else {
                config.icon = obj.Icon.replace("icon-", "");
            }
        },
        arrayToTree: function (data, id, pid) {
            //将ID、ParentID这种数据格式转换为树格式
            var g = this,
                p = this.options;
            var childrenName = "childs";
            if (!data || !data.length) return [];
            var targetData = []; //存储数据的容器(返回) 
            var records = {};
            var itemLength = data.length; //数据集合的个数
            for (var i = 0; i < itemLength; i++) {
                var o = data[i];
                var key = getKey(o[id]);
                records[key] = o;
            }
            for (var i = 0; i < itemLength; i++) {
                var currentData = data[i];
                var key = getKey(currentData[pid]);
                var parentData = records[key];
                if (!parentData) {
                    targetData.push(currentData);
                    continue;
                }
                parentData[childrenName] = parentData[childrenName] || [];
                parentData[childrenName].push(currentData);
            }
            return targetData;

            function getKey(key) {
                if (typeof (key) == "string") key = key.replace(/[.]/g, '').toLowerCase();
                return key;
            }
        },
        getOptions: function (barid, gridid) {
            var self = this;
            var deferred = {};
            function findBarByID(id) {
                var arr = [];
                $.each(toolbarConfig, function (i, obj) {
                    if (obj.BarID == id) {
                        arr.push(self.getItem(obj));
                    }
                });
                return self.arrayToTree(arr, "_id", "_pid");
            }
            var options = {
                items: findBarByID(barid), onbuttonClick: function (res, item) {
                    if (item.action) {
                        //deffered 
                        if (res.then) {
                            res.then(function (data) {
                                if (data) {
                                    ui.stateMachine.action(item.action);
                                }
                            }, function (data) {
                                alert(data);
                            }).always(function () {

                            });
                        } else if (res == true) {
                            ui.stateMachine.action(item.action);
                        }
                    } else {
                        //deffered
                    }
                }
            };

            if (gridid)
                options.gridid = gridid;
            return options;
        },
        init: function (ctrl) {
            this.toolbars = this.toolbars || {};
            var barid = ctrl.barid;
            var options = this.getOptions(barid);
            var bar = $("#" + ctrl.id).leeToolBar(options);
            $("#" + ctrl.id).addClass("lee-toolbar-large lee-toolbar-float");// 增加大尺寸样式
            this.add(barid, ctrl);
        },
        add: function (barid, ctrl) {
            this.toolbars = this.toolbars || {};
            this.toolbars[barid] = { ctrl: ctrl };
        }
    };
    // 状态机处理
    ui.stateMachine = {
        init: function () {
            this.fsm =
                new Page.StateMachine.instance(Page.StateMachine.map["card_fsm"].transitions);
            this.fsm.init();
            this.fsm.setOnTransitionListener($.proxy(this.refreshUI, this));
        },
        action: function (type) {
            this.fsm.action(type);
        },
        refreshUI: function (fsm, mes) {

            var self = this;
            //分为工具条
            var toolbars = ui.toolbarController.toolbars;
            $.each(leeUI.managers, function (key, bar) {
                if (bar.type == "ToolBar") {
                    var items = bar.options.items;
                    $.each(items, function (j, item) {
                        if (item.action && item.id) {
                            var flag = fsm.cannot(item.action, true);
                            //递归
                            if (flag) {
                                bar.setDisabled(item.id);
                            }
                            else {
                                bar.setEnabled(item.id);
                            }
                        }
                        refreshChildren(item, bar);
                    });
                }
            });
            // 处理子按钮
            function refreshChildren(items, bar) {
                if (!items.childs) return;
                $.each(items.childs, function (j, item) {
                    if (item.action && item.id) {
                        var flag = fsm.cannot(item.action, true);

                        //递归
                        if (flag) {
                            bar.setDisabled(item.id);
                        }
                        else {
                            bar.setEnabled(item.id);
                        }
                    }

                    refreshChildren(item, bar);
                });
            }
            // 处理界面其他控件
            if (fsm.cannot("edit")) {
                ui.instance.setPageReadOnly();
            } else {
                ui.instance.setPageNormal();
            }


            //界面
        }
    }

    //按钮控制器
    ui.buttonController = {
        init: function (ctrl) {
            var id = ctrl.id;
            var func = new Function(ctrl.onClick);
            $("#" + ctrl.id).click($.proxy(func, this));
        },
        add: function (id, manager) {

        }
    };

    //构件管理
    ui.compController = {
        init: function (ctrl) {
            var id = ctrl.id;
        },
        add: function (id, manager) {
        }
    };


    //控件编辑器属性
    ui.editorEvents = {
        onLookUpSelect: function () {
            //帮助选择值后
        },
        onLooUpSelected: function () {
            //回弹完成后

        },
        onComoboxSelect: function () {

        },
        onComoboxSelected: function () {

        },
        onFileUpload: function () {

        },
        onFileUploaded: function () {
            //
        }
    }

    //全局事件管理类
    ui.event = {
        register: function (viewid, eventname, func) {
            //注册全局事件
            if (viewid)
                $("#" + viewid).bind(eventname, func);
            else
                $("body").bind(eventname, func);
        },
        trigger: function (viewid, eventname, args) {
            if (viewid)
                $("#" + viewid).trigger(eventname, args);
            else
                $("body").trigger(eventname, args);
        },
        bind: function (eventname, func) {
            $("body").bind(eventname, func);
        }
    }


    //数据加载队列
    ui.queue = {
        addGridQueue: function (resourceid, gridid) {

        },
        addTreeQueue: function (resourceid, treeid) {

        },
        addComboxQueue: function (resourceid, comboxid) {

        },
        clearQueue: function (resourceid) {


        }
    };


    //界面参数处理 。提交给服务器端等
    ui.params = {
        init: function () {
            this.data = this.data || {};

        },
        getCmpType: function (value) {
            this.hashCmpMap = this.hashCmpMap || {
                "0": "=",
                "1": "like",
                "2": "leftlike",
                "3": "rightlike",
                "4": "in",
                "5": ">=",
                "6": "<="
            };
            return this.hashCmpMap[value] || "=";
        },
        getFilterTreeList: function (table, treeid) {

        },
        getTreeFilter: function (treeid) {
            var expressList = new Utils.Express();
            var self = this;
            var treeFilter = ui.treeController.getCacheFilter(treeid);

            if (treeFilter) {
                var filterarr = $.parseJSON(treeFilter);
                for (var item in filterarr) {
                    filterarr[item].ExpressValue = Page.ExpressParser.parser(filterarr[item].ExpressValue);
                }
                expressList.joinCondition(filterarr);
            }
            return expressList.serialize();
        },
        getFilterDataSource: function (table) {
            var expressList = new Utils.Express();
            var self = this;
            if (this.qrycols) {
                $.each(this.qrycols, function (i, col) {
                    if (col.dsid == table) {
                        $.each(col.childs, function (j, ctrl) {
                            if (ctrl.filter) {
                                var value = "", $ele = $("#" + ctrl.id);
                                if ($ele.leeUI()) {
                                    value = $ele.leeUI().getValue();
                                } else {
                                    value = $ele.val();
                                }
                                if (value != "" && ctrl.type == "checkbox" && ctrl.editor_checkbox.ismul) {
                                    var arr = value.split(",");
                                    var resarr = [];
                                    $.each(arr, function (i, val) {
                                        resarr.push("'" + val + "'");
                                    });
                                    value = "(" + resarr.join(",") + ")";
                                }

                                //txt_filterexp
                                if (value != "") {

                                    if (ctrl.filtertype == "4" && ctrl.filterexp) {//表达式分支处理

                                        expressList.push(ctrl.filterfield, self.dealExp({ value: value }, ctrl.filterexp), " in ", " and ", true);

                                    }
                                    else if (ctrl.filtertype == "9") {
                                        var rangvalue = value.split(" - ");
                                        if (rangvalue.length == 2) {
                                            expressList.push(ctrl.filterfield, rangvalue[0], " >= ", " and ");
                                            expressList.push(ctrl.filterfield, rangvalue[1], " <= ", " and ");
                                        }

                                    }
                                    else {
                                        expressList.push(ctrl.filterfield, value, self.getCmpType(ctrl.filtertype || ""), " and ");
                                    }
                                }

                            }
                        });
                    }
                });
            }

            //左树联动条件
            if (this.treelist) {
                $.each(this.treelist, function (i, obj) {
                    if (self.isVisible(obj.id)) {// 互斥可见
                        if (obj.dsid == table) {
                            var tree = $("#" + obj.id).leeUI();
                            if (tree.getSelected()) {
                                var rowdata = tree.getSelected().data;
                                var value = rowdata[obj.treefield];
                                if (obj.cmptype == "4") {
                                    expressList.push(obj.dsfield, self.dealExp(rowdata, obj.exp), " in ", " and ", true);
                                } else {
                                    expressList.push(obj.dsfield, value, self.getCmpType(obj.cmptype || ""), " and ");
                                }
                            }
                        }
                    }
                });
            }
            //左列表联动条件
            if (this.gridlist) {
                $.each(this.gridlist, function (i, obj) {
                    if (self.isVisible(obj.id)) {// 互斥可见
                        if (obj.dsid == table) {
                            var grid = $("#" + obj.id).leeUI();
                            if (grid.getSelected()) {
                                var rowdata = grid.getSelected();
                                var value = rowdata[obj.treefield];
                                if (obj.cmptype == "4") {
                                    expressList.push(obj.dsfield, self.dealExp(rowdata, obj.exp), " in ", " and ", true);
                                } else {
                                    expressList.push(obj.dsfield, value, self.getCmpType(obj.cmptype || ""), " and ");
                                }
                            }
                        }
                    }
                });
            }
            return expressList;
        },
        getFilterList: function (table, gridid, ignoreDefault) {
            var expressList = new Utils.Express();
            var self = this;
            expressList = this.getFilterDataSource(table);
            // 系统查询条件走
            /*if (this.qrycols) {
                $.each(this.qrycols, function (i, col) {
                    if (col.dsid == table) {
                        $.each(col.childs, function (j, ctrl) {
                            if (ctrl.filter) {
                                var value = "", $ele = $("#" + ctrl.id);
                                if ($ele.leeUI()) {
                                    value = $ele.leeUI().getValue();
                                } else {
                                    value = $ele.val();
                                }
                                if (value != "" && ctrl.type == "checkbox" && ctrl.editor_checkbox.ismul) {
                                    var arr = value.split(",");
                                    var resarr = [];
                                    $.each(arr, function (i, val) {
                                        resarr.push("'" + val + "'");
                                    });
                                    value = "(" + resarr.join(",") + ")";
                                }

                                //txt_filterexp
                                if (value != "") {

                                    if (ctrl.filtertype == "4" && ctrl.filterexp) {//表达式分支处理

                                        expressList.push(ctrl.filterfield, self.dealExp({ value: value }, ctrl.filterexp), " in ", " and ", true);

                                    } else {
                                        expressList.push(ctrl.filterfield, value, self.getCmpType(ctrl.filtertype || ""), " and ");
                                    }
                                }

                            }
                        });
                    }
                });
            }

           

            //左树联动条件
            if (this.treelist) {
                $.each(this.treelist, function (i, obj) {
                    if (self.isVisible(obj.id)) {// 互斥可见
                        if (obj.dsid == table) {
                            var tree = $("#" + obj.id).leeUI();
                            if (tree.getSelected()) {
                                var rowdata = tree.getSelected().data;
                                var value = rowdata[obj.treefield];
                                if (obj.cmptype == "4") {
                                    expressList.push(obj.dsfield, self.dealExp(rowdata, obj.exp), " in ", " and ", true);
                                } else {
                                    expressList.push(obj.dsfield, value, self.getCmpType(obj.cmptype || ""), " and ");
                                }
                            }
                        }
                    }
                });
            }
            //左列表联动条件
            if (this.gridlist) {
                $.each(this.gridlist, function (i, obj) {
                    if (self.isVisible(obj.id)) {// 互斥可见
                        if (obj.dsid == table) {
                            var grid = $("#" + obj.id).leeUI();
                            if (grid.getSelected()) {
                                var rowdata = grid.getSelected();
                                var value = rowdata[obj.treefield];
                                if (obj.cmptype == "4") {
                                    expressList.push(obj.dsfield, self.dealExp(rowdata, obj.exp), " in ", " and ", true);
                                } else {
                                    expressList.push(obj.dsfield, value, self.getCmpType(obj.cmptype || ""), " and ");
                                }
                            }
                        }
                    }
                });
            }*/
            /*tips 多个作用触发数据源是否需要互斥 互斥规则 ?谁可见？*/


            //  数据源定义的默认条件 
            var gridFilter = ui.gridController.getCacheFilter(gridid);
            if (gridFilter) {
                var filterarr = $.parseJSON(gridFilter);
                for (var item in filterarr) {
                    filterarr[item].ExpressValue = Page.ExpressParser.parser(filterarr[item].ExpressValue);
                }
                expressList.joinCondition(filterarr);
            }

            //自定义的动态查询条件 界面上过滤条件
            var gridExtFilter = ui.gridController.getGridExtFilter(gridid);
            if (gridExtFilter) {
                var filterarr = $.parseJSON(gridExtFilter);
                for (var item in filterarr) {
                    filterarr[item].ExpressValue = Page.ExpressParser.parser(filterarr[item].ExpressValue);
                }
                expressList.joinCondition(filterarr);
            }
            return expressList.serialize();
        },
        isVisible: function (id) {
            var dom = $("#" + id).closest(".lee-tab-content-item");
            if (dom.length == 0) return true;
            return dom.is(":visible");
        },
        dealExp: function (rowdata, exp) {
            for (var key in rowdata) {
                exp = exp.replace("#" + key + "#", rowdata[key]);
            }
            return exp;
        },
        pushQryZone: function (col) {
            this.qrycols = this.qrycols || [];
            this.qrycols.push(col)
        },
        pushGridZone: function (model) {
            this.gridlist = this.gridlist || [];
            this.gridlist.push(model);
        },
        pushTreeZone: function (model) {
            this.treelist = this.treelist || [];
            this.treelist.push(model);
        },
        initUrlParams: function () {
            //初始化把url上的参数值加入到缓存中区
        },
        serialize: function () {
            this.setValue("filter", this.getCondition());//查询条件动态赋值
            return this.data;
        },
        setValue: function (key, value) {
            this.data[key] = value;
        },
        getValue: function (key) {
            //key为空则获取所有的参数值
            return this.data[key];
        },
        getCondition: function (bindtable, gridid) {
            //获取界面上的元素作为查询条件
            return { "filter": [] }
        }
    }
    return ui;
})(Page.UI, Page.Service, Page.Model, window, $);


/*控件控制器*/
window.Page.UI = (function (ui, service, model, win, $) {

    //label 
    function labelCtrl(id, options) {
        this.options = options;
        this.ele = $("#" + id);
    }
    labelCtrl.prototype = {
        getType: function () {
            return "label";
        },
        getOptions: function () {
            return { type: "label" };
        },
        enableGridMode: function () {
            this.gridMode = true;
        },
        init: function () {
            var self = this;



        }
    };


    //textbox 
    function textBoxCtrl(id, options) {
        this.options = options;
        this.ele = $("#" + id);
    }
    textBoxCtrl.prototype = {
        getType: function () {
            return "text";
        },
        getOptions: function () {
            return { type: "text" };
        },
        enableGridMode: function () {
            this.gridMode = true;
        },
        init: function () {
            var self = this;


            return this.ele.leeTextBox({
                onChange: function () {
                    //刷新绑定？
                    //触发计算公式？
                    //公式需手动触发 要不然陷入赋值黑洞了
                    ui.instance.getCtrl(); //获取界面上值赋值给模型
                    Page.Calc.trigger(model.mainTableName, self.options.bindfield); // 此绑定的事件变化
                },
                placeholder: this.options.placeholder
            });
            //Page.Calc
        }
    };
    //
    //number
    function numberCtrl(id, options) {
        this.options = options;
        this.ele = $("#" + id);
    }
    numberCtrl.prototype = {
        //currency
        //digits
        //precision
        getType: function () {
            return "number";
        },
        getOptions: function () {
            var opts = {};
            var editor = this.options.editor_number;
            opts.currency = editor.thousand;
            opts.precision = editor.decimal;

            if (editor.decimal == "0")
                opts.digits = true;
            else
                opts.number = true;
            return opts;

        },
        enableGridMode: function () {
            this.gridMode = true;
        },
        init: function () {
            var opt = this.getOptions();
            return this.ele.leeTextBox(opt);
        }
    };


    // spinner
    function spinnerCtrl(id, options) {
        this.options = options;
        this.ele = $("#" + id);
    }
    spinnerCtrl.prototype = {
        //currency
        //digits
        //precision
        getType: function () {
            return "spinner";
        },
        getOptions: function () {
            var opts = {};
            var editor = this.options.editor_spinner;

            opts.decimalplace = editor.decimal;

            if (editor.decimal != "0")
                opts.type = "float";

            opts.maxValue = editor.maxvalue ? editor.maxvalue : null;
            opts.minValue = editor.minvalue ? editor.minvalue : null;
            return opts;

        },
        enableGridMode: function () {
            this.gridMode = true;
        },
        init: function () {
            var opt = this.getOptions();
            return this.ele.leeSpinner(opt);
        }
    };

    //textarea
    function textareaCtrl(id, options) {
        this.options = options;
        this.ele = $("#" + id);
    }
    textareaCtrl.prototype = {
        getType: function () {
            return "textarea";
        },
        getOptions: function () {
            return {};
        },
        enableGridMode: function () {
            this.gridMode = true;
        },
        init: function () {

        }
    };

    //下拉框 组件管理器
    function comboxCtrl(id, options) {
        this.id = id;
        this.options = options;
        this.ele = $("#" + id);

    }
    comboxCtrl.prototype = {
        getType: function () {
            return "dropdown";
        },
        getOptions: function (isgrid) {
            var self = this;
            var opts = {};
            var editor = this.options.editor_dropdown;

            if (editor.source == "0") {
                // 这里如果是 数据模型的话是单独取数还是统一取数？
                opts.data = $.parseJSON(editor.jsonstring);
                opts.valueField = "key";
                opts.textField = 'value';
            } else {

                // 如果是字表的话这里可能取不到枚举数据了

                opts.data = [];
                opts.modelID = editor.datasource;
                opts.filter = editor.filter;
                opts.order = editor.order;
                opts.valueField = editor.keyfield;
                opts.textField = editor.valfield;

                if (isgrid) {
                    //同步获取数据

                }

            }

            opts.isbit = editor.isbit;

            opts.isMultiSelect = editor.ismul;

            opts.isLabel = editor.islabel;
            opts.autocomplete = editor.issuggest; //是否智能提示 

            opts.onselected = function (value, text) {
                ui.event.trigger(self.id, "selected", [value, text]);
                //值改变后 触发计算公式 验证？
            }



            return opts;
        },
        enableGridMode: function () {
            this.gridMode = true;

        },
        init: function () {
            var self = this;
            var opt = this.getOptions();
            var ctrl;
            if (opt.isSuggest) {
                // suggest的时候setText没数啊 有可能 这时候是去数据库重新查询？ 还是采用帮助控件？
            } else {
                // 处理事件
                ctrl = this.ele.leeDropDown(opt);
                // 这个时候处理回弹
                if (opt.modelID) {
                    // 从数据模型取数
                    service.getModelData(opt.modelID, opt.filter, opt.order).done(function (data) {
                        if (data.res) {
                            var ctrl = self.ele.leeUI();

                            ctrl.setData(data.data);
                            ctrl.options.data = data.data;

                        }
                    }).fail(function (data) {
                        console.log("失败");
                    });
                }
            }
            return ctrl;
            //如果是数据模型 绑定远程url
        }
    };


    //单选框 组件管理器
    function radioCtrl(id, options) {
        this.id = id;
        this.options = options;
        this.ele = $("#" + id);

    }
    radioCtrl.prototype = {
        getType: function () {
            return "radio";
        },
        getOptions: function () {
            var self = this;
            var opts = {};
            var editor = this.options.editor_radio;

            if (editor.source == "0") {
                // 这里如果是 数据模型的话是单独取数还是统一取数？
                opts.data = $.parseJSON(editor.jsonstring);
                opts.valueField = "key";
                opts.textField = 'value';
            } else {
                opts.data = [];
                opts.modelID = editor.datasource;
                opts.filter = editor.filter;
                opts.order = editor.order;
                opts.valueField = editor.keyfield;
                opts.textField = editor.valfield;

            }


            opts.onSelect = function (value, text) {
                ui.event.trigger(self.id, "selected", [value, text]);
                //值改变后 触发计算公式 验证？
            }
            return opts;
        },
        enableGridMode: function () {
            this.gridMode = true;
        },
        init: function () {
            var self = this;
            var opt = this.getOptions();

            // 处理事件
            var ctrl = this.ele.leeRadioList(opt);
            // 这个时候处理回弹
            if (opt.modelID) {
                // 从数据模型取数
                service.getModelData(opt.modelID, opt.filter, opt.order).done(function (data) {
                    if (data.res) {
                        var ctrl = self.ele.leeUI();

                        ctrl.setData(data.data);
                        ctrl.options.data = data.data;

                    }
                }).fail(function (data) {
                    console.log("失败");
                });
            }
            return ctrl;
            //如果是数据模型 绑定远程url
        }
    };



    //单选框 组件管理器
    function checkboxCtrl(id, options) {
        this.id = id;
        this.options = options;
        this.ele = $("#" + id);

    }
    checkboxCtrl.prototype = {
        getType: function () {
            return "checkbox";
        },
        getOptions: function () {
            var self = this;
            var opts = {};
            var editor = this.options.editor_checkbox;

            if (editor.source == "0") {
                // 这里如果是 数据模型的话是单独取数还是统一取数？
                opts.data = $.parseJSON(editor.jsonstring);
                opts.valueField = "key";
                opts.textField = 'value';
            } else {
                opts.data = [];
                opts.modelID = editor.datasource;
                opts.filter = editor.filter;
                opts.order = editor.order;
                opts.valueField = editor.keyfield;
                opts.textField = editor.valfield;

            }

            opts.ismul = editor.ismul ? true : false;


            opts.onSelect = function (value, text) {
                ui.event.trigger(self.id, "selected", [value, text]);
                //值改变后 触发计算公式 验证？
            }

            if (!opts.ismul) {

                return { notbit: editor.notbit };
            }
            return opts;
        },
        enableGridMode: function () {
            this.gridMode = true;
        },
        init: function () {
            var self = this;
            var opt = this.getOptions();
            var ctrl;

            if (opt.ismul) {
                // 处理事件
                ctrl = this.ele.leeCheckList(opt);
                // 这个时候处理回弹
                if (opt.modelID) {
                    // 从数据模型取数
                    service.getModelData(opt.modelID, opt.filter, opt.order).done(function (data) {
                        if (data.res) {
                            var ctrl = self.ele.leeUI();

                            ctrl.setData(data.data);
                            ctrl.options.data = data.data;

                        }
                    }).fail(function (data) {
                        console.log("失败");
                    });
                }
            } else {

                ctrl = this.ele.leeCheckBox(opt);
            }

            return ctrl;
            //如果是数据模型 绑定远程url
        }
    };


    //日期控件
    function dateCtrl(id, options) {
        this.id = id;
        this.options = options;
        this.ele = $("#" + id);

    }
    dateCtrl.prototype = {
        getType: function () {
            return "date";
        },
        getOptions: function () {
            var self = this;
            var opts = {};
            var editor = this.options.editor_date;
            opts.format = editor.format;
            opts.valueformat = editor.valueformat;
            opts.showTime = editor.showtime;
            opts.showType = editor.showtype;
            opts.range = editor.isrange;
            opts.max = editor.max;
            opts.min = editor.min;

            return opts;
        },
        enableGridMode: function () {
            this.gridMode = true;

        },
        init: function () {
            var self = this;
            var opt = this.getOptions();


            var ctrl = this.ele.leeDate(opt);
            return ctrl;
            //如果是数据模型 绑定远程url
        }
    };


    //帮助
    function lookUpCtrl(id, options) {
        this.options = options;
        this.ele = $("#" + id);
    }
    lookUpCtrl.prototype = {
        getType: function () {
            return "lookup";
        },
        getOptions: function () {
            var opts = {};
            var editor = this.options.editor_lookup;


            opts.helpID = editor.helpdict; //帮助ID
            opts.codeField = editor.codefield;//编号字段
            opts.valueField = opts.textField = editor.bindfield;//值字段 显示字段

            if (editor.textfield) {
                opts.textField = editor.textfield;
            }
            opts.dgHeight = editor.dialogheight ? editor.dialogheight : undefined;

            opts.dgWidth = editor.dialogwidth ? editor.dialogwidth : undefined;
            opts.mapFields = editor.fieldmap;
            opts.title = editor.dialogtitle ? editor.dialogtitle : undefined;//帮助标题
            opts.async = editor.async ? true : false,
            opts.nameSwitch = editor.nameswitch;
            opts.isMul = editor.ismul;
            opts.isMulGrid = editor.ismulgrid;
            opts.isChildOnly = editor.childonly;

            // 注入服务请求
            opts.service = service;

            opts.onClearValue = function (g, p, data, srcID) {

                if (p.gridEditParm) {
                    // 如果是单选模式
                    var vsobj = {};
                    var mapFields = p.mapFields;
                    for (var i = 0; i < mapFields.length; i++) {
                        var FField = mapFields[i]["FField"];
                        vsobj[FField] = "";//这里得处理一下数字or日期
                    }
                    var gridManger = p.host_grid;
                    p.gridEditParm.record = $.extend(p.gridEditParm.record, vsobj);
                    gridManger.updateRow(p.gridEditParm.rowindex, vsobj);


                    gridManger.endEdit();



                } else {

                    var mapFields = p.mapFields;
                    for (var i = 0; i < mapFields.length; i++) {
                        var FField = mapFields[i]["FField"];
                        model.setMainModelObject(FField, "");//这里得处理一下数字or日期
                        ui.instance.bindMainData(FField, "");
                    }
                    // 多选这里是数组？ 如何处理呢？
                    // 多选最好用下拉框多选 帮助这里可能有问题 无法join出来
                }
            }

            opts.getFilter = function (g) {

                if (editor.filter) {
                    var filterarr = $.parseJSON(editor.filter);
                    for (var item in filterarr) {
                        filterarr[item].ExpressValue = Page.ExpressParser.parser(filterarr[item].ExpressValue);
                    }
                    return filterarr;
                }

                return [];
            }

            opts.onConfirmSelect = function (g, p, data, srcID) {
                function getMapObj(mapFields, data) {
                    var vsobj = {};
                    for (var i = 0; i < mapFields.length; i++) {
                        var HField = mapFields[i]["HField"];
                        var FField = mapFields[i]["FField"];
                        vsobj[FField] = data[HField];
                    }
                    return vsobj;
                }
                if (p.gridEditParm) {
                    // 多选模式 返回多条
                    // 多选模式返回逗号合并
                    // 如果是单选模式g
                    //var vsobj = {};
                    var mapFields = p.mapFields;
                    var vsobj = getMapObj(p.mapFields, data[0]);
                    var gridManger = p.host_grid;
                    p.gridEditParm.record = $.extend(p.gridEditParm.record, vsobj);

                    gridManger.updateRow(p.gridEditParm.rowindex, vsobj);


                    if (data.length > 1) {
                        var newDataArray = [];
                        for (var i = 1; i < data.length; i++) {
                            var vsobj = getMapObj(mapFields, data[i]);
                            var gridid = p.host_grid.id;
                            var bindings = ui.gridController.grids[gridid];
                            var bindtable = bindings.ctrl.bindtable;
                            vsobj[srcID] = data[i][p.valueField];//获取当前绑定字段值
                            var dataid = ui.instance.getDataID();//获取当前主键
                            var defaultrow = model.getDefaultGridRow(bindtable, dataid);
                            newDataArray.push($.extend(defaultrow, vsobj));

                            //
                            // grid.addRow(model.getDefaultGridRow(bindtable, this.getDataID()));
                        }
                        gridManger.addRows(newDataArray);
                    }
                    gridManger.endEdit();
                    console.log(p.gridEditParm)
                    var cell =
                        gridManger.getCellObj(p.gridEditParm.record, p.gridEditParm.column);


                    window.setTimeout(function () { gridManger._applyEditor(cell) }, 100);
                } else {
                    // 多选模式返回逗号合并
                    // 获取回弹object
                    // 对界面UI进行更新
                    // 对模型进行赋值
                    // 触发相关change事件 计算公式
                    // 
                    var mapFields = p.mapFields;
                    for (var i = 0; i < mapFields.length; i++) {
                        var HField = mapFields[i]["HField"];
                        var FField = mapFields[i]["FField"];
                        model.setMainModelObject(FField, data[0][HField]);//设置模型的值
                        ui.instance.bindMainData(FField, data[0][HField]);
                    }
                    // 多选这里是数组？ 如何处理呢？
                    // 多选最好用下拉框多选 帮助这里可能有问题 无法join出来
                }
            }
            return opts;
        },
        enableGridMode: function () {
            this.gridMode = true;
        },
        init: function () {
            //this.ele.leeTextBox(options);
            var self = this;
            var ctrl = this.ele.leeLookup(this.getOptions());

            if (this.options.readonly)
                ctrl._setDisabled(true);
            return ctrl;
            //帮助选择后事件
            //--遍历回弹字段 找到映射值 赋值 触发计算公式
            //==
            //帮助清空时间
        },
        onSelect: function () {
            //帮助值选择后事件
        }

    };

    //帮助
    function uploadCtrl(id, options) {
        this.options = options;
        this.ele = $("#" + id);
    }
    uploadCtrl.prototype = {
        getType: function () {
            return "file";
        },
        getOptions: function () {
            var opts = {};
            var editor = this.options.editor_file;
            opts.isCard = editor.iscard;//
            opts.ext = editor.ext;//扩展名
            opts.isPreview = editor.ispreview;
            opts.buttonText = editor.buttontext;
            opts.typecode = editor.typecode;
            opts.url = _global.sitePath + "/File/upload";
            return opts;
        },
        init: function () {
            //this.ele.leeTextBox(options);
            var self = this;
            this.ele.leeUpload(this.getOptions());
            // 加载数据
            //this.load();
        },
        load: function () {

        }
    };

    // AOP 统一格式化
    ui.ControlsManager = {
        format: function (params) {
            if (params.format && params.format.custom.islink) {
                var id = "#label_" + params.id;
                // 替换超链接
                var innerHtml = $(id).html();
                var newAchor = $("<a href='javascirpt:void(0)' >" + innerHtml + "</a>");
                $(id).empty().append(newAchor);

                var funclink = new Function("rowdata", "column", "(" + params.format.custom.linkclick + ")(rowdata,column)");
                newAchor.on("click", funclink);


                if (params.format.custom.linkhover) {
                    // 鼠标绑定事件
                    // 

                    var hoverclink = new Function(params.format.custom.linkhover);
                    newAchor.LeeToolTip({ title: " 加载中..." });
                    newAchor.on("shown.bs.tooltip", function () {
                        // alert(1);

                        if (newAchor.data("tip-load") == true) {
                            //缓存加载 不用每次都加载....
                            return;
                        }
                        //alert(1);
                        var res = hoverclink();

                        if (res && res.then) {
                            res.then(function (data) {
                                if (data.data) {
                                    newAchor.leeUI().options.title = data.data;
                                    newAchor.leeUI().setNewTitle(data.data);
                                    newAchor.data("tip-load", true);
                                }
                            }, function (data) {
                                alert(data);
                            }).always(function () {

                            });
                        } else {
                            newAchor.leeUI().options.title = res;
                            newAchor.leeUI().setNewTitle(res);
                            newAchor.data("tip-load", true);
                        }

                    });
                }
            }
        }
    };

    /*界面控件工厂*/
    ui.CtrlFactory = (function () {
        var cache = {};
        var cachefunc = {};
        return {
            factory: function (key, params, isinit) {
                return this.register(key, cachefunc[key], params, isinit);
                //cache[key] || 
                //return cache[key];
            },
            add: function (key, func) {
                cachefunc[key] = func;
            },
            register: function (key, instance, params, isinit) {
                //alert("用的时候在加载");
                var ctrlBulider = new instance(params.id, params);
                if (isinit) {
                    ctrlBulider.init(); //绑定事件

                    //如果是 checklist or radio 需要处理必填事件
                    ui.formatRules(params, params.label, null, true);
                    ui.ControlsManager.format(params);
                    if (key == "raido") {
                        var $ele = $("#" + params.id).leeUI();
                        var key = $("input:radio:first", $ele.radioList).attr("id");
                        if (params.required) {
                            ui.addExternalRules(key, "checked");
                        }
                        ui.instance.controlLabel["#" + key] = params.label;
                    }
                    if (key == "checkbox") {
                        var $ele = $("#" + params.id).leeUI();
                        var key = $("input:checkbox:first", $ele.checkList).attr("id");
                        if (params.required) {
                            ui.addExternalRules(key, "checked");
                            //
                        }

                        ui.instance.controlLabel["#" + key] = params.label;

                    }
                    ui.setRequired(params);
                }
                return ctrlBulider;
            }
        }
    })();



    //注册控件工厂
    ui.CtrlFactory.add("input", textBoxCtrl);
    ui.CtrlFactory.add("textarea", textareaCtrl);
    ui.CtrlFactory.add("date", dateCtrl);
    ui.CtrlFactory.add("number", numberCtrl);
    ui.CtrlFactory.add("dropdown", comboxCtrl);
    ui.CtrlFactory.add("lookup", lookUpCtrl);
    ui.CtrlFactory.add("file", uploadCtrl);
    ui.CtrlFactory.add("radio", radioCtrl);
    ui.CtrlFactory.add("checkbox", checkboxCtrl);
    ui.CtrlFactory.add("spinner", spinnerCtrl);

    ui.CtrlFactory.add("label", labelCtrl);

    /*界面校验处理*/
    ui.rules = {};
    ui.formatRules = function (params, label, key, norequired) {
        var rules = params.rules;
        if (rules && rules.length) {
            var ruleStr = [];
            $.each(rules, function (i, obj) {
                var type = obj.id.toLowerCase();
                if (type == "minlength") {
                    ruleStr.push("length(" + obj.params + "~)");
                } else if (type == "maxlength") {
                    ruleStr.push("length(~" + obj.params + ")");
                } else if (type == "required") {
                    ruleStr.push("required");
                } else if (type == "chinese") {
                    ruleStr.push("chinese");
                } else if (type == "telphone") {
                    ruleStr.push("telphone");
                } else if (type == "email") {
                    ruleStr.push("email");
                } else if (type == "website") {
                    ruleStr.push("website");
                } else if (type == "required" && !norequired) {
                    ruleStr.push("required");
                } else if (type == "startwith" || type == "endwidth") {
                    ruleStr.push(obj.id + "(" + obj.params + ")");
                } else if (type == "checkexits") {
                    ruleStr.push(obj.id + "(" + obj.params + "," + obj.tips + ")");
                }
                else {
                    ruleStr.push(obj.id + "(" + obj.tips + "," + obj.params + ")");
                }
            });
            if (key)
                ui.rules[key] = { rule: ruleStr.join(";"), title: label };
            else
                ui.rules["#" + params.id] = { rule: ruleStr.join(";"), title: label };

        }
    }

    ui.addExternalRules = function (key, rule) {
        ui.rules["#" + key] = { rule: rule, title: "" };
    }
    return ui;
})(Page.UI, Page.Service, Page.Model, window, $);