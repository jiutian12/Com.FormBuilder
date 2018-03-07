/*校验公式管理类*/
(function (win, $) {

    var RuleManger = function () {
    };

    RuleManger.prototype = {
        init: function () {
            this.ctrid = "";//初始化控件ID
            this.data = [];

            var options = [];
            $.each(RuleDict, function (i, obj) {
                options.push('<li><a href="#" data-id="' + obj.id + '">' + obj.name + '</a> </li>');
            });

            $("#checkrules_dropdown").append(options.join(""));
            this.bind();
        },
        bind: function () {
            var self = this;
            $(".setrules").on("click", "li .delete", function () {
                var id = $(this).closest("li").attr("data-id");
                self.deleteRule(id);
            });
            $(".setrules").on("click", "li .edit", function () {
                var id = $(this).closest("li").attr("data-id");
                self.editRule(id);
            });

            $(".setrules").on("click", "li .up", function () {
                var index = $(this).closest("li").index();
                self.up(index);
            });
            $(".setrules").on("click", "li .down", function () {
                var index = $(this).closest("li").index();
                self.down(index);
            });
            $("#checkrules_dropdown>li>a").bind("click", function () {
                var id = $(this).attr("data-id");
                self.addRule(id);
            });
        },
        up: function (index) {
            this.data.splice(index - 1, 0, (this.data[index]));    //删除后一项 
            this.data.splice(index + 1, 1);


            this.initList();


            this.listener.call(this, this.data);
        },
        down: function (index) {
            this.data.splice(index + 2, 0, (this.data[index]));    // 删除前一项 

            this.data.splice(index, 1);

            this.initList();

            this.listener.call(this, this.data);
        },
        setValue: function (data) {
            this.data = data;
            return this;
        },
        setOnChangeListener: function (listener) {
            this.listener = listener;
            //listenr.call(this, this.data);
        },
        getValue: function () {

        },
        initList: function () {
            var htmlarr = [];
            $.each(this.data, function (i, row) {
                htmlarr.push('<li data-id=' + row["id"] + ' >' + row["name"] + row["params"] + '<a  href="#" class="handlebar delete lee-ion-android-delete"></a><a href="#" class="handlebar edit lee-ion-edit"></a><a href="#" class="handlebar up lee-ion-arrow-up-b"></a><a href="#" class="handlebar down lee-ion-arrow-down-b"></a></li>');
            });
            if (htmlarr.length == 0) htmlarr.push("<li class='nodata'>暂无规则设置</li>");
            $(".setrules").html(htmlarr.join(""));

            return this;
        },
        addRule: function (id) {
            var name = RuleDict.find(function (i) {
                return i.id == id;
            }).name;
            RuleEditManger.show().setValue({ id: id, name: name, tips: "", params: "" }).setCallBack($.proxy(this.update, this));
        },
        editRule: function (id) {
            var model = this.getModel(id);

            RuleEditManger.show().setValue(model).setCallBack($.proxy(this.update, this));
        },
        getModel: function (id) {
            return this.data.find(function (i) {
                return i.id == id;
            });
        },
        getModelIndex: function (id) {
            return this.data.findIndex(function (i) {
                return i.id == id;
            });
        },
        deleteRule: function (id) {
            var self = this;
            $.each(this.data, function (i, row) {
                if (row["id"] == id) {
                    self.data.splice(i, 1);
                    self.initList();
                    return false;
                }
            });
            RuleEditManger.hide();
        },
        update: function (data) {
            var index = this.getModelIndex(data["id"]);
            if (index != -1) {
                this.data[index] = data;
            } else {
                this.data.push(data);
            }
            this.initList();
            this.listener.call(this, this.data);

        }
    }


    var RuleDict = [
        { id: "required", name: "必填", "desc": "", tips: "最大长度不能超过{0}" },
        { id: "maxLength", name: "最大长度", "desc": "数字最大长度 例如: 40", tips: "最大长度不能超过{0}" },
        { id: "minLength", name: "最小长度", "desc": "数字最大长度 例如: 20", tips: "最小长度不能小于{0}" },
        { id: "integer", name: "整数", "desc": "空为整数.+正整数；+0 正整数和零；-负整数；-0 负整数和零", tips: "" },
        { id: "chinese", name: "中文", "desc": "", tips: " " },
        { id: "telPhone", name: "手机", "desc": "", tips: "" },
        { id: "email", name: "邮箱", "desc": "：", tips: " " },
        { id: "website", name: "网址", "desc": "：", tips: "" },
        { id: "startWith", name: "以XX开头", "desc": "例如 Pre 那么输入必须以Pre才可以 ", tips: "" },
        { id: "endWith", name: "以XX结束", "desc": "例如 End 那么输入必须以End才结束 ：", tips: "" },
        { id: "checkExits", name: "远程校验", "desc": "表名称,验证字段名 例如 ExpertSort,Code", tips: "" },
        { id: "userfunc", name: "自定义function", "desc": "例子  </br>function(value){  </br>&nbsp;&nbsp; if(value=='') </br>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; return /^[0-9a-zA-Z]*$/.test(value) || '不允许保存空格、汉字和*、！、=、+、-等特殊字符';</br>} </br> return true 则表示成功 其他均表示失败" }
    ];
    var RuleEditManger = {
        init: function () {
            this.model = {};// 初始化数据模型
            this.bind();
        },
        bind: function () {
            var self = this;
            $("#rulebox_cancel").click(function () {
                self.hide();
                self.setValue({ id: "", name: "", tips: "", params: "" });
            });
            $("#rulebox_confirm").click(function () {
                self.confirm();
            });

        },
        show: function () {

            $(".rulebox").css("transform", " translate(0, 142px)");
            return this;
        },
        hide: function () {
            $(".rulebox").css("transform", "translate(0, -100%)");
            return this;
        },
        getCtrlData: function () {
            //
        },
        setValue: function (value) {
            this.model = value;




            $("#rule_name").html(this.model.name);
            $("#rule_tips").val(this.model.tips);
            $("#rule_params").val(this.model.params);
            if (this.model.id == "userfunc")
                $("#rule_params").val(Base64.decode(this.model.params));

            var desc = RuleDict.find(function (i) {
                return i.id == value.id;
            }).desc;
            $("#rule_description").html(desc);
            return this;
            //界面绑定
        },
        setCallBack: function (callback) {
            this.callback = callback;
            return this;
        },
        getValue: function () {
            return this.model;
        },
        clear: function () {

        },
        confirm: function () {
            // 确认关闭弹窗 并且返回模型信息

            this.model.params = $("#rule_params").val();
            this.model.tips = $("#rule_tips").val();
            if (this.model.id == "userfunc")
                this.model.params = Base64.encode($("#rule_params").val());
            this.callback.call(this, this.model);
            this.hide();
        }
    };

    window.ruleManger = new RuleManger();
    ruleManger.init();
    RuleEditManger.init();

})(window, $);