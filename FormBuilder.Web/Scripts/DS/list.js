/*智能帮助控制器*/
fBulider.page.DataSourceController = function (options) {
    fBulider.page.DataSourceController.base.constructor.call(this, options); //父构造函数
}

fBulider.page.DataSourceController.leeExtend(fBulider.page.ListViewController, {
    getView: function () {
        var htmlarr = [];
        htmlarr.push('<li class="card mcard" data-id={ID}  style="animation-delay: 150ms;">');
        htmlarr.push('  <div class="box">');
        htmlarr.push('  <span class="tag help">数据源</span>');
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
        return _global.sitePath + "/DataSource/GetPageList";
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
                    fBulider.core.dataService.requestApi("/DataSource/deleteData", { dataid: id }, "正在删除....").done(function (data) {
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
        //绑定修改事件
        $("body").on("click", "#listview .btnedit", function (e) {
            var li = $(this).closest("li");
            fBulider.core.window.open("", "修改模型", _global.sitePath + "/DataSource/Edit?dataid=" + li.attr("data-id"));
            li = null;
        });


        $('#txtkeyword').bind('keypress', function (event) {
            if (event.keyCode == "13") p.refresh();
        });

    },
    initExtendView: function () {
        //加载数据对象列表

    },
    createDialog: function () {
        var self = this;
        this.dialog = $.leeDialog.open({
            title: "新建数据源",
            width: "600",
            height: '65',
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

        var model = {
            ID: "",
            Code: Code,
            Name: Name
        };
        fBulider.core.dataService.requestApi("/DataSource/addData", { model: JSON.stringify(model) }, "正在添加....").done(function (data) {
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