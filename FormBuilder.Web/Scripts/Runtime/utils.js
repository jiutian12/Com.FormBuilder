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