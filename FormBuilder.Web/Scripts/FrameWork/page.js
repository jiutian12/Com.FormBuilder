window.fBulider.page = window.fBulider.page || {};

fBulider.page.UIController = function (options) {
    this.options = options;
    this.init();
    this.bind();
    this.render();
};
fBulider.page.UIController.prototype = {
    init: function () {

    },
    bind: function () {

    },
    render: function () {

    }
};
fBulider.page.ListViewController = function (options) {
    fBulider.page.ListViewController.base.constructor.call(this, options); //父构造函数
};

fBulider.page.ListViewController.leeExtend(fBulider.page.UIController, {
    init: function () {
        this.listview = this.getListDom();
        this.initTag();

        this.listview.leeListView({
            pager: true,
            temp: this.getView(),
            render: this.getRenderView,
            url: this.getApiURL(),
            method: "post",
            getParam: this.getParam
        });
        this.initExtendView();

    },
    initTag: function () {
        //初始化排序 or tag
    },
    initExtendView: function () {
    },
    getListDom: function () {
        return null;
    },
    getApiURL: function () {
        return "";
    },
    getParam: function () {
        return [];
    },
    getView: function () {
        return "<div></div>";
    },
    refresh: function () {
        this.listview.leeUI().reload();//刷新listView
    }
});

