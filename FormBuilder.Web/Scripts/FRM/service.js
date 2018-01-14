function Service() {

}
Service.prototype = {
    getForm: function (frmid) {
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/Form/GetModel", { dataid: frmid }, "正在加载...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();

    },
    saveForm: function (model) {
        //保存表单信息
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/Form/SaveData", { model: model }, "正在保存...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    },
    publicForm: function (model, list) {
        //保存表单信息
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/Form/publicPage", { model: model }, "正在发布...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    },
    getFormDS: function (frmID, modelID) {
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/Form/getFormDS", { frmID: frmID, modelID: modelID }, "正在加载字段...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    },
    getToolBar: function (frmID) {
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/Form/getToolBarRoot", { dataID: frmID }, "正在加载工具条设置...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    },
    getModel: function (modleid) {

    },
    getModelField: function (modelid, objectid) {
        //获取具体的字段信息
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/DataModel/GetObjectColList", { modelid: modelid, objectid: objectid }, "正在加载字段...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();

    },
    getHelpFiled: function (helpid) {
        //获取帮助的字段信息
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/SmartHelp/getSmartHelpCols", { helpid: helpid }, "正在加载字段...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();

    },
    getModelSchema: function (modelID) {
        //获取具体的字段信息
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/DataModel/getModelSchema", { modelid: modelID }, "正在加载...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();

    },
    saveDefaultValue: function (data, formID) {
        //获取具体的字段信息
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/Form/saveDefaultValue", { data: data, formID: formID }, "保存默认值...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();

    },
    saveFormRef: function (data, formID) {
        //获取具体的字段信息
        var defer = $.Deferred();
        fBulider.core.dataService.requestApi("/Form/saveFormRef", { model: data, formID: formID }, "保存默认值...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();

    }
}
var DataService = new Service();
