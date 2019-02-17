var ProcessDataEditor = function(b, a) {
    this.editorUi = b;
    this.container = a;
    this.init()
};
ProcessDataEditor.prototype.labelIndex = 0;
ProcessDataEditor.prototype.currentIndex = 0;
ProcessDataEditor.prototype.init = function() {
    var c = this.editorUi;
    var a = c.editor;
    var b = a.graph;
    this.update = mxUtils.bind(this, function(e, d) {
        this.clearSelectionState();
        this.refresh()
    });
    b.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
    b.addListener(mxEvent.EDITING_STARTED, this.update);
    b.addListener(mxEvent.EDITING_STOPPED, this.update);
    b.getModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function() {
        this.clearSelectionState()
    }));
    this.dom = {};
    this.render();
    this.refresh()
}
;
ProcessDataEditor.prototype.render = function() {
    if (this.dom.title) {
        return
    }
    var a = $(this.container).html("<div class='property-panel-title'>属性设置<ins class='fa fa-close'></ins></div><div class='property-panel-content'></div>");
    this.dom.title = a.find("div.property-panel-title");
    this.dom.content = a.find("div.property-panel-content")
}
;
ProcessDataEditor.prototype.clearSelectionState = function() {
    this.selectionState = null
}
;
ProcessDataEditor.prototype.getSelectionState = function() {
    if (this.selectionState == null) {
        this.selectionState = this.createSelectionState()
    }
    return this.selectionState
}
;
ProcessDataEditor.prototype.createSelectionState = function() {
    var b = this.editorUi.editor.graph.getSelectionCells();
    var a = this.initSelectionState();
    for (var c = 0; c < b.length; c++) {
        this.updateSelectionStateForCell(a, b[c], b)
    }
    return a
}
;
ProcessDataEditor.prototype.initSelectionState = function() {
    return {
        vertices: [],
        edges: [],
        x: null,
        y: null,
        width: null,
        height: null,
        style: {},
        containsImage: false,
        containsLabel: false,
        fill: true,
        glass: true,
        rounded: true,
        image: true,
        shadow: true
    }
}
;
ProcessDataEditor.prototype.updateSelectionStateForCell = function(k, h, j) {
    var i = this.editorUi.editor.graph;
    if (i.getModel().isVertex(h)) {
        k.vertices.push(h);
        var b = i.getCellGeometry(h);
        if (b != null) {
            if (b.width > 0) {
                if (k.width == null) {
                    k.width = b.width
                } else {
                    if (k.width != b.width) {
                        k.width = ""
                    }
                }
            } else {
                k.containsLabel = true
            }
            if (b.height > 0) {
                if (k.height == null) {
                    k.height = b.height
                } else {
                    if (k.height != b.height) {
                        k.height = ""
                    }
                }
            } else {
                k.containsLabel = true
            }
            if (!b.relative || b.offset != null) {
                var e = (b.relative) ? b.offset.x : b.x;
                var d = (b.relative) ? b.offset.y : b.y;
                if (k.x == null) {
                    k.x = e
                } else {
                    if (k.x != e) {
                        k.x = ""
                    }
                }
                if (k.y == null) {
                    k.y = d
                } else {
                    if (k.y != d) {
                        k.y = ""
                    }
                }
            }
        }
    } else {
        if (i.getModel().isEdge(h)) {
            k.edges.push(h)
        }
    }
    var a = i.view.getState(h);
    if (a != null) {
        k.glass = k.glass && this.isGlassState(a);
        k.rounded = k.rounded && this.isRoundedState(a);
        k.image = k.image && this.isImageState(a);
        k.shadow = k.shadow && this.isShadowState(a);
        k.fill = k.fill && this.isFillState(a);
        var c = mxUtils.getValue(a.style, mxConstants.STYLE_SHAPE, null);
        k.containsImage = k.containsImage || c == "image";
        for (var g in a.style) {
            var f = a.style[g];
            if (f != null) {
                if (k.style[g] == null) {
                    k.style[g] = f
                } else {
                    if (k.style[g] != f) {
                        k.style[g] = ""
                    }
                }
            }
        }
    }
}
;
ProcessDataEditor.prototype.isFillState = function(a) {
    return a.view.graph.model.isVertex(a.cell) || mxUtils.getValue(a.style, mxConstants.STYLE_SHAPE, null) == "arrow" || mxUtils.getValue(a.style, mxConstants.STYLE_SHAPE, null) == "flexArrow"
}
;
ProcessDataEditor.prototype.isGlassState = function(b) {
    var a = mxUtils.getValue(b.style, mxConstants.STYLE_SHAPE, null);
    return (a == "label" || a == "rectangle" || a == "internalStorage" || a == "ext" || a == "umlLifeline" || a == "swimlane")
}
;
ProcessDataEditor.prototype.isRoundedState = function(b) {
    var a = mxUtils.getValue(b.style, mxConstants.STYLE_SHAPE, null);
    return (a == "label" || a == "rectangle" || a == "internalStorage" || a == "corner" || a == "parallelogram" || a == "swimlane" || a == "triangle" || a == "trapezoid" || a == "ext" || a == "step" || a == "tee" || a == "process" || a == "link" || a == "rhombus" || a == "offPageConnector" || a == "loopLimit" || a == "hexagon" || a == "manualInput" || a == "curlyBracket" || a == "singleArrow" || a == "doubleArrow" || a == "flexArrow" || a == "card" || a == "umlLifeline")
}
;
ProcessDataEditor.prototype.isImageState = function(b) {
    var a = mxUtils.getValue(b.style, mxConstants.STYLE_SHAPE, null);
    return (a == "label" || a == "image")
}
;
ProcessDataEditor.prototype.isShadowState = function(b) {
    var a = mxUtils.getValue(b.style, mxConstants.STYLE_SHAPE, null);
    return (a != "image")
}
;
ProcessDataEditor.prototype.clear = function() {
    this.dom.content.empty();
    if (this.panels != null) {
        for (var a = 0; a < this.panels.length; a++) {
            this.panels[a].destroy()
        }
    }
    this.panels = []
}
;
ProcessDataEditor.prototype.refresh = function() {
    var b = this.container;
    if (b.style.width == "0px") {
        return
    }
    this.clear();
    var g = this.editorUi, e, i = g.editor.graph, a = document.createElement("div"), h, f, d;
    this.dom.content.append(a);
    if (i.isSelectionEmpty()) {
        e = "WorkFlow";
        if (!i.data) {
            i.data = processDefine;
            i.data.ID = processDefine.ProcessID;
            i.value = processName
        }
        f = i
    } else {
        h = this.getSelectionState();
        if (h.vertices.length) {
            f = h.vertices[0]
        } else {
            f = h.edges[0]
        }
        d = i.getCellStyle(f);
        e = d.shape.substr(0, 1).toUpperCase() + d.shape.substr(1)
    }
    if (this.currentCell === f) {
        return
    }
    var c = MY.getPageParams() || {};
    propertyPanel.refresh({
        currentShape: e,
        uiEditor: g.editor,
        selectedCell: f,
        el: a,
        urlParams: c
    });
    this.currentCell = f
}
;
function CustomDataPropertyChange(a, c, b) {
    this.cell = a;
    this.propName = c;
    this.value = b;
    this.previous = b;
    this.data = a.data
}
CustomDataPropertyChange.prototype.execute = function() {
    var a = this.data[this.propName];
    if (this.previous == null) {
        delete this.data[this.propName]
    } else {
        if (this.previous && $.isPlainObject(this.previous)) {
            this.data[this.propName] = $.extend({}, a, this.previous)
        } else {
            this.data[this.propName] = this.previous
        }
    }
    this.previous = a
}
;
var propertyPanel = {
    el: null,
    expandGroup: {},
    template: {
        group: "<dt class='property-group-title' name='{name}'><ins class='fa'></ins>{title}</dt><dd class='property-group-content'><table class='property-list'><colgroup><col width='100px'/><col width='100%' /></colgroup>{content}</table></dd>",
        property: {
            two: "<tr name='{name}'><th class='property-item-title' {titleStyle}>{title}</th><td class='property-item-value'><div class='property-item-ctrl'></div></td></tr>",
            one: "<tr name='{name}'><th class='property-item-title none'>{title}</th><td class='property-item-value' colspan='2'><div class='property-item-ctrl'></div></td></tr>"
        }
    },
    init: function(a) {
        $.extend(this, a);
        this.el = $(this.el);
        this.config = window.getPropertyConfig(this.currentShape, propertyValueOptions);
        this.render()
    },
    render: function() {
        var a = "expand"
          , b = this
          , c = this.expandGroup;
        this.el.on("click", "dt.property-group-title", function() {
            var g = $(this)
              , f = g.hasClass(a)
              , e = !f
              , d = g.attr("name");
            g.toggleClass(a, e);
            g.next().toggle(e);
            if (e) {
                c[d] = true
            } else {
                delete c[d]
            }
        })
    },
    refresh: function(a) {
        this.init(a);
        this.clear();
        this.createGroup();
        var b = this.el;
        this.expandGroup.common = true;
        $.each(this.expandGroup, function(c) {
            b.find("dt[name='" + c + "']").click()
        })
    },
    clear: function() {
        this.el.empty()
    },
    createGroup: function() {
        var l = this.config.list, b = this.config.groups, h = this, o, d = {}, p, m = {}, q, k = this.template.group, a = this.template.property, g = ["<dl>"];
        this.propertyCtrls = {};
        for (var e = 0, c = l.length; e < c; e++) {
            p = l[e];
            if (p.visible === false) {
                continue
            }
            d[p.group] = d[p.group] || [];
            d[p.group].push(MY.String.formatWithObj(p.showTitle === false ? a.one : a.two, p));
            m[p.name] = p
        }
        for (var f = 0, n = b.length; f < n; f++) {
            o = b[f];
            q = d[o.name];
            if (q && q.length) {
                g.push(MY.String.formatWithObj(k, {
                    title: o.title,
                    content: q.join(""),
                    name: o.name
                }))
            }
        }
        g.push("</dl>");
        this.el.html(g.join(""));
        this.el.find("div.property-item-ctrl").each(function(r, s) {
            var j = $(this).parents("tr").attr("name");
            h.createProperty(m[j], s)
        })
    },
    createProperty: function(f, c) {
        var b = this
          , a = f.propName || f.name
          , e = this.selectedCell.data || {}
          , d = PropertyValueEditor.createCtrl({
            el: c,
            property: f,
            name: a,
            owner: this,
            value: a == "Name" ? this.selectedCell.value : e[a],
            onsetdefaultvalue: function(g) {
                if (a == "Name") {
                    return
                }
                e[a] = g
            },
            onchange: function(g) {
                b.updateCellValue(g)
            },
            onpropertyvaluechange: function(i) {
                var h = this.property
                  , g = h.getRelativePropertyOptions && h.getRelativePropertyOptions(i);
                b.setPropertyVisible(g);
                if (h.onpropertyvaluechange) {
                    h.onpropertyvaluechange.call(b, i)
                }
            }
        });
        this.propertyCtrls[a] = d
    },
    getAllFlowNode: function(c) {
        var d = this.uiEditor.graph
          , b = d.model.filterDescendants()
          , a = [];
        if (!b.length) {
            return a
        }
        $.each(b, function(g, e) {
            var h = d.getCellStyle(e)
              , f = h.shape;
            if (e.isVertex() && e.getChildCount() === 0 && e.edges != null) {
                if (c && !c(e, f)) {
                    return
                }
                a.push(e)
            }
        });
        return a
    },
    setPropertyVisible: function(b) {
        if (!b || !b.length) {
            return
        }
        var a = this.el.find("tr[name]");
        $.each(b, function(c, d) {
            a.filter("[name='" + d.name + "']").toggle(d.visible)
        })
    },
    updateCellValue: function(d) {
        var c, a, b;
        if (!(a = this.selectedCell)) {
            return
        }
        b = this.uiEditor.graph;
        c = a.data;
        if (d.name == "Name") {
            if (a == b) {
                b.value = d.newValue
            } else {
                this.uiEditor.graph.model.setValue(a, d.newValue)
            }
        }
        this.customPropertyChange(a, d.name, d.newValue)
    },
    customPropertyChange: function(a, c, e) {
        var b = this.uiEditor.graph.model
          , d = new CustomDataPropertyChange(a,c,e);
        if (e && typeof e == "object") {}
        b.beginUpdate();
        b.execute(d);
        b.endUpdate()
    }
};
var PropertyValueEditor = createClass({
    editor: {},
    _getDefaultValue: function() {
        var a = this.property.defaultValue
          , b = this.property.defaultValueJson;
        if (!a || typeof a != "object") {
            return a
        }
        if (!b) {
            b = this.property.defaultValueJson = JSON.stringify(a)
        }
        return JSON.parse(b)
    },
    init: function(a) {
        $.extend(this, a);
        this.el = $(this.el);
        this.dom = {};
        if (this.value == null && this.property.hasOwnProperty("defaultValue")) {
            this.value = this._getDefaultValue();
            if (this.onsetdefaultvalue) {
                this.onsetdefaultvalue(this.value)
            }
        }
        this.render()
    },
    render: function() {
        var a = "<input type='text' tabindex='0' class='property-text' />";
        this.el.html(a);
        this.ctrl = this.el.find("input");
        this.setValue(this.value);
        this.initEvent()
    },
    initEvent: function() {
        this.ctrl.bind({
            click: function() {
                this.focus()
            },
            change: $.proxy(this.callchange, this)
        })
    },
    callchange: function() {
        var b = this.getValue()
          , a = this.value;
        if (b == a) {
            return
        }
        if (this.onchange) {
            if (this.check && !this.check(b)) {
                this.setValue(a);
                return
            }
            this.onchange({
                oldValue: a,
                newValue: b,
                name: this.name
            })
        }
        this.value = b;
        if (this.onpropertyvaluechange) {
            this.onpropertyvaluechange(b)
        }
    },
    check: function(c) {
        if (this.name !== "ID") {
            return true
        }
        var b = /^[A-Za-z_]\w+$/;
        if (!b.test(c)) {
            alert("Name第一个字符必须是一个字母或一个下划线(_),后续的字符必须是字母、数字或下划线");
            return false
        }
        var a = {};
        if (a.hasOwnProperty(c)) {
            alert(c + "已存在");
            return false
        }
        return true
    },
    getValue: function() {
        return this.ctrl.val()
    },
    setValue: function(a) {
        this.ctrl.val(a);
        this.value = a;
        if (this.onpropertyvaluechange) {
            this.onpropertyvaluechange(a)
        }
    },
    setRelativePropertyVisible: function() {}
});
PropertyValueEditor.ctrl = {};
PropertyValueEditor.createCtrl = function(a) {
    var d = a.property
      , b = d && d.editor;
    if (!b) {
        return null
    }
    if (typeof b == "string") {
        b = {
            type: b
        };
        a.editor = b
    } else {
        a.editor = b
    }
    var c = PropertyValueEditor.ctrl[b.type];
    return c ? new c(a) : null
}
;
PropertyValueEditor.ctrl.Text = MY.createClass(PropertyValueEditor, {
    init: function(a) {
        this.base(a)
    }
});
PropertyValueEditor.ctrl.Number = MY.createClass(PropertyValueEditor, {
    init: function(a) {
        this.base(a)
    },
    initEvent: function() {
        this.base();
        var b = this.editor.postfix
          , a = /^[+-]$/;
        this.ctrl.bind({
            keypress: function(c) {
                var e = c.which
                  , d = this.value;
                if (e >= 48 && c.keyCode <= 57) {
                    return
                }
                if (e == 45 && d.indexOf("-") == -1) {
                    return
                }
                if (e == 46 && d.indexOf(".") == -1) {
                    return
                }
                if (b && String.fromCharCode(e) == b && d.indexOf(b) == -1) {
                    return
                }
                c.preventDefault()
            },
            keyup: function(c) {
                var d = this.value;
                if (a.test(d)) {
                    return
                }
                var e = d;
                if (b && MY.String.endWith(d, b)) {
                    e = d.substr(0, d.lastIndexOf(b))
                }
                if (MY.String.IsNumber(e) != 0) {
                    this.value = ""
                }
            }
        })
    },
    getValue: function() {
        var b = this.ctrl.val()
          , a = this.editor;
        if (a.postfix && MY.String.endWith(b, a.postfix)) {
            return b
        }
        return parseFloat(b, 10) || 0
    }
});
PropertyValueEditor.ctrl.Textarea = MY.createClass(PropertyValueEditor, {
    init: function(a) {
        this.base(a)
    },
    render: function() {
        var a = "<textarea class='property-text' col='4'></textarea>";
        this.el.html(a);
        this.ctrl = this.el.find("textarea");
        this.setValue(this.value);
        this.initEvent()
    }
});
PropertyValueEditor.ctrl.Radio = MY.createClass(PropertyValueEditor, {
    template: "<label class='property-radio'><input type='radio' value='{value}' name='{name}' />{text}</label>",
    init: function(a) {
        this.base(a)
    },
    render: function() {
        var b = ""
          , c = this.template
          , a = this.name;
        $.each(this.editor.items, function(d, e) {
            e.name = a;
            b += MY.String.formatWithObj(c, e)
        });
        this.el.html(b);
        this.setValue(this.value);
        this.initEvent()
    },
    initEvent: function() {
        this.el.find("input").change($.proxy(this.callchange, this))
    },
    getValue: function() {
        var b, a = this.editor.items;
        this.el.find("input").each(function(d, c) {
            var e = a[d];
            if (c.checked) {
                b = e.value;
                return false
            }
        });
        return b
    },
    setValue: function(b) {
        var a = this.editor.items;
        this.el.find("input").each(function(d, c) {
            var e = a[d];
            if (e.value == b) {
                c.checked = true;
                return false
            }
        });
        this.value = b;
        if (this.onpropertyvaluechange) {
            this.onpropertyvaluechange(b)
        }
    }
});
PropertyValueEditor.ctrl.Checkbox = MY.createClass(PropertyValueEditor, {
    template: "<label class='property-checkbox'><input type='checkbox' name='{value}' />{text}</label>",
    init: function(a) {
        this.base(a)
    },
    render: function() {
        var a = ""
          , b = this.template;
        $.each(this.editor.items, function(c, d) {
            d.name = name;
            a += MY.String.formatWithObj(b, d)
        });
        this.el.html(a);
        if (this.constructor == PropertyValueEditor.ctrl.Checkbox) {
            this.setValue(this.value);
            this.initEvent()
        }
    },
    initEvent: function() {
        this.el.find("input[type='checkbox']").change($.proxy(this.callchange, this))
    },
    getValue: function() {
        var a = {};
        this.el.find("input").each(function(b, c) {
            a[c.name] = c.checked
        });
        return a
    },
    setValue: function(a) {
        a = a || {};
        this.el.find("input[type='checkbox']").each(function(b, c) {
            c.checked = a[c.name]
        });
        this.value = a;
        if (this.onpropertyvaluechange) {
            this.onpropertyvaluechange(a)
        }
    }
});
PropertyValueEditor.ctrl.Boolean = MY.createClass(PropertyValueEditor, {
    template: "<label class='property-checkbox'><input type='checkbox' />{text}</label>",
    init: function(a) {
        this.base(a)
    },
    render: function() {
        var a = MY.String.formatWithObj(this.template, this.editor);
        this.el.html(a);
        this.ctrl = this.el.find("input");
        this.setValue(this.value);
        this.initEvent()
    },
    setValue: function(b) {
        var a = false;
        if (b != null) {
            b += "";
            a = b == "true" || b == "1"
        }
        this.value = a;
        this.ctrl.prop("checked", a);
        if (this.onpropertyvaluechange) {
            this.onpropertyvaluechange(a)
        }
    },
    getValue: function() {
        return this.ctrl.prop("checked")
    }
});
PropertyValueEditor.ctrl.Combobox = MY.createClass(PropertyValueEditor, {
    template: "<option value='{value}'>{text}</option>",
    init: function(a) {
        this.base(a)
    },
    render: function() {
        var a = "<select class='property-select'>"
          , b = this.template;
        $.each(this.editor.items, function(c, d) {
            if (typeof d === "string") {
                d = {
                    value: d,
                    text: d
                }
            }
            a += MY.String.formatWithObj(b, d)
        });
        a += "</select>";
        this.el.html(a);
        this.ctrl = this.el.find("select");
        if (this.value != null) {
            this.setValue(this.value + "")
        } else {
            this.ctrl.prop("selectedIndex", -1)
        }
        this.initEvent()
    }
});
PropertyValueEditor.ctrl.DataItemPermissions = MY.createClass(PropertyValueEditor, {
    inputs: [],
    cols: [{
        name: "Visible",
        title: "可见"
    }, {
        name: "Writeable",
        title: "可写"
    }, {
        name: "Required",
        title: "必填"
    }],
    init: function(a) {
        this.base(a)
    },
    initEvent: function() {
        var a = this;
        this.el.find("input").bind({
            change: function() {
                a.setChecked(this);
                a.callchange()
            }
        })
    },
    render: function() {
        var f = "<tr><th class='property-item-title' title='{0}'>{0}</th><td class='property-item-value'>{1}</td></tr>"
          , e = this
          , d = ""
          , c = ""
          , b = ""
          , a = this.inputs = [];
        $.each(this.cols, function(g, h) {
            c += "<label><input type='checkbox' /><br/>" + h.title + "</label>";
            b += "<label><input type='checkbox' /></label>"
        });
        d = "<table class='property-list'>";
        d += "<colgroup><col width='100px'/><col width='0*' /></colgroup>";
        d += "<thead>" + MY.String.format(f, "", c) + "</thead>";
        this.editor.initItems(function(h, j) {
            j = e.items = e.groupItems(h, j);
            var l;
            for (var k = 0, g = j.length; k < g; k++) {
                l = j[k];
                if (l.isAll) {
                    continue
                }
                d += MY.String.format(f, l._ItemName || l.ItemName, b)
            }
        });
        d += "</table>";
        this.el.html(d);
        this.el.find("input").each(function(h, g) {
            g.index = h;
            a.push(g)
        });
        this.setValue(this.value);
        this.initEvent()
    },
    getCoordinate: function(a) {
        var b = {
            row: 0,
            col: 0
        }
          , c = this.cols.length;
        b.row = Math.floor(a.index / c);
        b.col = a.index % c;
        return b
    },
    getValue: function() {
        var g = [], c, k = this.cols, b = 3, n, l, f = this.inputs, h = this.items, a;
        for (var e = 0, m = h.length; e < m; e++) {
            n = h[e];
            if (!n.ItemID) {
                continue
            }
            a = $.extend({}, n);
            for (var d = 0; d < b; d++) {
                c = k[d];
                l = f[e * b + d];
                a[c.name] = l.checked
            }
            g.push(a)
        }
        return g
    },
    groupItems: function(a, b) {
        a = a || [];
        b = b || [];
        var d = {}
          , c = [];
        $.each(a, function(e, f) {
            d[f.SetID] = {
                list: [],
                SetID: f.SetID,
                SetName: f.SetName,
                IsMain: f.IsMain
            }
        });
        $.each(b, function(f, g) {
            var h = g.SetTable
              , e = d[h];
            if (!e) {
                return
            }
            if (e.IsMain) {
                g._ItemName = g.ItemName + '<br/><span style="color:gray">' + g.ItemID + "</span>"
            } else {
                g._ItemName = g.ItemName + '<br/><span style="color:gray">' + g.ItemID + "</span>"
            }
            e.list.push(g)
        });
        $.each(d, function(f, e) {
            if (e.IsMain) {
                e.list.unshift({
                    SetTable: e.SetID,
                    isAll: true
                })
            } else {
                e.list.unshift({
                    ItemName: "<b>" + e.SetName + "<br/>" + e.SetID.split("_").pop() + "</b>",
                    SetTable: e.SetID,
                    itemLength: e.list.length
                })
            }
            c = c.concat(e.list)
        });
        return c
    },
    setChecked: function(l) {
        var m = l.checked
          , o = this.getCoordinate(l)
          , b = this.cols.length
          , k = this.inputs
          , i = l.index
          , n = 0
          , c = 0
          , h = this.items
          , a = h[o.row]
          , g = this;
        if (o.row == 0) {
            n = 0;
            c = Math.floor((k.length + b - 1) / b) - 1
        } else {
            if (a.SetTable && a.itemLength) {
                n = o.row;
                c = n + a.itemLength
            } else {
                n = o.row;
                c = n
            }
        }
        var p = {
            checked: function() {
                var r = [];
                while (n <= c) {
                    var q = 0
                      , s = n * b;
                    while (q <= o.col) {
                        r.push(k[s + q]);
                        q++
                    }
                    n++
                }
                return r
            },
            unchecked: function() {
                var r = [];
                while (n <= c) {
                    var q = o.col
                      , s = n * b;
                    while (q < b) {
                        r.push(k[s + q]);
                        q++
                    }
                    n++
                }
                return r
            }
        };
        var f = function(s) {
            var r, q = o.row, t;
            while (q >= 0) {
                t = h[q];
                if (t.SetTable === a.SetTable && t.itemLength) {}
                q--
            }
        };
        var d = {
            checked: function() {
                return g.setCascadeChecked(o)
            },
            unchecked: function() {
                var r = []
                  , q = o.col;
                while (q < b) {
                    r.push(k[q]);
                    if (a.SetTable && !a.itemLength) {
                        r.push(f(q))
                    }
                    q++
                }
                return r
            }
        };
        var j = p[m ? "checked" : "unchecked"](), e;
        $.each(j, function(q, r) {
            r.checked = m
        });
        if (o.row > 0) {
            e = d[m ? "checked" : "unchecked"]();
            $.each(e, function(q, r) {
                if (r) {
                    r.checked = m
                }
            })
        }
    },
    setCascadeChecked: function(j) {
        var i = 0, k, h, d = 0, a = true, l, c = this.cols.length, g = this.inputs, f = this.items, b = this.items[j.row] || {}, e = [];
        while (i <= j.col) {
            l = {};
            d = f.length - 1;
            a = true;
            while (d > 0) {
                k = f[d];
                h = g[d * c + i];
                if (k.SetTable && !k.isAll) {
                    state = l[k.SetTable] || 0;
                    if (k.itemLength) {
                        h.checked = k.itemLength == state
                    } else {
                        state += h.checked ? 1 : 0
                    }
                    if (k.SetTable == b.SetTable && !h.checked) {
                        return e
                    }
                    l[k.SetTable] = state
                }
                a &= h.checked;
                d--
            }
            if (a) {
                e.push(g[i])
            }
            i++
        }
        return e
    },
    setValue: function(m) {
        m = m || [];
        this.value = m;
        var c, h = this.cols, b = 3, p, k, f = this.inputs, g = this.items, a, n = {};
        $.each(m, function(j, i) {
            n[i.SetTable + "." + i.ItemID] = i
        });
        for (var e = 0, l = g.length; e < l; e++) {
            p = g[e];
            if (!p.ItemID) {
                continue
            }
            a = n[p.SetTable + "." + p.ItemID] || {};
            for (var d = 0; d < b; d++) {
                c = h[d];
                k = f[e * b + d];
                k.checked = a[c.name]
            }
        }
        var o = this.setCascadeChecked({
            col: 2,
            row: -1
        });
        $.each(o, function(j, q) {
            q.checked = true
        })
    }
});
PropertyValueEditor.ctrl["PermittedActions.Reject"] = MY.createClass(PropertyValueEditor.ctrl.Checkbox, {
    toggleName: "RejectToFixed",
    inputName: "RejectToActivityIds",
    init: function(a) {
        this.base(a)
    },
    render: function() {
        this.base();
        this.dom.toggle = this.el.find("input[name='" + this.toggleName + "']");
        this.setValue(this.value);
        this.initCheckedList();
        this.dom.input = this.checkedList.el;
        this.toggleReject(this.value[this.toggleName]);
        this.initEvent()
    },
    initEvent: function() {
        this.base();
        var a = this;
        this.dom.toggle.change(function() {
            a.toggleReject(this.checked)
        });
        this.dom.input.change($.proxy(this.callchange, this))
    },
    initCheckedList: function() {
        var c = this
          , b = this.owner.getAllFlowNode(function(d, e) {
            return e == "userTask" || e == "approveTask"
        })
          , a = $.map(b, function(d) {
            var e = d.data || {};
            return {
                text: d.value,
                value: e.ID
            }
        });
        this.checkedList = PropertyValueEditor.createCtrl({
            el: $("<div></div>").appendTo(this.el),
            property: {
                name: this.inputName,
                title: "指定活动",
                editor: {
                    type: "MultiSelector",
                    items: a
                }
            },
            name: this.inputName,
            value: this.value[this.inputName] || [],
            onchange: function(d) {
                c.callchange()
            }
        })
    },
    setValue: function(a) {
        this.base(a)
    },
    getValue: function() {
        var a = this.base();
        if (a[this.toggleName]) {
            a[this.inputName] = this.checkedList.getValue()
        }
        return a
    },
    toggleReject: function(a) {
        this.dom.input.toggleClass("none", !a)
    }
});
PropertyValueEditor.ctrl.MultiSelector = MY.createClass(PropertyValueEditor, {
    template: "<span value='{value}'>{text}</span>",
    init: function(a) {
        this.base(a)
    },
    render: function() {
        var a = "<div class='property-multiselector'><button type='button' class='button'>设置</button><p class='property-multiselector-items'></p></div>";
        this.el.html(a);
        this.dom.checkedList = this.el.find("p.property-multiselector-items");
        this.dom.button = this.el.find("button");
        this.setValue(this.value);
        this.initEvent()
    },
    initEvent: function() {
        this.dom.button.click($.proxy(this.show, this))
    },
    bindValue: function(d) {
        d = d || [];
        var b = ""
          , c = this.template
          , a = this.editor.items;
        $.each(d, function(e, g) {
            var f = $.grep(a, function(i) {
                var h = i.value == g;
                if (h) {
                    i.checked = true
                }
                return h
            });
            if (f.length) {
                b += MY.String.formatWithObj(c, f[0])
            }
        });
        this.dom.checkedList.html(b)
    },
    saveValue: function(a) {
        a = a || [];
        this.bindValue(a);
        this.callchange();
        this.value = a
    },
    setValue: function(a) {
        a = a || [];
        this.bindValue(a);
        this.value = a
    },
    getValue: function(b) {
        var a = [];
        this.dom.checkedList.find("span").each(function() {
            a.push($(this).attr("value"))
        });
        return a
    },
    show: function() {
        var f = showDialogWindow({
            text: "设置",
            height: 455,
            width: 350,
            mode: "html",
            content: "<div class='dw-content-custom'></div><div></div>"
        });
        var b = f.dom.data
          , c = this
          , e = this.value;
        var a = new top.DialogOkCancelBar({
            el: b.lastChild,
            onokclick: function() {
                var g = c.listbox.getCheckedItems();
                if (!g.length) {
                    return
                }
                g = $.map(g, function(h) {
                    return h.value
                });
                c.saveValue(g);
                f.close()
            },
            oncancelclick: function() {
                f.close()
            }
        });
        var d = new top.ListBox({
            showCheckBox: true,
            el: b.firstChild,
            clickCheckBoxingCheck: false,
            items: this.editor.items
        });
        d.render();
        this.listbox = d
    }
});
PropertyValueEditor.ctrl.Script = MY.createClass(PropertyValueEditor, {
    enabled: true,
    init: function(a) {
        this.base(a)
    },
    render: function() {
        var a = "<div class='property-stringtemplate'><button type='button' class='button'>设置</button><pre></pre></div>";
        this.el.html(a);
        this.dom.code = this.el.find("pre");
        this.dom.button = this.el.find("button");
        this.setValue(this.value);
        this.initEvent()
    },
    initEvent: function() {
        var a = $.proxy(this.show, this);
        this.dom.button.click(a);
        this.dom.code.click(a)
    },
    bindValue: function(a) {
        this.dom.code.text(a).data("value", a).toggleClass("empty", !a);
        this.dom.button.toggle(!a)
    },
    getValue: function() {
        return this.dom.code.data("value") || ""
    },
    saveValue: function(a) {
        a = a || "";
        this.bindValue(a);
        this.callchange();
        this.value = a
    },
    setValue: function(a) {
        a = a || "";
        this.bindValue(a);
        this.value = a
    },
    setDefaultValue: function(a) {
        if (this.value) {
            return
        }
        this.dom.code.text(a).data("value", "").addClass("empty", true);
        this.dom.button.toggle(true)
    },
    show: function() {
        if (!this.enabled) {
            return
        }
        var b = top.absUrl + "BPM/Designer/UserScript.aspx?" + $.param(this.owner.urlParams)
          , c = this;
        var a = {
            text: "脚本编辑",
            height: 450,
            width: 800,
            content: b,
            showUrlScroll: true,
            isDialog: false,
            isAutoSize: true,
            isMax: false,
            isSize: true,
            customData: {
                scriptType: "csharp",
                mode: "script"
            },
            onclose: function() {},
            getScript: function() {
                return c.value || ""
            },
            saveScript: function(e) {
                c.saveValue(e)
            }
        };
        var d = top.showDialogWindow(a)
    }
});
PropertyValueEditor.ctrl.StringTemplate = MY.createClass(PropertyValueEditor.ctrl.Script, {
    show: function() {
        var b = top.absUrl + "BPM/Designer/UserScript.aspx?" + $.param(this.owner.urlParams)
          , c = this;
        var a = {
            text: "字符串模板编辑",
            height: 450,
            width: 820,
            content: b,
            showUrlScroll: true,
            isDialog: false,
            isAutoSize: true,
            isMax: false,
            isSize: true,
            customData: {
                scriptType: "html",
                mode: "template"
            },
            onclose: function() {},
            getScript: function() {
                return c.value || ""
            },
            saveScript: function(e) {
                c.saveValue(e)
            }
        };
        var d = top.showDialogWindow(a)
    }
});
PropertyValueEditor.ctrl.Participant = MY.createClass(PropertyValueEditor, {
    items: [],
    template: "<li>{_Description}</li>",
    init: function(a) {
        this.base(a)
    },
    render: function() {
        var a = "<div class='property-participant'><ul></ul><button type='button' class='button'>设置</button></div>";
        this.el.html(a);
        this.dom.list = this.el.find("ul");
        this.dom.button = this.el.find("button");
        this.items = this.value || [];
        this.setValue(this.value);
        this.initEvent()
    },
    initEvent: function() {
        var a = $.proxy(this.show, this);
        this.dom.button.click(a);
        this.dom.list.click(a)
    },
    bindValue: function(c) {
        this.items = c;
        var a = []
          , b = this.template;
        $.each(this.items, function(e, f) {
            var d;
            if (f.Include) {
                d = "+"
            } else {
                if (f.Exclude) {
                    d = "-"
                } else {
                    return
                }
            }
            f._Description = d + " " + f.Description;
            a.push(MY.String.formatWithObj(b, f))
        });
        this.dom.list.html(a.join(""));
        this.dom.button.toggle(!a.length)
    },
    saveValue: function(a) {
        a = a || [];
        this.bindValue(a);
        this.callchange();
        this.value = a
    },
    setValue: function(a) {
        a = a || [];
        this.bindValue(a);
        this.value = a
    },
    getValue: function() {
        return (this.items || []).slice(0)
    },
    show: function() {
        var b = this
          , a = [];
        this.owner.getAllFlowNode(function(d, e) {
            if (e == "userTask" || e == "approveTask") {
                a.push({
                    text: d.value,
                    value: d.data && d.data.ID || ""
                })
            }
        });
        var c = top.showDialogWindow({
            text: "处理人设置",
            height: 350,
            isDialog: false,
            isMax: false,
            width: 800,
            mode: "url",
            customData: {
                steps: a,
                items: this.items || [],
                types: this.editor.items || []
            },
            content: top.absUrl + "BPM/Designer/ParticipantMgr.aspx?" + $.param(this.owner.urlParams),
            onclose: function() {
                if (this.result == "ok") {
                    this.customData.items = JSON.parse(this.customData.json);
                    b.saveValue(this.customData.items)
                }
            }
        })
    }
});
PropertyValueEditor.ctrl.Event = MY.createClass(PropertyValueEditor.ctrl.Participant, {
    items: [],
    template: "<li>> {Description}</li>",
    bindValue: function(c) {
        this.items = c;
        var a = []
          , b = this.template;
        $.each(this.items, function(d, e) {
            a.push(MY.String.formatWithObj(b, e))
        });
        this.dom.list.html(a.join(""));
        this.dom.button.toggle(!c.length)
    },
    show: function() {
        var a = this;
        var b = top.showDialogWindow({
            text: this.editor.title || "事件设置",
            height: 350,
            isDialog: false,
            isMax: false,
            width: 650,
            mode: "url",
            customData: {
                items: this.items || [],
                types: this.editor.items || []
            },
            content: top.absUrl + "BPM/Designer/EventMgr.aspx?" + $.param(this.owner.urlParams),
            onclose: function() {
                if (this.result == "ok") {
                    a.saveValue(this.customData.items)
                }
            }
        })
    }
});
PropertyValueEditor.ctrl.Notice = MY.createClass(PropertyValueEditor.ctrl.Script, {
    noticeGroupName: "",
    _bindValue: function(e) {
        var a = e && e.length, f, d, c, f = [];
        c = this.combinValue(this._getDefaultNotice(), e) || [];
        a = c.length;
        for (var b = 0; b < a; b++) {
            d = c[b];
            if (d.Enabled) {
                if (d.UseDefault) {
                    f.push(d.Name)
                } else {
                    f.push("<span style='color:#ff0000'>" + d.Name + "</span>")
                }
            } else {
                f.push("<span style='color:#aaa'>" + d.Name + "</span>")
            }
        }
        f = f.join(",");
        this.dom.code.html(f).data("value", e);
        this.dom.button.toggle(!f)
    },
    _setDefaultNotice: function(a) {
        var b = this.noticeGroupName;
        this.owner.__defaultNotices[b] = JSON.stringify(a || {})
    },
    _getDefaultNotice: function() {
        var b = this.noticeGroupName
          , a = this.owner.__defaultNotices[b];
        return a ? JSON.parse(a) : {}
    },
    init: function(a) {
        a.noticeGroupName = a.noticeGroupName || "新任务通知";
        this.base(a)
    },
    bindValue: function(b) {
        var a = this
          , d = this.noticeGroupName;
        this.owner.__defaultNotices = this.owner.__defaultNotices || {};
        if (this.owner.__defaultNotices[d]) {
            this._bindValue(b)
        } else {
            var c = {
                ID: "00C50571CF0E4E9B940E5BF05DE61489",
                Args: {
                    ProcessID: this.owner.urlParams.processid
                }
            };
            top.MY.wait.show();
            top.MyRS.Core.DataService.Execute(c.ID, c.Args || {}, function(e) {
                top.MY.wait.hide();
                var f = $.grep(e.value || [], function(g) {
                    return g.GroupName == d
                })[0];
                a._setDefaultNotice(f);
                a._bindValue(b)
            })
        }
    },
    combinValue: function(h, j) {
        var g = h.Messages, b, c = {}, k, a, f = [];
        j = j || this.value || [];
        $.each(j, function(i, l) {
            c[l.Name] = l
        });
        for (var d = 0, e = g.length; d < e; d++) {
            b = g[d];
            k = c[b.Name];
            a = $.extend({}, b, k);
            a.DefaultTitle = b.Title || b.DefaultTitle;
            a.DefaultMessage = b.Message || b.DefaultMessage;
            if (k) {
                a.Title = k.Title;
                a.Message = k.Message
            } else {
                a.UseDefault = true;
                a.Title = a.Message = ""
            }
            f.push(a)
        }
        return f
    },
    saveValue: function(a) {
        var b = JSON.parse(a) || [];
        this.bindValue(b);
        this.callchange();
        this.value = b
    },
    setValue: function(a) {
        a = a || [];
        this.bindValue(a);
        this.value = a
    },
    getValue: function() {
        return this.dom.code.data("value") || []
    },
    show: function() {
        var d = this
          , c = this._getDefaultNotice()
          , e = {
            ModuleID: "A8DB49CDE29A4851A172E685424A1E0E",
            ProcessID: this.owner.urlParams.processid
        };
        var b = top.absUrl + "/WidgetModule/UI/Function/Common/Redirect.aspx?" + $.param(e);
        var a = {
            text: c.GroupName,
            height: 450,
            width: 700,
            content: b,
            showUrlScroll: true,
            Args: {
                Messages: this.combinValue(c)
            },
            isDialog: true,
            isAutoSize: false,
            isMax: false,
            isSize: false,
            onclose: function() {
                if (this.Result != "ok") {
                    return
                }
                d.saveValue(this.Args.Messages)
            }
        };
        top.showDialogWindow(a)
    }
});
PropertyValueEditor.ctrl.Expression = MY.createClass(PropertyValueEditor.ctrl.Script, {
    show: function() {
        var b = top.absUrl + "BPM/Designer/UserScript.aspx?" + $.param(this.owner.urlParams)
          , c = this
          , e = this.editor.mode || "";
        if (e) {
            e = "." + e
        }
        var a = {
            text: "表达式编辑",
            height: 450,
            width: 800,
            content: b,
            showUrlScroll: true,
            isDialog: false,
            isAutoSize: true,
            isMax: false,
            isSize: true,
            customData: {
                scriptType: "csharp",
                mode: "expression" + e
            },
            onclose: function() {},
            getScript: function() {
                return c.value || ""
            },
            saveScript: function(f) {
                c.saveValue(f)
            }
        };
        var d = top.showDialogWindow(a)
    }
});
PropertyValueEditor.ctrl.PermittedActions = MY.createClass(PropertyValueEditor, {
    template: {
        unname: "<li><label class='property-checkbox'><input type='checkbox' name='{value}' />{text}</label></li>",
        name: "<li><label class='property-checkbox'><input type='checkbox' name='{value}' />{text}</label><div class='actionname'><input class='text' name='{value}' placeholder='{text}'/></div></li>",
    },
    init: function(a) {
        this.base(a)
    },
    render: function() {
        var a = "<ul class='permittedaction-list'>"
          , b = this.template;
        $.each(this.editor.items, function(c, e) {
            if (typeof e === "string") {
                e = {
                    value: e,
                    text: e
                }
            }
            var d = e.hasName === false ? b.unname : b.name;
            a += MY.String.formatWithObj(d, e)
        });
        a += "</ul>";
        this.el.html(a);
        this.ctrl = this.el.find("input");
        if (!this.value || this.value.length == 0) {
            this.value = this._getDefaultValue();
            if (this.onsetdefaultvalue) {
                this.onsetdefaultvalue(this.value)
            }
        }
        this.setValue(this.value);
        this.initEvent()
    },
    setValue: function(a) {
        var b = {};
        $.each(a, function(c, d) {
            b[d.ID] = d.Name
        });
        this.ctrl.each(function(e, c) {
            var d = c.name
              , f = b[d];
            if (!f) {
                return
            }
            if (c.type == "checkbox") {
                c.checked = true
            } else {
                if (f !== c.placeholder) {
                    c.value = f
                }
            }
        })
    },
    getValue: function() {
        var a = []
          , c = {}
          , b = {};
        this.ctrl.each(function(f, d) {
            var e = d.name, g;
            if (!e) {
                return
            }
            if (d.type == "checkbox") {
                if (d.checked) {
                    b[e] = true
                }
            } else {
                c[e] = d.value || d.placeholder
            }
        });
        $.each(b, function(d) {
            a.push({
                ID: d,
                Name: c[d]
            })
        });
        return a
    }
});
PropertyValueEditor.ctrl.TimeoutRule = MY.createClass(PropertyValueEditor, {
    init: function(a) {
        this.dom = {};
        this.form = {};
        this.base(a)
    },
    render: function() {
        var a = $("#tmpl-overtimeprewarning").html()
          , b = this;
        this.el.html(a);
        this.el.find(":input").each(function() {
            var d = $(this);
            var c = d.data();
            if (c.tag) {
                b.form[c.tag] = d
            }
        });
        this.notice = new PropertyValueEditor.ctrl.Notice({
            el: this.el.find("div.urge-property-notice-content"),
            noticeGroupName: "超时催办通知",
            owner: this.owner,
            property: {},
            value: this.value && this.value.WarningNotify && this.value.WarningNotify.MessageItems
        });
        this.notice.callchange = function() {
            b.callchange()
        }
        ;
        this.initEvent();
        this.setValue(this.value)
    },
    initEvent: function() {
        var b = this.el
          , c = this;
        var a = {
            DeadlineType: function(f) {
                var e = f.val();
                b.find("div.deadlinetype-content").removeClass().addClass("deadlinetype-content _" + e.toLowerCase())
            },
            CalendarType: function(e) {
                b.find("li.overtimeprewarning-calendar").toggleClass("none", e.val() !== "SpecialCalendar")
            },
            "Deadline.Enabled": function(g) {
                var f = g.prop("checked")
                  , e = g[0];
                g.parents("div.deadlinetype").toggleClass("disabled", !f).find(":input").each(function(h, j) {
                    if (e == j) {
                        return
                    }
                    this.disabled = !f
                });
                b.find("input[data-tag='WarningNotify.Enabled']").prop("disabled", !f).trigger("change")
            },
            "WarningNotify.Enabled": function(f) {
                var e = f.prop("checked") && !f.prop("disabled");
                b.find("div.urge-property-times").toggleClass("disabled", !e).find("input").each(function() {
                    this.disabled = !e
                });
                b.find("div.urge-property-notice").toggleClass("disabled", !e);
                if (e) {
                    a["WarningNotify.Repeatable"](b.find("input.urge-property-repeatable"))
                }
                c.notice.enabled = e
            },
            "WarningNotify.Repeatable": function(f) {
                var e = f.prop("checked");
                f.parent().find(".urge-property-repeat").toggleClass("disabled", !e).find(".text").each(function() {
                    this.disabled = !e
                })
            }
        };
        var d = {
            selectform: function() {
                c._selectForm()
            }
        };
        this.el.find(":input").bind({
            change: function(f) {
                var h = $(this)
                  , g = h.data()
                  , e = a[g.tag];
                if (e) {
                    e(h)
                }
                if (!f.isTrigger) {
                    c.callchange()
                }
            },
            click: function() {
                var g = $(this)
                  , f = g.data()
                  , e = d[f.tag];
                if (e) {
                    e(g)
                }
            }
        });
        this.el.find(".urge-property-content .text").keypress(function(e) {
            var g = e.which
              , f = this.value;
            if (g >= 48 && e.keyCode <= 57) {
                return
            }
            e.preventDefault()
        })
    },
    setValue: function(a) {
        if (!a) {
            return
        }
        var c, d;
        if (a.WarningNotify) {
            c = Math.max(a.WarningNotify.FirstTimeMinutes || 0);
            d = Math.max(a.WarningNotify.RepeatMinutes || 0);
            a.WarningNotify.FirstTimeMinutes = {
                Hour: Math.floor(c / 60),
                Minutes: c % 60
            };
            a.WarningNotify.RepeatMinutes = {
                Hour: Math.floor(d / 60),
                Minutes: d % 60
            }
        }
        var b = function(l, o) {
            if (!o) {
                return
            }
            var j = o.split("."), m, g = a, k = l.prop("type"), h = j.length, n;
            if (h > 1) {
                for (var f = 0, h = j.length; f < h; f++) {
                    m = g[j[f]];
                    g = m
                }
            } else {
                for (var e in a) {
                    n = a[e];
                    if (n.hasOwnProperty(o)) {
                        m = n[o]
                    }
                }
            }
            if (typeof m != "undefined") {
                if (k == "checkbox") {
                    l.prop("checked", m)
                } else {
                    l.val(m)
                }
                l.trigger("change", a)
            }
        };
        this.el.find(":input").each(function() {
            var f = $(this)
              , e = f.data();
            if (!e.tag) {
                return
            }
            b(f, e.tag)
        });
        if (a.WarningNotify) {
            a.WarningNotify.FirstTimeMinutes = c;
            a.WarningNotify.RepeatMinutes = d
        }
    },
    getValue: function() {
        var b = {
            Calendar: {},
            Deadline: {},
            WarningNotify: {}
        };
        var a = {};
        this.el.find(":input").each(function() {
            var d = $(this)
              , c = d.data();
            if (!c.tag) {
                return
            }
            a[c.tag] = this.type == "checkbox" ? this.checked : d.val()
        });
        b.Calendar.CalendarType = a.CalendarType;
        b.Calendar.SpecialCalendarID = a["Calendar.SpecialCalendarID"];
        b.Deadline.DeadlineType = a.DeadlineType;
        b.Deadline.PlanTime = a.PlanTime;
        b.Deadline.Minutes = a.Minutes;
        b.Deadline.Enabled = a["Deadline.Enabled"];
        b.WarningNotify.Enabled = a["WarningNotify.Enabled"];
        b.WarningNotify.FirstTimeMinutes = (parseInt(a["WarningNotify.FirstTimeMinutes.Hour"], 10) || 0) * 60 + parseInt(a["WarningNotify.FirstTimeMinutes.Minutes"], 10) || 0;
        b.WarningNotify.Repeatable = a["WarningNotify.Repeatable"];
        b.WarningNotify.RepeatMinutes = (parseInt(a["WarningNotify.RepeatMinutes.Hour"], 10) || 0) * 60 + parseInt(a["WarningNotify.RepeatMinutes.Minutes"], 10);
        b.WarningNotify.MessageItems = this.notice.getValue();
        return b
    },
    _selectForm: function() {
        var c = this
          , b = !!this.form.PlanTime.prop("clientWidth")
          , h = b ? this.form.PlanTime : this.form.Minutes
          , i = h.val()
          , f = $.map(b ? this.editor.dateSetItems : this.editor.minutesSetItems, function(l, k) {
            return {
                text: l.text,
                value: l.value,
                selected: "@" + l.value == i
            }
        });
        var d = {
            text: "选择表单字段",
            height: 450,
            width: 350,
            mode: "html",
            content: "<div class='dock-full' style='bottom:45px;'></div><div class='dock-bottom dw-btnwrap'></div>",
            isMax: false,
            isSize: false,
            onclose: function() {
                if (this.result != "ok") {
                    return
                }
                var k = (e.getSelectedItems() || [])[0];
                if (k) {
                    k = "@" + k.value
                }
                if (k && k != i) {
                    h.val(k);
                    c.callchange()
                }
            }
        };
        var g = top.showDialogWindow(d);
        var a = g.dom.data
          , e = new top.ListBox({
            el: g.dom.data.firstChild,
            canMulitSelect: false,
            items: f
        });
        e.render();
        var j = new top.DialogOkCancelBar({
            el: g.dom.data.lastChild,
            win: window,
            onokclick: function() {
                g.result = "ok";
                g.close()
            },
            oncancelclick: function() {
                g.close()
            }
        })
    }
});
