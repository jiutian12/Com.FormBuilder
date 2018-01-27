/*智能帮助控制器*/
fBulider.page.DataSourceController = function (options) {
    fBulider.page.DataSourceController.base.constructor.call(this, options); //父构造函数
}

fBulider.page.DataSourceController.leeExtend(fBulider.page.ListViewController, {
    getView: function () {
        var htmlarr = [];
        htmlarr.push('<li class="card mcard" data-id={ID}  style="animation-delay: 150ms;">');
        htmlarr.push('  <div class="box">');
        htmlarr.push('  <span class="tag help">构件</span>');
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
        return _global.sitePath + "/CMP/GetPageList";
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
        })
        ;
        //绑定按钮栏事件
        $("#btnaddChild").click($.proxy(this.createDialog, this));
        //绑定选中事件
        $("body").on("click", "#object_list_view .box", function (e) {
            $(".box.active").removeClass("active");
            $(this).addClass("active");
        });
        //绑定删除事件
        $("body").on("click", "#listview .btndel", function (e) {
            var li = $(this).closest("li");
            var id = li.attr("data-id");
            li = null;
            $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
                if (type) {
                    fBulider.core.dataService.requestApi("/CMP/deleteData", { dataid: id }, "正在删除....").done(function (data) {
                        if (data.res) {
                            leeUI.Success(data.mes);
                            $("#listview").leeUI().loadData(0);
                        }
                    }).fail(function (data) {
                        console.log(data);
                    });
                }
            });
        });

        $("body").on("click", "#grid .griddelete", function (e) {
            var grid = $(this).closest(".lee-ui-grid").leeUI();
            var row = $(this).closest(".lee-grid-row");
            var rowobj = grid.getRow(row.attr("id").split("|")[2]);

            var id = rowobj.ID;
            $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
                if (type) {
                    fBulider.core.dataService.requestApi("/CMP/deleteData", { dataid: id }, "正在删除....").done(function (data) {
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
            fBulider.core.window.open("", "修改构件", _global.sitePath + "/CMP/Edit?dataid=" + id);

        })
        //绑定修改事件
        $("body").on("click", "#listview .btnedit", function (e) {
            var li = $(this).closest("li");
            fBulider.core.window.open("", "修改构件", _global.sitePath + "/CMP/Edit?dataid=" + li.attr("data-id"));
            li = null;
        });


        $('#txtkeyword').bind('keypress', function (event) {
            if (event.keyCode == "13") p.refresh();
        });

    },
    initExtendView: function () {
        this.toggleTab();

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
                //checkbox: true,
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

            {
                display: '操作', align: 'center', width: 140, render: function (g) {
                    return "<button class='lee-btn lee-btn-primary lee-btn-xs gridmodify'>修改</button> <button class='lee-btn lee-btn-danger  lee-btn-xs griddelete'>删除</button>";
                }
            },
            { display: '标识', name: 'ID', align: 'left', width: 220, minWidth: 60 },
            { display: '编号', name: 'Code', align: 'left', width: 160 },
            { display: '名称', name: 'Name', align: 'left', width: 140 },
            { display: '程序集', name: 'AssemblyName', align: 'left', width: 140 },
            { display: '创建人', name: 'CreateUser', align: 'center', width: 140 },
            { display: '最后修改时间', name: 'LastModifyTime', align: 'center', minWidth: 120, width: 160 }
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
    },
    createDialog: function () {
        var self = this;
        this.dialog = $.leeDialog.open({
            title: "新建构件",
            width: "600",
            height: '105',
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
    },
    confirmAdd: function (dialog) {

        var Name = $("#txtName").val();
        var Code = $("#txtCode").val();
        var AssemblyName = $("#txtAssemblyName").val();
        var ClassName = $("#txtClassName").val();
        if (Code == "") {
            leeUI.Error("请输入元数据编号");
            return;
        }
        if (Name == "") {
            leeUI.Error("请输入元数据名称");
            return;
        }
        if (AssemblyName == "") {
            leeUI.Error("请输入程序集名称");
            return;
        }
        if (ClassName == "") {
            leeUI.Error("请输入类名称");
            return;
        }
        var model = {
            ID: "",
            Code: Code,
            Name: Name,
            AssemblyName: AssemblyName,
            ClassName: ClassName,
            IsStatic: "1"
        };
        fBulider.core.dataService.requestApi("/CMP/addData", { model: JSON.stringify(model) }, "正在添加....").done(function (data) {
            if (data.res) {
                dialog.close();
                leeUI.Success(data.mes);
                $("#listview").leeUI().loadData(0);
            }
        }).fail(function (data) {
            console.log(data);
        });
    }

});

$(function () {
    var mgr = new fBulider.page.DataSourceController();
});