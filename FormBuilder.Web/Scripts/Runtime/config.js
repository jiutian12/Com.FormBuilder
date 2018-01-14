/*当前运行上下文的系统参数 包括系统级参数 模块级参数 表单参数 目前只实现系统参数*/
window.Page.Config = (function (config, win, $) {
    var _globalConfig = {};

    // 表单参数
    _globalConfig["form"] = {
        qryKeyPress: false,           //查询是否绑定键盘事件
        qryLinkExclude: true,         //多棵联动树/grid是否互斥 互斥原则为是否可见
        layOutResize: true,           //上下左右布局是否允许拖拽改变大小
        layOutCalc: true,             //布局调整后是否重新计算控件布局
    }
    // 系统级参数
    config.setValue = function (config) {
        _globalConfig = config;
    }

    config.getValue = function (key) {
        return _globalConfig[key];
    }

    //模块级别参数

    // 个性化参数

    return config;

})(Page.Confige, window, $);

