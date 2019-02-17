function Toolbar(b, a) {
    this.editorUi = b;
    this.container = a;
    this.staticElements = [];
    this.init();
    this.gestureHandler = mxUtils.bind(this, function(c) {
        this.hideMenu()
    });
    mxEvent.addGestureListeners(document, this.gestureHandler)
}
Toolbar.prototype.dropdownImage = (!mxClient.IS_SVG) ? IMAGE_PATH + "/dropdown.gif" : "data:image/gif;base64,R0lGODlhDQANAIABAHt7e////yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREM1NkJFMjE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREM1NkJFMzE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQzOUMzMjZCMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQzOUMzMjZDMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhGMj6nL3QAjVHIu6azbvPtWAAA7";
Toolbar.prototype.dropdownImageHtml = '<img border="0" style="position:absolute;right:4px;top:' + ((!EditorUi.compactUi) ? 8 : 6) + 'px;" src="' + Toolbar.prototype.dropdownImage + '" valign="middle"/>';
Toolbar.prototype.selectedBackground = "#d0d0d0";
Toolbar.prototype.unselectedBackground = "none";
Toolbar.prototype.staticElements = null;
Toolbar.prototype.init = function() {
    var a = this.addMenu("", "视图", true, "viewPanels", null, true);
    this.addDropDownArrow(a, "geSprite-formatpanel", 38, 50, -4, -3, 36, -8);
    this.addSeparator();
    var d = this.addItems(["save", "-"]);
    d[0].setAttribute("title", "保存");
    var d = this.addItems(["publish", "-"]);
    d[0].setAttribute("title", "发布");
    var c = this.addMenu("", "缩放 (Alt+Mousewheel)", true, "viewZoom", null, true);
    c.showDisabled = true;
    c.style.whiteSpace = "nowrap";
    c.style.position = "relative";
    c.style.overflow = "hidden";
    if (EditorUi.compactUi) {
        c.style.width = (mxClient.IS_QUIRKS) ? "58px" : "50px"
    } else {
        c.style.width = (mxClient.IS_QUIRKS) ? "62px" : "36px"
    }
    this.addSeparator();
    var d = this.addItems(["zoomIn", "zoomOut"]);
    d[0].setAttribute("title", mxResources.get("zoomIn") + " (" + this.editorUi.actions.get("zoomIn").shortcut + ")");
    d[1].setAttribute("title", mxResources.get("zoomOut") + " (" + this.editorUi.actions.get("zoomOut").shortcut + ")");
    var b = mxUtils.bind(this, function() {
        c.innerHTML = Math.round(this.editorUi.editor.graph.view.scale * 100) + "%" + this.dropdownImageHtml;
        if (EditorUi.compactUi) {
            c.getElementsByTagName("img")[0].style.right = "1px";
            c.getElementsByTagName("img")[0].style.top = "5px"
        }
    });
    this.editorUi.editor.graph.view.addListener(mxEvent.EVENT_SCALE, b);
    this.editorUi.editor.addListener("resetGraphView", b);
    var d = this.addItems(["-", "undo", "redo", "-", "delete", "-", "toFront", "toBack", "-", "fillColor", "strokeColor", "shadow", "-"]);
    d[1].setAttribute("title", mxResources.get("undo") + " (" + this.editorUi.actions.get("undo").shortcut + ")");
    d[2].setAttribute("title", mxResources.get("redo") + " (" + this.editorUi.actions.get("redo").shortcut + ")");
    d[4].setAttribute("title", mxResources.get("delete") + " (" + this.editorUi.actions.get("delete").shortcut + ")");
    this.edgeStyleMenu = this.addMenuFunction("geSprite-orthogonal", mxResources.get("waypoints"), false, mxUtils.bind(this, function(e) {
        this.editorUi.menus.edgeStyleChange(e, "", [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], [null, null, null], "geIcon geSprite geSprite-straight", null, true).setAttribute("title", mxResources.get("straight"));
        this.editorUi.menus.edgeStyleChange(e, "", [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ["orthogonalEdgeStyle", null, null], "geIcon geSprite geSprite-orthogonal", null, true).setAttribute("title", mxResources.get("orthogonal"));
        this.editorUi.menus.edgeStyleChange(e, "", [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ["orthogonalEdgeStyle", "1", null], "geIcon geSprite geSprite-curved", null, true).setAttribute("title", mxResources.get("curved"));
        this.editorUi.menus.edgeStyleChange(e, "", [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], ["entityRelationEdgeStyle", null, null], "geIcon geSprite geSprite-entity", null, true).setAttribute("title", mxResources.get("entityRelation"))
    }));
    this.addDropDownArrow(this.edgeStyleMenu, "geSprite-orthogonal", 44, 50, 0, 0, 22, -4)
}
;
Toolbar.prototype.addDropDownArrow = function(g, c, d, h, f, e, b, a) {
    b = (b != null) ? b : 32;
    f = (EditorUi.compactUi) ? f : a;
    g.style.whiteSpace = "nowrap";
    g.style.overflow = "hidden";
    g.style.position = "relative";
    g.innerHTML = '<div class="geSprite ' + c + '" style="margin-left:' + f + "px;margin-top:" + e + 'px;"></div>' + this.dropdownImageHtml;
    g.style.width = (mxClient.IS_QUIRKS) ? h + "px" : (h - b) + "px";
    if (mxClient.IS_QUIRKS) {
        g.style.height = (EditorUi.compactUi) ? "24px" : "26px"
    }
    if (EditorUi.compactUi) {
        g.getElementsByTagName("img")[0].style.left = "24px";
        g.getElementsByTagName("img")[0].style.top = "5px";
        g.style.width = (mxClient.IS_QUIRKS) ? d + "px" : (d - 10) + "px"
    }
}
;
Toolbar.prototype.setFontName = function(a) {
    if (this.fontMenu != null) {
        this.fontMenu.innerHTML = '<div style="width:60px;overflow:hidden;display:inline-block;">' + mxUtils.htmlEntities(a) + "</div>" + this.dropdownImageHtml
    }
}
;
Toolbar.prototype.setFontSize = function(a) {
    if (this.sizeMenu != null) {
        this.sizeMenu.innerHTML = '<div style="width:24px;overflow:hidden;display:inline-block;">' + a + "</div>" + this.dropdownImageHtml
    }
}
;
Toolbar.prototype.createTextToolbar = function() {
    var f = this.editorUi.editor.graph;
    var c = this.addMenu("", mxResources.get("style"), true, "formatBlock");
    c.style.position = "relative";
    c.style.whiteSpace = "nowrap";
    c.style.overflow = "hidden";
    c.innerHTML = mxResources.get("style") + this.dropdownImageHtml;
    if (EditorUi.compactUi) {
        c.style.paddingRight = "18px";
        c.getElementsByTagName("img")[0].style.right = "1px";
        c.getElementsByTagName("img")[0].style.top = "5px"
    }
    this.addSeparator();
    this.fontMenu = this.addMenu("", mxResources.get("fontFamily"), true, "fontFamily");
    this.fontMenu.style.position = "relative";
    this.fontMenu.style.whiteSpace = "nowrap";
    this.fontMenu.style.overflow = "hidden";
    this.fontMenu.style.width = (mxClient.IS_QUIRKS) ? "80px" : "60px";
    this.setFontName(Menus.prototype.defaultFont);
    if (EditorUi.compactUi) {
        this.fontMenu.style.paddingRight = "18px";
        this.fontMenu.getElementsByTagName("img")[0].style.right = "1px";
        this.fontMenu.getElementsByTagName("img")[0].style.top = "5px"
    }
    this.addSeparator();
    this.sizeMenu = this.addMenu(Menus.prototype.defaultFontSize, mxResources.get("fontSize"), true, "fontSize");
    this.sizeMenu.style.position = "relative";
    this.sizeMenu.style.whiteSpace = "nowrap";
    this.sizeMenu.style.overflow = "hidden";
    this.sizeMenu.style.width = (mxClient.IS_QUIRKS) ? "44px" : "24px";
    this.setFontSize(Menus.prototype.defaultFontSize);
    if (EditorUi.compactUi) {
        this.sizeMenu.style.paddingRight = "18px";
        this.sizeMenu.getElementsByTagName("img")[0].style.right = "1px";
        this.sizeMenu.getElementsByTagName("img")[0].style.top = "5px"
    }
    var g = this.addItems(["-", "undo", "redo", "-", "bold", "italic", "underline"]);
    g[1].setAttribute("title", mxResources.get("undo") + " (" + this.editorUi.actions.get("undo").shortcut + ")");
    g[2].setAttribute("title", mxResources.get("redo") + " (" + this.editorUi.actions.get("redo").shortcut + ")");
    g[4].setAttribute("title", mxResources.get("bold") + " (" + this.editorUi.actions.get("bold").shortcut + ")");
    g[5].setAttribute("title", mxResources.get("italic") + " (" + this.editorUi.actions.get("italic").shortcut + ")");
    g[6].setAttribute("title", mxResources.get("underline") + " (" + this.editorUi.actions.get("underline").shortcut + ")");
    var d = this.addMenuFunction("", mxResources.get("align"), false, mxUtils.bind(this, function(h) {
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("justifyleft", false, null)
        }), null, "geIcon geSprite geSprite-left");
        b.setAttribute("title", mxResources.get("left"));
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("justifycenter", false, null)
        }), null, "geIcon geSprite geSprite-center");
        b.setAttribute("title", mxResources.get("center"));
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("justifyright", false, null)
        }), null, "geIcon geSprite geSprite-right");
        b.setAttribute("title", mxResources.get("right"));
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("justifyfull", false, null)
        }), null, "geIcon geSprite geSprite-justifyfull");
        b.setAttribute("title", mxResources.get("justifyfull"));
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("insertorderedlist", false, null)
        }), null, "geIcon geSprite geSprite-orderedlist");
        b.setAttribute("title", mxResources.get("numberedList"));
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("insertunorderedlist", false, null)
        }), null, "geIcon geSprite geSprite-unorderedlist");
        b.setAttribute("title", mxResources.get("bulletedList"));
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("outdent", false, null)
        }), null, "geIcon geSprite geSprite-outdent");
        b.setAttribute("title", mxResources.get("decreaseIndent"));
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("indent", false, null)
        }), null, "geIcon geSprite geSprite-indent");
        b.setAttribute("title", mxResources.get("increaseIndent"))
    }));
    d.style.position = "relative";
    d.style.whiteSpace = "nowrap";
    d.style.overflow = "hidden";
    d.innerHTML = '<div class="geSprite geSprite-left" style="margin-left:-2px;"></div>' + this.dropdownImageHtml;
    d.style.width = (mxClient.IS_QUIRKS) ? "50px" : "30px";
    if (EditorUi.compactUi) {
        d.getElementsByTagName("img")[0].style.left = "22px";
        d.getElementsByTagName("img")[0].style.top = "5px"
    }
    var a = this.addMenuFunction("", mxResources.get("format"), false, mxUtils.bind(this, function(h) {
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("superscript", false, null)
        }), null, "geIcon geSprite geSprite-superscript");
        b.setAttribute("title", mxResources.get("superscript"));
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("subscript", false, null)
        }), null, "geIcon geSprite geSprite-subscript");
        b.setAttribute("title", mxResources.get("subscript"));
        b = h.addItem("", null, this.editorUi.actions.get("fontColor").funct, null, "geIcon geSprite geSprite-fontcolor");
        b.setAttribute("title", mxResources.get("fontColor"));
        b = h.addItem("", null, this.editorUi.actions.get("backgroundColor").funct, null, "geIcon geSprite geSprite-fontbackground");
        b.setAttribute("title", mxResources.get("backgroundColor"));
        b = h.addItem("", null, mxUtils.bind(this, function() {
            document.execCommand("removeformat", false, null)
        }), null, "geIcon geSprite geSprite-removeformat");
        b.setAttribute("title", mxResources.get("removeFormat"))
    }));
    a.style.position = "relative";
    a.style.whiteSpace = "nowrap";
    a.style.overflow = "hidden";
    a.innerHTML = '<div class="geSprite geSprite-superscript" style="margin-left:-2px;"></div>' + this.dropdownImageHtml;
    a.style.width = (mxClient.IS_QUIRKS) ? "50px" : "30px";
    if (EditorUi.compactUi) {
        a.getElementsByTagName("img")[0].style.left = "22px";
        a.getElementsByTagName("img")[0].style.top = "5px"
    }
    this.addSeparator();
    this.addButton("geIcon geSprite geSprite-code", mxResources.get("html"), function() {
        f.cellEditor.toggleViewMode();
        if (f.cellEditor.textarea.innerHTML.length > 0 && (f.cellEditor.textarea.innerHTML != "&nbsp;" || !f.cellEditor.clearOnChange)) {
            window.setTimeout(function() {
                document.execCommand("selectAll", false, null)
            })
        }
    });
    this.addSeparator();
    var e = this.addMenuFunction("", mxResources.get("insert"), true, mxUtils.bind(this, function(h) {
        h.addItem(mxResources.get("insertLink"), null, mxUtils.bind(this, function() {
            this.editorUi.actions.get("link").funct()
        }));
        h.addItem(mxResources.get("insertImage"), null, mxUtils.bind(this, function() {
            this.editorUi.actions.get("image").funct()
        }));
        h.addItem(mxResources.get("insertHorizontalRule"), null, mxUtils.bind(this, function() {
            document.execCommand("inserthorizontalrule", false, null)
        }))
    }));
    e.style.whiteSpace = "nowrap";
    e.style.overflow = "hidden";
    e.style.position = "relative";
    e.innerHTML = '<div class="geSprite geSprite-plus" style="margin-left:-4px;margin-top:-3px;"></div>' + this.dropdownImageHtml;
    e.style.width = (mxClient.IS_QUIRKS) ? "36px" : "16px";
    if (EditorUi.compactUi) {
        e.getElementsByTagName("img")[0].style.left = "24px";
        e.getElementsByTagName("img")[0].style.top = "5px";
        e.style.width = (mxClient.IS_QUIRKS) ? "50px" : "30px"
    }
    this.addSeparator();
    var b = this.addMenuFunction("geIcon geSprite geSprite-table", mxResources.get("table"), false, mxUtils.bind(this, function(l) {
        var i = f.getSelectedElement();
        var h = f.getParentByName(i, "TD", f.cellEditor.text2);
        var k = f.getParentByName(i, "TR", f.cellEditor.text2);
        if (k == null) {
            this.editorUi.menus.addInsertTableItem(l)
        } else {
            var j = f.getParentByName(k, "TABLE", f.cellEditor.text2);
            i = l.addItem("", null, mxUtils.bind(this, function() {
                try {
                    f.selectNode(f.insertColumn(j, (h != null) ? h.cellIndex : 0))
                } catch (m) {
                    mxUtils.alert(mxResources.get("error") + ": " + m.message)
                }
            }), null, "geIcon geSprite geSprite-insertcolumnbefore");
            i.setAttribute("title", mxResources.get("insertColumnBefore"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                try {
                    f.selectNode(f.insertColumn(j, (h != null) ? h.cellIndex + 1 : -1))
                } catch (m) {
                    mxUtils.alert(mxResources.get("error") + ": " + m.message)
                }
            }), null, "geIcon geSprite geSprite-insertcolumnafter");
            i.setAttribute("title", mxResources.get("insertColumnAfter"));
            i = l.addItem("Delete column", null, mxUtils.bind(this, function() {
                if (h != null) {
                    try {
                        f.deleteColumn(j, h.cellIndex)
                    } catch (m) {
                        mxUtils.alert(mxResources.get("error") + ": " + m.message)
                    }
                }
            }), null, "geIcon geSprite geSprite-deletecolumn");
            i.setAttribute("title", mxResources.get("deleteColumn"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                try {
                    f.selectNode(f.insertRow(j, k.sectionRowIndex))
                } catch (m) {
                    mxUtils.alert(mxResources.get("error") + ": " + m.message)
                }
            }), null, "geIcon geSprite geSprite-insertrowbefore");
            i.setAttribute("title", mxResources.get("insertRowBefore"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                try {
                    f.selectNode(f.insertRow(j, k.sectionRowIndex + 1))
                } catch (m) {
                    mxUtils.alert(mxResources.get("error") + ": " + m.message)
                }
            }), null, "geIcon geSprite geSprite-insertrowafter");
            i.setAttribute("title", mxResources.get("insertRowAfter"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                try {
                    f.deleteRow(j, k.sectionRowIndex)
                } catch (m) {
                    mxUtils.alert(mxResources.get("error") + ": " + m.message)
                }
            }), null, "geIcon geSprite geSprite-deleterow");
            i.setAttribute("title", mxResources.get("deleteRow"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                var m = j.style.borderColor.replace(/\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, function(o, n, q, p) {
                    return "#" + ("0" + Number(n).toString(16)).substr(-2) + ("0" + Number(q).toString(16)).substr(-2) + ("0" + Number(p).toString(16)).substr(-2)
                });
                this.editorUi.pickColor(m, function(n) {
                    if (n == null || n == mxConstants.NONE) {
                        j.removeAttribute("border");
                        j.style.border = "";
                        j.style.borderCollapse = ""
                    } else {
                        j.setAttribute("border", "1");
                        j.style.border = "1px solid " + n;
                        j.style.borderCollapse = "collapse"
                    }
                })
            }), null, "geIcon geSprite geSprite-strokecolor");
            i.setAttribute("title", mxResources.get("borderColor"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                var m = j.style.backgroundColor.replace(/\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, function(o, n, q, p) {
                    return "#" + ("0" + Number(n).toString(16)).substr(-2) + ("0" + Number(q).toString(16)).substr(-2) + ("0" + Number(p).toString(16)).substr(-2)
                });
                this.editorUi.pickColor(m, function(n) {
                    if (n == null || n == mxConstants.NONE) {
                        j.style.backgroundColor = ""
                    } else {
                        j.style.backgroundColor = n
                    }
                })
            }), null, "geIcon geSprite geSprite-fillcolor");
            i.setAttribute("title", mxResources.get("backgroundColor"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                var m = j.getAttribute("cellPadding") || 0;
                var n = new FilenameDialog(this.editorUi,m,mxResources.get("apply"),mxUtils.bind(this, function(o) {
                    if (o != null && o.length > 0) {
                        j.setAttribute("cellPadding", o)
                    } else {
                        j.removeAttribute("cellPadding")
                    }
                }),mxResources.get("spacing"));
                this.editorUi.showDialog(n.container, 300, 80, true, true);
                n.init()
            }), null, "geIcon geSprite geSprite-fit");
            i.setAttribute("title", mxResources.get("spacing"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                j.setAttribute("align", "left")
            }), null, "geIcon geSprite geSprite-left");
            i.setAttribute("title", mxResources.get("left"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                j.setAttribute("align", "center")
            }), null, "geIcon geSprite geSprite-center");
            i.setAttribute("title", mxResources.get("center"));
            i = l.addItem("", null, mxUtils.bind(this, function() {
                j.setAttribute("align", "right")
            }), null, "geIcon geSprite geSprite-right");
            i.setAttribute("title", mxResources.get("right"))
        }
    }));
    b.style.position = "relative";
    b.style.whiteSpace = "nowrap";
    b.style.overflow = "hidden";
    b.innerHTML = '<div class="geSprite geSprite-table" style="margin-left:-2px;"></div>' + this.dropdownImageHtml;
    b.style.width = (mxClient.IS_QUIRKS) ? "50px" : "30px";
    if (EditorUi.compactUi) {
        b.getElementsByTagName("img")[0].style.left = "22px";
        b.getElementsByTagName("img")[0].style.top = "5px"
    }
}
;
Toolbar.prototype.hideMenu = function() {
    if (this.currentMenu != null) {
        this.currentMenu.hideMenu();
        this.currentMenu.destroy()
    }
}
;
Toolbar.prototype.addMenu = function(d, g, f, b, i, e) {
    var h = this.editorUi.menus.get(b);
    var a = this.addMenuFunction(d, g, f, h.funct, i, e);
    h.addListener("stateChanged", function() {
        a.setEnabled(h.enabled)
    });
    return a
}
;
Toolbar.prototype.addMenuFunction = function(b, f, e, a, g, d) {
    return this.addMenuFunctionInContainer((g != null) ? g : this.container, b, f, e, a, d)
}
;
Toolbar.prototype.addMenuFunctionInContainer = function(b, d, g, f, a, e) {
    var c = (f) ? this.createLabel(d) : this.createButton(d);
    this.initElement(c, g);
    this.addMenuHandler(c, f, a, e);
    b.appendChild(c);
    return c
}
;
Toolbar.prototype.addSeparator = function(b) {
    b = (b != null) ? b : this.container;
    var a = document.createElement("div");
    a.className = "geSeparator";
    b.appendChild(a);
    return a
}
;
Toolbar.prototype.addItems = function(e, g, f) {
    var a = [];
    for (var d = 0; d < e.length; d++) {
        var b = e[d];
        if (b == "-") {
            a.push(this.addSeparator(g))
        } else {
            a.push(this.addItem("geSprite-" + b.toLowerCase(), b, g, f))
        }
    }
    return a
}
;
Toolbar.prototype.addItem = function(d, b, g, f) {
    var e = this.editorUi.actions.get(b);
    var a = null;
    if (e != null) {
        a = this.addButton(d, e.label, e.funct, g);
        if (!f) {
            a.setEnabled(e.enabled);
            e.addListener("stateChanged", function() {
                a.setEnabled(e.enabled)
            })
        }
    }
    return a
}
;
Toolbar.prototype.addButton = function(e, d, a, f) {
    var b = this.createButton(e);
    f = (f != null) ? f : this.container;
    this.initElement(b, d);
    this.addClickHandler(b, a);
    f.appendChild(b);
    return b
}
;
Toolbar.prototype.initElement = function(a, b) {
    if (b != null) {
        a.setAttribute("title", b)
    }
    this.addEnabledState(a)
}
;
Toolbar.prototype.addEnabledState = function(a) {
    var b = a.className;
    a.setEnabled = function(c) {
        a.enabled = c;
        if (c) {
            a.className = b
        } else {
            a.className = b + " mxDisabled"
        }
    }
    ;
    a.setEnabled(true)
}
;
Toolbar.prototype.addClickHandler = function(b, a) {
    if (a != null) {
        mxEvent.addListener(b, "click", function(c) {
            if (b.enabled) {
                a(c)
            }
            mxEvent.consume(c)
        });
        if (document.documentMode != null && document.documentMode >= 9) {
            mxEvent.addListener(b, "mousedown", function(c) {
                c.preventDefault()
            })
        }
    }
}
;
Toolbar.prototype.createButton = function(c) {
    var b = document.createElement("a");
    b.setAttribute("href", "javascript:void(0);");
    b.className = "geButton";
    var a = document.createElement("div");
    if (c != null) {
        a.className = "geSprite " + c
    }
    b.appendChild(a);
    return b
}
;
Toolbar.prototype.createLabel = function(b, c) {
    var a = document.createElement("a");
    a.setAttribute("href", "javascript:void(0);");
    a.className = "geLabel";
    mxUtils.write(a, b);
    return a
}
;
Toolbar.prototype.addMenuHandler = function(c, f, b, d) {
    if (b != null) {
        var e = this.editorUi.editor.graph;
        var g = null;
        var a = true;
        mxEvent.addListener(c, "click", mxUtils.bind(this, function(h) {
            if (a && (c.enabled == null || c.enabled)) {
                e.popupMenuHandler.hideMenu();
                g = new mxPopupMenu(b);
                g.div.className += " geToolbarMenu";
                g.showDisabled = d;
                g.labels = f;
                g.autoExpand = true;
                var i = mxUtils.getOffset(c);
                g.popup(i.x, i.y + c.offsetHeight, null, h);
                this.currentMenu = g;
                this.currentElt = c;
                g.addListener(mxEvent.EVENT_HIDE, mxUtils.bind(this, function() {
                    this.currentElt = null
                }))
            }
            a = true;
            mxEvent.consume(h)
        }));
        mxEvent.addListener(c, "mousedown", mxUtils.bind(this, function(h) {
            a = this.currentElt != c;
            if (document.documentMode != null && document.documentMode >= 9) {
                h.preventDefault()
            }
        }))
    }
}
;
Toolbar.prototype.destroy = function() {
    if (this.gestureHandler != null) {
        mxEvent.removeGestureListeners(document, this.gestureHandler);
        this.gestureHandler = null
    }
}
;
