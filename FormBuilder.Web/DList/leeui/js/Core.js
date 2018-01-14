/*
 *  leeUI 1.0.0 
 * Author skiphyuk  [ skiphyuk@163.com ] 
 * 
 */
(function ($) {
    Function.prototype.leeExtend = function (parent, overrides) {
        if (typeof parent != 'function') return this; //如果父类不是function 直接返回
        this.base = parent.prototype; //base 记录父类的原型链
        this.base.constructor = parent; //
        var f = function () { };
        f.prototype = parent.prototype;
        this.prototype = new f(); //当前原型指向new func
        this.prototype.constructor = this; //
        if (overrides) $.extend(this.prototype, overrides);
        //扩展集成方法	
    }

    Function.prototype.leeDefer = function (o, defer, args) {
        var fn = this;
        return setTimeout(function () {
            fn.apply(o, args || []);
        }, defer);
    }
    //leeUI核心对象
    window.leeUI = $.leeUI = {
        version: "1.0.0",
        managerCount: 0,
        //组件缓存
        managers: {},
        managerIdPrev: "leeUI",
        //管理器id已经存在时自动创建新的
        autoNewId: true,
        //错误提示
        error: {
            managerIsExist: '管理器id已经存在'
        },
        pluginPrev: 'lee',
        attrPrev: 'data',
        getId: function (prev) { //随机生成一个组件ID
            prev = prev || this.managerIdPrev;
            var id = prev + (1000 + this.managerCount);
            this.managerCount++;
            return id;

        },
        add: function (manager) {
            if (arguments.length == 2) {
                var m = arguments[1];
                m.id = m.id || m.options.id || arguments[0].id;
                this.addManager(m);
                return;
            }
            if (!manager.id) manager.id = this.getId(manager.__idPrev());
            //if (this.managers[manager.id]) manager.id = this.getId(manager.__idPrev());
            //if (this.managers[manager.id])
            //{
            //    throw new Error(this.error.managerIsExist);
            //}
            this.managers[manager.id] = manager; //添加一个组件信息
        },
        remove: function (arg) {
            if (typeof arg == "string" || typeof arg == "number") {
                delete leeUI.managers[arg];
            } else if (typeof arg == "object") {
                if (arg instanceof leeUI.core.Component) {
                    delete leeUI.managers[arg.id];
                } else {
                    if (!$(arg).attr(this.idAttrName)) return false;
                    delete leeUI.managers[$(arg).attr(this.idAttrName)];
                }
            }

        },
        //获取leeui对象
        //1,传入ligerui ID
        //2,传入Dom Object
        get: function (arg, idAttrName) {
            idAttrName = idAttrName || "uiid";
            if (typeof arg == "string" || typeof arg == "number") {
                return leeUI.managers[arg];
            } else if (typeof arg == "object") {
                var domObj = arg.length ? arg[0] : arg;
                var id = domObj[idAttrName] || $(domObj).attr(idAttrName);
                if (!id) return null;
                return leeUI.managers[id];
            }
            return null;
        },
        find: function (type) //根据类型查找某一个对象
        {
            var arr = [];
            for (var id in this.managers) {
                var manager = this.managers[id];
                if (type instanceof Function) {
                    if (manager instanceof type) {
                        arr.push(manager);
                    }
                } else if (type instanceof Array) {
                    if ($.inArray(manager.__getType(), type) != -1) {
                        arr.push(manager);
                    }
                } else {
                    if (manager.__getType() == type) {
                        arr.push(manager);
                    }
                }
            }
            return arr;
        },
        //$.fn.liger{Plugin} 和 $.fn.ligerGet{Plugin}Manager
        //会调用这个方法,并传入作用域(this)
        //parm [plugin]  插件名
        //parm [args] 参数(数组)
        //parm [ext] 扩展参数,定义命名空间或者id属性名
        run: function (plugin, args, ext) {
            if (!plugin) return;
            ext = $.extend({
                defaultsNamespace: 'leeUIDefaults',
                methodsNamespace: 'leeUIMethods',
                controlNamespace: 'controls',
                idAttrName: 'uiid',
                isStatic: false,
                hasElement: true, //是否拥有element主体(比如drag、resizable等辅助性插件就不拥有)
                propertyToElemnt: null //链接到element的属性名
            }, ext || {});
            plugin = plugin.replace(/^leeUIGet/, '');
            plugin = plugin.replace(/^leeUI/, '');
            if (this == null || this == window || ext.isStatic) {
                if (!leeUI.plugins[plugin]) {
                    leeUI.plugins[plugin] = {
                        fn: $[leeUI.pluginPrev + plugin],
                        isStatic: true
                    };
                }
                return new $.leeUI[ext.controlNamespace][plugin]($.extend({}, $[ext.defaultsNamespace][plugin] || {}, $[ext.defaultsNamespace][plugin + 'String'] || {}, args.length > 0 ? args[0] : {}));
            }
            if (!leeUI.plugins[plugin]) {
                leeUI.plugins[plugin] = {
                    fn: $.fn[leeUI.pluginPrev + plugin],
                    isStatic: false
                };
            }
            if (/Manager$/.test(plugin)) return leeUI.get(this, ext.idAttrName);
            this.each(function () {
                if (this[ext.idAttrName] || $(this).attr(ext.idAttrName)) {
                    var manager = leeUI.get(this[ext.idAttrName] || $(this).attr(ext.idAttrName));
                    if (manager && args.length > 0) manager.set(args[0]);
                    //已经执行过  获取控件管理器的内容
                    return;
                }
                if (args.length >= 1 && typeof args[0] == 'string') return;
                //只要第一个参数不是string类型,都执行组件的实例化工作
                var options = args.length > 0 ? args[0] : null;
                var p = $.extend({}, $[ext.defaultsNamespace][plugin], $[ext.defaultsNamespace][plugin + 'String'], options);
                if (ext.propertyToElemnt) p[ext.propertyToElemnt] = this;
                if (ext.hasElement) {
                    new $.leeUI[ext.controlNamespace][plugin](this, p);
                } else {
                    new $.leeUI[ext.controlNamespace][plugin](p);
                }
            });

            if (this.length == 0) return null;
            if (args.length == 0) return leeUI.get(this, ext.idAttrName);
            if (typeof args[0] == 'object') return leeUI.get(this, ext.idAttrName);
            if (typeof args[0] == 'string') {
                var manager = leeUI.get(this, ext.idAttrName);
                if (manager == null) return;
                if (args[0] == "option") {
                    if (args.length == 2)
                        return manager.get(args[1]); //manager get
                    else if (args.length >= 3)
                        return manager.set(args[1], args[2]); //manager set
                } else {
                    var method = args[0];
                    if (!manager[method]) return; //不存在这个方法
                    var parms = Array.apply(null, args);
                    parms.shift();
                    return manager[method].apply(manager, parms); //manager method
                }
            }
            return null;
        },
        //扩展
        //1,默认参数     
        //2,本地化扩展 
        defaults: {},
        //3,方法接口扩展
        methods: {},
        //命名空间
        //核心控件,封装了一些常用方法
        core: {},
        //命名空间
        //组件的集合
        controls: {},
        //plugin 插件的集合
        plugins: {}
    };
    //扩展对象
    $.leeUIDefaults = {};

    //扩展对象
    $.leeUIMethods = {};

    //关联起来
    leeUI.defaults = $.leeUIDefaults;
    leeUI.methods = $.leeUIMethods;

    //获取ligerui对象
    //parm [plugin]  插件名,可为空
    $.fn.leeUI = function (plugin) {
        if (plugin) {
            return leeUI.run.call(this, plugin, arguments);
        } else {
            return leeUI.get(this);
        }
    };

    //组件基类
    //1,完成定义参数处理方法和参数属性初始化的工作
    //2,完成定义事件处理方法和事件属性初始化的工作
    leeUI.core.Component = function (options) {
        //事件容器
        this.events = this.events || {};
        //配置参数
        this.options = options || {};
        //子组件集合索引
        this.children = {};
    };
    //扩展core对象的原型方法 
    $.extend(leeUI.core.Component.prototype, {
        __getType: function () {
            return 'leeUI.core.Component';
        },
        __idPrev: function () {
            return 'leeUI';
        },

        //设置属性
        // arg 属性名    value 属性值 
        // arg 属性/值   value 是否只设置事件
        set: function (arg, value, value2) {
            if (!arg) return;
            if (typeof arg == 'object') {
                var tmp;
                if (this.options != arg) {
                    $.extend(this.options, arg);
                    tmp = arg;
                } else {
                    tmp = $.extend({}, arg);
                }
                if (value == undefined || value == true) {
                    for (var p in tmp) {
                        if (p.indexOf('on') == 0) //如果是事件开头 则绑定事件
                            this.set(p, tmp[p]);
                    }
                }
                if (value == undefined || value == false) {
                    for (var p in tmp) {
                        if (p.indexOf('on') != 0) //如果不是on开头则绑定属性
                            this.set(p, tmp[p], value2);
                    }
                }
                return;
            }
            var name = arg;
            //事件参数
            if (name.indexOf('on') == 0) {
                //绑定事件
                if (typeof value == 'function')
                    this.bind(name.substr(2), value);
                return;
            }
            if (!this.options) this.options = {};
            if (this.trigger('propertychange', [arg, value]) == false) return;
            this.options[name] = value;
            var pn = '_set' + name.substr(0, 1).toUpperCase() + name.substr(1);
            if (this[pn]) {
                this[pn].call(this, value, value2);
            }
            this.trigger('propertychanged', [arg, value]);
        },

        //获取属性
        get: function (name) {
            var pn = '_get' + name.substr(0, 1).toUpperCase() + name.substr(1);
            if (this[pn]) {
                return this[pn].call(this, name);
            }
            return this.options[name];
        },

        hasBind: function (arg) {
            var name = arg.toLowerCase();
            var event = this.events[name];
            if (event && event.length) return true;
            return false;
        },

        //触发事件
        //data (可选) Array(可选)传递给事件处理函数的附加参数
        trigger: function (arg, data) {
            if (!arg) return;
            var name = arg.toLowerCase();
            var event = this.events[name];
            if (!event) return;
            data = data || [];
            if ((data instanceof Array) == false) {
                data = [data];
            }
            for (var i = 0; i < event.length; i++) {
                var ev = event[i];
                if (ev.handler.apply(ev.context, data) == false)
                    return false;
            }
        },

        //绑定事件
        bind: function (arg, handler, context) {
            if (typeof arg == 'object') {
                for (var p in arg) {
                    this.bind(p, arg[p]);
                }
                return;
            }
            if (typeof handler != 'function') return false;
            var name = arg.toLowerCase();
            var event = this.events[name] || [];
            context = context || this;
            event.push({
                handler: handler,
                context: context
            });
            this.events[name] = event;
        },

        //取消绑定
        unbind: function (arg, handler) {
            if (!arg) {
                this.events = {};
                return;
            }
            var name = arg.toLowerCase();
            var event = this.events[name];
            if (!event || !event.length) return;
            if (!handler) {
                delete this.events[name];
            } else {
                for (var i = 0, l = event.length; i < l; i++) {
                    if (event[i].handler == handler) {
                        event.splice(i, 1);
                        break;
                    }
                }
            }
        },
        destroy: function () {
            leeUI.remove(this);
        }
    });

    //界面组件基类, 
    //1,完成界面初始化:设置组件id并存入组件管理器池,初始化参数
    //2,渲染的工作,细节交给子类实现
    //parm [element] 组件对应的dom element对象
    //parm [options] 组件的参数
    leeUI.core.UIComponent = function (element, options) {
        leeUI.core.UIComponent.base.constructor.call(this, options); //基类执行
        var extendMethods = this._extendMethods(); //
        if (extendMethods) $.extend(this, extendMethods);
        this.element = element;
        this._init();
        this._preRender();
        this.trigger('render');
        this._render();
        this.trigger('rendered');
        this._rendered();
    };

    //UIComponent 继承
    leeUI.core.UIComponent.leeExtend(leeUI.core.Component, {
        __getType: function () {
            return 'leeUI.core.UIComponent';
        },
        //扩展方法
        _extendMethods: function () {

        },
        _init: function () {
            this.type = this.__getType();
            if (!this.element) {
                this.id = this.options.id || leeUI.getId(this.__idPrev());
            } else {
                this.id = this.options.id || this.element.id || leeUI.getId(this.__idPrev());
            }
            //存入管理器池
            leeUI.add(this);

            if (!this.element) return;

            //读取attr方法,并加载到参数,比如['url']
            var attributes = this.attr();
            if (attributes && attributes instanceof Array) {
                for (var i = 0; i < attributes.length; i++) {
                    var name = attributes[i];
                    if ($(this.element).attr(name)) {
                        this.options[name] = $(this.element).attr(name); //设置属性
                    }
                }
            }
            //读取ligerui这个属性，并加载到参数，比如 ligerui = "width:120,heigth:100"
            var p = this.options;
            if ($(this.element).attr("leeUI")) {
                try {
                    var attroptions = $(this.element).attr("leeUI");
                    if (attroptions.indexOf('{') != 0) attroptions = "{" + attroptions + "}";
                    eval("attroptions = " + attroptions + ";");
                    if (attroptions) $.extend(p, attroptions);
                } catch (e) { }
            }

            //v1.3.2增加 从data-XX 加载属性
            function loadDataOp(control, jelement) {
                var op = {};
                if (!control || control.indexOf('.') != -1) return op;
                var defaultOp = leeUI.defaults[control];
                if (!defaultOp) return op;
                for (var name in defaultOp) {
                    if (jelement.attr(leeUI.attrPrev + "-" + name)) {
                        var value = jelement.attr(leeUI.attrPrev + "-" + name);
                        if (typeof (defaultOp[name]) == "boolean") {
                            op[name] = value == "true" || value == "1";
                        } else {
                            op[name] = value;
                        }
                    }
                }
                return op;
            }

            $.extend(p, loadDataOp(this.__getType(), $(this.element)));

        },
        //预渲染,可以用于继承扩展
        _preRender: function () {

        },
        _render: function () {

        },
        _rendered: function () {
            if (this.element) {
                $(this.element).attr("uiid", this.id);
            }
        },
        _setCls: function (value) {
            if (this.element && value) {
                $(this.element).addClass(value);
            }
        },
        //返回要转换成ligerui参数的属性,比如['url']
        attr: function () {
            return [];
        },
        destroy: function () {
            if (this.element) {
                $(this.element).remove();
            }
            this.options = null;
            leeUI.remove(this);
        }
    });

    //表单控件基类
    leeUI.controls.Input = function (element, options) {
        //执行父类构造函数
        leeUI.controls.Input.base.constructor.call(this, element, options);
    };

    leeUI.controls.Input.leeExtend(leeUI.core.UIComponent, {
        __getType: function () {
            return 'leeUI.controls.Input';
        },
        attr: function () {
            return ['nullText'];
        },
        setValue: function (value) {
            return this.set('value', value);
        },
        getValue: function () {
            return this.get('value');
        },
        //设置只读
        _setReadonly: function (readonly) {
            var wrapper = this.wrapper || this.text;
            if (!wrapper || !wrapper.hasClass("l-text")) return;
            var inputText = this.inputText;
            if (readonly) {
                if (inputText) inputText.attr("readonly", "readonly");
                wrapper.addClass("l-text-readonly");
            } else {
                if (inputText) inputText.removeAttr("readonly");
                wrapper.removeClass("l-text-readonly");
            }
        },
        setReadonly: function (readonly) {
            return this.set('readonly', readonly);
        },
        setEnabled: function () {
            return this.set('disabled', false);
        },
        setDisabled: function () {
            return this.set('disabled', true);
        },
        updateStyle: function () {

        },
        resize: function (width, height) {
            //alert("resize");
            this.set({
                width: width - 2,
                height: height + 2
            });
        }
    });

    leeUI.draggable = {
        dragging: false
    };

    leeUI.resizable = {
        reszing: false
    };

    //获取 默认的编辑构造器
    leeUI.getEditor = function (e) {
        var type = e.type,
			control = e.control,
			master = e.master;
        if (!type) return null;
        var inputTag = 0;
        if (control) control = control.substr(0, 1).toUpperCase() + control.substr(1); //控件类型 首字母大写
        var defaultOp = {
            create: function (container, editParm, controlOptions) {
                //field in form , column in grid
                var field = editParm.field || editParm.column,
					options = controlOptions || {};
                var isInGrid = editParm.column ? true : false;
                var p = $.extend({}, e.options);
                var inputType = "text";
                if ($.inArray(type, ["password", "file", "checkbox", "radio"]) != -1) inputType = type;
                if (e.password) inputType = "password";
                var inputBody = $("<input id='txt_grid_" + editParm.column.id + "' type='" + inputType + "'/>");
                if (e.body) {
                    inputBody = e.body.clone();
                }
                inputBody.appendTo(container);
                if (editParm.field) {
                    var txtInputName = field.name;
                    var prefixID = $.isFunction(options.prefixID) ? options.prefixID(master) : (options.prefixID || "");
                    p.id = field.id || (prefixID + field.name);
                    if ($.inArray(type, ["select", "combobox", "autocomplete", "popup"]) != -1) {
                        txtInputName = field.textField || field.comboboxName;
                        if (field.comboboxName && !field.id)
                            p.id = (options.prefixID || "") + field.comboboxName;
                    }
                    if ($.inArray(type, ["select", "combobox", "autocomplete", "popup", "radiolist", "checkboxlist", "listbox"]) != -1) {
                        p.valueFieldID = prefixID + field.name;
                    }
                    if (!e.body) {
                        var inputName = prefixID + txtInputName;
                        var inputId = new Date().getTime() + "_" + ++inputTag + "_" + field.name;
                        inputBody.attr($.extend({
                            id: inputId,
                            name: inputName
                        }, field.attr));
                        if (field.cssClass) {
                            inputBody.addClass(field.cssClass);
                        }
                        if (field.validate && !master.options.unSetValidateAttr) {
                            inputBody.attr('validate', leeUI.toJSON(field.validate));
                        }
                    }
                    $.extend(p, field.options);
                }
                if (field.dictionary) //字典字段，比如:男|女
                {
                    field.editor = field.editor || {};
                    if (!field.editor.data) {
                        var dicEditorData = [],
							dicItems = field.dictionary.split('|');
                        $(dicItems).each(function (i, dicItem) {
                            var dics = dicItem.split(',');
                            var dicItemId = dics[0],
								dicItemText = dics.length >= 2 ? dics[1] : dics[0];
                            dicEditorData.push({
                                id: dicItemId,
                                value: dicItemId,
                                text: dicItemText
                            });
                        });
                        field.editor.data = dicEditorData;
                    }
                }
                if (field.editor) {
                    if (field.editor.options) {
                        $.extend(p, field.editor.options);
                        delete field.editor.options;
                    }
                    if (field.editor.valueColumnName) {
                        p.valueField = field.editor.valueColumnName;
                        delete field.editor.valueColumnName;
                    }
                    if (field.editor.displayColumnName) {
                        p.textField = field.editor.displayColumnName;
                        delete field.editor.displayColumnName;
                    }
                    //可扩展参数,支持动态加载
                    var ext = field.editor.p || field.editor.ext;
                    if (ext) {
                        ext = typeof (ext) == 'function' ? ext(editParm) : ext;
                        $.extend(p, ext);
                        delete field.editor.p;
                        delete field.editor.ext;
                    }
                    $.extend(p, field.editor);
                }

                if (isInGrid) {
                    p.host_grid = this;
                    p.host_grid_row = editParm.record;
                    p.host_grid_column = editParm.column;
                    p.gridEditParm = editParm;
                } else {
                    p.host_form = this;

                    if (field.readonly || p.host_form.get('readonly')) {
                        p.readonly = true;
                    }
                }
                //返回的是ligerui对象
                var lobj = inputBody['lee' + control](p);
                if (isInGrid) {
                    setTimeout(function () {
                        inputBody.focus();
                        //inputBody.click();
                        if (control == "DropDown") {
                            inputBody.leeUI()._toggleSelectBox(false);
                        }
                    }, 100);
                }
                return lobj;
            },
            getValue: function (editor, editParm) {
                var field = editParm.field || editParm.column;
                if (editor.getValue) {
                    var value = editor.getValue();
                    var edtirType = editParm.column ? editParm.column.editor.type : editParm.field.type;
                    //isArrayValue属性可将提交字段数据改成[id1,id2,id3]的形式
                    if (field && field.editor && field.editor.isArrayValue && value) {
                        value = value.split(';');
                    }
                    //isRef属性可将提交字段数据改成[id,value]的形式 值 名称
                    if (field && field.editor && field.editor.isRef && editor.getText) {
                        value = [value, editor.getText()];
                    }
                    //isRefMul属性可将提交字段数据改成[[id1,value1],[id2,value2]]的形式
                    if (field && field.editor && field.editor.isRefMul && editor.getText) {
                        var vs = value.split(';');
                        var ts = editor.getText().split(';');
                        value = [];
                        for (var i = 0; i < vs.length; i++) {
                            value.push([vs[i], ts[i]]);
                        }
                    }
                    if (edtirType == "int" || edtirType == "digits") {
                        value = value ? parseInt(value, 10) : 0;
                    } else if (edtirType == "float" || edtirType == "number") {
                        value = value ? parseFloat(value) : 0;
                    }
                    return value;
                }
            },
            setValue: function (editor, value, editParm) {
                var field = editParm.field || editParm.column;
                if (editor.setValue) {

                    if (editor.type == "Lookup") {
                        editor.setValue(value, value);
                        return;
                    }
                    //设置了isArrayValue属性- 如果获取到的数据是[id1,id2,id3]的形式，需要合并为一个完整字符串
                    if (field && field.editor && field.editor.isArrayValue && value) {
                        value = value.join(';');
                    }
                    //设置了isRef属性-如果获取到的数据是[id,text]的形式，需要获取[0]
                    if (field && field.editor && field.editor.isRef && $.isArray(value)) {
                        value = value[0];
                    }
                    //设置了isRefMul属性- 获取到[[id1,value1],[id2,value2]]的形式，需要合并为一个完整字符串
                    if (field && field.editor && field.editor.isRefMul && $.isArray(value)) {
                        var vs = [];
                        for (var i = 0; i < value.length; i++) {
                            vs.push(value[i].length > 1 ? value[i][1] : value[i][0]);
                        }
                        value = vs.join(';');
                    }
                    editor.setValue(value);
                }
            },
            //从控件获取到文本信息
            getText: function (editor, editParm) {
                var field = editParm.field || editParm.column;
                if (editor.getText) {
                    var text = editor.getText();
                    return text;
                }
            },
            //设置文本信息到控件去
            setText: function (editor, text, editParm) {
                if (text && editor.setText) {
                    editor.setText(text);
                }
                    //如果没有把数据保存到 textField 字段，那么需要获取值字段
                else {
                    var field = editParm.field || editParm.column;
                    text = editor.setValue() || editParm.value || "";
                    //如果获取到的数据是[id,text]的形式，需要获取[0]
                    if (field && field.editor && field.editor.isRef && $.isArray(text) && text.length > 1) {
                        text = text[1];
                    }
                    //在grid的编辑里面 获取到[[id1,value1],[id2,value2]]的形式，需要合并为一个完整字符串
                    if (field && field.editor && field.editor.isRefMul && $.isArray(text) && text.length > 1) {
                        var vs = [];
                        for (var i = 0; i < text.length; i++) {
                            vs.push(text[1]);
                        }
                        text = vs.join(';');
                    }
                    if (editor.setText) {
                        editor.setText(text);
                    }
                }
            },
            getSelected: function (editor, editParm) {
                if (editor.getSelected) {
                    return editor.getSelected();
                }
            },
            resize: function (editor, width, height, editParm) {
                if (editParm.field) width = width - 2;
                if (editor.resize) editor.resize(width, height);
            },
            setEnabled: function (editor, isEnabled) {
                if (isEnabled) {
                    if (editor.setEnabled) editor.setEnabled();
                } else {
                    if (editor.setDisabled) editor.setDisabled();
                }
            },
            destroy: function (editor, editParm) {
                if (editor.destroy) editor.destroy();
            }
        };

        return $.extend({}, defaultOp, leeUI.editorCreatorDefaults || {}, e);
    }

    leeUI.win = {

        mid: 0,

        getMaskID: function () {
            this.mid += 10;
            return this.mid;
        },
        //顶端显示
        top: false,
        maskid: function (zindex) {
           
            var ele = $("#lee-mask-" + zindex);
            if (ele.length > 0) return;
            var style = "";
            if (zindex) {
                style = "z-index:" + String(9000 + Number(zindex)) + ";";
            }
            var windowMask = $("<div id='lee-mask-" + (zindex ? zindex : "") + "' class='lee-window-mask' style='display: block;" + style + "'></div>").appendTo('body');
        },
        unmaskid: function (id) {

            if (id) {
                $("#lee-mask-" + id).remove();
            }
        },
        //遮罩
        mask: function (win) {

            function setHeight() {
                if (!leeUI.win.windowMask) return;
                var h = $(window).height() + $(window).scrollTop();
                leeUI.win.windowMask.height(h);
            }
            if (!this.windowMask) {
                this.windowMask = $("<div  class='lee-window-mask' style='display: block;'></div>").appendTo('body');
                $(window).bind('resize.ligeruiwin', setHeight);
                $(window).bind('scroll', setHeight);
            }
            this.windowMask.show();
            setHeight();
            this.masking = true;
        },

        //取消遮罩
        unmask: function (win) {
            var jwins = $("body > .lee-dialog:visible,body > .lee-window:visible");
            for (var i = 0, l = jwins.length; i < l; i++) {
                var winid = jwins.eq(i).attr("uiid");
                if (win && win.id == winid) continue;
                //获取ligerui对象
                var winmanager = leeUI.get(winid);
                if (!winmanager) continue;
                //是否模态窗口
                var modal = winmanager.get('modal');
                //如果存在其他模态窗口，那么不会取消遮罩
                if (modal) return;
            }
            if (this.windowMask)
                this.windowMask.hide();
            this.masking = false;
        },

        //显示任务栏
        createTaskbar: function () {
            if (!this.taskbar) {
                this.taskbar = $('<div class="l-taskbar"><div class="l-taskbar-tasks"></div><div class="l-clear"></div></div>').appendTo('body');
                if (this.top) this.taskbar.addClass("l-taskbar-top");
                this.taskbar.tasks = $(".l-taskbar-tasks:first", this.taskbar);
                this.tasks = {};
            }
            this.taskbar.show();
            this.taskbar.animate({
                bottom: 0
            });
            return this.taskbar;
        },

        //关闭任务栏
        removeTaskbar: function () {
            var self = this;
            self.taskbar.animate({
                bottom: -32
            }, function () {
                self.taskbar.remove();
                self.taskbar = null;
            });
        },
        activeTask: function (win) {
            for (var winid in this.tasks) {
                var t = this.tasks[winid];
                if (winid == win.id) {
                    t.addClass("l-taskbar-task-active");
                } else {
                    t.removeClass("l-taskbar-task-active");
                }
            }
        },

        //获取任务
        getTask: function (win) {
            var self = this;
            if (!self.taskbar) return;
            if (self.tasks[win.id]) return self.tasks[win.id];
            return null;
        },

        //增加任务
        addTask: function (win) {
            var self = this;
            if (!self.taskbar) self.createTaskbar();
            if (self.tasks[win.id]) return self.tasks[win.id];
            var title = win.get('title');
            var task = self.tasks[win.id] = $('<div class="l-taskbar-task"><div class="l-taskbar-task-icon"></div><div class="l-taskbar-task-content">' + title + '</div></div>');
            self.taskbar.tasks.append(task);
            self.activeTask(win);
            task.bind('click', function () {
                self.activeTask(win);
                if (win.actived)
                    win.min();
                else
                    win.active();
            }).hover(function () {
                $(this).addClass("l-taskbar-task-over");
            }, function () {
                $(this).removeClass("l-taskbar-task-over");
            });
            return task;
        },

        hasTask: function () {
            for (var p in this.tasks) {
                if (this.tasks[p])
                    return true;
            }
            return false;
        },

        //移除任务
        removeTask: function (win) {
            var self = this;
            if (!self.taskbar) return;
            if (self.tasks[win.id]) {
                self.tasks[win.id].unbind();
                self.tasks[win.id].remove();
                delete self.tasks[win.id];
            }
            if (!self.hasTask()) {
                self.removeTaskbar();
            }
        },
        //前端显示
        setFront: function (win) {
            if (win.options.coverMode) return;
            var wins = leeUI.find(leeUI.core.Win);
            for (var i in wins) {
                var w = wins[i];
                if (w == win) {
                    $(w.element).css("z-index", "9200");
                    this.activeTask(w);
                } else {
                    $(w.element).css("z-index", "9100");
                }
            }
        }
    };

    //窗口基类 window、dialog
    leeUI.core.Win = function (element, options) {
        leeUI.core.Win.base.constructor.call(this, element, options);
    };

    leeUI.core.Win.leeExtend(leeUI.core.UIComponent, {
        __getType: function () {
            return 'leeUI.controls.Win';
        },
        mask: function (id) {
            // 遮罩

            if (this.options.modal) {
                if (id) {
                    leeUI.win.maskid(id);
                } else {
                    leeUI.win.mask(this);
                }
            }
        },
        unmask: function (id) {
            if (this.options.modal) {
                if (id) {
                    leeUI.win.unmaskid(id);
                } else {
                    leeUI.win.unmask(this);
                }
            }
        },
        min: function () { },
        max: function () { },
        active: function () { }
    });

    //这里指定编辑器类型
    leeUI.editors = {
        "text": {
            control: 'TextBox'
        },
        "dropdown": {
            control: 'DropDown'
        },
        "lookup": {
            control: 'Lookup'
        },
        "popup": {
            control: 'Popup'
        },
        "date": {
            control: 'Date'
        }
    }
    //grid 扩展编辑器的时候回自动给editor的options加上gridEditParm


})(jQuery);

$.browser = {};
$.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
$.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
$.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());



+
function ($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function () {
            called = true
        })
        var callback = function () {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);