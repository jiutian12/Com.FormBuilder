var mygp = {};
$(function() {
    mygp.params = MY.getPageParams() || {};
    mxGraph.prototype.expandedImage = null;
    mxGraph.prototype.foldingEnabled = false;
    editorUi = new EditorUi(new Editor());
    graph = editorUi.editor.graph;
    parent = graph.getDefaultParent();
    model = graph.getModel();
    configureStylesheet(editorUi.editor.graph);
    editorUi.addListener("oncopy", function(c, b) {
        console.log("oncopy ...")
    });
    editorUi.addListener("onpaste", function(c, b) {
        console.log("onpaste: ");
        console.log(b.getProperty("cells"))
    });
    var a = graph.cellsAdded;
    graph.cellsAdded = function(l, j, g, b, h) {
        var c = {};
        for (var f = 0; f < l.length; f++) {
            var k = l[f];
            k.data = k.data || {};
            var d = graph.getCellStyle(k);
            if (k.isVertex()) {
                var e = this.getNextId(d.shape, k.data.ID, c);
                k.data.ID = e
            } else {
                var e = this.getNextId("sequenceFlow", k.data.ID, c);
                k.data.ID = e
            }
        }
        a.call(this, l, j, g, b, h)
    }
    ;
    graph.getNextId = function(i, e, c) {
        var k = this.model.cells;
        for (var f in k) {
            if (k.hasOwnProperty(f) && k[f].data) {
                c[k[f].data.ID] = 1
            }
        }
        if (e) {
            i = e
        }
        if (e && !c[e]) {
            return e
        }
        var g = new RegExp("_(\\d+)$","i");
        var h = g.exec(i);
        if (h) {
            var b = h[0];
            i = i.substr(0, i.length - b.length)
        }
        var j = 1;
        var d;
        do {
            d = i + "_" + j;
            j++
        } while (c[d] != null);c[d] = "d";
        return d
    }
    ;
    if (processId) {
        window.setTimeout(function() {
            var c = $.trim(document.getElementById("flowGraphXml").innerHTML);
            if (!c) {
                return
            }
            editorUi.loadGraph(c);
            var b = graph.model.filterDescendants();
            for (var d = 0; d < b.length; d++) {
                if (b[d].code) {
                    b[d].data = namedElements[b[d].code]
                }
            }
            if (!nograph) {
                return
            }
            var e = new mxHierarchicalLayout(graph,mxConstants.DIRECTION_WEST);
            editorUi.executeLayout(function() {
                graph.selectAll();
                var f = graph.getSelectionCells();
                e.execute(graph.getDefaultParent(), f.length == 0 ? null : f)
            }, true)
        }, 100)
    }
});
function configureStylesheet(a) {
    var b = a.getStylesheet().getDefaultVertexStyle();
    b.strokeColor = "#888888";
    b.fontFamily = "宋体";
    b.fontStyle = 1;
    b = a.getStylesheet().getDefaultEdgeStyle();
    b.rounded = "1";
    b.strokeWidth = 2;
    b.strokeColor = "#777777";
    a.defaultEdgeStyle.rounded = "1";
    a.defaultEdgeStyle.strokeColor = "#888888"
}
function getAllFlowNode() {
    var b = graph.model.filterDescendants();
    var a = [];
    if (b.length > 0) {
        for (var c = 0; c < b.length; c++) {
            if (b[c].isVertex() && b[c].getChildCount() === 0) {
                a.push(b[c])
            }
        }
    }
    return a
}
function getAllSequenceFlow() {
    var b = graph.model.filterDescendants();
    var a = [];
    if (b.length > 0) {
        for (var c = 0; c < b.length; c++) {
            if (b[c].isEdge() && b[c].getChildCount() === 0) {
                a.push(b[c])
            }
        }
    }
    return a
}
function getProcessDefine() {
    var n = {};
    for (var b in graph.data) {
        var s;
        if (b == "Name" || b == "ID" || !graph.data.hasOwnProperty(b)) {
            continue
        }
        s = graph.data[b];
        n[b] = s
    }
    n.ProcessID = graph.data.ID;
    n.ProcessName = graph.value;
    n.PackageID = mygp.params.packageid;
    n.Descript = "";
    n.GraphXml = "";
    n.StartEvents = [];
    n.EndEvents = [];
    n.UserTasks = [];
    n.ApproveTasks = [];
    n.WaitTasks = [];
    n.Gateways = [];
    n.ScriptTasks = [];
    n.SequenceFlows = [];
    var c = getAllFlowNode(), l = {}, m, h, e;
    for (m = 0; m < c.length; m++) {
        var f = c[m]
          , k = f.data || {};
        if (k.ID) {
            f.code = k.ID
        }
        var a = graph.getCellStyle(f)
          , q = a.shape.substr(0, 1).toUpperCase() + a.shape.substr(1) + "s"
          , p = n[q];
        if ($.isArray(p)) {
            k.Name = f.value;
            p.push(k)
        }
        h = f.edges;
        if (h && h.length) {
            for (var g = 0; g < h.length; g++) {
                e = h[g];
                if (e && e.data) {
                    e.code = e.data.ID;
                    if (!l[e.id]) {
                        l[e.id] = e
                    }
                }
            }
        }
    }
    for (var d in l) {
        if (!l.hasOwnProperty(d)) {
            continue
        }
        e = l[d];
        if (e && (e.source === e.target)) {
            continue
        }
        var r = checkDefine("SequenceFlow", e);
        if (!r.validated) {
            alert(r.message);
            return
        }
        var k = e.data;
        var o = {
            ID: k.ID,
            Name: e.value,
            SourceRef: e.source.data.ID,
            TargetRef: e.target.data.ID,
            DispOrder: k.DispOrder,
            Condition: k.Condition,
            IsDefault: k.IsDefault,
            OnAfterSelect: k.OnAfterSelect || []
        };
        n.SequenceFlows.push(o)
    }
    n.GraphXml = editorUi.save();
    return n
}
function doSave(b) {
    if (document.activeElement) {
        document.activeElement.blur()
    }
    if (processIsPublished) {
        showMessageBox("已发布的流程不能更改");
        return
    }
    var a = function() {
        var d = getProcessDefine();
        if (!d) {
            return
        }
        var c = {
            type: "POST",
            cache: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(d),
            dataType: "json",
            success: function(e) {
                top.MY.wait.hide();
                if (e.IsOK) {
                    editorUi.editor.modified = false;
                    if (b) {
                        b();
                        return
                    }
                    showMessageBox("保存成功")
                } else {
                    showMessageBox({
                        message: "保存失败, " + e.Message,
                        time: -1
                    })
                }
            },
            error: function() {
                top.MY.wait.hide()
            }
        };
        top.MY.wait.show();
        $.ajax("?action=save", c)
    };
    setTimeout(a, 10)
}
function checkDefine(b, d) {
    var a = {
        validated: true,
        message: ""
    }, c, e = {
        SequenceFlow: function(i) {
            var f = a;
            if (!i) {
                return f
            }
            var h = i.data && i.data.ID;
            var g = i.data && i.data.Name;
            if (!i.source) {
                f.message = "线的起始节点不能为空，编码：" + h + ",名称：" + g;
                f.validated = false;
                return f
            }
            if (!i.target) {
                f.message = "线的目标节点不能为空，编码：" + h + ",名称：" + g;
                f.validated = false;
                return f
            }
            return f
        }
    };
    c = e[b];
    return c ? c(d) : a
}
function doPublish() {
    var a = window.DLGWIN;
    if (!a) {
        return
    }
    if (processIsPublished) {
        showMessageBox("已发布的流程不能更改");
        return
    }
    doSave(function() {
        if (a.DialogArgs && a.DialogArgs.publish) {
            a.DialogArgs.publish()
        }
    })
}
;