
fBulider.page.VisioController = function (options) {
    fBulider.page.VisioController.base.constructor.call(this, options); //父构造函数
}

fBulider.page.VisioController.leeExtend(fBulider.page.ListViewController, {
    getView: function () {
        var htmlarr = [];
        htmlarr.push('<li class="card mcard" data-id={ID}  style="animation-delay: 150ms;">');
        htmlarr.push('  <div class="box">');
        htmlarr.push('  <span class="tag model">矢量图</span>');
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
        return _global.sitePath + "/Visio/getPageList";
    },
    getParam: function () {
        var res = [];
        res.push({ name: "keyword", value: $(".lee-search-words").val() });
        return res;
    },
    getGridRow: function (cell) {
        var grid = $(cell).closest(".lee-ui-grid").leeUI();
        var row = $(cell).closest(".lee-grid-row");
        var rowobj = grid.getRow(row.attr("id").split("|")[2]);
        return rowobj;
    },
    bind: function () {
        var p = this;
 

        $("body").on("click", "#grid .griddelete", function (e) {
            var rowobj = p.getGridRow(this);

            var id = rowobj.ID;
            $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
                if (type) {
                    fBulider.core.dataService.requestApi("/Visio/deleteData", { ID: id }, "正在删除....").done(function (data) {
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
            var rowobj = p.getGridRow(this);


            var id = rowobj.ID;

            CardManger.showPage(id);

        });
        $("body").on("click", "#grid .griddesign", function (e) {
            var rowobj = p.getGridRow(this);
            var id = rowobj.ID;
            fBulider.core.window.open("", "修改数据对象", _global.sitePath + "/Visio/Edit?dataid=" + id);
        });
        
        $("input[name='viewtype']").change(function () {
            p.viewtype = $("input[name='viewtype']:checked").val();
            p.toggleTab();
        });
     


        //绑定删除事件
        $("body").on("click", "#listview .btndel", function (e) {
            var li = $(this).closest("li");
            var id = li.attr("data-id");
            li = null;
            $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
                if (type) {
                    fBulider.core.dataService.requestApi("/Visio/DeleteData", { ID: id }, "正在删除....").done(function (data) {
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
            fBulider.core.window.open("", "修改数据对象", _global.sitePath + "/Visio/Edit?dataid=" + li.attr("data-id"));
            li = null;
        });


        $('#txtkeyword').bind('keypress', function (event) {
            if (event.keyCode == "13") p.refresh();
        });

    },
    initExtendView: function () {
        this.toggleTab();
        var self = this;
        $("#btngroup").leeToolBar({
            items: [
                {
                    id: "add", iconfont: "android-add", type: "btn", text: "添加矢量图", click: function () {
                        CardManger.showPage("");
                    }
                },
                {
                    id: "search", type: "searchbox", align: "right", click: function () {
                        self.refresh();
                    }
                }
            ]
        });
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
                    return "<button class='lee-btn lee-btn-primary lee-btn-xs gridmodify'>修改</button>  <button class='lee-btn  lee-btn-xs griddesign'>设计</button> <button class='lee-btn lee-btn-danger  lee-btn-xs griddelete'>删除</button> ";
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

var ListMgr;
$(function () {
    ListMgr = new fBulider.page.VisioController();
});



(function (window, $) {
    function CardManger() {
        this.init();
    }
    CardManger.prototype = {
        init: function () {
            this.status = "";//初始状态为空
            this.dataModel = {};//数据模型为空
        },
        bind: function () {
        },
        showPage: function (id) {
            this.CurentKey = id;
            if (id == "") {
                this.status = "add";
            } else {
                this.status = "edit";
            }
            this.openDialog();
            this.getModel();
        },
        openDialog: function () {
            var self = this;
            this.dialog = $.leeDialog.open({
                title: "详情",
                width: "600",
                height: '300',
                target: $("#FormEdit"),
                targetBody: true,
                isResize: true,
                buttons: [{
                    text: '保存',
                    cls: 'lee-btn-primary lee-dialog-btn-ok',
                    onclick: function (item, dialog) {
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
        },
        initLayout: function () {
            $("#txtGraphType").leeDropDown({
                data: [
                    { id: "1", text: "公用" },
                    { id: "2", text: "私有" }
                ]
            });


        },
        save: function () {
            if (!$("#form").isValid())
                return;
            $.leeDialog.loading("正在保存....");
            this.getValue();
            var self = this;
            $.post(_global.sitePath + "/Visio/SaveData", { id: this.CurentKey, model: JSON.stringify(this.dataModel) }, function (res) {
                if (res.res) {
                    if (res.id) {
                        self.status = "edit";//初始状态为空
                        self.CurentKey = res.id;
                    }
                    $.leeUI.Success(res.mes);
                } else {
                    $.leeUI.Error(res.mes);
                }
                $.leeDialog.hideLoading();
                self.dialog.close();
                ListMgr.refresh();


            });
        },
        getModel: function () {
            var self = this;
            $.leeDialog.loading("加载中....");
            $.post(_global.sitePath + "/Visio/GetModel", { id: this.CurentKey }, function (res) {
                if (res.res) {
                    self.dataModel = res.data;
                    self.setValue();
                } else {

                }
                $.leeDialog.hideLoading();
            });
        },
        setValue: function () {
            this.arr = $("[data-bind]");


            for (var i = 0; i < this.arr.length; i++) {
                var item = this.arr[i];
                var BindKey = $(item).attr("data-bind");
                var BindValue = "";
                if ($(item).leeUI()) {
                    $(item).leeUI().setValue(this.dataModel[BindKey]);
                } else {
                    var type = $(item).attr("type");
                    if (type == "text" || type == "password") {
                        $(item).val(this.dataModel[BindKey]);
                    }
                    else if (type == "checkbox") {
                        $(item).prop("checked", this.dataModel[BindKey] == "1");
                    }
                }
            }
            //if (this.status == "edit") {
            $("#form").validator("cleanUp");//清除表单验证的全部消息
            //}
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
                    if (type == "text" || type == "password") {
                        BindValue = $(item).val();
                    }
                    else if (type == "checkbox") {
                        BindValue = $(item).prop("checked") ? "1" : "0";
                    }
                }
                this.dataModel[BindKey] = BindValue;
            }
        }
    }
    window.CardManger = new CardManger();

})(window, $);