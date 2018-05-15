window.Utils = window.Utils || {};
window.Utils = (function (utils, win, $) {
    utils.Express = function () {
        this.condtions = [];
    }
    utils.Express.prototype = {
        push: function (field, value, oper, logic, isExpress) {
            oper = oper || "=";
            logic = logic || "and";
            isExpress = isExpress || false;
            this.condtions.push({
                LeftBrace: "",
                ParamName: field,
                Operate: oper,
                IsExpress: isExpress,
                ExpressValue: value,
                RightBrace: "",
                Logic: logic
            });
        },
        add: function (LeftBrace, RightBrace, field, value, oper, logic) {
            oper = oper || "=";
            logic = logic || "and";
            this.condtions.push({
                LeftBrace: LeftBrace,
                ParamName: field,
                Operate: oper,
                IsExpress: false,
                ExpressValue: value,
                RightBrace: RightBrace,
                Logic: logic
            });
        },
        joinCondition: function (filterlist) {

            this.condtions = this.condtions.concat(filterlist);
        },
        serialize: function () {
            return this.condtions;
        },
        getSql: function () {
            var arr = [];
            $.each(this.condtions, function (i, row) {
                var value = row.ExpressValue;
                if (!row.IsExpress) {
                    if (row.oper == "like") {
                        value = "'%" + value + "'";
                    } else if (row.oper == "leftlike") {
                        value = "'%" + value + "%'";
                    } else if (row.oper == "rightlike") {
                        value = "'%" + value + "'";
                    } else {
                        value = "'" + value + "'";
                    }
                }
                arr.push(row.LeftBrace + row.Logic + " " + row.ParamName + " " + row.Operate + " " + value + " " + row.RightBrace);
            });
            return arr.join(" ");

        }
    };



    utils.SortCondition = function () {
        this.sorts = [];
    }
    utils.SortCondition.prototype = {
        push: function (field, order) {
            order = order || "asc";
            this.sorts.push({
                Field: field,
                Order: order
            });
        },
        serialize: function () {
            return this.sorts;
        }
    };
    return utils;
})(window.Utils, window, $)