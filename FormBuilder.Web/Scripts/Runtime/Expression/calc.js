window.Page.Calc = (function (parser, model, ui, win, $) {

    var CalcManger = function () {

    }

    var HashExpData = {
        //"input_j8n3pm7z0d9rqe15um": { exp: "'{Data:PurCat.CODE}'+'{Data:PurCat.NAME}'" }
    };
    var HashExpMap = {
        //"PurCat.CODE": [
        //    { ctrlid: "input_j8n3pm7z0d9rqe15um" }
        //],
        //"PurCat.NAME": [
        //    { ctrlid: "input_j8n3pm7z0d9rqe15um" }
        //]
    };



    CalcManger.prototype = {
        init: function (data) {
            $.each(data, function (key, obj) {
                var dep = obj.dep;
                $.each(dep, function (i, value) {
                    HashExpMap[value] = HashExpMap[value] || [];
                    HashExpMap[value].push({
                        ctrlid: key
                    });
                });
            });
            HashExpData = data;
        },

        triggerGrid: function () {
            // 界面触发时机
            // 新增行 删除行 触发所有字段
            // 单元格值改变
            // 帮助回弹 多选
        },
        getMainValue: function (field) {
            return model.getMainObjectValue(field);
        },
        getGridValue: function (rowdata, index, table, column) {
            return rowdata[column];
            //
        },
        trigger: function (table, field, gridid, index, rowdata) {
            var self = this;

            if (!HashExpMap[table + "." + field]) return;
            if (!gridid) {
                // 先处理主表内容
                var arr = HashExpMap[table + "." + field];
                for (var item in arr) {
                    var exp = HashExpData[arr[item].ctrlid].express;// 提前编译好？
                    exp = parser.parser(exp);
                    var result = eval(exp);
                    $("#" + arr[item].ctrlid).leeUI().setValue(result); //循环触发？
                }
            } else {
                var arr = HashExpMap[table + "." + field];

                for (var item in arr) {
                    var exp = HashExpData[arr[item].ctrlid].express;// 提前编译好？
                    exp = parser.parser(exp);
                    var result = eval(exp);
                    var field = HashExpData[arr[item].ctrlid].field;
                    $("#" + gridid).leeUI().updateCell(field, result, index);
                    //alert(result);
                }
            }
        }
    };


    return new CalcManger();
})(Page.ExpressParser, Page.Model, Page.UI, window, $);