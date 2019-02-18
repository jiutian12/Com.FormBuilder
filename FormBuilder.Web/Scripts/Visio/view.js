var VisioController = {
    model: {},
    GraphConfig: {},
    setModel: function (model) {
        this.model = model;
        if (this.model.GraphConfig) {
            this.GraphConfig = JSON.parse(this.model.GraphConfig);
        }
    },
    getModel: function () {
        this.model.GraphConfig = JSON.stringify(this.GraphConfig);
        return this.model;
    },
    load: function () {
        $.leeDialog.loading("正在初始化....");
        var self = this;
        var id = urlParams.dataid;
        $.post(_global.sitePath + "/Visio/GetModel", { id: id }, function (res) {
            if (res.res) {
                self.setModel(res.data);
                self.initGraph();
            } else {
                $.leeUI.Error(res.mes);
            }
            $.leeDialog.hideLoading();
        });
    },
    initGraph: function () {
        var self = this;
        var xml = this.getXML();
        var config = this.model.GraphConfig;
        var funcInfo = JSON.parse(config);
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error("Browser is not supported!", 200, false)
        } else {
            var h = {
                "default": null
            };
            h["default"] = mxUtils.load(STYLE_PATH + "/default.xml").getDocumentElement();
            var j = new Graph($("#visioGraphContainer")[0], null, null, null, h);
            j.resizeContainer = false;
            j.setEnabled(true);
            j.setCellsEditable(false);
            j.setCellsSelectable(false);
            j.setPanning(false);
            j.setConnectable(false);
            j.setCellsMovable(false);
            j.dblClick = function () { };
            var l = j.getStylesheet().getDefaultEdgeStyle();
            l.strokeColor = "#777";
            j.getCursorForCell = function (o) {
                if (o && o.value !== null && o.vertex == 1) {
                    return "pointer"
                }
            }
                ;
            j.addListener(mxEvent.CLICK, function (p, o) {
                var cell = o.getProperty("cell");
                self._onclick(cell, funcInfo)
            });
            var n = mxUtils.parseXml(xml);
            var g = new mxCodec(n);
            g.decode(n.documentElement, j.getModel());
            var c = j.getGraphBounds();
            var m = -c.x;
            var k = -c.y;
            j.view.setTranslate(Math.round(m), Math.round(k));
            $("#visioGraphContainer").css({
                width: c.width
            });
            $("#visioGraph").css("overflow", "auto");
            this._referenceObject = j;
            //if (a) {
            //    a(j)
            //}
        }
    },
    _onclick: function (cell, eventList) {
        if (cell) {
            var findEventItem = null;
            for (var i = 0; i < eventList.length; i++) {
                if (eventList[i].id == cell.id) {
                    findEventItem = eventList[i];
                    break
                }
            }

            if (eventList[cell.id]) {
                var eventArgs = {
                    vertex: cell.vertex,
                    param: eventList.onclickparam || "",
                    cell: cell,
                    graph: this._referenceObject,
                    cancel: false
                };
                if (cell && cell.vertex == 1) {
                   
                    eval(eventList[cell.id].onclick)
                }
            }
           
        }
    },
    getXML: function () {
        return Base64.decode(this.model.GraphXML);
    }
}

$(function () {

    VisioController.load();
})
