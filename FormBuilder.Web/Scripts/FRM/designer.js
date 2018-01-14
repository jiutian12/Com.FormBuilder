var startdrag = 0;
var stopsave = 0;
var curlayoutid = -1;
var isdrag = false;
var curcontroltype = ""; // layout control
var Page = {};
Page.config = {};
Page.CurrentPage = "Center"; //North South East West CenterBottom

Page.Layout = {
    Center: [],
    Top: [],
    Bottom: [],
    Left: [],
    Right: [],
    CenterBottom: []
};

function bulidGridSystem(type) {
    var l = leeManger;
    if (type == "0") {
        return '<div class="column"></div>';
    }
    if (type == "1") {
        return '<div class="col-sm col-sm-12" id="' + l.getNewUid("col") + '"><div class="column"></div></div>';
    } else if (type == "2") {

        return '<div class="col-sm col-sm-6" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-6" id="' + l.getNewUid("col") + '"><div class="column"></div></div>';
    } else if (type == "3") {

        return '<div class="col-sm col-sm-4" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-8" id="' + l.getNewUid("col") + '"><div class="column"></div></div>';
    } else if (type == "4") {

        return '<div class="col-sm col-sm-8" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-4" id="' + l.getNewUid("col") + '"><div class="column"></div></div>';
    } else if (type == "5") {

        return '<div class="col-sm col-sm-4" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-4" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-4" id="' + l.getNewUid("col") + '" ><div class="column"></div></div>';
    } else if (type == "6") {

        return '<div class="col-sm col-sm-9" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column"></div></div>';
    } else if (type == "7") {

        return '<div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-9" id="' + l.getNewUid("col") + '"><div class="column"></div></div>';
    } else if (type == "8") {

        return '<div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column"></div></div><div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column"></div></div>';
    } else if (type == "9") {
        return '<ul class="nav nav-tabs"><li class="active"><a href="#">标题</a></li><a href="#" class="addtab"><i class="fa fa-plus"></i></a></ul><div class="tab-content" ><div class="tab-pane active " id="' + l.getNewUid("col") + '"><div class="column"></div></div></div>';
    }
    else if (type == "10") {
        //绝对布局
        return '<div  class="col-sm col-sm-12"  id="' + l.getNewUid("col") + '" ><div class="column absolute"></div></div>';
    } else if (type == "11") {


        return '<div class="col-sm col-sm-6" id="' + l.getNewUid("col") + '"><div class="column absolute"></div></div><div class="col-sm col-sm-6" id="' + l.getNewUid("col") + '"><div class="column absolute"></div></div>';

    } else if (type == "12") {
        return '<div class="col-sm col-sm-4" id="' + l.getNewUid("col") + '"><div class="column absolute"></div></div><div class="col-sm col-sm-4" id="' + l.getNewUid("col") + '"><div class="column absolute"></div></div><div class="col-sm col-sm-4" id="' + l.getNewUid("col") + '" ><div class="column absolute"></div></div>';
    } else if (type == "13") {
        return '<div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column absolute"></div></div><div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column absolute"></div></div><div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column absolute"></div></div><div class="col-sm col-sm-3" id="' + l.getNewUid("col") + '"><div class="column absolute"></div></div>';
    }

}

// 传递控件类型 和位置坐标信息 包括宽高 top left
function bulidControll(type, position) {
    //alert(type);
    var uid = leeManger.getNewUid(type);
    var html = "";
    switch (type) {
        case "input":
            html = '<div id="' + uid + '" class="item_id item_field_label"><span>文本</span></div><div class="item_field_value">文本框</div><div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>';
            break;

        case "date":
            html = '<div id="' + uid + '" class="item_id item_field_label"><span>日期</span></div><div class="item_field_value">日期框</div><div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>';
            break;
        case "checkbox":
            html = '<div id="' + uid + '" class="item_id item_field_label"><span>复选框</span></div><div class="item_field_value">复选框</div><div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>';
            break;
        case "radio":
            html = '<div id="' + uid + '" class="item_id item_field_label"><span>单选框</span></div><div class="item_field_value">单选框</div><div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>';
            break;
        case "dropdown":
            html = '<div id="' + uid + '" class="item_id item_field_label"><span>下拉框</span></div><div class="item_field_value">下拉框</div><div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>';
            break;
        case "spinner":
            html = '<div id="' + uid + '" class="item_id item_field_label"><span>微调器</span></div><div class="item_field_value">下拉框</div><div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>';
            break;
        case "lookup":
            html = '<div id="' + uid + '" class="item_id item_field_label"><span>帮助</span></div><div class="item_field_value">帮助</div><div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>';
            break;
        case "file":
            html = '<div id="' + uid + '" class="item_id item_field_label"><span>附件</span></div><div class="item_field_value">附件</div><div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>';
            break;
        case "textarea":
            html = '<div id="' + uid + '" class="item_id item_field_label"><span>多行文本</span></div><div class="item_field_value">多行文本</div><div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>';
            break;
        case "grid":
            html = '<div id="' + uid + '" class="item_id grid"><div><a href="#" class="remove" ><i class="fa fa-close "></i></a></div><div class="grid_toolbar" style="display:none;">工具栏</div><div class="grid_wrap"><table class="grid_edit"></table></div></div>';
            break;
        case "bar":
            html = '<div id="' + uid + '" class="item_id toolbarwrap"><div><a href="#" class="remove" ><i class="fa fa-close"></i></a></div><div class="toolbar_wrap">工具栏</div></div>';
            break;
        case "tree":
            html = '<div id="' + uid + '" class="item_id treewrap"><div><a href="#" class="remove" ><i class="fa fa-close"></i></a></div><div class="tree_wrap">树</div></div>';
            break;
        case "button":
            html = '<div id="' + uid + '" class="item_id buttonwrap"><a href="#" class="remove" ><i class="fa fa-close"></i></a><div class="button_wrap"><button class="lee-btn">按钮</button></div></div>';
            break;
        case "label":
            html = '<div id="' + uid + '" class="item_id"><a href="#" class="remove" ><i class="fa fa-close"></i></a><span></span></div>';
            break;
        case "label":
            html = '<div id="' + uid + '" class="item_id buttonwrap"><a href="#" class="remove" ><i class="fa fa-close"></i></a><span class="labelwrap"></span></div>';
            break;
        case "chart":
            html = '<div id="' + uid + '" class="item_id buttonwrap"><a href="#" class="remove" ><i class="fa fa-close"></i></a><div class="chart_wrap">图表</div></div>';
            break;
        default:
            break;
    }
    leeManger.addControl(uid, type, "");
    return html;
}

//创建
function bulidLayout(type) {

    var arr = [];
    var id = leeManger.getNewUid("layout");
    arr.push("<div class='sortale' id='" + id + "'>");
    arr.push('<div class="handle">');
    arr.push('<a href="#" class="drag"><i class="icon iconfont icon-arrows_move"></i>拖动</a>');
    arr.push('<a href="#" class="del">删除</a>');
    arr.push('<a href="#" class="attr">属性</a>');
    arr.push('</div>')
    arr.push('<div class="mainlayout">');
    arr.push(bulidGridSystem(type));
    arr.push('</div>');
    arr.push('</div>');
    leeManger.addLayout(id, [], type);
    return arr.join('');
}
$(function () {
    leeManger.init();
    bind();
    refresh();


    $(".toolbar a>span").LeeToolTip({ placement: "bottom" });
    $(".propgrid tr>td>span").LeeToolTip();
    //布局容器拖动初始
    $(".toolbox-container li").draggable({
        connectToSortable: ".center-nav",
        helper: "clone",
        revert: "invalid",
        drag: function (r, u) {
            isdrag = true;
            u.helper.width(200);
            u.helper.height("auto");
            curlayoutid = u.helper.attr("areatype");
            curcontroltype = "layout";
        },
        stop: function (r, u) {
            refresh();//拖动触发后重新绑定事件
        }
    });

    //控件库拖动初始
    $(".controllbox-container .item").draggable({
        connectToSortable: ".column:not(.absolute)", //控件能drop的区域
        helper: "clone",
        revert: "invalid",
        drag: function (r, u) {
            isdrag = true;
            u.helper.width(200);
            u.helper.height("auto");
            curlayoutid = u.helper.attr("areatype");
            curcontroltype = u.helper.attr("controltype");
        },
        stop: function (r, u) {
            //如果目标函数是一个

        }
    });


    //主区域的布局
    $(".center-nav").sortable({
        //connectWith: ".column", //这里是布局嵌套的关键
        handle: ".drag",
        placeholder: "ui-state-highlight",
        start: function (r, u) {
            u.helper.width(200);
            //u.helper.addClass("active")
            //return false;
            if (curlayoutid == "input" || curlayoutid == -1) {
                // 
                $(".center-nav .column").find(".ui-state-highlight").html("拖放控件到这里").css("float", "left").css("width", "50%");
            }
        },
        stop: function (r, u) {
            //u.helper.removeClass("active")
            if (isdrag) {
                var f = $(u.item[0]);

                if (curlayoutid == "input") {
                    f.html(bulidControll(curcontroltype));
                    if (curcontroltype == "grid" || curcontroltype == "bar" || curcontroltype == "tree") {
                        f.css("width", "100%");
                        f.css("clear", "both")
                    } else {
                        f.css("width", "50%");
                    }
                } else {

                    f.html(bulidLayout(curlayoutid));
                }
                //refresh();
                isdrag = false;
                curlayoutid = -1;
                curcontroltype = "";

            }
            //alert(222);
            leeManger.refresh();
            //alert(1);

        }

    });

    function bind() {
        //tab页选中切换事件
        $(document).on("click", ".nav>li>a", function (e) {
            var mainlayout = $(this).closest(".mainlayout");
            $(this).closest(".nav").find("li").removeClass("active");
            $(this).parent().addClass("active");
            var index = $(this).parent().index();
            $(".tab-pane.active", mainlayout).removeClass("active")
            $(".tab-pane:eq(" + index + ")", mainlayout).addClass("active");
            e.stopPropagation();
        });
        //布局选中事件
        $(".center-nav").on("click", ".column", function (e) {
            if (!$(this).hasClass("selected")) {
                $(".column.selected").removeClass("selected");
                $(".column .item.active").removeClass("active"); //移除控件选中
                $(this).addClass("selected");
                var id = $(this).parent().attr("id");
                $(document).trigger("column.select", id);
            } else {
                $(document).trigger("column.unselect");
                $(".column.selected").removeClass("selected");
            }
            e.stopPropagation();
        });
        //tab布局点击事件
        $(".center-nav").on("click", ".nav>li>a", function (e) {
            var mainlayout = $(this).closest(".mainlayout");
            $(this).closest(".nav").find("li").removeClass("active");
            $(this).parent().addClass("active");
            var index = $(this).parent().index();
            $(".tab-pane.active", mainlayout).removeClass("active")
            $(".tab-pane:eq(" + index + ")", mainlayout).addClass("active");
            e.stopPropagation();
            //alert($(this).parent().index());
        });
        //删除布局
        $(".center-nav").on("click", ".sortale .handle>.del", function (e) {
            if (confirm("确认要删除此布局吗(清除会删除布局内控件)?")) {
                var id = $(this).closest(".sortale").attr("id");
                leeManger.removeLayout(id);
                $(this).closest(".ui-draggable").remove();

            }
            e.stopPropagation();
        });
        //布局属性
        $(".center-nav").on("click", ".sortale .handle>.attr", function (e) {
            var id = $(this).closest(".sortale").attr("id");

            var type = leeManger.layout[id].type;
            if (type == "9") {
                TabSet.setValue(id);
                TabSet.openModal();
            }
            e.stopPropagation();
        });
        //控件选中
        $(".center-nav").on("click", ".column .item", function (e) {
            //$(".column.selected").removeClass("selected");
            if (!$(this).hasClass("active")) {
                $(".column .item.active").removeClass("active");
                $(".column.selected").removeClass("selected");
                $(".grid_edit th").removeClass("active");
                $(this).addClass("active");
                var id = $(this).find(".item_id").attr("id");
                $(document).trigger("control.select", id);

                $(this).attr('tabindex', 1); //首先为DIV标签添加tabindex属性  
                $(this).focus();
            } else {
                $(".column.selected").removeClass("selected");
                $(".grid_edit th").removeClass("active");
                $(document).trigger("control.unselect");
                $(".column .item.active").removeClass("active");
                $(this).removeAttr('tabindex'); //首先为DIV标签添加tabindex属性  
                $(this).blur();
            }

            e.stopPropagation();
        });

        $(".center-nav").on("keydown", ".absolute .item", function (e) {
            var pos = $(this).position();

            switch (e.keyCode) {
                case 37: //左键  
                    $(this).css("left", pos.left - 1);
                    break;
                case 39: //右键  
                    $(this).css("left", pos.left + 1);
                    break;
                case 38: //上键  
                    $(this).css("top", pos.top - 1);
                    break;
                case 40: //下键  
                    $(this).css("top", pos.top + 1);
                    break;
                default:
                    return;

            }

            var id = $(this).find(".item_id").attr("id");

            updatePostion(id, $(this));


            e.stopPropagation();
        });
        $(".center-nav").on("click", ".column .item .item_field_remove", function (e) {
            //$(".column.selected").removeClass("selected");
            if (confirm("确认要删除吗?")) {
                var $ele = $(this).closest(".item");
                var id = $ele.find(".item_id").attr("id");
                $ele.remove();
                leeManger.removeControl(id);
            }
            e.stopPropagation();
        });

        $(".center-nav").on("click", ".column .item .remove", function (e) {
            //$(".column.selected").removeClass("selected");
            if (confirm("确认要删除吗?")) {
                var $ele = $(this).closest(".item");
                var id = $ele.find(".item_id").attr("id");
                $ele.remove();
                leeManger.removeControl(id);
            }
            e.stopPropagation();
        });

        $(".center-nav").on("click", ".column .item .grid_edit th", function (e) {
            //$(".column.selected").removeClass("selected");
            if (!$(this).hasClass("active")) {
                $(".grid_edit th").removeClass("active");
                $(".column .item.active").removeClass("active");
                $(".column.selected").removeClass("selected");
                $(this).addClass("active");
                var gid = $(this).attr("gid");
                var cid = $(this).attr("cid");
                var arr = [gid, cid];
                $(document).trigger("gridcolumn.select", arr);
            } else {
                $(".column.selected").removeClass("selected");
                $(".grid_edit th").removeClass("active");
                $(".column .item.active").removeClass("active");
                $(document).trigger("gridcolumn.unselect");
            }

            e.stopPropagation();
        });

        $(document).on("click", function (e) {
            //清除column选中
            //清除控件选中
            //$(".column .item.active").removeClass("active");
            //$(".column.selected").removeClass("selected");

            //hideallPanel();
        });
        // 控件选中事件
        $(document).on("control.select", function (e, id) {
            //隐藏其他布局
            //显示控件属性编辑器
            var obj = leeManger.controls[id];
            //alert(obj.type);
            if (obj.type == "grid") {
                showPanel("grid");
                CompFactory.factory("grid").setValue(id, obj);
                return;
            }
            if (obj.type == "bar") {
                showPanel("bar");
                CompFactory.factory("bar").setValue(id, obj);
                return;
            }

            if (obj.type == "button") {
                showPanel("button");
                CompFactory.factory("button").setValue(id, obj);
                return;
            }
            if (obj.type == "tree") {
                showPanel("tree");
                CompFactory.factory("tree").setValue(id, obj);
                return;
            }
            if (obj.type == "chart") {
                showPanel("chart");
                CompFactory.factory("chart").setValue(id, obj);
                return;
            }

            showPanel("input");
            CompFactory.factory("input").setValue(id, obj);

        });
        $(document).on("gridcolumn.select", function (e, gid, cid) {

            //alert(id);
            var obj = leeManger.getCol(gid, cid);
            //alert(obj.type);
            showPanel("input");
            CompFactory.factory("input").setValue(cid, obj, gid);

        });
        $(document).on("control.unselect", function (e, id) {
            //隐藏其他布局
            //显示控件属性编辑器
            hidePanel("input");
            hidePanel("tree");
            hidePanel("chart");


            hidePanel("button");
            hidePanel("bar");
            var obj = leeManger.controls[id];
        });

        $(document).on("column.select", function (e, id) {
            showPanel("column");
            var obj = leeManger.columns[id];

            CompFactory.factory("column").setValue(id, obj);

        });
        $(document).on("column.unselect", function (e, id) {
            //隐藏其他布局
            //显示控件属性编辑器
            hidePanel("column");
            var obj = leeManger.controls[id];
        });
        $(document).on("grid.select", function () {
            //隐藏其他布局
            //显示grid属性编辑器
        });
        $(document).on("gridcolumn.select", function () {
            //隐藏其他布局
            //显示grid 控件属性编辑器
        });
        $(".center-nav").on("click", ".addtab", function (e) {
            var main_wrap = $(this).closest(".sortale");
            var id = main_wrap.attr("id");

            $(this).before('<li><a href="#">tabcontent</a></li>');
            main_wrap.find(".tab-content").append('<div class="tab-pane" id="' + leeManger.getNewUid("col") + '"><div class="column"></div></div>');
            refresh();
            leeManger.refreshPart(id);
            e.stopPropagation();
        });
    }

});
function updatePostion(id, ele, curcontroltype) {
    var size = {};
    size.height = ele.height();
    size.width = ele.width();
    leeManger.updatePosition(id, curcontroltype, ele.position(), size);
    $(document).trigger("control.select", id);
}
function refresh() {
    $(".center-nav .column.absolute").droppable({
        accept: ".controllbox-container .item",
        drop: function (e, t) {
            //alert(1);

            var drag = $(t.draggable);
            var position = drag.position();
            var f = $(this);
            if (isdrag) {
                if (curlayoutid == "input") {
                    var ele = $("<div class='item'  controltype='" + curcontroltype + "' style='position:absolute;' >" + bulidControll(curcontroltype) + "</div>");

                    ele.draggable({
                        scroll: true, scrollSensitivity: 100,
                        stop: function (e, t) {
                            var id = $(">div", ele).attr("id");

                            updatePostion(id, ele);
                            //var size = {};
                            //size.height = ele.height();
                            //size.width = ele.width();
                            //leeManger.updatePosition(id, curcontroltype, ele.position(), size);
                            //ele.trigger("control.select", id);
                            e.stopPropagation();
                        }
                    });

                    ele.resizable({
                        disabled: false,
                        handles: 'w,n,e,s,se',
                        stop: function (e, t) {
                            var id = $(">div", ele).attr("id");
                            updatePostion(id, ele);

                            //var size = {};
                            //size.height = ele.height();
                            //size.width = ele.width();
                            //leeManger.updatePosition(id, curcontroltype, ele.position(), size);
                            //ele.trigger("control.select", id);
                            e.stopPropagation();
                        }
                    });

                    f.append(ele);
                    //f.removeClass("item");
                    if (curcontroltype == "grid" || curcontroltype == "bar" || curcontroltype == "tree" || curcontroltype == "button") {
                        ele.css("width", "100%");
                        //f.css("clear", "both");
                        ele.addClass(curcontroltype);
                    } else {
                        ele.css("width", "200");
                    }

                    var parentP = $(this).offset()
                    var dragP = t.offset;
                    ele.css("left", dragP.left - parentP.left);
                    ele.css("top", dragP.top - parentP.top);

                    var size = {};
                    var id = $(">div", ele).attr("id");

                    updatePostion(id, ele);
                    //size.height = ele.height();
                    //size.width = ele.width();
                    //leeManger.updatePosition(id, curcontroltype, ele.position(), size);
                }
                isdrag = false;
                curlayoutid = -1;
                curcontroltype = "";
            }
        }
    });

    $(".center-nav .column:not(.absolute)").sortable({
        opacity: .35,

        connectWith: ".column",
        placeholder: "ui-state-highlight",
        start: function (e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
            //t.helper.width(200);
            //t.helper.addClass("active");
            if (curlayoutid == "input" || curlayoutid == -1) {
                $(".center-nav .column").find(".ui-state-highlight").html("拖放控件到这里").css("width", "50%").css("float", "left");
            }
            //return false;
            //$(".center-nav .column").find(".ui-state-highlight").width(100).html("拖放控件到这里").height(20);
        },
        stop: function (e, t) {
            if (stopsave > 0) stopsave--;
            startdrag = 0;
            var f = $(t.item[0]);
            f && f.removeClass("active")
            if (isdrag) {
                if (curlayoutid == "input") {
                    f.html(bulidControll(curcontroltype));
                    //f.removeClass("item");
                    if (curcontroltype == "grid" || curcontroltype == "bar" || curcontroltype == "tree" || curcontroltype == "button") {
                        f.css("width", "100%");
                        f.css("clear", "both");

                        f.addClass(curcontroltype);

                    } else {
                        f.css("width", "50%");
                    }
                } else {
                    f.html(bulidLayout(curlayoutid));
                }
                //f.html(bulidLayout(curlayoutid));
                isdrag = false;
                curlayoutid = -1;
                curcontroltype = "";
            }
            //alert(2);
        }
    });
}
//布局管理容器
//控件管理容器
//控件属性基类
//控件类型
var leeManger = {
    getNewUid: function (prev) {    //生成一个随机的ID
        var arr = [];
        var idStr = Date.now().toString(36);
        arr.push(prev + "_");
        arr.push(idStr);
        arr.push(Math.random().toString(36).substr(3));
        return arr.join("");
    },
    getFrmID: function () {
        return fBulider.utils.getQuery("dataid");
    },
    add: function (manager) {

    },
    remove: function (id) {

    },
    controls: {},
    columns: {},
    removeControl: function (id, type) {
        delete this.controls[id];
    },
    addControl: function (id, type, field) {
        //添加组件
        this.controls[id] = { id: id, type: type, label: "标题", field: field, colspan: "2", editors: {} };
    },
    updatePosition: function (id, type, postion, size) {
        this.controls[id].width = size.width;
        this.controls[id].height = size.height;
        this.controls[id].left = postion.left;
        this.controls[id].top = postion.top;
    },
    getWidth: function (colspan, width) {
        if (width) return width + "px";
        if (colspan == "1") {
            return "100%";
        }
        if (colspan == "2") {
            return "50%";
        }
        if (colspan == "3") {
            return "33.33%";
        }
        if (colspan == "4") {
            return "25%";
        }
        if (colspan == "5") {
            return "20%";
        }
        if (colspan == "8") {
            return "12.5%";
        }
        if (colspan == "10") {
            return "10%";
        }
        if (colspan == "20") {
            return "5%";
        }
        if (colspan == "60") {
            return "60%";
        }
        if (colspan == "80") {
            return "80%";
        }
        if (colspan == "90") {
            return "90%";
        }
        if (colspan == "45") {
            return "45%";
        }
        if (colspan == "30") {
            return "30%";
        }
        return "50%";
    },
    refreshControl: function (id) {
        var attr = this.controls[id];
        var ele = $("#" + id);
        $("#" + id + " span").html(attr.label);


        ele.parent().css("width", this.getWidth(attr.colspan, attr.width));

        if (attr.editor_textarea && attr.editor_textarea.height) {
            ele.parent().css("height", attr.editor_textarea.height);
        }
        if (attr.type == "button") {
            var style = this.getButtonAlign(attr.align);
            var arr = style.split(":");
            $("#" + id).find(".button_wrap").css("padding-left", "0px").css("text-align", "left");
            $("#" + id).find(".button_wrap").html(this.getBtnHtml(attr)).css(arr[0], arr[1]);


        }
        if (attr.height && attr.top) {
            ele.parent().css("height", attr.height);
        }
        if (attr.top) {
            ele.parent().css("top", attr.top + "px");
        }
        if (attr.left) {
            ele.parent().css("left", attr.left + "px");
        }
    },
    getButtonAlign: function (type) {
        var style = "";
        if (type == "1") {
            style = "padding-left:120px";
        } else if (type == "2") {
            style = "text-align:center";
        } else if (type == "4") {
            style = "text-align:left";
        } else if (type == "3") {
            style = "text-align:right";
        }
        return style;
    },
    getBtnHtml: function (attr) {
        var icon = attr.icon;
        iconhtml = icon ? "<i class='" + icon + "' style='margin-right:5px;font-size:14px;line-height:0;'></i>" : "";
        var html = "<button class='lee-btn " + this.getBtnStyle(attr.style) + "'>" + iconhtml + attr.text + "</button>";
        return html;
    },
    getBtnIDHtml: function (attr, id) {
        var icon = attr.icon;
        iconhtml = icon ? "<i class='" + icon + "' style='margin-right:5px;font-size:14px;line-height:0;'></i>" : "";
        var html = "<button id='" + id + "' type='button' class='lee-btn " + this.getBtnStyle(attr.style) + "'>" + iconhtml + attr.text + "</button>";
        return html;
    },
    getBtnStyle: function (type) {
        this.hash_btnstyle = this.hash_btnstyle || {
            "1": "lee-btn-default",
            "2": "lee-btn-primary",
            "3": "lee-btn-sucess",
            "4": "lee-btn-info",
            "5": "lee-btn-danger",
        };
        return this.hash_btnstyle[type];
    },
    refreshPart: function (id) {
        var self = this;
        var val = self.layout[id];
        var childs = [];
        if (val.type == "9") { //如果是tablayout
            childs = $(".tab-content .tab-pane", "#" + id);
        } else {
            childs = $(".mainlayout .col-sm", "#" + id);
        }
        val.childs = [];
        var ord = 0;
        var navs = $(".nav>li>a", "#" + id);
        $.each(childs, function (i, obj) {
            var id = $(obj).attr("id");
            if (self.columns[id]) {
                self.columns[id].ord = ord;
                val.childs.push(self.columns[id]);
            } else {
                var ins = {
                    "id": id,
                    "type": "column",
                    "auto": true,
                    "height": "",
                    "title": "标题",
                    "minheight": "200",
                    "ord": ord,
                    "label": $(navs[i]).html()
                };
                self.columns[id] = ins;
                val.childs.push(ins);
            }
            self.refreshColumnPart(id);
            //这里刷新控件
            ord++;
        });
    },
    refreshColumnPart: function (colid) {
        //刷新column布局以及对象存储
        var $ele = $(".column", "#" + colid);
        var self = this;
        self.columns[colid].childs = [];
        var childrens = $ele.children();
        var ord = 0;
        $.each(childrens, function (i, e) {
            if ($(e).attr("controltype")) {
                var id = $(e).find(".item_id").attr("id");
                self.controls[id].ord = ord;
                self.columns[colid].childs.push(self.controls[id]);
            }
            ord++;
        });
    },
    refreshColumn: function (colid) {
        var attr = this.columns[colid];
        var $ele = $(".column", "#" + colid);
        if (attr.auto) {
            $ele.attr("height", "auto");
        }
        if (attr.height != "") {
            $ele.height(attr.height);
        } else {
            $ele.height("auto");
        }
        if (attr.minheight) {
            $ele.css("min-height", attr.minheight + "px");
        }
        this.refreshColumnPart(colid);

    },
    refresh: function () {
        var self = this;
        Page.Layout[Page.CurrentPage] = [];
        var children = $(".center-nav li .sortale");
        $.each(children, function (i, ele) {
            var id = $(ele).attr("id");
            Page.Layout[Page.CurrentPage].push(id);

            self.refreshPart(id);
        });
        //$.each(this.layout, function(key, val) {
        //self.refreshPart(key);
        //});
    },
    addLayout: function (id, childs, type) {
        //添加布局
        this.layout[id] = {
            childs: childs,
            ord: 0,
            parentid: "",
            type: type
        }
    },
    removeColumn: function (id) {
        var self = this;
        $.each(this.columns[id].childs, function (key, val) {
            //alert(val.id);
            self.removeControl(val.id);
        });
        delete this.columns[id];
    },
    removeLayout: function (id) {
        var self = this;
        this.refresh();
        $.each(this.layout[id].childs, function (key, val) {
            self.removeColumn(val.id);
        });
        delete this.layout[id];

    },
    refreshTabLayout: function (id, newLayouts, removeLayouts) {
        var childs = [];
        var self = this;
        $.each(newLayouts, function (i, value) {
            childs.push(leeManger.columns[value]);
        });
        $.each(removeLayouts, function (i, value) {
            self.removeColumn(value);
        });
        leeManger.layout[id].childs = childs;

        var liwrap = $("#" + id).closest("li");
        liwrap.empty().html(Layout.getLayoutContent(leeManger.layout[id], id));
        refresh();
    },
    layout: {

    },
    ctrlSelect: function (ele) {
        if (!$(ele).hasClass("active")) {
            $(".column .item.active").removeClass("active");
            $(".column.selected").removeClass("selected");
            $(".grid_edit th").removeClass("active");
            $(ele).addClass("active");
            var id = $(">div", $(ele)).attr("id");
            $(ele).trigger("control.select", id);
        }
    },

    makeCtrlDraggable: function () {
        //
        var guides;
        var self = this;
        var MIN_DISTANCE = 1;
        $(".column.absolute .item").draggable({
            scroll: true, scrollSensitivity: 100,
            start: function () {

                self.ctrlSelect(this);

            },
            drag: function (event, ui) {



            },
            stop: function (e, t) {
                var id = $(">div", $(this)).attr("id");

                updatePostion(id, $(this));
                $("#guide-v, #guide-h").hide();
                //var size = {};
                //size.height = $(this).height();
                //size.width = $(this).width();
                //leeManger.updatePosition(id, "", $(this).position(), size);
                //$(this).trigger("control.select", id);
                e.stopPropagation();
            }
        });


    },

    makeResizeable: function () {
        var self = this;
        $(".column.absolute .item").resizable({
            disabled: false,
            handles: 'w,n,e,s,se',
            start: function () {
                self.ctrlSelect(this);
            },
            stop: function (e, t) {
                var id = $(">div", $(this)).attr("id");
                updatePostion(id, $(this));

                //var size = {};
                //size.height = $(this).height();
                //size.width = $(this).width();
                //leeManger.updatePosition(id, "", $(this).position(), size);
                //$(this).trigger("control.select", id);
                e.stopPropagation();
            }
        });


    },
    //begin 子表core相关处理
    getCol: function (id, colid) {
        //获取grid的某一列的属性
        return this.controls[id].columns.find(function (i) {
            return i.colid == colid;
        });

    },
    getTabOptions: function (layoutid) {
        var childs = leeManger.layout[layoutid].childs;
        var arr = [];
        $.each(childs, function (i, obj) {
            arr.push({
                id: obj.id,
                label: obj.label,
                visable: true
            })
        });
        return arr;

    },

    refreshGridHtml: function (id) {
        //刷新子表样式
    },
    columnsToTree: function (data) {
        // 把columns转换为树形结构
        var childrenName = "children";
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
    setMulColumns: function (columns) {
        var maxLevel = 1;
        var leafcol = [];
        function setcol(col, level, pid) {
            if (level > maxLevel) maxLevel = level;
            col["_level"] = level;
            if (!col.children) {
                col["_colspan"] = 1;
                col["_isleaf"] = true; //子节点
                leafcol.push(col);
                return 1;
            }
            var leafcount = 0;
            for (var i = 0; i < col.children.length; i++) {
                leafcount += setcol(col.children[i], level + 1, col.children[i].pid)
            }
            col["_colspan"] = leafcount;
            return leafcount;
        }
        for (var i = 0; i < columns.length; i++) {
            setcol(columns[i], 1, "");
        }
        return { level: maxLevel, cols: leafcol };
    },
    setColumns: function (id, columns) {
        this.controls[id].columns = columns;
        var table = $("#" + id + " .grid_edit");
        var rescolumns = this.columnsToTree($.extend(true, [], columns));
        var multData = this.setMulColumns(rescolumns);
        var maxlevel = multData.level;
        var leafcol = multData.cols;
        table.empty();
        table.append(this.getGridHtml(rescolumns, maxlevel, leafcol, id));

    },
    getColumns: function (id) {
        //根据子表id获取
        if (this.controls[id].columns)
            return this.controls[id].columns;
        else if (this.controls.bindtable)//如果绑定表则按照表来获取
            return this._getDefaultColumnsByDataSource(this.controls.bindtable);
        else
            return [];
    },
    getGridHtml: function (rescolumns, maxlevel, leafcol, id) {
        var headhtml = ["<thead>"],
          bodyhtml = ["<tbody>"];
        colgroup = ["<colgroup>"];
        for (var level = 1; level <= maxlevel; level++) {
            headhtml.push("<tr>");
            var cols = getColumns(level);

            $.each(cols, function (i, obj) {
                var rowspan = 1;
                if (obj._isleaf && obj._level != maxlevel) {
                    rowspan = maxlevel - obj._level + 1;
                }

                headhtml.push("<th gid='" + id + "' rowspan='" + rowspan + "'  colspan='" + obj["_colspan"] + "'  cid='" + obj["colid"] + "'><span>" + obj["colname"] + "</span></th>");
            });
            headhtml.push("</tr>");


        }
        function getChildren(cols, level) {
            var res = [];
            for (var item in cols) {
                if (cols[item]["_level"] == level) {
                    res.push(cols[item]);
                } else {
                    res = res.concat(getChildren(cols[item].children, level));
                }
            }
            return res;

        }
        function getColumns(level) {
            var res = [];
            for (var item in rescolumns) {
                if (rescolumns[item]["_level"]) {
                    if (rescolumns[item]["_level"] == level) {
                        res.push(rescolumns[item]);
                    } else if (rescolumns[item].children) {
                        res = res.concat(getChildren(rescolumns[item].children, level));
                    }
                } else {
                    res.push(rescolumns[item]);
                }
            }
            return res;
        }

        $.each(leafcol, function (i, val) {
            // headhtml.push("<th gid='" + id + "'  cid='" + val["colid"] + "'><span>" + val["colname"] + "</span></th>");
            bodyhtml.push("<td><span>" + val["colname"] + "</span></td>"); //leaf
            var width = val["colwidth"] == "" ? "auto" : val["colwidth"] + "";
            colgroup.push("<col width='" + width + "'>");
        });
        headhtml.push("</thead>");
        bodyhtml.push("</tbody>");
        colgroup.push("</colgroup>");
        return colgroup.concat(headhtml).concat(bodyhtml).join("");
    },
    _getDefaultColumnsByDataSource: function () {
        return [];
    },
    getBindTableByGridID: function (id) {
        //根据子表id获取绑定数据源
        return "";
    },
    getAttrByGridColID: function (grid, colid) {
        return "";
    },
    getDefaultColumn: function () {
        var id = this.getNewUid("gridcol");
        return {
            id: id, colid: id, colname: "列名",
            bindtable: "", bindfield: "", ord: "",
            width: "", parentid: "", type: "input",
            label: "", title: "", required: false,
            readonly: false, editor: {}, events: {}
        };
    },
    // 锁定布局
    toogleLock: function () {
        //控制是否锁定布局 不让容器内的控件随意拖动
        if (!this.islock) {
            $(".center-nav .column").sortable("disable");
            $("#btnLock i").addClass("fa-unlock");
            this.islock = true;
        } else {
            $(".center-nav .column").sortable("enable");
            $("#btnLock i").removeClass("fa-unlock")
            this.islock = false;
        }
    },
    // 预览方法
    preview: function () {
        var fromtype = $("#attr_formtype").leeUI().getValue();
        if (fromtype == "1") {
            window.open(_global.sitePath + "/Runtime/Dict?frmid=" + leeManger.getFrmID());
        } else if (fromtype == "2") {
            window.open(_global.sitePath + "/Runtime/List?frmid=" + leeManger.getFrmID());
        } else if (fromtype == "3") {
            window.open(_global.sitePath + "/Runtime/Card?frmid=" + leeManger.getFrmID());
        }
    },
    viewDataModel: function () {
        window.open(_global.sitePath + "/DataModel/Edit?dataid=" + this.dataModel.ModelID);

    },
    viewDepend: function () {
        fBulider.core.window.openDialog("", "查看表单依赖", _global.sitePath + "/Common/Dependence?dataid=" + leeManger.getFrmID());
    },
    viewUserScript: function () {

        fBulider.core.window.open("", "自定义脚本", _global.sitePath + "/Form/FormCode?dataid=" + leeManger.getFrmID());
    },
    // 显示表单属性
    showFromAttr: function () {
        //表单属性编辑
        $(".formattr").show().animate({
            "top": "20"
        });
    },
    // 关闭表单属性
    closeFormAttr: function () {
        $(".formattr").show().animate({ "top": "-280" }, function () {
            $(".formattr").hide();
        });
    },
    init: function () {
        //初始化取数据
        var self = this;
        this.frmID = this.getFrmID();
        DataService.getForm(this.frmID).done(function (data) {
            if (data.res) {
                self.dataModel = data.data;
                if (self.dataModel.LayoutConfig)
                    self.layout = $.parseJSON(self.dataModel.LayoutConfig);
                if (self.dataModel.Config)
                    Page.config = $.parseJSON(self.dataModel.Config);
                if (self.dataModel.PageLayout)
                    Page.Layout = $.parseJSON(self.dataModel.PageLayout);
                if (self.dataModel.DefaultInfo)
                    defaultValueManger.setDefaultJSON($.parseJSON(self.dataModel.DefaultInfo));
                if (self.dataModel.Note)
                    $("#txtNote").val(self.dataModel.Note)

                defaultValueManger.setModelID(self.dataModel.ModelID).setFormID(self.dataModel.ID);


                if (self.dataModel.ExpressInfo)
                    CalcManger.set($.parseJSON(self.dataModel.ExpressInfo));


                self.initDesigner();
                leeDataSourceManager.setModel(self.dataModel.ID, self.dataModel.ModelID);
                leeDataSourceManager.refresh();
                refresh();
            }
        });
        //this.layout = this.get();
        //Page = this.getPage();


    },
    initDesigner: function () {
        this.bind();
        $("#chooseregion").leeUI().setValue(Page.CurrentPage);
        this.initData();
        this.initLayout();

    },
    reloadALLConfig: function (model) {
        this.layout = model.LayoutConfig;
        Page.config = model.formConfig;
        Page.Layout = model.PageLayout;
        this.initData();
        this.clearLayout();
        this.initLayout();
        this.setPageConfig();
    },
    initData: function () {
        //初始化数据 装载columns 和controls
        var self = this;
        $.each(this.layout, function (key, obj) {
            $.each(obj.childs, function (i, column) {
                self.columns[column.id] = column
                $.each(column.childs, function (j, control) {
                    self.controls[control.id] = control;
                });
            });
        });
    },
    clearLayout: function () {
        $(".center-nav").html("");
    },
    initLayout: function () {
        //根据当前所选区域来加载布局
        var arr = [];
        $.each(Page.Layout[Page.CurrentPage], function (i, id) {
            arr.push(Layout.getLayout(leeManger.layout[id], id));
        });
        $(".center-nav").html(arr.join(""));

        this.makeCtrlDraggable();
        this.makeResizeable();
    },

    CodeInit: function () {
        CodeEngineManger.setValue(Page, this.layout);
        //console.log(CodeEngineManger.getHtml());
        var html = $("<div class='layout'></div>");

        html.append(CodeEngineManger.getHtml());
        //$.leeDialog.open({
        //    title: "布局预览", width: "900", height: '430',
        //    target: html, targetBody: false, isResize: true
        //}).max();
        this.dataModel.JSInfo = Base64.encode(JSON.stringify(this.layout));
        this.dataModel.HtmlInfo = Base64.encode(CodeEngineManger.getHtml());
        //html.leeLayout({});
        this.publicForm();
    },
    // 打开自定义数据源方法
    showCustomDS: function () {
        fBulider.core.window.open("", "自定义数据源配置", _global.sitePath + "/Form/DSInfo?dataid=" + leeManger.getFrmID());
    },
    // 打开工具条配置方法
    showToolBarConfig: function () {
        fBulider.core.window.open("", "工具栏配置", _global.sitePath + "/Form/Toolbar?dataid=" + leeManger.getFrmID());
    },
    // 打开默认值配置方法
    showDefValueConfig: function () {
        defaultValueManger.open();
    },
    reLoadForm: function () {
        var self = this;
        if (!this.mTmpGenerator) {
            this.mTmpGenerator = new TmpGenerator();
            this.mTmpGenerator.init(this.dataModel.ModelID);
        }

        $.leeDialog.confirm("确认要重新加载吗？", "提示", function (type) {
            if (type) {
                var fromtype = $("#attr_formtype").leeUI().getValue();
                var model = self.mTmpGenerator.refresh(fromtype);
                self.reloadALLConfig(model);
            }
        });
    },
    // 事件绑定
    bind: function () {
        var self = this;
        $("#btnLock").click($.proxy(this.toogleLock, this));
        $("#btnCode").click($.proxy(this.CodeInit, this));
        $("#btnDataSource").click($.proxy(this.showCustomDS, this));
        $("#btnToolBar").click($.proxy(this.showToolBarConfig, this));
        $("#btnDefVal").click($.proxy(this.showDefValueConfig, this));

        $("#btnFormAttr").click($.proxy(this.showFromAttr, this));
        $(".formattr .closeattr").click($.proxy(this.closeFormAttr, this));
        $("#btnSave").click($.proxy(this.save, this));
        $("#btnPreview").click($.proxy(this.preview, this));
        $("#btnViewDataModel").click($.proxy(this.viewDataModel, this));
        $("#btnViewDP").click($.proxy(this.viewDepend, this));
        $("#btnUserScript").click($.proxy(this.viewUserScript, this));


        $("#btnreLoadForm").click($.proxy(this.reLoadForm, this));


        //
        var data = [
            { id: "Center", text: "Center" },
			{ id: "Top", text: "Top" },
			{ id: "Bottom", text: "Bottom" },
			{ id: "Left", text: "Left" },
			{ id: "Right", text: "Right" },
			{ id: "CenterBottom", text: "CenterBottom" }
        ];
        //区域选择下拉框
        $("#chooseregion").leeDropDown({
            width: 130, cancelable: false, data: data,
            onselected: function (value) {
                self.saveTmp();
                Page.CurrentPage = value;
                self.initLayout();
                refresh();
            }
        }).setValue(Page.CurrentPage);
        // $("#chooseregion").leeUI().setValue(Page.CurrentPage);

        $("#attr_formtype").leeDropDown({
            width: 150,
            cancelable: false,
            data: [{ id: "1", text: "字典" }, { id: "2", text: "列表" }, { id: "3", text: "卡片" }]
        });
        $("#attr_fsmid").leeDropDown({
            width: 150,
            cancelable: false,
            data: [
                { id: "card_fsm", text: "Card状态机" }
            ]
        });


        $("#attr_engine").leeDropDown({
            width: 200,
            cancelable: false,
            data: [
                { id: "1", text: "PlatFormV1.0(DefalutUI)" },
                { id: "2", text: "PlatFormV2.0(EasyUI)未实现" }
            ]
        });
        $("#attr_datamodel").leePopup({
            width: 200,
            cancelable: false
        });
        $("#attr_bizobject").leePopup({
            width: 200,
            cancelable: false
        });

        $("#attr_theme").leeDropDown({
            width: 150, cancelable: false,
            data: [
                { id: "white", text: "简约白" },
                { id: "blue", text: "商务蓝" }
            ]
        });

        var self = this;




        this.setPageConfig();

    },
    setPageConfig: function () {    //页面配置 set
        $("#attr_engine").leeUI().setValue(Page.config.engine);
        $("#attr_datamodel").leeUI().setValue(Page.config.datamodel);
        $("#attr_theme").leeUI().setValue(Page.config.theme);
        $("#attr_formtype").leeUI().setValue(Page.config.formtype);
        $("#attr_fsmid").leeUI().setValue(Page.config.fsmid);


        $("#attr_websocket").prop("checked", Page.config.show_websocket ? true : false);
        $("#attr_show_b").prop("checked", Page.config.show_b ? true : false);
        $("#attr_show_c").prop("checked", Page.config.show_c ? true : false);
        $("#attr_show_t").prop("checked", Page.config.show_t ? true : false);
        $("#attr_show_l").prop("checked", Page.config.show_l ? true : false);
        $("#attr_show_r").prop("checked", Page.config.show_r ? true : false);
        $("#attr_show_cb").prop("checked", Page.config.show_cb ? true : false);

        $("#attr_fix_t").prop("checked", Page.config.fix_t ? true : false);
        $("#attr_fix_b").prop("checked", Page.config.fix_b ? true : false);
        $("#attr_region").prop("checked", Page.config.region ? true : false);

        $("#attr_l_width").val(Page.config.l_width);
        $("#attr_l_title").val(Page.config.l_title);
        $("#attr_r_width").val(Page.config.r_width);
        $("#attr_r_title").val(Page.config.r_title);
        $("#attr_t_title").val(Page.config.t_title);
        $("#attr_b_title").val(Page.config.b_title);
        $("#attr_c_title").val(Page.config.c_title);
    },
    getPageConfig: function () {
        var config = {};
        config.show_b = $("#attr_show_b").prop("checked");
        config.show_c = $("#attr_show_c").prop("checked");


        config.show_l = $("#attr_show_l").prop("checked");
        config.show_t = $("#attr_show_t").prop("checked");
        config.show_r = $("#attr_show_r").prop("checked");
        config.show_cb = $("#attr_show_cb").prop("checked");
        config.show_websocket = $("#attr_websocket").prop("checked");
        config.formtype = $("#attr_formtype").leeUI().getValue();
        config.fsmid = $("#attr_fsmid").leeUI().getValue();
        config.theme = $("#attr_theme").leeUI().getValue();
        config.datamodel = $("#attr_datamodel").leeUI().getValue();
        config.engine = $("#attr_engine").leeUI().getValue();
        config.fix_t = $("#attr_fix_t").prop("checked");
        config.fix_b = $("#attr_fix_b").prop("checked");
        config.region = $("#attr_region").prop("checked");

        config.l_width = $("#attr_l_width").val();
        config.l_title = $("#attr_l_title").val();
        config.r_width = $("#attr_r_width").val();
        config.r_title = $("#attr_r_title").val();
        config.t_title = $("#attr_t_title").val();
        config.b_title = $("#attr_b_title").val();
        config.c_title = $("#attr_c_title").val();

        return config;
    },
    getValue: function () {
        this.dataModel.Config = JSON.stringify(Page.config);
        this.dataModel.PageLayout = JSON.stringify(Page.Layout);
        this.dataModel.LayoutConfig = JSON.stringify(this.layout);
        this.dataModel.FSMID = Page.config.fsmid;
        this.dataModel.Note = $("#txtNote").val();
        this.dataModel.ExpressInfo = JSON.stringify(CalcManger.get());
    },
    getDependence: function () {
        var controls = leeManger.controls;
        var dps_arr = [];
        $.each(controls, function (key, ctrl) {
            if (ctrl.type == "lookup") {
                dps_arr.push(ctrl.editor_lookup.helpdict);
            } else if (ctrl.type == "dropdown") {
                dps_arr.push(ctrl.editor_dropdown.datasource);
            } else if (ctrl.type == "grid") {
                var columns = ctrl.columns;
                $.each(columns, function (j, colctrl) {
                    if (colctrl.type == "lookup") {
                        dps_arr.push(colctrl.editor_lookup.helpdict);
                    } else if (colctrl.type == "dropdown") {
                        dps_arr.push(colctrl.editor_dropdown.datasource);
                    }
                });
            }
        });
        console.log(dps_arr);
        return dps_arr;
    },
    save: function () {
        this.saveRef();
        this.refresh();
        Page.config = this.getPageConfig();
        //localStorage.layout = JSON.stringify(this.layout);
        //localStorage.page = JSON.stringify(Page);
        this.getValue();
        var dplist = this.getDependence();
        this.dataModel.dplist = dplist;
        DataService.saveForm(JSON.stringify(this.dataModel)).done(function (data) {
            if (data.res) {
                leeUI.Success("保存成功！");
            }
        });
    },

    saveRef: function () {
        var hashList = {};
        for (var item in leeManger.controls) {
            var ctrl = leeManger.controls[item];
            if (ctrl["type"] == "input" || ctrl["type"] == "date" || ctrl["type"] == "file" || ctrl["type"] == "lookup" || ctrl["type"] == "select" || ctrl["type"] == "radio" || ctrl["type"] == "checkbox" || ctrl["type"] == "number" || ctrl["type"] == "textarea") {
                var sourceid = ctrl["bindtable"];
                hashList[sourceid] = hashList[sourceid] || [];
                var fields = ctrl["bindfield"];
                hashList[sourceid].push(fields);
            }

            if (ctrl["type"] == "grid") {
                var sourceid = ctrl["bindtable"];
                hashList[sourceid] = hashList[sourceid] || [];
                for (var field in ctrl.columns) {
                    hashList[sourceid].push(ctrl.columns[field]["bindfield"]);
                }

            }
        }
        var data = [];
        for (var id in hashList) {
            if (id != "") {
                var model = {};
                model.RefID = id;
                model.FormID = this.getFrmID();
                model.ColList = "," + hashList[id].join(",") + ",";
                data.push(model);
            }
        }




        DataService.saveFormRef(JSON.stringify(data), this.getFrmID()).done(function (data) {
            if (data.res) {
                leeUI.Success("发布成功！");
            }
        });
        console.log(hashList);
    },
    publicForm: function () {

        var dplist = this.getDependence();
        this.dataModel.dplist = dplist;
        DataService.publicForm(JSON.stringify(this.dataModel)).done(function (data) {
            if (data.res) {
                leeUI.Success("发布成功！");
            }
        });
    },
    saveTmp: function () {
        //暂存到本地
        this.refresh();
        Page.config = this.getPageConfig();
        localStorage.layout = JSON.stringify(this.layout);
        localStorage.page = JSON.stringify(Page);
    },
    get: function () {
        if (!localStorage.layout || localStorage.layout == "") {
            return {};
        }
        return $.parseJSON(localStorage.layout);
    },
    getPage: function () {
        if (localStorage.page == "" || localStorage.page == undefined) {
            return {
                CurrentPage: "Center",
                Layout: { Center: [], Top: [], Bottom: [], Left: [], Right: [], CenterBottom: [] }
            };
        }
        return $.parseJSON(localStorage.page);
    }
};

//根据配置生成设计时运行界面
var Layout = {
    getLayout: function (layout, id) {
        var arr = [];
        arr.push("<li areatype='" + layout.type + "' class='ui-draggable'>")
        arr.push(this.getLayoutContent(layout, id));
        arr.push('</li>');
        //leeManger.addLayout(id, [], type);
        return arr.join('');
    },
    getLayoutContent: function (layout, id) {
        var arr = [];
        arr.push("<div class='sortale' id='" + id + "'>");
        arr.push('<div class="handle">');
        arr.push('<a href="#" class="drag"><i class="icon iconfont icon-arrows_move"></i>拖动</a>');
        arr.push('<a href="#" class="del">删除</a>');
        arr.push('<a href="#" class="attr">属性</a>');
        arr.push('</div>')
        arr.push('<div class="mainlayout">');
        if (layout.type == "9") {
            arr.push(this.getTabColumn(layout));
        } else if (layout.type == "10" || layout.type == "11" || layout.type == "12" || layout.type == "13") {
            arr.push(this.getAbsoluteColumn(layout));
        } else {
            arr.push(this.getColumn(layout));
        }
        arr.push('</div>');
        arr.push('</div>');
        return arr.join('');
    },
    getAbsoluteColumn: function (layout) {
        var self = this;
        var arrhtml = [];

        if (layout.type == "10") {
            arr = ["12"];
        } else if (layout.type == "11") {
            arr = ["6", "6"];
        } else if (layout.type == "12") {
            arr = ["4", "4", "4"];
        } else if (layout.type == "13") {
            arr = ["3", "3", "3", "3"];
        }
        $.each(layout.childs, function (i, column) {
            var childhtml = self.getControl(column, true);//绝对布局处理 宽高top left zindex 等内容

            //var stylearr = [];
            //if (column.minheight) {
            //    stylearr.push("min-height:" + column.minheight + "px;");
            //}
            //if (column.height) {
            //    stylearr.push("height:" + column.height + "px;");
            //}
            //var style = "style='" + stylearr.join("") + "'";

            arrhtml.push("<div  class='col-sm col-sm-" + arr[i] + "' id='" + column.id + "'><div class='column absolute'>" + childhtml + "</div></div>")
        });
        return arrhtml.join("");


    },
    getColumn: function (layout) {
        var self = this;
        var arrhtml = [];
        if (layout.type == "1") {
            arr = ["12"];
        } else if (layout.type == "2") {
            arr = ["6", "6"];
        } else if (layout.type == "3") {
            arr = ["4", "8"];
        } else if (layout.type == "4") {
            arr = ["8", "4"];
        } else if (layout.type == "5") {
            arr = ["4", "4", "4"];
        } else if (layout.type == "6") {
            arr = ["9", "3"];
        } else if (layout.type == "7") {
            arr = ["3", "9"];
        } else if (layout.type == "8") {
            arr = ["3", "3", "3", "3"];
        }
        $.each(layout.childs, function (i, column) {
            var childhtml = self.getControl(column);
            var stylearr = [];
            if (column.minheight) {
                stylearr.push("min-height:" + column.minheight + "px;");
            }
            if (column.height) {
                stylearr.push("height:" + column.height + "px;");
            }
            var style = "style='" + stylearr.join("") + "'";

            arrhtml.push("<div class='col-sm col-sm-" + arr[i] + "' id='" + column.id + "'><div " + style + " class='column'>" + childhtml + "</div></div>")
        });
        return arrhtml.join("");
    },
    getTabColumn: function (layout) {
        var arrhtml = [];
        var self = this;
        arrhtml.push('<ul class="nav nav-tabs">');
        $.each(layout.childs, function (i, column) {
            arrhtml.push('<li class="' + (i == 0 ? "active" : "") + '"><a href="#">' + column.label + '</a></li>');
        });
        arrhtml.push('<a href="#" class="addtab"><i class="fa fa-plus"></i></a></ul>');
        arrhtml.push('<div class="tab-content">');
        $.each(layout.childs, function (i, column) {
            var childhtml = self.getControl(column);
            // var style = column.minheight ? "" : "style='min-height:0;'";
            //var style = column.minheight ? "style='min-height:" + column.minheight + "px;'" : "style='min-height:0;'";
            var stylearr = [];
            if (column.minheight) {
                stylearr.push("min-height:" + column.minheight + "px;");
            }
            if (column.height) {
                stylearr.push("height:" + column.height + "px;");
            }
            var style = "style='" + stylearr.join("") + "'";
            arrhtml.push('<div class="tab-pane ' + (i == 0 ? "active" : "") + '"  id="' + column.id + '"><div  ' + style + ' class="column ui-sortable">' + childhtml + '</div></div>');
        });
        arrhtml.push('</div>');
        return arrhtml.join("");
    },
    getControl: function (column, isabs) {
        var self = this;
        var arr = [];
        $.each(column.childs, function (i, control) {
            if (control.type == "grid") {
                arr.push(self.getGridControlInnerHtml(control, isabs));
            }
            else if (control.type == "bar") {
                arr.push(self.getToolbarControlInnerHtml(control, isabs))
            }
            else if (control.type == "tree") {
                arr.push(self.getTreeControlInnerHtml(control, isabs))
            }
            else if (control.type == "button") {
                arr.push(self.getButtonControlInnerHtml(control, isabs))
            }
            else if (control.type == "label") {
                arr.push(self.getLabelHtml(control, isabs))

            } else if (control.type == "chart") {
                arr.push(self.getChartHtml(control, isabs))

            }
            else {
                arr.push(self.getControlInnerHtml(control, isabs));
            }
        });
        return arr.join("");

    },
    getWidthByColSpan: function (control) {
        var def = "100%";
        if (control.width) return control.width + "px";
        var colspan = control.colspan;
        //alert(colspan);
        if (colspan == "2") {
            return "50%";
        }
        if (colspan == "3") {
            return "33.33%";
        }
        if (colspan == "4") {
            return "25%";
        }
        if (colspan == "5") {
            return "20%";
        }
        if (colspan == "8") {
            return "12.5%";
        }
        if (colspan == "10") {
            return "10%";
        }
        if (colspan == "20") {
            return "5%";
        }
        if (colspan == "60") {
            return "60%";
        }
        if (colspan == "80") {
            return "80%";
        }
        if (colspan == "90") {
            return "90%";
        }
        if (colspan == "45") {
            return "45%";
        }
        if (colspan == "30") {
            return "30%";
        }
        return def;
    },
    getControlTypeName: function (type) {
        var hash = {
            "input": "文本",
            "number": "数字",
            "dropdown": "下拉框",
            "date": "日期",
            "lookup": "帮助",
            "checkbox": "复选框",
            "file": "附件",
            "textarea": "多行文本",
            "spinner": "微调器"
        }
        return hash[type];
    },
    getCtrlStyle: function (ctrl) {
        var styArr = [];
        styArr.push("position:absolute");
        if (ctrl.top) {
            styArr.push("top:" + ctrl.top + "px");
        } if (ctrl.left) {
            styArr.push("left:" + ctrl.left + "px");
        }
        if (ctrl.height) {
            styArr.push("height:" + ctrl.height + "px");
        }
        if (ctrl.width) {
            styArr.push("width:" + ctrl.width + "px");
        }
        return styArr.join(";");
    },

    getControlInnerHtml: function (control, isabs) {
        var arr = [];
        var style = "";

        if (control.type == "textarea" && control.editor_textarea && control.editor_textarea.height) {
            style = ";height:" + control.editor_textarea.height + "px";
        }
        if (isabs) {
            style += ";" + this.getCtrlStyle(control);
        }

        arr.push("<div class='item'  areatype='input' controltype='" + control.type + "' style='width: " + this.getWidthByColSpan(control) + "" + style + ";'>");
        arr.push('<div id="' + control.id + '" class="item_id item_field_label">');
        arr.push('<span>' + control.label + '</span></div>');
        arr.push('<div class="item_field_value">' + this.getControlTypeName(control.type) + ' </div>');
        arr.push('<div class="item_field_remove"><i title="移除控件" class="del fa fa-close"></i></div>');
        arr.push("</div>");
        return arr.join("");
    },
    getLabelHtml: function (control, isabs) {
        var arr = [];
        var style = "";


        if (isabs) {
            style += ";" + this.getCtrlStyle(control);
        }

        arr.push("<div class='item'  areatype='input' controltype='" + control.type + "' style='width: " + this.getWidthByColSpan(control) + "" + style + ";'>");
        arr.push('<div id="' + control.id + '" class="item_id ">');
        arr.push('<a href="#" class="remove"><i class="fa fa-close"></i></a>');
        arr.push('<span>' + control.label + '</span></div>');

        arr.push("</div>");
        return arr.join("");
    },
    getChartHtml: function (control, isabs) {
        var arr = [];
        var style = "";


        if (isabs) {
            style += ";" + this.getCtrlStyle(control);
        }

        arr.push("<div class='item chart'  areatype='input' controltype='" + control.type + "' style='width: " + this.getWidthByColSpan(control) + "" + style + ";'>");
        arr.push('<div id="' + control.id + '" class="item_id chartwrap">');
        arr.push('    <a href="#" class="remove"><i class="fa fa-close "></i></a> ');

        arr.push('    <div class="chart_wrap">图表</div>');

        arr.push('  </div>');
        arr.push('</div>');
        return arr.join("");
    },

    getToolbarControlInnerHtml: function (control, isabs) {
        var arr = [];
        var style = "";
        if (isabs) {
            style += ";" + this.getCtrlStyle(control);
        }
        arr.push("<div class='item bar' areatype='input' controltype='" + control.type + "' style='width: 100%" + style + ";'>");
        arr.push('  <div id="' + control.id + '" class="item_id toolbarwrap">');
        arr.push('     <a href="#" class="remove"><i class="fa fa-close "></i></a> ');

        arr.push('    <div class="toolbar_wrap">工具栏 </div>');

        arr.push('  </div>');
        arr.push('</div>');

        return arr.join("");
    },
    getTreeControlInnerHtml: function (control, isabs) {
        var arr = [];
        var style = "";
        if (isabs) {
            style += ";" + this.getCtrlStyle(control);
        }
        arr.push("<div class='item tree' areatype='input' controltype='" + control.type + "' style='width: " + this.getWidthByColSpan(control) + style + ";'>");
        arr.push('  <div id="' + control.id + '" class="item_id treewrap">');
        arr.push('     <a href="#" class="remove"><i class="fa fa-close "></i></a> ');

        arr.push('    <div class="tree_wrap"  >树 </div>');

        arr.push('  </div>');
        arr.push('</div>');

        return arr.join("");
    },
    getButtonControlInnerHtml: function (control, isabs) {
        var arr = [];
        var style = "";
        if (isabs) {
            style += ";" + this.getCtrlStyle(control);
        }
        arr.push("<div class='item button' areatype='input' controltype='" + control.type + "' style='width:" + this.getWidthByColSpan(control) + style + ";'>");
        arr.push('  <div id="' + control.id + '" class="item_id buttonwrap">');
        arr.push('     <a href="#" class="remove"><i class="fa fa-close "></i></a> ');

        arr.push('    <div class="button_wrap" style="' + leeManger.getButtonAlign(control.align) + '">' + leeManger.getBtnHtml(control) + '</div>');

        arr.push('  </div>');
        arr.push('</div>');

        return arr.join("");
    },
    getGridControlInnerHtml: function (control, isabs) {
        var arr = [];
        var style = "";
        if (isabs) {
            style += ";" + this.getCtrlStyle(control);
        }
        arr.push("<div class='item grid' areatype='input' controltype='" + control.type + "' style='width: 100%;" + style + "'>");
        arr.push('  <div id="' + control.id + '" class="item_id grid">');
        arr.push('    <div><a href="#" class="remove"><i class="fa fa-close "></i></a></div>');
        arr.push('    <div class="grid_toolbar" style="display:none;">工具栏</div>');
        arr.push('    <div class="grid_wrap">');
        arr.push('    <table class="grid_edit">');

        //arr.push('    <colgroup>');


        var rescolumns = leeManger.columnsToTree($.extend(true, [], control.columns));
        var multData = leeManger.setMulColumns(rescolumns);
        var maxlevel = multData.level;
        var leafcol = multData.cols;

        arr.push(leeManger.getGridHtml(rescolumns, maxlevel, leafcol, control.id));
        //
        //if (control.columns) {
        //    $.each(control.columns, function (i, value) {
        //        var width = value["colwidth"] == "" ? "auto" : value["colwidth"] + "";
        //        arr.push("<col width='" + width + "'>");
        //    });
        //}
        //arr.push('    </colgroup>');
        //arr.push('    <thead><tr>');
        //if (control.columns) {
        //    $.each(control.columns, function (i, value) {
        //        arr.push('<th gid="' + control.id + '" cid="' + value.colid + '"><span>' + value.colname + '</span></th>')
        //    });
        //}
        // arr.push('    </tr></thead>');
        //arr.push('    <tbody><tr>');
        //if (control.columns) {
        //    $.each(control.columns, function (i, value) {
        //        arr.push('<td><span>' + value.colname + '</span></td>')
        //    });
        //}
        //arr.push('    </tr></tbody>');
        arr.push('    </table>');
        arr.push('    </div>');
        arr.push('  </div>');
        arr.push('</div>');

        return arr.join("");
    }

};

function showPanel(type) {
    /*$(".aside").animate({
		"right": "-300px"
	});
	$(".aside." + type + "attr").animate({
		"right": "0px"
	});*/
    $(".aside").css("right", "-300px");
    $(".aside." + type + "attr").css("right", "0px");
    $(".center-nav").css("right", "288px");
};




function hideallPanel() {
    $(".aside").animate({
        "right": "-300px"
    });
    $(".center-nav").css("right", "0");
};

function hidePanel(type) {
    $(".aside." + type + "attr").animate({
        "right": "-288px"
    });
    $(".center-nav").css("right", "0");
}