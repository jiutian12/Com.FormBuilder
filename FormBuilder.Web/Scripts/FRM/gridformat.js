/*单元格格式化操作类*/

(function (win, $) {

    var gridFormat = function () { }

    gridFormat.prototype = {
        init: function () {
            this.initUI();
            this.bind();
            this.bindEnum();
            this.refreshUI();

            $(".titleinfo").LeeToolTip({ html: true });
        },
        getQuery: function (key) {
            var search = location.search.slice(1); //得到get方式提交的查询字符串
            var arr = search.split("&");
            for (var i = 0; i < arr.length; i++) {
                var ar = arr[i].split("=");
                if (ar[0] == key) {
                    if (unescape(ar[1]) == 'undefined') {
                        return "";
                    } else {
                        return unescape(ar[1]);
                    }
                }
            }
            return "";
        },
        isInputModel: function () {
            var isinput = this.getQuery("isinput");
            return isinput ? true : false;
        },
        refreshUI: function () {
            if (this.isInputModel()) {
                $("[data-toogle='enum']").hide();
                $("[data-toogle='number']").hide();
                $("[data-toogle='date']").hide();
                $("[data-toogle='none']").click();
            }
        },
        initUI: function () {
            var self = this;
            $("#formatType").leeRadioList({
                data: [],
                value: "0",
                onSelect: function (obj) {
                    self.toggleWrap(obj.value);
                }
            });
            var data = [
                { text: "标准", id: "0" },
                { text: "自定义代码", id: "1" },
                { text: "无格式", id: "2" }];
            if (this.isInputModel()) {
                data = [
                    { text: "标准", id: "0" },
                    { text: "无格式", id: "2" }
                ]


            }
            $("#formatType").leeRadioList().setData(data);

            $("#txt_date_mask").leeTextBox();



            $("#txt_number_decimal").leeSpinner({ maxValue: 8, minValue: 0 });
            $("#txt_number_isthousand").leeCheckBox({});


            $("#chk_islink").leeCheckBox({});
            $("#chk_islink").change(function () {

                self.toogleLink($("#chk_islink").leeUI().getValue());
            })

            // 初始化代码编辑器
            this.editor = ace.edit("editor");
            this.editor.session.setMode("ace/mode/javascript");
            this.editor1 = ace.edit("editor1");
            this.editor1.session.setMode("ace/mode/javascript");
            this.editor2 = ace.edit("editor2");
            this.editor2.session.setMode("ace/mode/javascript");



        },
        bind: function () {
            var self = this;
            $(".options li").click(function () {
                if ($(this).hasClass("active")) return;
                $(".options li.active").removeClass("active");
                $(this).addClass("active");
                var dataToogle = $(this).attr("data-toogle");
                self.toggleDetail(dataToogle);
            })
        },
        toogleLink: function (value) {
            if (value) {
                $(".linktr").show();
            } else {
                $(".linktr").hide();
            }
        },
        toggleDetail: function (dataToogle) {
            $(".options li.active").removeClass("active");
            $(".options li[data-toogle='" + dataToogle + "']").addClass("active");
            $(".contentinfo.active").removeClass("active");
            $("." + dataToogle).addClass("active");
        },
        toggleWrap: function (value) {
            if (value == "0") {
                $(".render_format").show();
                $(".render_code").hide();
                $(".render_none").hide();

            } else if (value == "1") {
                $(".render_format").hide();
                $(".render_code").show();
                $(".render_none").hide();
            } else if (value == "2") {
                $(".render_format").hide();
                $(".render_code").hide();
                $(".render_none").show();
            }
        },
        setValue: function (value) {
            this.data = value;
            if (!this.data) return;
            $("#formatType").leeUI().setValue(this.data.type);
            if (this.data.type != undefined)
                this.toggleWrap(this.data.type);

            var custom = this.data.custom;
            if (custom) {
                if (custom.type == "number") {
                    $("#txt_number_decimal").leeUI().setValue(custom.decimal)
                    $("#txt_number_isthousand").leeUI().setValue(custom.isthousand)
                } else if (custom.type == "date") {
                    $("#txt_date_mask").val(custom.mask);

                } else if (custom.type == "enum") {
                    this.setEnum(custom.enum);
                }
                this.toggleDetail(custom.type);

                $("#chk_islink").leeUI().setValue(custom.islink);
                this.toogleLink(this.data.custom.islink);
                this.editor1.setValue(custom.linkclick);
                this.editor2.setValue(custom.linkhover);
            }
            if (this.data.render)
                this.editor.setValue(this.data.render);

            //根据json结构给当前赋值

        },
        getValue: function () {
            // 获取当前的选中值
            this.data = this.data || {};
            this.data.type = $("#formatType").leeUI().getValue();
            if (this.data.type == "1") {
                this.data.render = this.editor.getValue();
            } else if (this.data.type == "0") {
                this.data.custom = this.data.custom || {};

                var custom = this.data.custom.type = $(".options li.active").attr("data-toogle");

                if (custom == "number") {
                    this.data.custom.decimal = $("#txt_number_decimal").leeUI().getValue()
                    this.data.custom.isthousand = $("#txt_number_isthousand").leeUI().getValue()
                } else if (custom == "date") {
                    this.data.custom.mask = $("#txt_date_mask").val();

                } else if (custom == "enum") {
                    this.data.custom.enum = this.getEnum();
                }

                this.data.custom.islink = $("#chk_islink").leeUI().getValue();


                this.data.custom.linkclick = this.editor1.getValue();
                this.data.custom.linkhover = this.editor2.getValue();

            }
            return this.data;
        },
        bindEnum: function () {
            var self = this;
            $(".grid").on("click", ".item1 .add", function () {
                self.addEnum();
            });
            $(".grid").on("click", ".item .remove", function (e) {
                self.removeEnum(e);
            });

            $(".grid").on("click", ".item .open", function (e) {
                self.openIconSet(e);
            });
        },
        initEnum: function () {

        },
        addEnum: function () {
            //增加一行枚举
            var htmlarr =
                 '<div class="item">'
               + '  <i href="#" class="handle lee-ion-minus-round remove" style="font-size:14px;"></i>'
               + '  <input type="text" class="input" data-bind="id" placeholder="值" style="margin-left:4px;" />'
               + '  <input type="text" class="input" data-bind="text" placeholder="显示" />'
               + '  <input type="hidden" class="input" data-bind="icon" />'
               + '  <button class="lee-btn lee-btn-primary open">选择图片</button>'
               + '  <span class="iconinfo"></span>'
               + ' </div>';
            $(".grid").append($(htmlarr));

        },
        removeEnum: function (e) {
            // 删除一行记录
            $(e.target).closest(".item").remove();
        },
        openIconSet: function (e) {
            //打开图标配置

            var self = this;
            var dialog = $.leeDialog.open({
                title: '选择图标',
                name: 'winselector',
                isHidden: false,
                showMax: true,
                width: "900",
                slide: false,
                height: "380",
                url: _global.sitePath + "/Common/icons",
                buttons: [{
                    text: '确定',
                    cls: 'lee-btn-primary lee-dialog-btn-ok',
                    onclick: function (item, dialog) {
                        var selected = window.frames["winselector"].getSelectIcon();
                        if (selected) {
                            //self.setWrap(selected);
                            //$("#txtIcon").val(selected);
                            var renderWrap = $(e.target).siblings("span");
                            renderWrap.html(self.getIcon(selected));
                            $(e.target).siblings("input[data-bind='icon']").val(selected);

                            dialog.close();
                        } else {
                            leeUI.Error("请选中图标");
                        }
                    }
                },
                    {
                        text: '取消',
                        cls: 'lee-dialog-btn-cancel ',
                        onclick: function (item, dialog) {
                            dialog.close();
                        }
                    }
                ]
            })
        },
        getEnum: function () {
            // 获取table上的数据

            var $items = $(".grid .item");
            var arr = [];
            $.each($items, function (i, ele) {
                var id = $(ele).find("input[data-bind='id']").val();
                var icon = $(ele).find("input[data-bind='icon']").val();
                var text = $(ele).find("input[data-bind='text']").val();
                arr.push({ id: id, text: text, icon: icon });
            });

            return arr;
        },
        setEnum: function (data) {
            //循环生成布局

            //如果没有默认插入一行

            for (var item in data) {
                var htmlarr =
                     '<div class="item">'
                   + '  <i href="#" class="handle lee-ion-minus-round remove" style="font-size:14px;"></i>'
                   + '  <input type="text" value="' + data[item]["id"] + '" class="input" data-bind="id" placeholder="值" style="margin-left:4px;" />'
                   + '  <input type="text" value="' + data[item]["text"] + '" class="input" data-bind="text" placeholder="显示" />'
                   + '  <input type="hidden" value="' + data[item]["icon"] + '" class="input" data-bind="icon" />'
                   + '  <button class="lee-btn lee-btn-primary open">选择图片</button>'
                   + '  <span class="iconinfo">' + this.getIcon(data[item]["icon"]) + '</span>'
                   + ' </div>';
                $(".grid").append($(htmlarr));
            }
            if (data.length == 0) {
                this.addEnum();
            }

        },
        getIcon: function (icon) {
            var html = "";
            if (icon.indexOf("lee-ion") != -1) {
                html = '<i style="font-size:18px;" class="' + icon + '"></i>';
            }
            else {
                html = '<i style="font-size:18px;height:16px;width:16px;display:inline-block;margin: 0 auto;position: absolute;top: 5px; " class="' + icon + '"></i>';
            }
            return html;
        }
    }

    window.GridFormatMgr = new gridFormat();
})(window, $);

$(function () {
    GridFormatMgr.init();
});