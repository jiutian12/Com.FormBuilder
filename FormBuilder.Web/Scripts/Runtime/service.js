
window.Page = window.Page || {};
window.Page.Service = window.Page.Service || {};
window.Page.Service = (function (service, win, $) {


    var requestHeder = {};


    $.ajaxSetup({
        error: function (jqXHR, textStatus, errorMsg) {
            console.log('发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg);
        },
        success: function (data) {
            //console.log("请求状态成功");
        },
        beforeSend: function (XHR) {
            XHR.setRequestHeader("runtime", "1");
            $.each(requestHeder, function (key, value) {
                XHR.setRequestHeader(key, value);
            });
        }
    });
    service.defaults = {
        baseURL: _global.sitePath,
        invokeURL: ""
    };


    /*定时轮训服务*/
    service.heartBreak = function () {
    }

    /*设置请求header*/
    service.setRequsetHeader = function (key, value) {
        requestHeder[key] = value;
    }

    //请求通用的ajax封装
    service.requestApi = function (api, apiParams, tipMessage) {
        //提示 这里可以检查超时
        tipMessage && $.leeDialog.loading(tipMessage);
        var defer = $.Deferred();
        $.ajax({ url: service.defaults.baseURL + api, data: apiParams, dataType: "json" })
            .done(function (data) {
                $.leeDialog.hideLoading();
                //取消loading//如果有报错提示
                if (data.res == false) {
                    leeUI.Error(data.mes);
                }
                defer.resolve(data);
            })
            .fail(function (data) {
                $.leeDialog.hideLoading();
                defer.reject(data);
            });
        return defer.promise();
    }

    /*表单业务类请求封装*/
    //根据主键获取数据
    service.getModelByDataID = function (modelID, dataID) {
        var defer = $.Deferred();
        this.requestApi("/DataModel/getModelDataByDataID", { modelID: modelID, dataID: dataID, detail: true })
            .done(function (data) {
                defer.resolve(data);
            })
            .fail(function (data) {
                defer.reject(data);
            });
        return defer.promise();
    }




    ///获取模型数据 list
    service.getModelData = function (modelID, filter, order, keyword, isCustom) {

        var defer = $.Deferred();
        this.requestApi("/DataModel/getModelData", {
            modelID: modelID,
            filter: filter,
            order: order,
            keyword: keyword,
            isCustom: isCustom
        }).done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    }

    ///获取模型数据 list
    service.getModelTreeDataALL = function (modelID, filter, order, keyword, isCustom) {

        var defer = $.Deferred();
        this.requestApi("/DataModel/getModelTreeDataALL", {
            modelID: modelID,
            filter: filter,
            order: order,
            keyword: keyword,
            isCustom: isCustom
        }).done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();

    }




    ///获取某一个明细表的数据
    service.getModelDetail = function (modelID, objectID, dataID) {

    }


    service.saveModel = function (modelID, model, status, treeNode) {
        var defer = $.Deferred();
        this.requestApi("/DataModel/saveModel", {
            modelID: modelID,
            model: model,
            status: status,
            treeNode: treeNode
        }, "正在保存..."
        ).done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    }
    // 保存卡片数据(包含子对象)
    service.saveModelALL = function (modelID, dataID, model, status, treeNode) {
        var defer = $.Deferred();
        this.requestApi("/DataModel/saveModelALL", {
            modelID: modelID, dataID: dataID, model: model, status: status, treeNode: treeNode
        }, "正在保存...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    }

    //保存列表信息
    service.saveModelList = function (modelID, data, delData) {
        var defer = $.Deferred();
        this.requestApi("/DataModel/saveModelList", {
            modelID: modelID,
            saveData: data,
            deleteData: delData
        }, "正在保存...").done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    }





    service.deleteModel = function (modelID, dataID) {
        var defer = $.Deferred();
        this.requestApi("/DataModel/deleteModel", { modelID: modelID, dataID: dataID }, "正在删除...")
            .done(function (data) {
                defer.resolve(data);
            })
            .fail(function (data) {
                defer.reject(data);
            });
        return defer.promise();
    }


    // update 相关操作
    // 保存字典方法
    service.saveDataForDict = function (modelID, FrmID, model) {

    }


    ///保存卡片方法
    service.saveDataForCard = function (modelID, FrmID, model) {

    }

    // 列表保存多行数据
    service.saveDataForList = function (modelID, FrmID, data) {

    }




    // 帮助辅助操作服务类
    service.getQueryHelpSwitch = function (helpID, keyword, codeField, nameField, filter, isParent) {
        var defer = $.Deferred();
        this.requestApi("/DataModel/getQueryHelpSwitch", {
            helpID: helpID,
            keyword: keyword,
            codeField: codeField,
            nameField: nameField,
            filter: filter,
            isParent: isParent
        }).done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    }

    // 树列表/帮助异步加载相关接口
    service.getTreeAsyncLoadData = function (modelID, level, path, parentID, keyword, filter, sort, isCustom) {
        var defer = $.Deferred();
        this.requestApi("/DataModel/getModelTreeData", {
            modelID: modelID,
            level: level,
            path: path,
            parentID: parentID,
            keyword: keyword,
            filter: filter,
            isCustom: isCustom,
            sort: sort
        }).done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    }

    /*获取文件列表*/
    service.getFileList = function (frmID, dataID) {
        var defer = $.Deferred();
        this.requestApi("/File/GetFileList", { frmID: frmID, dataID: dataID }, "加载附件...")
            .done(function (data) {
                defer.resolve(data);
            })
            .fail(function (data) {
                defer.reject(data);
            });
        return defer.promise();
    }

    ///执行数据库服务脚本
    service.execService = function (dsID, data) {

        var defer = $.Deferred();
        this.requestApi("/DataModel/callCustomService", {
            dsID: dsID,
            frmID: "",
            data: JSON.stringify(data)
        }).done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();

    }



    /// 调用构件方法
    service.invokeMethod = function (id, name, args) {

        var defer = $.Deferred();
        this.requestApi("/CMP/InvokeMethod", {
            componentID: id,
            methodName: name,
            paraArr: args
        }).done(function (data) {
            defer.resolve(data);
        }).fail(function (data) {
            defer.reject(data);
        });
        return defer.promise();
    }


    return service;
})(Page.Service, window, $);