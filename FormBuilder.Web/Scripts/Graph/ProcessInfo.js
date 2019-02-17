mxGraph.prototype.zoomToCenter = function(b) {
    var a = this.getGraphBounds();
    b = b || 10;
    this.container.style.overflow = "hidden";
    this.view.setTranslate(Math.round(-a.x - (a.width - this.container.clientWidth) / 2), Math.round(-a.y - (a.height - this.container.clientHeight) / 2));
    while ((a.width + b * 2) > this.container.clientWidth || (a.height + b * 2) > this.container.clientHeight) {
        this.zoomOut();
        a = this.getGraphBounds()
    }
    this.container.style.overflow = "auto"
}
;
var CURRENTCONST = {
    userTask: {
        strokeColor: {
            none: "#888888",
            ing: "#888888",
            pass: "#888888"
        },
        fillColor: {
            none: "#ffffff",
            ing: "#ffff00",
            pass: "#6dbacc",
            exception: "#ff0000"
        }
    },
    sequenceFlow: {
        strokeColor: {
            none: "#cccccc",
            ing: "#aaa",
            pass: "#777777"
        }
    }
};
function buildCurrentGraph(i) {
    var f = new Graph(i.el);
    f.getTooltipForCell = function(k) {
        var e = k.code + "<br/>" + k.value;
        return '<div style="padding: 10px; border: 1px solid red; background-color:#fff">' + e + "</div>"
    }
    ;
    f.setGraphXml = function(l) {
        this.setEnabled(false);
        this.setPanning(false);
        if (l != null) {
            var n = new mxCodec(l.ownerDocument);
            if (l.nodeName === "mxGraphModel") {
                this.model.beginUpdate();
                try {
                    this.model.clear();
                    this.view.scale = 1;
                    this.gridSize = parseFloat(l.getAttribute("gridSize")) || mxGraph.prototype.gridSize;
                    this.graphHandler.guidesEnabled = l.getAttribute("guides") != "0";
                    this.setTooltips(l.getAttribute("tooltips") != "0");
                    this.pageVisible = false;
                    var m = l.getAttribute("pageScale");
                    this.pageScale = m != null ? this.pageScale : mxGraph.prototype.pageScale;
                    var k = l.getAttribute("page");
                    this.pageBreaksVisible = this.pageVisible;
                    this.preferPageSize = this.pageBreaksVisible;
                    var e = l.getAttribute("background");
                    if (e != null && e.length > 0) {
                        this.background = e
                    } else {
                        this.background = this.defaultGraphBackground
                    }
                    n.decode(l, this.getModel())
                } finally {
                    this.model.endUpdate()
                }
            }
        } else {
            this.resetGraph();
            this.graph.model.clear();
            this.fireEvent(new mxEventObject("resetGraphView"))
        }
    }
    ;
    var g = f.getStylesheet().getDefaultVertexStyle();
    g.strokeColor = "#888888";
    g.fontFamily = "宋体";
    g.fontStyle = 1;
    g = f.getStylesheet().getDefaultEdgeStyle();
    g.rounded = "1";
    g.strokeWidth = 2;
    g.strokeColor = CURRENTCONST.sequenceFlow.strokeColor.none;
    f.trackingList = i.trackingList;
    f.deduceParticipants = i.deduceParticipants;
    try {
        var b = i.xml;
        var d = mxUtils.parseXml(b);
        f.setGraphXml(d.documentElement);
        var a = f.getGraphBounds();
        var j = -a.x;
        var h = -a.y;
        f.view.setTranslate(Math.round(j), Math.round(h))
    } catch (c) {}
    window.graph = f;
    processRunAnimate.init(i)
}
var processRunAnimate = {
    taskData: [],
    trackingList: [],
    currentIndex: 0,
    currentDetail: null,
    init: function(c) {
        $.extend(this, c);
        var d = this;
        this.dom = {};
        graph.addMouseListener({
            mouseDown: function(h, g) {},
            mouseMove: function(i, h) {
                d.hideDetail({
                    delay: 200
                });
                var g = h.getCell();
                if (g) {
                    d.showDetail(g)
                }
            },
            mouseUp: function() {}
        });
        var b = this.trackingList[0]
          , a = this.trackingList
          , e = [[b]];
        var f = function(k, l) {
            var h = [], o = k.TrackingID, q;
            for (var n = 1, p = a.length; n < p; n++) {
                q = a[n];
                if (q.ParentTrackingID == o) {
                    h.push(q)
                }
            }
            if (h.length) {
                var g = e[l] || [];
                g = g.concat(h);
                e[l] = g;
                for (var m = 0; m < h.length; m++) {
                    f(h[m], l + 1)
                }
            }
        };
        f(b, 1);
        this.trackingLevels = e;
        this.deduceParticipants = this.deduceParticipants || {};
        this.setLastFrame()
    },
    initDetail: function() {
        if (this.dom.process) {
            return
        }
        var c = this
          , d = $("#divPage")
          , b = $("<div class='mxgraph-detail-process none cbo-list'><div style='height:100%'></div></div>").appendTo(d)
          , f = $("<div class='mxgraph-detail-predict none cbo-list'><h3>预估处理人：</h3><p></p></div>").appendTo(d);
        this.dom.page = d;
        this.dom.process = b;
        this.dom.predict = f;
        var e = function() {
            c.clearHideDetailTimer()
        };
        var a = function() {
            c.hideDetail({
                delay: 200
            })
        };
        this.dom.process.hover(e, a);
        this.dom.predict.hover(e, a);
        this.processedGrid = new GridTable({
            el: this.dom.process.find("div")[0],
            pageSize: 20,
            showPagingToolbar: 20,
            defaultSort: false,
            showSelected: false,
            showAlternatRow: false,
            showHoverRow: false,
            hasRowSelectCheck: false,
            allowHeaderContext: true,
            onpagechange: function(i, h) {
                var g = c.getProcessedGridData() || {};
                h.callback(g)
            }
        });
        this.dom.predict.on("click", "a", function() {
            alert(this.innerHTML)
        })
    },
    getCellByActivityId: function(a) {
        var b = graph.model.filterDescendants();
        for (var c = 0; c < b.length; c++) {
            if (b[c].code == a) {
                return b[c]
            }
        }
        return null
    },
    getGradientColors: function(c) {
        var f = CURRENTCONST.userTask.fillColor
          , b = CURRENTCONST.sequenceFlow.strokeColor;
        var e = function(i, h) {
            var g = [];
            $.each(i, function(j, k) {
                if (h(j)) {
                    g.push(k)
                }
            });
            return g
        };
        var a = {
            Init: function() {
                return [f.none]
            },
            Completed: function() {
                if (c.NodeType == "SequenceFlow") {
                    return e(b, function() {
                        return true
                    })
                }
                return e(f, function(g) {
                    return g != "exception"
                })
            },
            Running: function() {
                return e(f, function(g) {
                    return g == "none" || g == "ing"
                })
            },
            Exception: function() {
                return e(f, function(g) {
                    return g != "pass"
                })
            }
        };
        var d = c.EndTime ? "Completed" : "Running";
        return a[d] && a[d]() || a.Completed()
    },
    getProcessedGridData: function() {
        var c = {
            pageSize: 100,
            recordCount: 1,
            fields: [],
            datas: [],
            headers: [{
                field: "ExecutorName",
                text: "处理人",
                align: "LEFT",
                warp: false,
                width: "140"
            }, {
                field: "CreateTime",
                text: "接收时间",
                align: "CENTER",
                warp: false,
                width: "150"
            }, {
                field: "EndTime",
                text: "完成时间",
                align: "CENTER",
                warp: false,
                width: "150"
            }, {
                field: "StateDesc",
                text: "操作",
                align: "CENTER",
                warp: false,
                width: "50"
            }]
        }, a = this.currentDetail && this.currentDetail.cell, b, d;
        if (!a || !this.trackingList.length) {
            return
        }
        b = a.code;
        d = this.taskData[0];
        $.each(d, function(e) {
            c.fields.push(e)
        });
        $.each(this.taskData, function(f, g) {
            if (g.ActivityID != b) {
                return
            }
            var j, h = [];
            for (var f = 0, e = c.fields.length; f < e; f++) {
                j = c.fields[f];
                h.push(g[j])
            }
            c.datas.push(h)
        });
        return c
    },
    play: function() {
        this.clearContext();
        this.playTheFrame()
    },
    stop: function() {},
    playTheFrame: function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null
        }
        var b = this.trackingLevels[this.currentIndex]
          , f = this
          , h = [];
        for (var d = 0, g = b.length; d < g; d++) {
            var j = b[d]
              , a = this.getGradientColors(j)
              , e = [];
            $.each(a, function(k, i) {
                e.push({
                    start: i,
                    end: i
                });
                var l = a[k + 1];
                if (l) {
                    e.push({
                        start: i,
                        end: l
                    })
                }
            });
            h.push({
                item: j,
                colors: e
            })
        }
        var c = function() {
            var i = true;
            $.each(h, function(l, m) {
                var k = m.colors.shift();
                if (k) {
                    f.setTheFrameStep(m.item, k);
                    i &= false
                }
            });
            if (i) {
                clearInterval(f.timer);
                f.gotoNextFrame()
            }
        };
        f.timer = setInterval(c, 140)
    },
    gotoNextFrame: function() {
        this.currentIndex++;
        var a = this.trackingLevels.length;
        if (this.currentIndex >= a) {
            this.highlightLastProcessStep();
            return
        }
        this.playTheFrame()
    },
    setTheFrameStep: function(d, c, e) {
        var f = this
          , b = f.getCellByActivityId(d.ActivityID)
          , h = true;
        if (!b || !c) {
            return
        }
        h = d.NodeType == "SequenceFlow";
        b.data = d;
        var a = function() {
            var i = {};
            if (h) {
                i[mxConstants.STYLE_STROKECOLOR] = c.start
            } else {
                i[mxConstants.STYLE_GRADIENTCOLOR] = c.start;
                i[mxConstants.STYLE_FILLCOLOR] = c.end;
                i[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_SOUTH
            }
            return i
        };
        var g = function() {
            var j = a();
            for (var i in j) {
                graph.setCellStyles(i, j[i], [b])
            }
        };
        if (h) {
            g();
            return
        }
        if (e === false) {
            g()
        } else {
            setTimeout(g, 140 * 3)
        }
    },
    setLastFrame: function() {
        var a = this;
        this.orderSequenceFlows();
        this.eachData(function(c) {
            var b = a.getGradientColors(c).pop();
            a.setTheFrameStep(c, {
                start: b,
                end: b
            }, false)
        });
        this.highlightLastProcessStep()
    },
    eachData: function(a) {
        $.each(this.trackingList, function(b, c) {
            if (a(c) === false) {
                return false
            }
        })
    },
    highlightLastProcessStep: function() {
        var c = this.trackingList[this.trackingList.length - 1]
          , a = this.getCellByActivityId(c.ActivityID);
        if (!a) {
            return
        }
        return;
        var b = 0
          , f = new mxStyleChange();
        f.cell = a;
        var e = this
          , b = 0
          , d = function() {
            if (b >= 3) {
                return
            }
            mxEffects.animateChanges(graph, [f]);
            b++;
            e.highlightTimer = setTimeout(d, 700)
        };
        d()
    },
    getProcessDetail: function(a) {
        var c = this
          , b = this.dom.process;
        return {
            cell: a,
            hide: function() {
                this.cell = null;
                b.toggleClass("none", true)
            },
            show: function(d) {
                b.toggleClass("none", false);
                if (d) {
                    b.css(d)
                }
                c.processedGrid.ref()
            }
        }
    },
    getPredictedUserDetail: function(a) {
        var c = this
          , b = this.dom.predict;
        return {
            cell: a,
            hide: function() {
                this.cell = null;
                b.toggleClass("none", true)
            },
            show: function(f) {
                var e = c.deduceParticipants[this.cell.code] || []
                  , d = $.map(e, function(g) {
                    return "<a href='javascript:;' name='" + g.UserID + "'>" + g.UserName + "</a>"
                });
                b.toggleClass("none", false).find("p").html(d.join(""));
                if (f) {
                    b.css(f)
                }
                c.processedGrid.ref()
            }
        }
    },
    getDetail: function(a) {
        var c = graph.getCellStyle(a)
          , b = c.shape.substr(0, 1).toUpperCase() + c.shape.substr(1);
        if (b != "UserTask" && b != "ApproveTask") {
            return
        }
        return a.data ? this.getProcessDetail(a) : this.getPredictedUserDetail(a)
    },
    clearContext: function() {
        var a = this;
        this.currentIndex = 0;
        if (this.highlightTimer) {
            clearTimeout(this.highlightTimer);
            this.highlightTimer = null
        }
        this.eachData(function(c) {
            var b = "";
            if (c.NodeType == "SequenceFlow") {
                b = CURRENTCONST.sequenceFlow.strokeColor.none
            } else {
                b = CURRENTCONST.userTask.fillColor.none
            }
            a.setTheFrameStep(c, {
                start: b,
                end: b
            }, false)
        })
    },
    clearHideDetailTimer: function() {
        if (this.detailTimer) {
            clearTimeout(this.detailTimer);
            this.detailTimer = null
        }
    },
    showDetail: function(a) {
        this.initDetail();
        this.clearHideDetailTimer();
        if (this.currentDetail && this.currentDetail.cell == a) {
            return
        }
        this.hideDetail();
        this.currentDetail = this.getDetail(a);
        if (!this.currentDetail) {
            return
        }
        var b = this.getDetailPosition(a);
        this.currentDetail.cell = a;
        this.currentDetail.show(b)
    },
    hideDetail: function(a) {
        if (!this.currentDetail) {
            return
        }
        this.clearHideDetailTimer();
        a = a || {};
        if (!a.delay) {
            return this.currentDetail.hide()
        } else {
            this.detailTimer = setTimeout($.proxy(this.currentDetail.hide, this.currentDetail), a.delay)
        }
    },
    getDetailPosition: function(a) {
        if (!a) {
            return
        }
        var c = {}
          , e = this.dom.page
          , d = graph.view.getState(a)
          , b = d.shape.node.getBoundingClientRect()
          , f = a.getGeometry();
        c.left = b.left + e.scrollLeft();
        c.top = b.top + e.scrollTop() + f.height;
        return c
    },
    setTaskData: function(a) {
        this.taskData = a
    },
    orderSequenceFlows: function() {
        var a = []
          , b = this;
        this.eachData(function(d) {
            var c;
            if (d.NodeType == "SequenceFlow") {
                c = b.getCellByActivityId(d.ActivityID);
                if (c) {
                    a.push(c)
                }
            }
        });
        graph.orderCells(false, a)
    }
};
