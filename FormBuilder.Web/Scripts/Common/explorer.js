var MeataExplorer = function () {
};


MeataExplorer.prototype = {
    init: function () {
        this.viewtype = "list";
        this.breadData = [];
        this.isUser = false;
        this.parentID = this.lastParentID = "";
        this.listview = $("#fileWrap");
        this.bind();
        this.contextMenu = $("#contextMenu");
        this.chooseData = [];

        this.refreshNav();
    },
    initList: function () {
        var self = this;
        this.listview.leeListView({
            pager: false,
            render: $.proxy(this.getView, this),
            url: this.getApiURL(),
            method: "post",
            getParam: $.proxy(this.getParam, this),
            onAfterShowData: function () {
                self.lastParentID = self.parentID;
                self.chooseData = [];
                self.bulidNav();
            }
        });
    },
    addFolder: function () {
        var self = this;
        this.dialog = $.leeDialog.open({
            title: "新建文件夹",
            width: "400",
            height: '70',
            target: $("#dialog_addFolder"),
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
    reNameFolder: function () {
        var self = this;
        if (this.chooseData.length != 1) return;
        var id = this.chooseData[0].fielid;
        this.dialog = $.leeDialog.open({
            title: "重命名",
            width: "400",
            height: '70',
            target: $("#dialog_addFolder"),
            targetBody: true,
            isResize: true,
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    self.confirmModify(dialog, id);
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

    viewDepend: function () {
        var self = this;
        if (this.chooseData.length != 1) return;
        var id = this.chooseData[0].fielid;


        $.leeDialog.open({
            title: "查看依赖引用",
            name: 'viewdependwindow',
            isHidden: false,
            showMax: true,
            width: 750,
            slide: false,
            height: 400,
            url: "Dependence?dataid=" + id,
            onLoaded: function () {
            }

        });
    },
    deleteFolder: function () {
        var self = this;
        if (this.chooseData.length != 1) return;
        var id = this.chooseData[0].fielid;
        var metatype = this.chooseData[0].type;

        $.leeDialog.confirm("确认要删除吗？", "提示", function (type) {
            if (type) {
                self.confirmDelete(id, metatype);
            }
        });
    },
    modifyMeta: function () {
        if (this.chooseData.length != 1) return;
        var id = this.chooseData[0].fielid;
        var metatype = this.chooseData[0].type;

        this.preview(metatype, id);
    },
    confirmModify: function (dialog, id) {
        var self = this;
        fBulider.core.dataService.requestApi("/CommonFB/renameFolder", {
            name: $("#txtFolderName").val(),
            id: id
        }, "正在添加....").done(function (data) {
            if (data.res) {
                dialog.close();
                leeUI.Success(data.mes);
                self.reload();
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    confirmAdd: function (dialog) {
        var self = this;

        fBulider.core.dataService.requestApi("/CommonFB/addFolder", {
            name: $("#txtFolderName").val(),
            parentID: self.parentID
        }, "正在添加....").done(function (data) {
            if (data.res) {
                dialog.close();
                leeUI.Success(data.mes);
                self.reload();
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    openAddMeta: function (type) {
        this.addType = type;
        var opts = {
            title: "新建元数据",
            width: "800",
            height: '400',
            showMax: false,
            target: $("#dialog_addFrm"),
            targetBody: true,
            isResize: true,
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    var model = {};
                    model.Code = $("#txtCode").val();
                    model.Name = $("#txtName").val();
                    model.ParentID = self.parentID;
                    if ($("#gridinfo").leeUI()) {
                        var selected = $("#gridinfo").leeUI().getSelected();
                        if (selected) {
                            model.ModelID = selected["ID"];
                        } else {
                            if (type == "2" || type == "3") {
                                leeUI.Error("请选中参照的数据模型！");
                                model.FormType = "1";//默认是字典吧
                                return;
                            }
                            if (type == "1") {
                                leeUI.Error("请选中参照的数据对象！");
                                return;
                            }
                        }
                    }
                    self.confirmAddMeta(dialog, model, type);
                }
            }, {
                text: '取消',
                cls: 'lee-dialog-btn-cancel ',
                onclick: function (item, dialog) {
                    dialog.close();
                }
            }]
        };
        var self = this;
        if (type == "0" || type == "5" || type == "6") {
            opts.height = "60";
            opts.width = "600";
            $("#DOGRID").hide();
        } else {
            $("#DOGRID").show();
        }
        $.leeDialog.open(opts);

        if (type == "1" || type == "2" || type == "3") {
            $("#gridinfo").leeGrid({
                columns: this.bulidDOColumns(type),
                fixedCellHeight: true,
                alternatingRow: false,
                url: this.bulidUrl(type),
                parms: $.proxy(this.getParamCreate, this),
                dataAction: 'server', //服务器排序
                usePager: true,       //服务器分页
                height: "306",
                checkbox: false,
                rownumbers: true,
                rowHeight: 30
            });
        }

        $("#btnSearchList").unbind("click").bind("click", function () {
            $("#gridinfo").leeUI().loadData(true);
        });
    },
    bulidDOColumns: function (type) {
        if (type == "1")
            return [
                { display: '标识', name: 'ID', align: 'left', width: 260, minWidth: 60 },
                { display: '编号', name: 'Code', align: 'left', width: 160 },
                { display: '名称', name: 'AiasName', align: 'left', width: 140 }
            ];
        return [
              { display: '标识', name: 'ID', align: 'left', width: 260, minWidth: 60 },
              { display: '编号', name: 'Code', align: 'left', width: 160 },
              { display: '名称', name: 'Name', align: 'left', width: 140 }
        ];
    },
    bulidUrl: function (type) {
        if (type == "1")
            return _global.sitePath + "/DataObject/GetDataObjectList";
        else
            return _global.sitePath + "/DataModel/GetDataModelList";
    },
    getParamCreate: function () {
        var res = [];
        res.push({ name: "keyword", value: $("#txtkeywordList").val() });

        return res;
    },
    confirmAddMeta: function (dialog, model, type) {
        var self = this;
        fBulider.core.dataService.requestApi("/CommonFB/createMetaData", {
            data: JSON.stringify(model),
            type: type
        }, "正在添加....").done(function (data) {
            if (data.res) {
                dialog.close();
                leeUI.Success(data.mes);
                self.reload();
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    confirmDelete: function (id, type) {
        var self = this;

        fBulider.core.dataService.requestApi("/CommonFB/detleteMeta", {
            type: type,
            id: id
        }, "正在删除....").done(function (data) {
            if (data.res) {
                //dialog.close();
                leeUI.Success(data.mes);
                self.reload();
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    setUIButon: function () {

        if (this.chooseData.length > 1) {
            $("#btnDelete,#btnModify").attr("disabled", "disabled");
        } else {
            $("#btnDelete,#btnModify").removeAttr("disabled");
        }

    },
    bind: function () {
        var self = this;
        $("#btnAdd").click($.proxy(this.addFolder, this));

        $("#btnMove").click($.proxy(this.getFolderTree, this));
        $("#btnDelete").click($.proxy(this.deleteFolder, this));

        $("#btnModify").click($.proxy(this.modifyMeta, this));
        //addFolder

        $('#txtkeyword').bind('keypress', function (event) {
            if (event.keyCode == "13") self.reload();
        });

        $(".addMeta li a").click(function () {
            var id = $(this).attr("data-id");
            self.openAddMeta(id)
        });
        $("#btnSearch").click($.proxy(this.reload, this));
        $(this.listview).on("click", ".achor", function (e) {
            var $ele = $(this).closest(".box");
            var id = $ele.attr("fileid");
            var name = $ele.attr("data-name");
            var isfolder = $ele.attr("isfloder");

            self.isUser = false;
            if (isfolder == "1") {
                self.parentID = id;
                self.pusNav(id, name);

                self.reload();
                e.stopPropagation();
            } else {
                self.preview($ele.attr("data-type"), id);
            }
        });

        $(this.listview).on("click", ".btnPreview", function (e) {
            var $ele = $(this).closest(".box");
            var id = $ele.attr("fileid");

            var url = "Runtime/Preview";
            window.open(_global.sitePath + "/" + url + "?dataid=" + id);
        });


        //$(document).bind("contextmenu", function (e) {
        //    return false;
        //});
        $(document).bind("click", function (e) {
            self.contextMenu.hide();
        });

        this.listview.bind("selectChange", function (data) {
            self.setUIButon();
        });
        $(this.listview).on("contextmenu", ".box", function (e) {

            self.contextMenu.show();
            self.updatePosition(e);
            self.selectSingle(this);
            e.stopPropagation();
            return false;
        });
        $(this.listview).on("click", ".box", function (e) {


            self.selectSingle(this);
            e.stopPropagation();
            return false;
        });
        $(this.listview).on("click", ".item-chk", function (e) {

            //如果选中则取消选中
            var $ele = $(this).closest(".box");
            if ($ele.hasClass("active")) {
                $ele.removeClass("active");

                var id = $ele.attr("fileid");
                var deleteIndex = -1;
                for (var item in self.chooseData) {
                    if (self.chooseData[item].fielid == id) {
                        deleteIndex = item;
                    }
                }
                self.chooseData.splice(deleteIndex, 1);
                self.trigger();
                e.stopPropagation();
                return;
            }
            self.selectMul($(this).closest(".box"));

            e.stopPropagation();
            return false;
        });
        $(".headerwrap").on("click", ".bread", function (e) {

            //如果选中则取消选中
            var id = $(this).attr("data-id");
            var index = $(this).attr("data-index");

            self.openAchor(index, id);
            e.stopPropagation();
            return false;
        });
        $(".headerwrap").on("click", ".backnav", function (e) {

            self.backAchor();
        });




        $("body").on("click", ".rename", $.proxy(this.reNameFolder, this));
        $("body").on("click", ".delete", $.proxy(this.deleteFolder, this));
        $("body").on("click", ".move", $.proxy(this.getFolderTree, this));


        $("body").on("click", ".viewDepend", $.proxy(this.viewDepend, this));
        ///reNameFolder
    },
    trigger: function () {
        this.listview.trigger("selectChange", [this.chooseData]);
    },
    selectMul: function (ele) {


        this.chooseData.push(this.getBoxObject($(ele)));
        $(ele).addClass("active");
        this.trigger();
    },
    selectSingle: function (ele) {
        this.chooseData = [];
        this.chooseData.push(this.getBoxObject($(ele)));
        $(".box.active").removeClass("active")
        $(ele).addClass("active");
        this.trigger();
    },
    getBoxObject: function (ele) {
        return { fielid: ele.attr("fileid"), type: ele.attr("data-type") };
    },
    updatePosition: function (e) {
        this.contextMenu.css("left", e.clientX + "px");
        this.contextMenu.css("top", e.clientY + "px");
    },
    preview: function (type, id) {
        var url = "";
        if (type == "0") {
            url = "DataObject/Edit";
        } else if (type == "1") {
            url = "DataModel/Edit";
        } else if (type == "2") {
            url = "SmartHelp/Edit";
        } else if (type == "3") {
            url = "Form/Edit";
        } else if (type == "5") {
            url = "DataSource/Edit";
        } else if (type == "6") {
            url = "CMP/Edit";
        } else if (type == "9") {
            return;
        }
        window.open(_global.sitePath + "/" + url + "?dataid=" + id);
    },
    reload: function () {

        $(".info_wrap.header")[this.viewtype == "list" ? "show" : "hide"]();
        $(".breadcrumb")[$("#txtkeyword").val() == "" ? "show" : "hide"]();

        this.listview.leeUI().reload();//刷新listView
    },
    getApiURL: function () {
        return _global.sitePath + "/CommonFB/getFolderList";
    },
    getCss: function (type) {
        this.hasCss = this.hasCss || {
            "0": "do",
            "1": "dm",
            "2": "help",
            "3": "frm",
            "5": "ds",
            "6": "cmp"
        };
        return this.hasCss[type];
    },
    getView: function (row, index) {

        var htmlarr = [];


        if (this.viewtype == "list") {
            htmlarr.push('<dd class="info_wrap box" data-name="' + row.Name + '" data-type="' + row.Type + '" isfloder="' + (row.IsFolder == "1" ? "1" : "0") + '" fileid="' + row.ID + '">');
            htmlarr.push('  <span class="item-chk"></span>');
            if (row.IsFolder == "1")
                htmlarr.push('  <span class="folder"></span>');
            else
                htmlarr.push('  <span class="dll ' + this.getCss(row.Type) + '"></span>');
            htmlarr.push('  <div class="textline"><a href="#" class="achor">' + row.Name + '</a>');
            if (row.Type == "3")
                htmlarr.push('<a class="preview"><button class="lee-btn btnPreview"  ><i class="lee-ion-edit" style="margin-right:5px;"></i>预览  </button> </a> ');

            htmlarr.push('       <div class="edit-name lst">');
            htmlarr.push('           <input class="box" type="text" value="">');
            htmlarr.push('           <span class="sure"></span>');
            htmlarr.push('           <span class="cancel"></span>');
            htmlarr.push('       </div>');
            htmlarr.push('   </div>');
            htmlarr.push('  <div class="filetag">' + row.MetaType + '</a></div>');
            htmlarr.push('  <div class="filetime"> ' + row.LastModifyTime + '</div>');

            htmlarr.push('  <div class="fileuser">' + row.LastModifyUser + '</div>');
            htmlarr.push('</dd>');

        } else {
            htmlarr.push('<div class="file-view-item box" data-name="' + row.Name + '" data-type="' + row.Type + '" isfloder="' + (row.IsFolder == "1" ? "1" : "0") + '" fileid="' + row.ID + '">');

            var css = row.IsFolder == "1" ? "" : "dll";
            htmlarr.push('  <div class="file-view-item-wrap ' + css + '">');


            htmlarr.push('      <span></span>');
            htmlarr.push('      <span class="item-chk item-chked"></span>');
            htmlarr.push('  </div>');
            htmlarr.push('  <div class="file-info">');

            htmlarr.push('      <a href="#" class="achor">' + row.Name + '</a>');
            htmlarr.push('      <div class="edit-name">');
            htmlarr.push('          <input class="box" value="">');
            htmlarr.push('          <span class="sure"></span>');
            htmlarr.push('          <span class="cancel"></span>');
            htmlarr.push('       </div>');
            htmlarr.push('   </div>');
            htmlarr.push('</div>');
        }
        return htmlarr.join("");
    },
    getParam: function () {

        var res = [];
        res.push({ name: "parentID", value: this.parentID });
        res.push({ name: "isSys", value: this.isUser });
        res.push({ name: "isFolder", value: false });
        res.push({ name: "isMy", value: this.isUser });
        res.push({ name: "keyword", value: $("#txtkeyword").val() });
        return res;
    },
    initBread: function () {
    },
    getFolderTree: function () {

        var self = this;
        fBulider.core.dataService.requestApi("/CommonFB/getFolderList", {
            parentID: "",
            isSys: false,
            isFolder: true
        }, "正在加载....").done(function (data) {
            if (data.res) {
                self.createTree(data.data);
            }
        }).fail(function (data) {
            console.log(data);
        });

    },
    createTree: function (data) {

        var arr = [];
        arr.push({ ID: "Root", ParentID: "", Name: "根目录" });

        $("#folderTree").leeTree({
            data: arr.concat(data),
            idFieldName: 'ID',
            parentIcon: "folder",
            childIcon: "leaf",
            textFieldName: "Name",
            parentIDFieldName: "ParentID"
        });
        var self = this;
        $.leeDialog.open({
            title: "移动",
            width: "450",
            height: '300',
            target: $("#dialog_moveFolder"),
            targetBody: true,
            isResize: true,
            buttons: [{
                text: '确定',
                cls: 'lee-btn-primary lee-dialog-btn-ok',
                onclick: function (item, dialog) {
                    var id = "";

                    var selected = $("#folderTree").leeUI().getSelected();
                    if (selected) {
                        self.confirmMove(dialog, selected.data.ID);
                    } else {
                        leeUI.Error("请选中要移动到的文件夹！");
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
    confirmMove: function (dialog, id) {
        var self = this;
        var arr = [];
        $.each(this.chooseData, function (i, obj) {
            arr.push(obj.fielid)
        });
        fBulider.core.dataService.requestApi("/CommonFB/moveFolder", {
            data: JSON.stringify(arr),
            id: id
        }, "正在添加....").done(function (data) {
            if (data.res) {
                dialog.close();
                leeUI.Success(data.mes);
                self.reload();
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    refreshNav: function () {
        this.navs = [];
        this.navs.push({ id: "", name: "全部" });

        if (this.parentID == "SYS") {
            this.navs.push({ id: "SYS", name: "系统目录" });
        }
        this.bulidNav();
    },
    openMore: function (item) {
        this.navs.push[{ id: item.id, name: item.name }];
    },
    openAchor: function (index, id) {
        this.navs.splice(Number(index) + 1, this.navs.length - index - 1);

        this.parentID = id;
        this.reload();
        this.bulidNav();
    },
    backAchor: function () {
        if (this.navs.length == 1) return;
        this.navs.splice(this.navs.length - 1, 1);
        this.parentID = this.navs[this.navs.length - 1].id;
        this.reload();
        this.bulidNav();
    },
    pusNav: function (id, name) {
        this.navs.push({ id: id, name: name });
    },
    backFront: function () {
        var item = this.navs[this.navs.length - 1];
        this.openAchor(this.navs.length - 2, item.id);
    },
    bulidNav: function () {
        var htmlarr = [];
        for (var i = 0; i < this.navs.length; i++) {
            //var style = (this.navs.length == 1 ? "style='display:none'" : "");
            var style = "";
            if (i == 0)
                htmlarr.push('<a href="#" ' + style + ' class="backnav" style="color:#0000FF"> 返回上一级 </a> <span ' + style + '> |  </span> ');
            if (i == this.navs.length - 1) {
                htmlarr.push('<span>' + this.navs[i].name + '</span>')
            } else {
                htmlarr.push('<a href="#" class="bread" data-id="' + this.navs[i].id + '" data-index="' + i + '" style="color:#0000FF">' + this.navs[i].name + '</a> > ')
            }
        }
        $(".breadcrumb").html(htmlarr.join(""));
    }
}




$(function () {

    var Manager = new MeataExplorer();

    Manager.init();
    Manager.initList();

    $("input[name='viewtype']").change(function () {
        Manager.viewtype = $("input[name='viewtype']:checked").val();
        Manager.reload();
    });
    $(".nav-item", ".lee-navbar").click(function () {
        $(".nav-item.active").removeClass("active");
        $(this).addClass("active");
        var id = $(this).attr("data-id");
        if (id == "my") {
            Manager.isUser = true;
        } else {
            Manager.isUser = false;
        }
        $("#txtkeyword").val("");
        Manager.parentID = id;
        Manager.refreshNav();
        Manager.reload();
    });

    $(".nav-header", ".lee-navbar").click(function () {
        var parent = $(this).parent();
        if (parent.hasClass("collapse")) {
            parent.removeClass("collapse");
            parent.addClass("open");

            $(this).next().show();
        } else {
            parent.removeClass("open");
            parent.addClass("collapse");
            $(this).next().hide();
        }
    });
});



var SlideMenu = function () {
};

SlideMenu.prototype = {
    init: function (width) {
        // 初始化配置信息 宽度 展现方式 
        if (!this.isInit)
            this.initDom();
        this.page = 1;
    },
    initList: function (data) {
        var htmlarr = [];
        for (var i = 0; i < data.length; i++) {
            htmlarr.push('<li class="timeline-item"> <div class="tail"></div><div class="head blue"></div>');
            htmlarr.push(" <div class='content'><b> <span >" + data[i].OpTime + "</span></b><p><a href='#' style='color:#2196F3;margin-right:4px;font-weight:bold;'>" + data[i].OpUser + "</a>" + data[i].LogInfo + "</p></b>");

            htmlarr.push("</li>");
        }

        this.list[this.page == 1 ? "html" : "append"](htmlarr.join(""))
    },
    refresh: function () {
        this.page = 1;
        this.getLog();
    },
    loadMoreData: function () {
        this.page++;
        this.getLog();
    },
    initLoadMore: function (TotalCount) {


    },
    getLog: function () {

        var self = this;
        fBulider.core.dataService.requestApi("/CommonFB/getLogList", {
            page: this.page,
            pagesize: 20
        }, "正在加载....").done(function (data) {
            if (!data.error) {
                self.initList(data.Rows);
                self.dataload = true;
                if (self.page == data.TotalCount) {
                    self.loadMore.hide();
                    self.tip.show();

                } else {
                    self.tip.hide();
                    self.loadMore.show();
                }
                //self.page++;
            }
        }).fail(function (data) {
            console.log(data);
        });
    },
    show: function () {
        this.mask.show();
        this.container.show();
        this.container.addClass("slideInRight");
    },
    close: function () {
        var self = this;
        self.container.addClass("slideOutRight");
        setTimeout(function () {
            self.mask.hide();
            self.container.hide();
            self.container.removeClass("slideOutRight slideInRight");
        }, 300);
    },
    initDom: function () {
        var self = this;
        this.mask = $("<div class='lee-slide-mask'></div>");
        this.container = $("<div class='lee-slide-container'></div>");
        this.container.append("<div class='lee-slide-header '><span>操作日志</span><a class='refresh'><i class='lee-ion-refresh'></i></a><a class='close'><i class='lee-ion-close'></i></a></div>");
        $(document.body).append(this.mask).append(this.container);

        this.mainwrap = $("<div class='lee-slide-content'></div>");
        this.list = $("<ul class='timeline'></ul>");

        this.loadMore = $("<a href='#' style='display:block;text-align:center;'>加载更多</a>");
        this.tip = $("<div href='#' style='display:none;text-align:center;'>没有更多了</div>");

        this.loadMore.click(function () {
            self.loadMoreData();
        });
        this.mainwrap.append(this.list).append(this.loadMore).append(this.tip);
        this.container.append(this.mainwrap);
        this.isInit = true;
        this.refreshBtn = this.container.find(".refresh");
        this.refreshBtn.click(function () {
            self.refresh();
        });

        this.closeBtn = this.container.find(".close");
        this.closeBtn.click(function () {
            self.close();
        });
        this.mask.click(function () {
            self.close();
            //self.container.addClass("slideOutRight");
            //setTimeout(function () {
            //    self.mask.hide();
            //    self.container.hide();
            //}, 300);
        });
    }
};

var slideMenu = new SlideMenu();
function openLog() {

    slideMenu.init();
    slideMenu.show();
    if (!slideMenu.dataload)
        slideMenu.getLog();
}