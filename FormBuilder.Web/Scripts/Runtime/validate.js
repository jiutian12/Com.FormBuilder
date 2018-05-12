
/*界面逻辑验证控制器*/
$.validator.config({
    
    rules: {
       
        telphone: [/^1[3-9]\d{9}$/, "请填写有效的手机号"],
        email: [/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, "请填写有效的邮箱"],
        website: [/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/, "请填写有效的网址"],
        chinese: [/^[\u0391-\uFFE5]+$/, "请填写中文字符"],
        userfunc: function (element, parms) {
            var value = element.value;
            var funcStr = Base64.decode(parms[0].split(",")[1])
            var applyFunc = new Function("value", "return (" + funcStr + ")(value)");
            return applyFunc(value);
        },
        checkExits: function (element, parms) {
            var arr = parms[0].split(",")
            var data = JSON.stringify({
                TableName: arr[0],
                DataID: Page.Model.getMainDataID(), // 根据表名称和字段名称获取当前界面的值
                ValidField: arr[1],
                ValidValue: element.value,
                KeyField: arr[2],
                Label: arr[3]
            });
            return $.ajax({
                url: _global.sitePath + '/CommonFB/remoteCheck',
                type: 'post',
                data: { model: data },
                dataType: 'json'
            });
        }
    }
});



$(function () {
   
    //$('#form').validator({ theme: 'yellow_top' });
    //$('#form').validator("setField", {
    //    "#input_j809xsf5p8808ghjhk": {
    //        rule: "required;checkExits(FBDataObject,3);chinese"
    //    },
    //    "#textarea_j809xu6unmzjbzw9hc": {
    //        rule: "required"
    //    },
    //    "#textarea_j809xusxn6fdqupay": {
    //        rule: "required"
    //    },
    //    "SORT_ID": {
    //        rule: "required;checkExits(test,请填写中文字符)"
    //    }
    //});
});



var Rules = {
    required: function (value, params) {
        //alert(value);
        if (value == "") {
            return { res: false, mes: params ? params : "不能为空！" };
        } else {
            return { res: true }
        }
    },
    chinese: function (value, parmams) {
        var flag = /^[\u0391-\uFFE5]+$/.test(value);
        return { res: flag, mes: params ? params : "请录入中文字符！" };
    },
    userfunc: function (value, parmams) {
        var funcStr = Base64.decode(parmams[0].split(",")[1])
        var applyFunc = new Function("value", "return (" + funcStr + ")(value)");
        var res = applyFunc(value);
        return { res: (res == true ? true : false), mes: res };
    },
    startWith: function (value, params) {
        if (!value || !params) {
            return { res: true, mes: "需要以" + params + "开始" };
        }
        if (value.substr(0, params.length) == params) {
            return { res: true };
        }
        return { res: false, mes: "需要以" + params + "开始" };
    },
    endWith: function (value, params) {
        if (!value) {
            return { res: false, mes: "需要以" + params + "结尾" };
        }
        var a = value.lastIndexOf(params);
        return { res: a != -1 && a + params.length == value.length, mes: "需要以" + params + "结尾" };
    },
    checkExits: function (value, params) {

        var arr = params[0].split(",");
        var data = JSON.stringify({
            TableName: arr[0],
            DataID: "",
            ValidField: arr[1],
            ValidValue: value,
            KeyField: arr[2],
            Label: arr[3]
        });
        return $.ajax({
            url: _global.sitePath + '/CommonFB/remoteCheck',
            type: 'post',
            data: { model: data },
            dataType: 'json'
        });
    }
};
//rRule.exec("chinese(3,3,3,\"asfasf\")")


(function (win, $) {
    var rRule = /(\w+)(?:\[\s*(.*?\]?)\s*\]|\(\s*(.*?\)?)\s*\))?/;
    var deferred = {};
    var ValidateController = function () {

    }
    ValidateController.prototype = {
        init: function () {

        },
        setRules: function (rules) {
            this.rules = rules;
            $('#form').validator({ timely: 3, theme: 'yellow_bottom' });
            $('#form').validator("setField", this.rules);
        },

        getFnFromKey: function (key) {
            var fns = [];
            if (!this.rules[key]) return;
            var rule = this.rules[key].rule.split(";");
            $.each(rule, function (i, val) {
                var ret = rRule.exec(val);
                fns.push({
                    fn:
                        new Function("value", "params", "return Rules."
                        + ret[1] + "(value,params)"),
                    params: ret[3]
                })
            });
            return fns;
        },
        // 验证子表数据
        validate: function (tablename, dataset, doneCallback) {
            var self = this;
            self.hasError = false;
            self.message = [];
            self.brekIndex = -1;
            self.validating = true;
            $.each(dataset, function (i, obj) {
                self.brekIndex = i;
                $.each(obj, function (key, val) {
                    var fns = self.getFnFromKey(tablename + "." + key);
                    if (!fns) return true; // 跳出本次循环
                    $.each(fns, function (k, fn) {
                        var params = fn.params;
                        var ret = fn.fn.call(this, val, params);
                        if (ret.res == false) {
                            self.hasError = true;
                            self.message.push({ key: key, mes: ret.mes });
                        }
                        // reponse {res:false,mes:"XXX不能为空"}
                        if (ret.then) {
                            deferred[key] = ret;

                            // waiting to parse the response data
                            ret.then(
                                function (d, textStatus, jqXHR) {
                                    var data = jqXHR.responseText;
                                    //self.hasError = true;
                                    alert(data);
                                },
                                function (jqXHR, textStatus) {
                                    var data = trim(jqXHR.responseText);
                                    //alert(data);

                                }
                            ).always(function () {
                                delete deferred[key];
                            });
                        }
                        if (self.hasError) {
                            // stop the validation
                            return false;
                        }
                    });
                    //if (self.hasError) {
                    //    // stop the validation
                    //    return false;
                    //}
                });
                if (self.hasError) {
                    // stop the validation
                    return false;
                }
            });
            //alert(JSON.stringify(deferred));
            $.when.apply(
                null,
                $.map(deferred, function (v) { return v; })
            ).done(function () {
                doneCallback.call(self, !self.hasError, self.brekIndex, self.message, tablename);
                self.validating = false;
            });
        }
    }
    win.Page.Validate = new ValidateController();
})(window, $);