
window.Page = window.Page || {};
//核心处理类
window.Page.Core = window.Page.Core || {};
//界面操作类
window.Page.UI = window.Page.UI || {};
//通用服务
window.Page.Service = window.Page.Service || {};
//内置方法 增删改查
window.Page.Func = window.Page.Func || {};
//界面数据模型
window.Page.Model = window.Page.Model || {};
//表达式解析器类
window.Page.ExpressParser = window.Page.ExpressParser || {};

//当前界面编辑状态
Page.Core.status = "init";// edit  view  add
// 表单类型
Page.Core.formtype = "1";
//界面传参数据
Page.Core.formData = {};
//
Page.Core.schema = {};//数据模型字段信息

Page.Core.modelID = "";

$(function () {

    //alert(formConfig.l_width)
    var opts = {};
    opts.leftWidth = (formConfig.l_width ? Number(formConfig.l_width) : 500);
    opts.rightWidth = (formConfig.r_width ? Number(formConfig.r_width) : 500);

    opts.onEndResize = function () {
        $(window).trigger("resize");
    }
    // 固定底部需要计算

    if (formConfig.fix_b) {
        opts.heightDiff = -40;
    }

    $(".layout-main").leeLayout(opts);
    if (!(formConfig.show_l || formConfig.show_r || formConfig.show_b || formConfig.show_t)) {
        $(".lee-layout-center").css("border", "0");
        $("body").css("padding", "0");
    }
    $(".lee-layout-content").scroll(function (event) {
        var managers = $.leeUI.find($.leeUI.controls.DropDown);
        for (var i = 0, l = managers.length; i < l; i++) {
            var o = managers[i];
            if (o.selectBox.is(":visible") != null && o.selectBox.is(":visible")) {
                o._toggleSelectBox(true);
            }

        }
    });

    //$.each(pageConfig, function (key, obj) {
    //    if ($("#" + key)) {
    //        console.log("layoutid:" + key);
    //        console.log(obj);
    //        initLayout(obj);
    //    }
    //    //如果存在 则初始化Layout
    //    //判定layout中的child 如果只有一个 column那么去掉 bootstrap-grid col-12
    //    //初始化column 如果column只有一个子child（grid or toolbar） 并且fixed 那么取到tableitem包围，直接生成
    //    //初始化 内容//循环column中的内容 生成控件和绑定信息
    //});

    Page.Calc.init(expressInfo);
    Page.Model.run(modelSchema, dsSchema);//初始化模型信息
    Page.Model.setDefaultValue(defaultValue);
    Page.UI.run();

    Page.Service.setRequsetHeader("modelID", modelID);


    // 初始化tab页
    $(".tablayout").leeTab({
        onAfterSelectTabItem: function (tabid, id) {
            Page.UI.refreshColumn(id);
        }
    });
    // 重新触发计算事件
    $(".layout-main").leeUI()._onResize();


    //ui Ready
    //listener init //事件绑定
    //dataModel Ready   //取数 schema信息
    //setModel          //界面赋值绑定
    //external Module   //扩展模块
    //all ready         //界面呈现


    //get Model //获取模型数据
    //validate// 规则校验
    //dataModel Save 保存模型


});