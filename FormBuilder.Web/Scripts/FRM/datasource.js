(function ($, window) {
    function leeDataSource() {
        //this.frmid = frmid;
        this.init();
    }
    leeDataSource.prototype = {
        init: function () {
            //初始化 取出模型变量			
        },
        setData: function (data) {
            this.data = data;
        },
        setModel: function (frmid, modelid) {
            this.modelID = modelid;
            this.frmID = frmid;
        },
        getDataSource: function () {
            return this.data;
        },

        getMainTable: function () {

            return this.data.find(function (i) {
                return i.ismain == true;
            }).name;
        },
        getDataFieldBySource: function (sourceid) {
            if (!sourceid)
                return [];
            return this.data.find(function (i) {
                return i.id == sourceid;
            }).columns;
        },
        refresh: function () {
            var self = this;
            DataService.getFormDS(this.frmID, this.modelID).done(function (data) {
                if (data.res) {
                    self.setData(data.data);
                }
            });
        }
    };
    window.leeDataSourceManager = new leeDataSource();
}(jQuery, window));


//根据表单ID获取到数据模型信息