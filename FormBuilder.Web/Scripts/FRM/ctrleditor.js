
//属性编辑器管理类 控件的个性化编辑属性
var EditorFactory = (function () {
    var cache = {};
    var cachefunc = {};
    return {
        factory: function (key) {
            if (!cachefunc[key]) return null;
            cache[key] || this.register(key, cachefunc[key]);
            return cache[key];
        },
        add: function (key, func) {
            cachefunc[key] = func;
        },
        register: function (key, instance) {
            //alert("用的时候在加载");
            cache[key] = new instance();
            cache[key].init(key); //绑定事件
        }
    }
})();

(function ($, window) {
    var ControlEditor = function () {

    }
    ControlEditor.prototype = {
        init: function (type) {
            //初始化布局
            this.type = type;
            this.bind();
            this.initUI();
        },
        setID: function (id, gid) {
            this.id = id;
            this.gridid = gid;
        },
        show: function () {
            $(".ed_warp").hide();
            $("#ed_" + this.type + "_warp").show();
        },
        hide: function () {
            //隐藏布局
            $("#ed_" + this.type + "_warp").hide();
        },
        initUI: function () {

        },
        bind: function () {

        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            this.editor = editor;
        },
        getValue: function () {
            return this.editor;
        },
        onPropChanged: function () {
            //通知父组件
        }
    }

    function HelpEditor() {

    }
    HelpEditor.leeExtend(ControlEditor, {
        initUI: function () {
            var self = this;
            var column = [
                { display: '帮助ID', name: 'ID', align: 'center', width: 200 },
                { display: '帮助编号', name: 'Code', align: 'left', width: 100 },
				{ display: '帮助名称', name: 'Name', align: 'left', width: 140 }
            ];
            var $injector = new $.leeUI.PopUp.LookupInjector({
                textfield: "Name",
                valuefield: "ID",
                filter: true,
                url: _global.sitePath + "/SmartHelp/getPageList",
                title: "请选择帮助字典",
                method: "post",
                column: column
            });

            $("#ed_help_helpdict").leePopup({
                onButtonClick: $.leeUI.PopUp.Lookup($injector),
                onValuechange: function (row) {
                    self.onPropChanged();

                    self.refreshOptions(row["ID"] || "");     //帮助值改变后 刷新绑定数据
                    self.editor.bindfield = "";
                    self.editor.fieldmap = "";
                    $("#ed_help_bindfield,#ed_help_codefield").leeUI().setValue("");
                    //$("#ed_help_filter").leeUI().setValue("");
                    //self.editor.filter = "";

                }
            });
            $("#ed_help_bindfield,#ed_help_codefield").leeDropDown({
                data: [],
                onselected: function () {
                    self.onPropChanged();
                }
            });

            var $injector2 = new $.leeUI.PopUp.FilterEditorInjector({
                width: 800, height: 350, getValue: function () {
                    return $("#ed_help_filter").leeUI().getValue();
                }, getFields: function () {

                    var defer = $.Deferred();
                    self.getDataModelFields(self.editor.helpdict, function (data) {
                        if (data) {
                            defer.resolve(data);
                        }
                    });
                    return defer.promise();
                    //var data = CardManager.grid.getData();
                    //console.log(data);
                    //var arr = [];
                    //$.each(data, function (i, obj) {
                    //    arr.push({ id: obj.Code, text: obj.Name });
                    //});
                    //return arr;
                },
                onConfirm: function () {

                    self.onPropChanged();
                }
            });
            $("#ed_help_filter").leePopup({
                onButtonClick: $.leeUI.PopUp.Lookup($injector2),
                onValuechange: function (row) {
                    self.onPropChanged();

                }
            });

        },
        bind: function () {
            var self = this;
            var ctrlboxs = [
                "#ed_help_dialogheight",
                "#ed_help_dialogwidth",
                "#ed_help_dialogtitle",
                "#ed_help_childonly",
                "#ed_help_nameswitch",
                "#ed_help_ismul",
                "#ed_help_ismulgrid",
                "#ed_help_async"
            ];
            $(ctrlboxs.join(",")).change(function () {
                self.onPropChanged();
            });

            $("#ed_help_fieldmap").click(function () {
                var data = self.editor.fieldmap || [];

                var $injector = {
                    setData: function (data) {
                        self.editor.fieldmap = data;
                    },
                    getData: function () {
                        return data;
                    },
                    getHFields: function () {
                        //self.editor.helpdict 根据帮助获取数据
                        //alert(self.editor.helpdict);
                        if (!self.editor.helpdict) {
                            alert("请选择帮助字典！");
                            return false;
                        }
                        return self.cache[self.editor.helpdict];
                    },
                    getFFields: function () {
                        //获取当前模型的绑定字段
                        //alert(self.ctrobj.bindtable);

                        if (self.gridid) {
                            return leeDataSourceManager.getDataFieldBySource(leeManger.controls[self.gridid].bindtable);
                        }
                        return leeDataSourceManager.getDataFieldBySource(self.ctrobj.bindtable);
                    }
                };
                HelpMapEditor($injector).show();
            });

        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            HelpEditor.base.setValue.call(this, editor);
            $("#ed_help_helpdict").leeUI().setValue(editor.helpdict);
            $("#ed_help_helpdict").leeUI().setText(editor.helpdicttext);
            $("#ed_help_bindfield").leeUI().setValue(editor.bindfield);
            $("#ed_help_codefield").leeUI().setValue(editor.codefield);
            $("#ed_help_filter").leeUI().setValue(editor.filter, editor.filter);

            $("#ed_help_dialogheight").val(editor.dialogheight);
            $("#ed_help_dialogwidth").val(editor.dialogwidth);
            $("#ed_help_dialogtitle").val(editor.dialogtitle);
            $("#ed_help_nameswitch").prop("checked", editor.nameswitch);
            $("#ed_help_ismul").prop("checked", editor.ismul);
            $("#ed_help_childonly").prop("checked", editor.childonly);


            $("#ed_help_ismulgrid").prop("checked", editor.ismulgrid);

            $("#ed_help_async").prop("checked", editor.async);


            this.refreshOptions(editor.helpdict || "");
        },
        onPropChanged: function () {

            this.editor.helpdicttext = $("#ed_help_helpdict").leeUI().getText();
            this.editor.helpdict = $("#ed_help_helpdict").leeUI().getValue();
            this.editor.bindfield = $("#ed_help_bindfield").leeUI().getValue();
            this.editor.codefield = $("#ed_help_codefield").leeUI().getValue();
            this.editor.filter = $("#ed_help_filter").leeUI().getValue();



            this.editor.dialogtitle = $("#ed_help_dialogtitle").val();
            this.editor.dialogheight = $("#ed_help_dialogheight").val();
            this.editor.dialogwidth = $("#ed_help_dialogwidth").val();
            this.editor.nameswitch = $("#ed_help_nameswitch").prop("checked");
            this.editor.ismul = $("#ed_help_ismul").prop("checked");
            this.editor.ismulgrid = $("#ed_help_ismulgrid").prop("checked");
            this.editor.async = $("#ed_help_async").prop("checked");
            this.editor.childonly = $("#ed_help_childonly").prop("checked");

        },
        refreshOptions: function (helpid) {
            this.getDataModelFields(helpid, function (data) {
                if (data) {

                    $("#ed_help_bindfield").leeUI().setData(data);
                    $("#ed_help_codefield").leeUI().setData(data);
                }
            });
        },
        getDataModelFields: function (helpID, callback) {
            var self = this;
            this.cache = this.cache || {};
            if (helpID == "") {
                callback.call(this, []);
            }
            else {
                DataService.getHelpFiled(helpID).done(function (data) {
                    if (data.res) {
                        $.each(data.data, function (i, obj) {
                            obj.text = obj.Name + "[" + obj.Label + "]";
                            obj.id = obj.Label;
                        });
                        self.cache[helpID] = data.data;//缓存数据
                        callback.call(this, data.data);
                    }
                });
            }

        }
    });
    EditorFactory.add("lookup", HelpEditor);
    EditorFactory.add("input", ControlEditor); //文本的不做处理

    function DropDownEditor() {

    }
    DropDownEditor.leeExtend(ControlEditor, {

        initUI: function () {
            var self = this;
            $("#ed_dropdown_source").leeDropDown({
                data: [{
                    "id": "0",
                    "text": "字符串"
                },
					{
					    "id": "1",
					    "text": "数据模型"
					}
                ],
                onselected: function (value) {
                    self.onPropChanged();
                    self.setVisible(value);
                    //if (value == "1")
                    //    self.refreshOptions(value);
                }
            });
            var column = [
                { display: '主键', name: 'ID', align: 'left', width: 200 },
                { display: '编号', name: 'Code', align: 'left', width: 120 },
				{ display: '名称', name: 'Name', align: 'left', width: 160 }
            ];
            var $injector = new $.leeUI.PopUp.LookupInjector({
                textfield: "Name",
                valuefield: "ID",
                filter: true,
                url: _global.sitePath + "/DataModel/GetDataModelList",
                title: "请选择数据模型",
                method: "post",
                column: column

            });

            $("#ed_dropdown_datasource").leePopup({
                onButtonClick: $.leeUI.PopUp.Lookup($injector),
                onValuechange: function (row) {
                    //alert(row.name);
                    self.onPropChanged();
                    self.refreshOptions(row["ID"] || "");
                    //值改变清空下拉选项的值
                    self.editor.keyfield = "";
                    self.editor.valfield = "";
                    $("#ed_dropdown_keyfield").leeUI().setValue("");
                    $("#ed_dropdown_valfield").leeUI().setValue("");
                }

            });
            $("#ed_dropdown_jsonstring").leePopup({
                onButtonClick: DropDownStringEditor(),
                onValuechange: function (row) {
                    //alert(row.name);
                    self.onPropChanged();
                }

            });

            $("#ed_dropdown_keyfield,#ed_dropdown_valfield").leeDropDown({
                data: [],
                //autocomplete: true,
                onselected: function () {
                    self.onPropChanged();
                }
            });
        },
        setVisible: function (value) {
            if (value == "0") {
                $("#ed_dropdown_warp .str").show();
                $("#ed_dropdown_warp .dm").hide();
            }
            else if (value == "1") {
                $("#ed_dropdown_warp .str").hide();
                $("#ed_dropdown_warp .dm").show();
            } else {
                $("#ed_dropdown_warp .str").hide();
                $("#ed_dropdown_warp .dm").hide();
            }
        },
        bind: function () {
            var self = this;
            this.propsarr = [
				"#ed_dropdown_filter",
                "#ed_dropdown_order",
				"#ed_dropdown_ismul",
				"#ed_dropdown_issuggest",
                "#ed_dropdown_islabel"


            ];

            //"#ed_dropdown_source",
            $(this.propsarr.join(",")).change(function () {
                self.onPropChanged();
            });

        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            DropDownEditor.base.setValue.call(this, editor);
            this.editor = editor;
            for (var i in this.propsarr) {
                var key = this.propsarr[i];
                var value = editor[key.replace("#ed_dropdown_", "")];
                if ($(key).leeUI()) {
                    $(key).leeUI().setValue(value);
                } else {
                    $(key).val(value);
                }
            }
            $("#ed_dropdown_source").leeUI().setValue(editor.source);

            $("#ed_dropdown_jsonstring").leeUI().setValue(editor.jsonstring);
            $("#ed_dropdown_jsonstring").leeUI().setText(editor.jsonstring);


            $("#ed_dropdown_order").val(editor.order);
            $("#ed_dropdown_filter").val(editor.filter);

            $("#ed_dropdown_datasource").leeUI().setValue(editor.datasource);
            $("#ed_dropdown_datasource").leeUI().setText(editor.datasourcetext);
            this.refreshOptions(editor.datasource || "");
            $("#ed_dropdown_keyfield").leeUI().setValue(editor.keyfield);
            $("#ed_dropdown_valfield").leeUI().setValue(editor.valfield);
            $("#ed_dropdown_ismul").prop("checked", editor.ismul);
            $("#ed_dropdown_issuggest").prop("checked", editor.issuggest);
            $("#ed_dropdown_islabel").prop("checked", editor.islabel);

            this.setVisible(editor.source);

        },
        refreshOptions: function (modelID) {
            var self = this;
            this.getDataModelFields(modelID, function (data) {
                if (data) {
                    $("#ed_dropdown_keyfield").leeUI().setData(data);
                    $("#ed_dropdown_valfield").leeUI().setData(data);

                    $("#ed_dropdown_keyfield").leeUI().setValue(self.editor.keyfield);
                    $("#ed_dropdown_valfield").leeUI().setValue(self.editor.valfield);
                }
            });
        },
        getDataModelFields: function (modelID, callback) {
            var self = this;
            this.cache = this.cache || {};
            if (modelID == "") {
                callback.call(this, []);
            }
            else {
                DataService.getModelField(modelID, "").done(function (data) {
                    if (data.res) {
                        $.each(data.data, function (i, obj) {
                            obj.text = obj.Name + "[" + obj.Label + "]";
                            obj.id = obj.Label;
                        });
                        self.cache[modelID] = data.data;//缓存数据
                        callback.call(this, data.data);
                    }
                });
            }

        },
        onPropChanged: function () {
            this.editor.source = $("#ed_dropdown_source").leeUI().getValue();

            this.editor.datasource = $("#ed_dropdown_datasource").leeUI().getValue();
            this.editor.datasourcetext = $("#ed_dropdown_datasource").leeUI().getText();
            this.editor.filter = $("#ed_dropdown_filter").val();
            this.editor.order = $("#ed_dropdown_order").val();

            this.editor.keyfield = $("#ed_dropdown_keyfield").leeUI().getValue();
            this.editor.valfield = $("#ed_dropdown_valfield").leeUI().getValue();
            this.editor.jsonstring = $("#ed_dropdown_jsonstring").leeUI().getValue();
            this.editor.ismul = $("#ed_dropdown_ismul").prop("checked");
            this.editor.issuggest = $("#ed_dropdown_issuggest").prop("checked");
            this.editor.islabel = $("#ed_dropdown_v").prop("checked");
        },
        getCompleteName: function (key) {
            return "ed_dropdown_" + key;
        }
    });
    EditorFactory.add("dropdown", DropDownEditor);
    //日期属性组件
    function DateEditor() {

    }
    DateEditor.leeExtend(ControlEditor, {
        initUI: function () {

        },
        bind: function () {
            var self = this;
            this.propsarr = [
				"#ed_date_format",
				"#ed_date_valueformat",
				"#ed_date_showtime"
            ];
            $(this.propsarr.join(",")).change(function () {
                self.onPropChanged();
            });
        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            DateEditor.base.setValue.call(this, editor);

            for (var i in this.propsarr) {
                var key = this.propsarr[i];
                var value = editor[key.replace("#ed_date_", "")];
                if ($(key).leeUI()) {
                    $(key).leeUI().setValue(value);
                } else {
                    $(key).val(value);
                }
            }

            $("#ed_date_showtime").prop("checked", editor.showtime);
        },
        onPropChanged: function () {
            this.editor.format = $("#ed_date_format").val();
            this.editor.valueformat = $("#ed_date_valueformat").val();
            this.editor.showtime = $("#ed_date_showtime").prop("checked");
        },
        getCompleteName: function (key) {
            return "ed_date_" + key;
        }
    });

    EditorFactory.add("date", DateEditor);
    //数值属性组件
    function NumberEditor() {

    }
    NumberEditor.leeExtend(ControlEditor, {
        initUI: function () {

        },
        bind: function () {
            var self = this;
            this.propsarr = [
				"#ed_number_decimal",
				"#ed_number_thousand"
            ];
            $(this.propsarr.join(",")).change(function () {
                self.onPropChanged();
            });
        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            NumberEditor.base.setValue.call(this, editor);

            for (var i in this.propsarr) {
                var key = this.propsarr[i];
                var value = editor[key.replace("#ed_number_", "")];
                if ($(key).leeUI()) {
                    $(key).leeUI().setValue(value);
                } else {
                    $(key).val(value);
                }
            }

            $("#ed_date_showtime").prop("checked", editor.showtime);
        },
        onPropChanged: function () {
            this.editor.decimal = $("#ed_number_decimal").val();
            this.editor.thousand = $("#ed_number_thousand").prop("checked");
        },
        getCompleteName: function (key) {
            return "ed_number_" + key;
        }
    });
    EditorFactory.add("number", NumberEditor);


    //数值属性组件
    function SpinnerEditor() {

    }
    SpinnerEditor.leeExtend(ControlEditor, {
        initUI: function () {

        },
        bind: function () {
            var self = this;
            this.propsarr = [
				"#ed_spinner_decimal", "#ed_spinner_minvalue", "#ed_spinner_maxvalue"
            ];
            $(this.propsarr.join(",")).change(function () {
                self.onPropChanged();
            });
        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            SpinnerEditor.base.setValue.call(this, editor);

            for (var i in this.propsarr) {
                var key = this.propsarr[i];
                var value = editor[key.replace("#ed_spinner_", "")];
                if ($(key).leeUI()) {
                    $(key).leeUI().setValue(value);
                } else {
                    $(key).val(value);
                }
            }

        },
        onPropChanged: function () {
            this.editor.decimal = $("#ed_spinner_decimal").val();
            this.editor.maxvalue = $("#ed_spinner_maxvalue").val();
            this.editor.minvalue = $("#ed_spinner_minvalue").val();
        },
        getCompleteName: function (key) {
            return "ed_spinner_" + key;
        }
    });
    EditorFactory.add("spinner", SpinnerEditor);


    //附件属性
    function FileEditor() {

    }
    FileEditor.leeExtend(ControlEditor, {
        initUI: function () {

        },
        bind: function () {
            var self = this;
            this.propsarr = [
				"#ed_file_ismul",
                "#ed_file_iscard",
                "#ed_file_ispreview",
                "#ed_file_ext",
                "#ed_file_buttontext"
            ];
            $(this.propsarr.join(",")).change(function () {
                self.onPropChanged();
            });
        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            FileEditor.base.setValue.call(this, editor);
            $("#ed_file_ismul").prop("checked", editor.ismul);
            $("#ed_file_iscard").prop("checked", editor.iscard);
            $("#ed_file_ispreview").prop("checked", editor.ispreview);
            $("#ed_file_ext").val(editor.ext);
            $("#ed_file_buttontext").val(editor.buttontext);
        },
        onPropChanged: function () {

            this.editor.ismul = $("#ed_file_ismul").prop("checked");
            this.editor.iscard = $("#ed_file_iscard").prop("checked");
            this.editor.ispreview = $("#ed_file_ispreview").prop("checked");
            this.editor.ext = $("#ed_file_ext").val();
            this.editor.buttontext = $("#ed_file_buttontext").val();
        },
        getCompleteName: function (key) {
            return "ed_file_" + key;
        }
    });
    EditorFactory.add("file", FileEditor);
    // 多行文本
    function TextAreaEditor() {

    }
    TextAreaEditor.leeExtend(ControlEditor, {
        initUI: function () {

        },
        bind: function () {
            var self = this;
            this.propsarr = [
				"#ed_textarea_height"
            ];
            $(this.propsarr.join(",")).change(function () {
                self.onPropChanged();
            });
        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            TextAreaEditor.base.setValue.call(this, editor);
            $("#ed_textarea_height").val(editor.height);
        },
        onPropChanged: function () {
            this.editor.height = $("#ed_textarea_height").val();
            if (!this.gridid) {
                leeManger.refreshControl(this.id);
            }
        },
        getCompleteName: function (key) {
            return "ed_file_" + key;
        }
    });
    EditorFactory.add("textarea", TextAreaEditor);




    function RadioEditor() {

    }
    RadioEditor.leeExtend(ControlEditor, {

        initUI: function () {
            var self = this;
            $("#ed_radio_source").leeDropDown({
                data: [{
                    "id": "0",
                    "text": "字符串"
                },
					{
					    "id": "1",
					    "text": "数据模型"
					}
                ],
                onselected: function (value) {
                    self.onPropChanged();
                    self.setVisible(value);
                    //if (value == "1")
                    //    self.refreshOptions(value);
                }
            });
            var column = [
                { display: '主键', name: 'ID', align: 'left', width: 200 },
                { display: '编号', name: 'Code', align: 'left', width: 120 },
				{ display: '名称', name: 'Name', align: 'left', width: 160 }
            ];
            var $injector = new $.leeUI.PopUp.LookupInjector({
                textfield: "Name",
                valuefield: "ID",
                filter: true,
                url: _global.sitePath + "/DataModel/GetDataModelList",
                title: "请选择数据模型",
                method: "post",
                column: column

            });

            $("#ed_radio_datasource").leePopup({
                onButtonClick: $.leeUI.PopUp.Lookup($injector),
                onValuechange: function (row) {
                    //alert(row.name);
                    self.onPropChanged();
                    self.refreshOptions(row["ID"] || "");
                    //值改变清空下拉选项的值
                    self.editor.keyfield = "";
                    self.editor.valfield = "";
                    $("#ed_radio_keyfield").leeUI().setValue("");
                    $("#ed_radio_valfield").leeUI().setValue("");
                }

            });
            $("#ed_radio_jsonstring").leePopup({
                onButtonClick: DropDownStringEditor(),
                onValuechange: function (row) {
                    //alert(row.name);
                    self.onPropChanged();
                }

            });

            $("#ed_radio_keyfield,#ed_radio_valfield").leeDropDown({
                data: [],
                //autocomplete: true,
                onselected: function () {
                    self.onPropChanged();
                }
            });
        },
        setVisible: function (value) {
            if (value == "0") {
                $("#ed_radio_warp .str").show();
                $("#ed_radio_warp .dm").hide();
            }
            else if (value == "1") {
                $("#ed_radio_warp .str").hide();
                $("#ed_radio_warp .dm").show();
            } else {
                $("#ed_radio_warp .str").hide();
                $("#ed_radio_warp .dm").hide();
            }
        },
        bind: function () {
            var self = this;
            this.propsarr = [
				"#ed_radio_filter",
                "#ed_radio_order",
				"#ed_radio_ismul"

            ];

            //"#ed_dropdown_source",
            $(this.propsarr.join(",")).change(function () {
                self.onPropChanged();
            });

        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            RadioEditor.base.setValue.call(this, editor);
            this.editor = editor;
            for (var i in this.propsarr) {
                var key = this.propsarr[i];
                var value = editor[key.replace("#ed_radio_", "")];
                if ($(key).leeUI()) {
                    $(key).leeUI().setValue(value);
                } else {
                    $(key).val(value);
                }
            }
            $("#ed_radio_source").leeUI().setValue(editor.source);

            $("#ed_radio_jsonstring").leeUI().setValue(editor.jsonstring);
            $("#ed_radio_jsonstring").leeUI().setText(editor.jsonstring);

            $("#ed_radio_order").val(editor.order);
            $("#ed_radio_filter").val(editor.filter);

            $("#ed_radio_datasource").leeUI().setValue(editor.datasource);
            $("#ed_radio_datasource").leeUI().setText(editor.datasourcetext);
            this.refreshOptions(editor.datasource || "");
            $("#ed_radio_keyfield").leeUI().setValue(editor.keyfield);
            $("#ed_radio_valfield").leeUI().setValue(editor.valfield);
            $("#ed_radio_ismul").prop("checked", editor.ismul);
            $("#ed_radio_issuggest").prop("checked", editor.issuggest);
            $("#ed_radio_islabel").prop("checked", editor.islabel);

            this.setVisible(editor.source);

        },
        refreshOptions: function (modelID) {
            var self = this;
            this.getDataModelFields(modelID, function (data) {
                if (data) {
                    $("#ed_radio_keyfield").leeUI().setData(data);
                    $("#ed_radio_valfield").leeUI().setData(data);

                    $("#ed_radio_keyfield").leeUI().setValue(self.editor.keyfield);
                    $("#ed_radio_valfield").leeUI().setValue(self.editor.valfield);
                }
            });
        },
        getDataModelFields: function (modelID, callback) {
            var self = this;
            this.cache = this.cache || {};
            if (modelID == "") {
                callback.call(this, []);
            }
            else {
                DataService.getModelField(modelID, "").done(function (data) {
                    if (data.res) {
                        $.each(data.data, function (i, obj) {
                            obj.text = obj.Name + "[" + obj.Label + "]";
                            obj.id = obj.Label;
                        });
                        self.cache[modelID] = data.data;//缓存数据
                        callback.call(this, data.data);
                    }
                });
            }

        },
        onPropChanged: function () {
            this.editor.source = $("#ed_radio_source").leeUI().getValue();

            this.editor.datasource = $("#ed_radio_datasource").leeUI().getValue();
            this.editor.datasourcetext = $("#ed_radio_datasource").leeUI().getText();
            this.editor.filter = $("#ed_radio_filter").val();
            this.editor.order = $("#ed_radio_order").val();

            this.editor.keyfield = $("#ed_radio_keyfield").leeUI().getValue();
            this.editor.valfield = $("#ed_radio_valfield").leeUI().getValue();
            this.editor.jsonstring = $("#ed_radio_jsonstring").leeUI().getValue();

        },
        getCompleteName: function (key) {
            return "ed_dropdown_" + key;
        }
    });
    EditorFactory.add("radio", RadioEditor);




    function CheckboxEditor() {

    }
    CheckboxEditor.leeExtend(ControlEditor, {

        initUI: function () {
            var self = this;
            $("#ed_checkbox_source").leeDropDown({
                data: [{
                    "id": "0",
                    "text": "字符串"
                },
					{
					    "id": "1",
					    "text": "数据模型"
					}
                ],
                onselected: function (value) {
                    self.onPropChanged();
                    self.setVisible(value);
                    //if (value == "1")
                    //    self.refreshOptions(value);
                }
            });
            var column = [
                { display: '主键', name: 'ID', align: 'left', width: 200 },
                { display: '编号', name: 'Code', align: 'left', width: 120 },
				{ display: '名称', name: 'Name', align: 'left', width: 160 }
            ];
            var $injector = new $.leeUI.PopUp.LookupInjector({
                textfield: "Name",
                valuefield: "ID",
                filter: true,
                url: _global.sitePath + "/DataModel/GetDataModelList",
                title: "请选择数据模型",
                method: "post",
                column: column

            });

            $("#ed_checkbox_datasource").leePopup({
                onButtonClick: $.leeUI.PopUp.Lookup($injector),
                onValuechange: function (row) {
                    //alert(row.name);
                    self.onPropChanged();
                    self.refreshOptions(row["ID"] || "");
                    //值改变清空下拉选项的值
                    self.editor.keyfield = "";
                    self.editor.valfield = "";
                    $("#ed_checkbox_keyfield").leeUI().setValue("");
                    $("#ed_checkbox_valfield").leeUI().setValue("");
                }

            });
            $("#ed_checkbox_jsonstring").leePopup({
                onButtonClick: DropDownStringEditor(),
                onValuechange: function (row) {
                    //alert(row.name);
                    self.onPropChanged();
                }

            });

            $("#ed_checkbox_keyfield,#ed_checkbox_valfield").leeDropDown({
                data: [],
                //autocomplete: true,
                onselected: function () {
                    self.onPropChanged();
                }
            });
        },
        setVisible: function (value) {
            this.setVisibleMul();
            if (value == "0") {
                $("#ed_checkbox_warp .str").show();
                $("#ed_checkbox_warp .dm").hide();
            }
            else if (value == "1") {
                $("#ed_checkbox_warp .str").hide();
                $("#ed_checkbox_warp .dm").show();
            } else {
                $("#ed_checkbox_warp .str").hide();
                $("#ed_checkbox_warp .dm").hide();
            }


        },
        setVisibleMul: function () {
            if ($("#ed_checkbox_ismul").prop("checked")) {
                $("#ed_checkbox_warp .mul").show();
                $("#ed_checkbox_warp .single").hide();
            }
            else {
                $("#ed_checkbox_warp .mul").hide();
                $("#ed_checkbox_warp .single").show();
            }
        },
        bind: function () {
            var self = this;
            this.propsarr = [
				"#ed_checkbox_filter",
                "#ed_checkbox_order",
				"#ed_checkbox_ismul",
                "#ed_checkbox_notbit"

            ];

            //"#ed_dropdown_source",
            $(this.propsarr.join(",")).change(function () {
                self.onPropChanged();
                self.setVisibleMul();
            });

        },
        setBaseObj: function (obj) {
            this.ctrobj = obj;
        },
        setValue: function (editor) {
            DropDownEditor.base.setValue.call(this, editor);
            this.editor = editor;
            for (var i in this.propsarr) {
                var key = this.propsarr[i];
                var value = editor[key.replace("#ed_checkbox_", "")];
                if ($(key).leeUI()) {
                    $(key).leeUI().setValue(value);
                } else {
                    $(key).val(value);
                }
            }
            $("#ed_checkbox_source").leeUI().setValue(editor.source);

            $("#ed_checkbox_jsonstring").leeUI().setValue(editor.jsonstring);
            $("#ed_checkbox_jsonstring").leeUI().setText(editor.jsonstring);

            $("#ed_checkbox_order").val(editor.order);
            $("#ed_checkbox_filter").val(editor.filter);

            $("#ed_checkbox_datasource").leeUI().setValue(editor.datasource);
            $("#ed_checkbox_datasource").leeUI().setText(editor.datasourcetext);
            this.refreshOptions(editor.datasource || "");
            $("#ed_checkbox_keyfield").leeUI().setValue(editor.keyfield);
            $("#ed_checkbox_valfield").leeUI().setValue(editor.valfield);
            $("#ed_checkbox_ismul").prop("checked", editor.ismul ? true : false);
            $("#ed_checkbox_notbit").prop("checked", editor.notbit ? true : false);




            this.setVisible(editor.source);

        },
        refreshOptions: function (modelID) {
            var self = this;
            this.getDataModelFields(modelID, function (data) {
                if (data) {
                    $("#ed_checkbox_keyfield").leeUI().setData(data);
                    $("#ed_checkbox_valfield").leeUI().setData(data);

                    $("#ed_checkbox_keyfield").leeUI().setValue(self.editor.keyfield);
                    $("#ed_checkbox_valfield").leeUI().setValue(self.editor.valfield);
                }
            });
        },
        getDataModelFields: function (modelID, callback) {
            var self = this;
            this.cache = this.cache || {};
            if (modelID == "") {
                callback.call(this, []);
            }
            else {
                DataService.getModelField(modelID, "").done(function (data) {
                    if (data.res) {
                        $.each(data.data, function (i, obj) {
                            obj.text = obj.Name + "[" + obj.Label + "]";
                            obj.id = obj.Label;
                        });
                        self.cache[modelID] = data.data;//缓存数据
                        callback.call(this, data.data);
                    }
                });
            }

        },
        onPropChanged: function () {
            this.editor.source = $("#ed_checkbox_source").leeUI().getValue();

            this.editor.datasource = $("#ed_checkbox_datasource").leeUI().getValue();
            this.editor.datasourcetext = $("#ed_checkbox_datasource").leeUI().getText();
            this.editor.filter = $("#ed_checkbox_filter").val();
            this.editor.order = $("#ed_checkbox_order").val();
            this.editor.ismul = $("#ed_checkbox_ismul").prop("checked");
            this.editor.notbit = $("#ed_checkbox_notbit").prop("checked");
            this.editor.keyfield = $("#ed_checkbox_keyfield").leeUI().getValue();
            this.editor.valfield = $("#ed_checkbox_valfield").leeUI().getValue();
            this.editor.jsonstring = $("#ed_checkbox_jsonstring").leeUI().getValue();

        },
        getCompleteName: function (key) {
            return "ed_checkbox_" + key;
        }
    });
    EditorFactory.add("checkbox", CheckboxEditor);
}).call(this, $, window);