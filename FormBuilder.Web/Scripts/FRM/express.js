/* 表达式管理 */

(function ($, window) {
    var ExpressManger = function () {

    }
    var expressData = [
        // session
        {
            type: "Session", data: [
                { id: "root", text: "系统变量" },
                { id: "{Session.UserID}", exp: "{Session.UserID}", text: "用户ID", pid: "root" },
                { id: "{Session.UserCode}", exp: "{Session.UserCode}", text: "用户账号", pid: "root" },
                { id: "{Session.UserName}", exp: "{Session.UserName}", text: "用户姓名", pid: "root" },
                { id: "{Session.LoginDate}", exp: "{Session.LoginDate}", text: "登陆日期", pid: "root" }
            ]
        },

        // 模型
        {
            type: "Model", data: [

            ]
        },
        {
            type: "Func", data: [
                 { id: "grid", text: "表格函数" },
                 { id: "{Sum:(TableName.FieldName)}", exp: "{Sum:(TableName.FieldName)}", text: "合计明细表", pid: "grid" },
                 { id: "{Sum:(GridID.FieldName)}", exp: "{Sum:(GridID.FieldName)}", text: "合计grid字段", pid: "grid" }
            ]
        }
    ];
    ExpressManger.prototype = {
        init: function () {
            $("#layout1").leeLayout({ leftWidth: 230 });
            $(".tabinfo").leeTab({ contextmenu: false, showSwitch: false });

            $("#treeSession").leeTree({
                data: expressData[0].data,
                parentIDFieldName: "pid",
                onDblclick: $.proxy(this.onDblclick, this)
            })

            $("#treeModel").leeTree({
                data: expressData[1].data,
                parentIDFieldName: "pid",
                onDblclick: $.proxy(this.onDblclick, this)
            })
            $("#treeFunc").leeTree({
                data: expressData[2].data,
                parentIDFieldName: "pid",
                onDblclick: $.proxy(this.onDblclick, this)
            });
            this.initEditor();
        },
        onDblclick: function (node) {
            //alert(node.data);
            var exp = node.data.exp;

            this.editor.insert(exp);
        },
        initEditor: function () {
            this.editor = ace.edit("editor");

            //this.editor.setTheme("ace/theme/twilight");
            this.editor.session.setMode("ace/mode/javascript");

            this.editor.renderer.setShowGutter(false);
        },
        getValue: function () {
            return this.editor.getValue();
        },
        setValue: function (val) {
            this.editor.setValue(val);
        },
        setModel: function (data) {
            var arr = [];
            for (var item in data) {

                arr.push({ id: data[item]["ID"], text: data[item]["tableName"], pid: "" });
                $.each(data[item].cols, function (i, obj) {
                    arr.push({
                        id: obj["id"],
                        text: obj["name"] + "[" + obj["label"] + "]",
                        exp: "{Data:" + data[item]["tableName"] + "." + obj["label"] + "}",
                        pid: data[item]["ID"]
                    });
                });
            }
            console.log(arr);
            expressData[1].data = arr;
        }
    };


    window.expressManger = new ExpressManger();

}).call(this, $, window);


