/*代码生成器*/
function CodeGenerator() {
    this.Page = {};
    this.layout = {};
}

CodeGenerator.prototype = {
    setValue: function (page, layout) {
        this.Page = page;
        this.layout = layout;
    },
    getHtml: function () {
        var htmlArr = ["<div class='layout-main'>"];
        var self = this;
        $.each(this.Page.Layout, function (key, value) {
            if (self.isShow(key.toLowerCase())) {
                if ((Page.config.fix_t && key.toLowerCase() == "top") || Page.config.fix_b && key.toLowerCase() == "bottom") {
                    //htmlArr.push("<div title=\"" + self.getTitle(key.toLowerCase()) + "\"  >");
                } else {
                    htmlArr.push("<div title=\"" + self.getTitle(key.toLowerCase()) + "\"  position=" + key.toLowerCase() + ">");

                    //htmlArr.push("<div class='wrap'>");
                    $.each(value, function (i, id) {
                        htmlArr.push(self.getLayoutHtml(id))
                    });
                    //htmlArr.push("</div>");
                    htmlArr.push("</div>");
                }
            }
        });
        htmlArr.push("</div>");
        var headerArr = [];
        if (Page.config.fix_t) {
            headerArr.push("<div class='fix-top'>");
            $.each(Page.Layout["Top"], function (i, id) {
                headerArr.push(self.getLayoutHtml(id))
            });
            headerArr.push("</div>");
        }

        //如果固定底部栏目的话
        if (Page.config.fix_b) {
            htmlArr.push("<div class='fix-bottom'>");
            $.each(Page.Layout["Bottom"], function (i, id) {
                htmlArr.push(self.getLayoutHtml(id))
            });
            htmlArr.push("</div>");
        }

        return headerArr.concat(htmlArr).join("");
    },
    isShow: function (key) {
        var res = false;
        switch (key) {
            case "left":
                res = this.Page.config.show_l;
                break;
            case "top":
                res = this.Page.config.show_t;
                break;
            case "right":
                res = this.Page.config.show_r;
                break;
            case "bottom":
                res = this.Page.config.show_b;
                break;
            case "center":
                res = this.Page.config.show_c;
                break;
            case "centerbottom":
                res = this.Page.config.show_cb;
                break;
            default:
                break;
        }
        return res;
    },
    getTitle: function (key) {
        var res = "";
        switch (key) {
            case "left":
                res = this.Page.config.l_title;
                break;
            case "top":
                res = this.Page.config.t_title;
                break;
            case "right":
                res = this.Page.config.r_title;
                break;
            case "bottom":
                res = this.Page.config.b_title;
                break;
            case "center":
                res = this.Page.config.c_title;
                break;
            default:
                break;
        }
        return res;
    },
    getLayoutHtml: function (id) {
        var arr = [];
        var layout = this.layout[id];
        var classname = layout.type == "9" ? "tablayout" : "";

        arr.push("<div  id='" + id + "' class='" + classname + "'>");
        //arr.push('<div class="mainlayout">');
        if (layout.type == "9") {
            arr.push(this.getTabColumn(layout));
        } else if (
            layout.type == "10" || layout.type == "11" || layout.type == "12" || layout.type == "13") {
            arr.push(this.getAbsoluteColumn(layout));
        } else {
            arr.push(this.getColumn(layout));
        }
        //arr.push('</div>');
        arr.push('</div>');
        return arr.join("");
    },
    getTabColumn: function (layout) {
        var arrhtml = [];
        var self = this;
        $.each(layout.childs, function (i, column) {
            var childhtml = self.getControlHtml(column);
            var classname = "";//column.border ? "" : " noborder ";
            classname += column.fill ? " fixed " : "  ";
            classname += self.getColumnStyle(column.formstyle);
            arrhtml.push('<div class="" title="' + column.label + '"  id="' + column.id + '"><div ' + self.getColumnStyleInLine(column) + '  class="' + classname + '">' + childhtml + '</div></div>');
        });
        //arrhtml.push('</div>');
        return arrhtml.join("");
    },
    getAbsoluteColumn: function (layout) {
        var self = this;
        var arrhtml = [];
        if (layout.type == "10") {
            arr = ["12"];
        } else if (layout.type == "11") {
            arr = ["6", "6"];
        } else if (layout.type == "12") {
            arr = ["4", "4", "4"];
        } else if (layout.type == "13") {
            arr = ["3", "3", "3", "3"];
        }


        $.each(layout.childs, function (i, column) {
            var childhtml = self.getControlHtml(column, true);//绝对布局处理 宽高top left zindex 等内容

            var classname = "";//column.border ? "" : " noborder ";
            classname += column.fill ? " fixed " : "  ";
            classname += self.getColumnStyle(column.formstyle);
            // 绝对布局


            if (arr[i] == "12") {
                arrhtml.push("<div id='" + column.id + "'  style='position:relative;'><div "
                    + self.getColumnStyleInLine(column) + " class='" + classname + "'>" + childhtml + "</div></div>");
            } else {
                arrhtml.push("<div class='col-sm col-sm-" + arr[i] + "' id='" + column.id + "'  style='position:relative;'><div "
                    + self.getColumnStyleInLine(column) + " class='" + classname + "'>" + childhtml + "</div></div>");
            }
            //arrhtml.push("<div class='' id='" + column.id + "' style='position:relative;'><div "
            //    + self.getColumnStyleInLine(column) + " class='" + classname + " '>" + childhtml + "</div></div>");


            //arrhtml.push("<div  class='col-sm col-sm-12' id='" + column.id + "'><div class='absolute'>" + childhtml + "</div></div>")
        });
        return arrhtml.join("");
    },
    getColumn: function (layout) {
        var self = this;
        var arrhtml = [];
        if (layout.type == "1") {
            arr = ["12"];
        } else if (layout.type == "2") {
            arr = ["6", "6"];
        } else if (layout.type == "3") {
            arr = ["4", "8"];
        } else if (layout.type == "4") {
            arr = ["8", "4"];
        } else if (layout.type == "5") {
            arr = ["4", "4", "4"];
        } else if (layout.type == "6") {
            arr = ["9", "3"];
        } else if (layout.type == "7") {
            arr = ["3", "9"];
        } else if (layout.type == "8") {
            arr = ["3", "3", "3", "3"];
        }

        $.each(layout.childs, function (i, column) {
            var childhtml = self.getControlHtml(column);
            if (column.showtitle) {
                childhtml = self.getColumnTitle(column.title) + childhtml;
            }
            var classname = "";//column.border ? "" : " noborder ";
            classname += column.fill ? " fixed " : "  ";
            classname += self.getColumnStyle(column.formstyle);
            if (arr[i] == "12") {
                arrhtml.push("<div id='" + column.id + "'><div "
                    + self.getColumnStyleInLine(column) + " class='" + classname + "'>" + childhtml + "</div></div>");
            } else {
                arrhtml.push("<div class='col-sm col-sm-" + arr[i] + "' id='" + column.id + "'><div "
                    + self.getColumnStyleInLine(column) + " class='" + classname + "'>" + childhtml + "</div></div>");
            }

        });
        return arrhtml.join("");
    },
    getColumnStyle: function (type) {
        // 获取column类信息
        var res = "lee-table-form";
        if (type && type == "1") {
            res = "lee-table-form-border"; //有边框
        }
        if (type && type == "2") {
            res = " lee-table-form-border table-query"; // 无边框
        }
        if (type && type == "3") {
            res = " lee-table-form-border table-block";//label换行
        }
        if (type && type == "4") {
            res = " lee-table-form-border table-query table-single";//控件独立占一行
        }
        return res;
    },
    getColumnStyleInLine: function (col) {
        var style = " style='";
        if (col.height) {
            style += "height:" + col.height + "px;";
        } else {
            style += "overflow:hidden;";
        }
        if (col.minheight) {
            style += "min-height:" + col.minheight + "px;";
        }
        style += "' ";
        return style;
    },
    getColumnTitle: function (title) {
        if (title && title != "") {
            return "<div><span class='table-group'>" + title + "</span><div class='table-group-line'></div></div>";
        }
        return "";
    },
    getControlHtml: function (column, isabs) {
        var self = this;
        var arr = [];
        $.each(column.childs, function (i, control) {

            var style = "";
            if (isabs) {
                style = self.getCtrlStyle(control);
            }
            if (control.type == "grid") {

                arr.push(self.getGridHtml(control, (column.childs.length > 1 ? true : false), isabs));

            }
            else if (control.type == "chart") {
                arr.push(self.getChartHtml(control, isabs));
            }
            else if (control.type == "tree") {
                arr.push(self.getTreeHtml(control, style));
            }
            else if (control.type == "bar") {
                arr.push(self.getToolBar(control, style))
            }
            else if (control.type == "button") {
                arr.push(self.getButton(control, style))
            }

            else if (control.type == "textarea") {
                arr.push(self.getTextAreaHtml(control, style))
            }
            else if (control.type == "label") {
                arr.push(self.getLabel(control, style))
            }
            else {
                arr.push(self.getCommonInput(control, style));
            }
        });
        return arr.join("");

    },
    getCommonInput: function (control, style) {
        var required = "";
        var span = "";
        if (control.required) {
            //alert(1);
            required = 'data-rule="required"';
            span = "<span style='color:red;'>*</span>";
        }
        var arr = [];
        arr.push("<div class='table-item' style='width: " + this.getWidthByColSpan(control) + ";" + style + "'>");
        arr.push("    <div class='table-label'  style='color:#000;'  id='label_" + control.id + "'>" + span + control.label + " </div>");
        arr.push("    <div class='table-editor'>");
        arr.push("        <input type='text' class='lee-input' " + required + " id='" + control.id + "' data-bindtable='" + control.bindtable + "' data-bindfield='" + control.bindfield + "' />");
        arr.push("    </div>");
        arr.push("</div>");
        return arr.join("");


        /*<table><tr><td></td><td></td><td></td><td></td></tr></table>*/
    },
    getLabel: function (control, style) {


        var arr = [];
        arr.push("<div style='width: " + this.getWidthByColSpan(control) + ";" + style + "'>");
        arr.push("<span id='" + control.id + "'>" + control.label + "</span>");

        arr.push("</div>");
        return arr.join("");
    },
    getCtrlStyle: function (ctrl) {
        var styArr = [];
        styArr.push("position:absolute");
        if (ctrl.top) {
            styArr.push("top:" + ctrl.top + "px");
        } if (ctrl.left) {
            styArr.push("left:" + ctrl.left + "px");
        }
        if (ctrl.height) {
            styArr.push("height:" + ctrl.height + "px");
        }
        if (ctrl.width) {
            if (String(ctrl.width).indexOf("%") != -1) {
                styArr.push("width:" + ctrl.width + "");
            } else {
                styArr.push("width:" + ctrl.width + "px");
            }


        }
        return styArr.join(";");
    },

    getGridHtml: function (control, fit, isabs) {
        var colSpan = "style ='";
        if (fit)
            colSpan += "  width: " + this.getWidthByColSpan(control) + ";";
        if (isabs)
            colSpan += this.getCtrlStyle(control) + ";";
        colSpan += "'";

        return "<div class='table-item clear' " + colSpan + " ><div class='grid' id='" + control.id + "' data-bindtable='" + control.bindtable + "' ></div></div>";
    },
    getChartHtml: function (control, isabs) {
        var colSpan = "style ='";
        var height = control.height.indexOf("%") == -1 ? String(control.height) + "px" : control.height;
        colSpan += "  width: " + this.getWidthByColSpan(control) + ";height:" + height + "";
        if (isabs)
            colSpan += this.getCtrlStyle(control) + ";";
        colSpan += "'";
        return "<div class='chart-item' " + colSpan + " ><div class='chart'  id='" + control.id + "' data-bindtable='" + control.bindtable + "' ></div></div>";
    },
    getTreeHtml: function (control, style) {
        return "<div class='table-item clear' style='" + style + ";'><div class='tree' id='" + control.id + "' data-bindtable='" + control.bindtable + "' ></div></div>";
    },
    getTextAreaHtml: function (control, style) {
        var arr = [];

        var required = "";
        var span = "";
        if (control.required) {
            //alert(1);
            required = 'data-rule="required"';
            span = "<span style='color:red;'>*</span>";
        }
        arr.push("<div class='table-item' style='width: " + this.getWidthByColSpan(control) + ";" + style + ";'>");
        arr.push("    <div class='table-label' style='color:#000;'  id='label_" + control.id + "'>" + span + control.label + " </div>");
        arr.push("    <div class='table-editor'>");
        arr.push("        <textarea id='" + control.id + "' " + required + " style='height:" + control.editor_textarea.height + "px;' data-bindtable='" + control.bindtable + "' data-bindfield='" + control.bindfield + "'></textarea>");
        arr.push("    </div>");
        arr.push("</div>");
        return arr.join("");
    },
    getToolBar: function (control, style) {
        return "<div class='table-item clear' style='" + style + ";'><div class='toolbar' id='" + control.id + "' ></div></div>";
    },
    getButton: function (control, style) {
        return "<div class='table-item clear' style='width: " + this.getWidthByColSpan(control) + ";" + style + ";'><div class='buttoninfo' style='" + leeManger.getButtonAlign(control.align) + "'>" + leeManger.getBtnIDHtml(control, control.id) + "</div></div>";

    },
    getWidthByColSpan: function (control) {
        var def = "100%";
        var colspan = control.colspan;


        if (control.width) {
            return control.width + "px";
        }
        if (colspan == "2") {
            return "50%";
        }
        if (colspan == "3") {
            return "33.33%";
        }
        if (colspan == "4") {
            return "25%";
        }
        if (colspan == "5") {
            return "20%";
        }
        if (colspan == "8") {
            return "12.5%";
        }
        if (colspan == "10") {
            return "10%";
        }
        if (colspan == "20") {
            return "5%";
        }
        if (colspan == "60") {
            return "60%";
        }
        if (colspan == "80") {
            return "80%";
        }
        if (colspan == "90") {
            return "90%";
        }
        if (colspan == "45") {
            return "45%";
        }
        if (colspan == "30") {
            return "30%";
        }

        return def;
    }
};


window.CodeEngineManger = new CodeGenerator();