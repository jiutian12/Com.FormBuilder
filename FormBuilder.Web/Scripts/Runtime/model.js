window.Page.Model = (function (model, win, $) {
    //model.schema = {};
    model.ID = "";
    model.pkCol = "";//主键名称
    model.mainTable = { //主表信息缓存
        id: "",
        name: "",
        code: ""
    };
    var defaultInstance = {};//当前界面绑定模型数据 卡片 字典使用
    var listInstance = {};//当前界面列表数据 供字典和列表使用
    var defaultValue = {};
    var defalutCol = {};
    // 获取当前主表的主键值方法
    model.getMainDataID = function () {

        var index = this.getModelObjectIndex(model.mainTableName);
        if (index != -1)
            return defaultInstance[index].data[0][model.pkCol];
        else
            return "";
    }

    model.getMainObjectValue = function (col) {
        var index = this.getModelObjectIndex(model.mainTableName);
        if (index != -1)
            return defaultInstance[index].data[0][col];
        else
            return "";
    }

    model.setDefaultValue = function (data) {
        defaultValue = {};
        for (var i = 0; i < data.length; i++) {
            var tableName = data[i]["code"];
            for (var j = 0; j < data[i]["columns"].length; j++) {
                var columnName = data[i]["columns"][j]["label"];//标签名称
                defaultValue[tableName + "." + columnName] = data[i]["columns"][j]["defval"];
                defalutCol[tableName + "." + columnName] = data[i]["columns"][j];
                // 处理bit 和 日期 还有interger decimal的默认值类型;

            }
        }
    }
    model.dealDefautlDatatypeValue = function (tableName, col, value) {
        var dataType = defalutCol[tableName + "." + col].dataType;
        if (dataType == "6") { //bit bool类型
            if (value) {
                value = value == "1" ? true : false;
            } else {
                value = null;
            }
        }
        if (dataType == "1") {
            if (value) {
                value = parseInt(value);
            } else {
                value = null;
            }
        }
        if (dataType == "2") {
            if (value) {
                value = parseFloat(value);
            } else {
                value = null;
            }
        }

        return value;
    }
    model.getDefaultValue = function () {
        return defaultValue;
    }
    model.getDefaultValueExpress = function (table, col) {
        var express = defaultValue[table + "." + col];

        if (express) {
            var res = Page.ExpressParser.parser(express);
            res = model.dealDefautlDatatypeValue(table, col, res);
            return res;
        }
        return null;
    }
    //获取数据对象的默认值信息
    model.getDefaultDataRow = function (table, isTree, rowdata, isSame) {

        var obj = {};

        for (var item in this.mainobject.cols) {
            var key = this.mainobject.cols[item]["label"];
            obj[key] = "";
            if (key == model.pkCol) {
                obj[key] = Guid.NewGuid().ToString();//声明主键
            } else {
                if (!table) table = model.mainTableName;
                // 处理默认值
                var defalvalue = this.getDefaultValueExpress(table, key);
                obj[key] = defalvalue ? defalvalue : "";
            }
        }
        if (isTree)
            obj = model.getTreeDataRow(obj, rowdata, isSame);



        var timeInfo = model.getTimeInfo(model.mainTable.id);
        if (timeInfo) {
            obj[timeInfo.lastModifyUser] = Page.Context.get("UserName");
            obj[timeInfo.lastModifyTime] = Page.Context.getNow();
            obj[timeInfo.createUser] = Page.Context.get("UserName");
            obj[timeInfo.createTime] = Page.Context.getNow();
        }
        //这里要处理模型的默认值信息

        //树形结构需获取分级码信息 根据上级的内容

        //parentid level 好生成  分级码如何生成不重复的？这个可以在服务器端进行处理 (保存的时候)

        return obj;
    }
    var curentTreeObj = {
    };
    model.getCurrentTreeObj = function () {
        return curentTreeObj;
    }
    model.getTreeDataRow = function (obj, rowdata, isSame) {
        var treeInfo = model.getTreeInfo(model.mainTable.id);
        if (!rowdata) {
            obj[treeInfo.level] = treeInfo.rootlevel ? treeInfo.rootlevel : "1";
            obj[treeInfo.parentid] = treeInfo.rootvalue ? treeInfo.rootvalue : "-1";
            obj[treeInfo.isdetail] = "1";
            obj[treeInfo.ischild] = "1";
            obj[treeInfo.grade] = "0001";
        }
        curentTreeObj = {};
        if (treeInfo.grade && treeInfo.level && rowdata) {
            // 分级码
            curentTreeObj.grade = rowdata[treeInfo.grade];
            curentTreeObj.level = rowdata[treeInfo.level];
            if (isSame) {

                obj[treeInfo.level] = rowdata[treeInfo.level];
            } else {
                obj[treeInfo.level] = String(parseInt(rowdata[treeInfo.level]) + 1);
            }
            obj[treeInfo.isdetail] = "1";
        }


        if (treeInfo.parentid && treeInfo.id && rowdata) {

            if (isSame) {
                obj[treeInfo.parentid] = rowdata[treeInfo.parentid];
            } else {
                obj[treeInfo.parentid] = rowdata[treeInfo.id];
            }
            obj[treeInfo.ischild] = "1";
            curentTreeObj.id = rowdata[treeInfo.id];
            curentTreeObj.parentid = rowdata[treeInfo.parentid];

        }
        if (rowdata) {
            curentTreeObj.dataid = rowdata[model.pkCol];
        }
        return obj;
    }
    model.getDefaultGridRow = function (bindtable, dataid) {
        var obj = {};
        var detailObject = this.getDetailObject(bindtable);
        for (var item in detailObject.cols) {
            var key = detailObject.cols[item]["label"];
            obj[key] = "";
            if (detailObject.cols[item].pkcol) {
                obj[key] = Guid.NewGuid().ToString();//声明主键
            }
            else if (key == detailObject.condition) { //如果是关联建
                obj[key] = dataid;
            }
            else {
                var table = detailObject.tableName;
                var defalvalue = this.getDefaultValueExpress(table, key);
                obj[key] = defalvalue ? defalvalue : "";
            }
        }
        return obj;

    }
    model.getSchemaNullValue = function (table, col) {
        // 根据数据库字段获取默认值 string datetime number
    }


    model.run = function (schema, dsSchema) {
        //初始化数据模型信息
        model.schema = schema;
        model.dsSchema = dsSchema;
        model.ID = modelID;
        model.setCache();

    }
    var hashSchema = {};


    model.getTreeInfo = function (sourceid, isCustom) {
        if (isCustom) {
            for (var i = 0; i < model.dsSchema.length; i++) {
                if (model.dsSchema[i]["ID"] == sourceid) {
                    return model.dsSchema[i].treeInfo;
                }
            }
        }
        var index = hashSchema[sourceid];
        if (index) {
            return model.schema[index].treeInfo;
        } else {
            index = hashSchema[this.mainTable.id];
            return model.schema[index].treeInfo;
        }



    }

    model.getTimeInfo = function (sourceid) {
        var index = hashSchema[sourceid];
        if (index) {
            return model.schema[index].timeInfo;
        } else {
            index = hashSchema[this.mainTable.id];
            return model.schema[index].timeInfo;
        }
    }
    // 处理模型缓存
    model.setCache = function () {
        var main = this.getMainObject();
        model.mainobject = main;
        model.pkCol = main.pkCol;

        model.mainTableName = main.tableName;//主表名称

        model.mainTable = {
            id: main.ID,
            name: main.tableName,
            code: main.tableName
        }
        //初始化空的modelSchema
        var instanceArr = [];
        $.each(model.schema, function (i, obj) {
            hashSchema[obj.ID] = i;
            hashSchema[obj.tableName] = i;
            instanceArr.push({
                id: obj.ID,
                code: obj.tableName,
                data: []
            });

        });


        model.setModel(instanceArr);
    }


    model.getMainObject = function () {
        var res;
        $.each(model.schema, function (i, obj) {
            if (obj.isMain) {
                res = obj;
            }
        });
        return res;
    }

    model.getDetailObject = function (sourceid) {
        var res;
        $.each(model.schema, function (i, obj) {
            if (obj.ID == sourceid || obj.tableName == sourceid) {
                res = obj;
            }
        });
        return res;
    }
    model.isMainSource = function (sourceid) {
        if (this.mainTable.id == sourceid || this.mainTable.code == sourceid)
            return true;
        return false;
        //return this.mainTable.id == sourceid ? true : false;
    }
    model.isDetailSoucre = function (sourceid) {
        var res = false;
        $.each(model.schema, function (i, obj) {
            if (!obj.isMain && (obj.ID == sourceid || obj.tableName == sourceid)) {
                res = true;
            }
        });
        return res;
    }
    model.isDataModelSource = function (sourceid) {
        var res = false;
        $.each(model.schema, function (i, obj) {
            if (obj.ID == sourceid) {
                res = true;
            }
        });
        return res;
    };
    //数据模型的get set
    model.setModel = function (model) {
        defaultInstance = model;
    }
    model.getModel = function () {
        return defaultInstance;
    }
    model.setNewDataID = function (value) {
        var index = this.getModelObjectIndex(model.mainTableName);
        if (index != -1)
            defaultInstance[index].data[0][model.pkCol] = value;
    }

    model.setMainModelObject = function (key, value) {
        if (key == model.pkCol) return;
        var index = this.getModelObjectIndex(model.mainTableName);
        if (index != -1)
            defaultInstance[index].data[0][key] = value;
    }

    model.clearTimeStamp = function () {

        var index = this.getModelObjectIndex(model.mainTableName);
        if (index != -1) {
            var timeInfo = model.getTimeInfo(model.mainTable.id);
            if (timeInfo) {
                defaultInstance[index].data[0][timeInfo.lastModifyUser] = "";
                defaultInstance[index].data[0][timeInfo.lastModifyTime] = "";
                defaultInstance[index].data[0][timeInfo.createUser] = "";
                defaultInstance[index].data[0][timeInfo.createTime] = "";
            }
        }
    }
    //timeinfo
    model.setMainModel = function (data) {
        var index = this.getModelObjectIndex(model.mainTableName);
        if (index != -1)
            defaultInstance[index].data = data;
    }

    model.clearDetailModel = function () {
        var index = this.getModelObjectIndex(model.mainTableName);
        if (index != -1) {
            for (var i = 0; i < defaultInstance.length; i++) {
                if (i !== index) {
                    defaultInstance[i].data = [];
                }
            }
        }
    }
    // 整体给子对象赋值
    model.setModelObject = function (bindtable, data) {
        var index = this.getModelObjectIndex(bindtable);
        if (index != -1)
            defaultInstance[index].data = data;
    }
    var mainindex = -1;
    model.getMainIndex = function () {

        mainindex = model.getModelObjectIndex(model.mainTable.id);
        return mainindex;
    }

    model.getModelObjectIndex = function (bindtable) {
        var index = -1;
        for (var item in defaultInstance) {
            if (defaultInstance[item]["id"] == bindtable ||
                defaultInstance[item]["code"] == bindtable) {
                index = item;
                break;
            }
        }
        return Number(index);
    }
    model.setDetailModel = function (table, rowindex, key, value) {
        var index = this.getModelObjectIndex(table);
        if (index != -1)
            defaultInstance[index].data[rowindex][key] = value;
        // 触发模型值改变事件 主要是为了刷新计算公式
        // 如果是UI改变则不刷新自己
        // 
    }
    model.setDetailData = function (table, data) {
        var index = this.getModelObjectIndex(table);
        if (index != -1)
            defaultInstance[index].data = data;
    }
    // 添加行
    model.addDetailRow = function (table, row) {

    }



    // 删除行
    model.deleteDetailRow = function (table, row) {
        var detailObject = this.getDetailObject(table);
        var detailPkCol = detailObject.pkCol;
        var index = this.getModelObjectIndex(table);
        var data = defaultInstance[index].data;
        for (var i = 0; i < data.length; i++) {
            if (data[i][detailPkCol] == row[detailPkCol]) {
                data.splice(i, 1);
                break;
            }
        }

    }
    model.onChange = function (table, rowindex, key, value, isRfresh, source) {
        // 计算依赖表达式赋值

        // 给UI界面赋值 判断是否主表 然后进行赋值
    }

    model.getSaveData = function () {

        var mainObject = {};
        for (var item in defaultInstance) {
            mainObject[defaultInstance[item].code] = defaultInstance[item].data;
        }

        //mainObject[model.mainTable.code] = [];
        //mainObject[model.mainTable.code].push(defaultInstance[0].data[0]);

        return mainObject;
        //循环子对象 添加saveData

    }


    model.setList = function (list) {
        listInstance = list;
    }
    model.getList = function () {
        return listInstance;
    }

    return model;
})(Page.Model, window, $);