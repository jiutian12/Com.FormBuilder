var WidgetVisualGraph = createClass(Control, {
    type: "WidgetVisualGraph",
    typeAlias: "VisualGraph",
    Dock: "Fill",
    Width: 300,
    Height: 300,
    GraphID: "",
    OnClick: "function(sender, eventArgs){\n\n}",
    Refresh: function(a) {
        this.refresh(a)
    },
    GetCell: function(b) {
        if (!this._referenceObject) {
            return null
        }
        var a = this._referenceObject.getModel().cells;
        if (!a) {
            return null
        }
        return a[b]
    },
    GetCellValue: function(b) {
        var a = this.GetCell(b);
        if (!a) {
            return ""
        }
        return a.getValue() || ""
    },
    SetCellValue: function(c, b) {
        var a = this.GetCell(c);
        if (!a) {
            return
        }
        this._referenceObject.getModel().setValue(a, b)
    },
    ForeachCell: function(b) {
        if (!this._referenceObject) {
            return
        }
        var c = this._referenceObject.getModel().cells;
        var a;
        for (var d in c) {
            if (d < 2 || !c.hasOwnProperty(d)) {
                continue
            }
            a = c[d];
            if (b && a) {
                b(d, a)
            }
        }
    },
    init: function(a) {
        this.base(a)
    },
    render: function() {
        this.base();
        if (!this.el) {
            return
        }
        var a = ["<div style='text-align:center'>", "<div style='display:inline-block; margin:5px;' >", "</div>", "</div>"].join("");
        this.el.innerHTML = a;
        this.dom = {
            graphel: this.el.childNodes[0].children[0]
        };
        MY.dom.addClass(this.el, "run-component-visualgraph");
        this._onloadcompleted()
    },
    getDesignerProperty: function() {
        var a = this.base();
        a.push({
            name: "GraphID",
            editor: {
                type: "ComboBox",
                extend: ChooseVisualGraphPropertyEditor
            },
            value: this.GraphID
        });
        return a
    },
    getDesignerEvent: function() {
        var a = this.base();
        a.push({
            name: "OnClick",
            editor: {
                type: "Event"
            }
        });
        return a
    },
    getDesigner: function() {
        return new DesignPanel({
            owner: this
        })
    },
    refresh: function(a) {
        var b = this;
        MyRS.Core.Utils.GetVisualGraphEntity(this.GraphID, true, function(f) {
            if (f) {
                var i = f.value.GraphXml;
                var e = f.value.GraphConfig;
                var d = JSON.parse(e);
                if (!mxClient.isBrowserSupported()) {
                    mxUtils.error("Browser is not supported!", 200, false)
                } else {
                    var h = {
                        "default": null
                    };
                    h["default"] = mxUtils.load(STYLE_PATH + "/default.xml").getDocumentElement();
                    var j = new Graph(b.dom.graphel,null,null,null,h);
                    j.resizeContainer = false;
                    j.setEnabled(true);
                    j.setCellsEditable(false);
                    j.setCellsSelectable(false);
                    j.setPanning(false);
                    j.setConnectable(false);
                    j.setCellsMovable(false);
                    j.dblClick = function() {}
                    ;
                    var l = j.getStylesheet().getDefaultEdgeStyle();
                    l.strokeColor = "#777";
                    j.getCursorForCell = function(o) {
                        if (o && o.value !== null && o.vertex == 1) {
                            return "pointer"
                        }
                    }
                    ;
                    j.addListener(mxEvent.CLICK, function(p, o) {
                        var q = o.getProperty("cell");
                        b._onclick(q, d)
                    });
                    var n = mxUtils.parseXml(i);
                    var g = new mxCodec(n);
                    g.decode(n.documentElement, j.getModel());
                    var c = j.getGraphBounds();
                    var m = -c.x;
                    var k = -c.y;
                    j.view.setTranslate(Math.round(m), Math.round(k));
                    $(b.dom.graphel).css({
                        width: c.width
                    });
                    $(b.el).css("overflow", "auto");
                    b._referenceObject = j;
                    if (a) {
                        a(j)
                    }
                }
            }
        })
    },
    _onclick: function(cell, eventList) {
        if (cell) {
            var findEventItem = null;
            for (var i = 0; i < eventList.length; i++) {
                if (eventList[i].id == cell.id) {
                    findEventItem = eventList[i];
                    break
                }
            }
            var eventArgs = {
                vertex: cell.vertex,
                param: (findEventItem ? findEventItem.onclickparam : undefined) || "",
                cell: cell,
                graph: this._referenceObject,
                cancel: false
            };
            runEvent(this, "OnClick", [this, eventArgs]);
            if (findEventItem && findEventItem.onclick && !eventArgs.cancel) {
                if (cell && cell.vertex == 1) {
                    var script = "MY.Script.globalEval('" + findEventItem.onclick + "')";
                    eval(script)
                }
            }
        }
    }
});
