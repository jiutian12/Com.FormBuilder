/*智能帮助控制器*/
fBulider.page.SmartHelpController = function (options) {
    fBulider.page.SmartHelpController.base.constructor.call(this, options); //父构造函数
}

fBulider.page.SmartHelpController.leeExtend(fBulider.page.ListViewController, {
    getView: function () {
        var htmlarr = [];
        htmlarr.push('<li class="card mcard" data-id={ID}  style="animation-delay: 150ms;">');
        htmlarr.push('  <div class="box">');
        htmlarr.push('  <span class="tag help">智能帮助</span>');
        htmlarr.push('  <span class="label"><a href="#">{CreateUser}</a></span>');
        htmlarr.push('  <div class="cover-info" style="margin-top:25px;"><h4>{Name}</h4><small>{Code}</small></br><span style="display:block;margin-top:10px;">{LastModifyTime}</span></div>');
        htmlarr.push('  <div><div class="date"><small  ></small></div><div class="bar"><a href="#" class="button btnedit"><i class="lee-ion-edit"></i><span>修改</span></a><a href="#" class="button btndel"><i class="lee-ion-android-delete"></i><span>删除</span></a></div></div>');

        htmlarr.push('</div></li>');
        return htmlarr.join("");
    },
    getListDom: function () {
        return $("#listview");
    },
    getApiURL: function () {
        return _global.sitePath + "/SmartHelp/GetPageList";
    },
    getParam: function () {
        var res = [];
        res.push({ name: "keyword", value: $("#txtkeyword").val() });
        return res;
    },
    bind: function () {
        var p = this;
        //绑定搜索事件
        $("#btnSearch").click(function () {
            p.refresh();
        });
        $("input[name='viewtype']").change(function () {
            p.viewtype = $("input[name='viewtype']:checked").val();
            p.toggleTab();
        });

        $("body").on("click", "#grid .griddelete", function (e) {
            var grid = $(this).closest(".lee-ui-grid").leeUI();
            var row = $(this).closest(".lee-grid-row");
            var rowobj = grid.getRow(row.attr("id").split("|")[2]);

            var id = rowobj.ID;
            $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
                if (type) {
                    fBulider.core.dataService.requestApi("/SmartHelp/deleteData", { helpID: id }, "正在删除....").done(function (data) {
                        if (data.res) {
                            leeUI.Success(data.mes);
                            p.refresh();
                        }
                    }).fail(function (data) {
                        console.log(data);
                    });
                }
            });

        });
        $("body").on("click", "#grid .gridmodify", function (e) {
            var grid = $(this).closest(".lee-ui-grid").leeUI();

            var row = $(this).closest(".lee-grid-row");
            var rowobj = grid.getRow(row.attr("id").split("|")[2]);

            var id = rowobj.ID;
            fBulider.core.window.open("", "修改模型", _global.sitePath + "/SmartHelp/Edit?dataid=" + id);

        })
        //绑定按钮栏事件
        $("#btnaddChild").click($.proxy(this.createDialog, this));
        //绑定选中事件
        //$("body").on("click", "#object_list_view .box", function (e) {
        //    $(".box.active").removeClass("active");
        //    $(this).addClass("active");
        //});


        //绑定删除事件
        $("body").on("click", "#listview .btndel", function (e) {
            var li = $(this).closest("li");
            var id = li.attr("data-id");
            li = null;
            $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
                if (type) {
                    fBulider.core.dataService.requestApi("/SmartHelp/deleteData", { helpID: id }, "正在删除....").done(function (data) {
                        if (data.res) {
                            leeUI.Success(data.mes);
                            p.refresh();
                        }
                    }).fail(function (data) {
                        console.log(data);
                    });
                }
            });
        });
        //绑定修改事件
        $("body").on("click", "#listview .btnedit", function (e) {
            var li = $(this).closest("li");
            fBulider.core.window.open("", "修改帮助", _global.sitePath + "/SmartHelp/Edit?dataid=" + li.attr("data-id"));
            li = null;
        });


        $('#txtkeyword').bind('keypress', function (event) {
            if (event.keyCode == "13") p.refresh();
        });

        $('#txtkeywordList').bind('keypress', function (event) {
            if (event.keyCode == "13") $("#gridinfo").leeUI().loadData(true);
        });

        $("#btnSearchList").unbind("click").bind("click", function () {
            $("#gridinfo").leeUI().loadData(true);
        });
    },
    initExtendView: function () {
        this.toggleTab();
    },
    createDialog: function () {
        var self = this;
        this.dialog = $.leeDialog.open({
            title: "创建帮助-选择数据模型",
            width: "800",
            height: '400',
            showMax: false,
            target: $("#dialog_create"),
            targetBody: true,
            isResize: true,
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    self.confirmAdd(dialog);
                }
            }, {
                text: '取消',
                cls: 'lee-dialog-btn-cancel ',
                onclick: function (item, dialog) {
                    dialog.close();
                }
            }]
        });

        $("#gridinfo").leeGrid({
            columns: this.bulidDOColumns(),
            fixedCellHeight: true,
            alternatingRow: false,
            url: _global.sitePath + "/DataModel/GetDataModelList",
            parms: $.proxy(this.getParamCreate, this),
            dataAction: 'server', //服务器排序
            usePager: true,       //服务器分页
            height: "304",
            checkbox: false,
            rownumbers: true,
            rowHeight: 30
        });
        //$("#object_list_view").leeUI().reload();
    },
    bulidDOColumns: function () {
        return [
            { display: '标识', name: 'ID', align: 'left', width: 260, minWidth: 60 },
            { display: '编号', name: 'Code', align: 'left', width: 160 },
            { display: '名称', name: 'Name', align: 'left', width: 140 }
        ];

    },
    getParamCreate: function () {
        var res = [];
        res.push({ name: "keyword", value: $("#txtkeywordList").val() });
        return res;
    },
    confirmAdd: function (dialog) {

        var Name = $("#txtName").val();
        var Code = $("#txtCode").val();
        if (Code == "") {
            leeUI.Error("请输入帮助编号！");
            return;
        }
        if (Name == "") {
            leeUI.Error("请输入帮助名称！");
            return;
        }

        var selected = $("#gridinfo").leeUI().getSelected();
        if (selected) {

            var ModelID = selected["ID"];


            var model = {
                ID: "",
                Code: Code,
                Name: Name,
                ModelID: ModelID,
                ViewType: "1"
            };
            fBulider.core.dataService.requestApi("/SmartHelp/addData", { model: JSON.stringify(model) }, "正在添加....").done(function (data) {
                if (data.res) {
                    dialog.close();
                    leeUI.Success(data.mes);
                    $("#listview").leeUI().loadData(0);
                }
            }).fail(function (data) {
                console.log(data);
            });
        }
        else {
            leeUI.Error("请选择帮助依赖的数据模型！");
        }
    },
    initGird: function () {
        if (!this.gridstatus) {
            this.grid = $("#grid").leeGrid({
                columns: this.getColumns(),
                fixedCellHeight: true,
                alternatingRow: false,
                url: this.getApiURL(),
                parms: this.getParam,
                dataAction: 'server', //服务器排序
                usePager: true,       //服务器分页
                height: "100%",
                checkbox: true,
                rownumbers: true,
                rowHeight: 30
            });
            this.gridstatus = true;
        }
        this.grid._onResize();
        //this.grid.reloadData(true);
    },
    getColumns: function () {
        return [
            { display: '标识', name: 'ID', align: 'left', width: 220, minWidth: 60 },
            { display: '编号', name: 'Code', align: 'left', width: 160 },
            { display: '名称', name: 'Name', align: 'left', width: 140 },
            { display: '创建人', name: 'CreateUser', align: 'center', width: 140 },
            { display: '最后修改时间', name: 'LastModifyTime', align: 'center', minWidth: 120, width: 160 },
            {
                display: '操作', align: 'center', width: 160, render: function (g) {
                    return "<button class='lee-btn lee-btn-primary lee-btn-xs gridmodify'>修改</button> <button class='lee-btn lee-btn-danger  lee-btn-xs griddelete'>删除</button>";
                }
            }
        ];
    },
    toggleTab: function () {
        if (this.viewtype == "0") {
            $("#listview").show();
            $("#grid").hide();
        } else {
            $("#listview").hide();
            $("#grid").show();
            this.initGird();
        }
    },
    refresh: function () {
        this.listview.leeUI().reload();//刷新listView
        this.grid.loadData(true);
    }

});

$(function () {
    var mgr = new fBulider.page.SmartHelpController();
});