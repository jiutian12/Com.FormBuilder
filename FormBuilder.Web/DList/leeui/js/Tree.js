(function ($) {
    $.fn.leeTree = function (options) {
        return $.leeUI.run.call(this, "leeUITree", arguments);
    };

    $.fn.leeGetTreeManager = function () {
        return $.leeUI.run.call(this, "leeUIGetTreeManager", arguments);
    };

    $.leeUIDefaults.Tree = {
        url: null,
        urlParms: null, //url带参数
        data: null,
        width: "auto",
        checkbox: false,
        autoCheckboxEven: true, //复选框级联？
        enabledCompleteCheckbox: true, //是否启用半选择
        parentIcon: 'folder', //'folder',icon-tfs-tcm-static-suite 
        childIcon: 'leaf', //'leaf',
        textFieldName: 'text',
        attribute: ['id', 'url'],
        treeLine: true, //是否显示line
        nodeWidth: 90,
        statusName: '__status',
        isLeaf: null, //是否子节点的判断函数
        single: false, //是否单选
        needCancel: true, //已选的是否需要取消操作
        idFieldName: 'id',
        parentIDFieldName: "pid",
        topParentIDValue: 0,
        slide: false, //是否以动画的形式显示
        iconFieldName: 'icon',
        nodeDraggable: false, //是否允许拖拽
        nodeDraggingRender: null,
        btnClickToToggleOnly: true, //是否点击展开/收缩 按钮时才有效
        ajaxType: 'post',
        ajaxContentType: null,
        render: null, //自定义函数
        selectable: null, //可选择判断函数
        /*
		是否展开 
		    1,可以是true/false 
		    2,也可以是数字(层次)N 代表第1层到第N层都是展开的，其他收缩
		    3,或者是判断函数 函数参数e(data,level) 返回true/false

		优先级没有节点数据的isexpand属性高,并没有delay属性高
		*/
        isExpand: null,
        /*
		是否延迟加载 
		    1,可以是true/false 
		    2,也可以是数字(层次)N 代表第N层延迟加载 
		    3,或者是字符串(Url) 加载数据的远程地址
		    4,如果是数组,代表这些层都延迟加载,如[1,2]代表第1、2层延迟加载
		    5,再是函数(运行时动态获取延迟加载参数) 函数参数e(data,level),返回true/false或者{url:...,parms:...}

		优先级没有节点数据的delay属性高
		*/
        delay: null,
        idField: null, //id字段
        parentIDField: null, //parent id字段，可用于线性数据转换为tree数据
        iconClsFieldName: "iconclass",
        onBeforeAppend: function () { }, //加载数据前事件，可以通过return false取消操作
        onAppend: function () { }, //加载数据时事件，对数据进行预处理以后
        onAfterAppend: function () { }, //加载数据完事件
        onBeforeExpand: function () { },
        onContextmenu: function () { },
        onExpand: function () { },
        onBeforeCollapse: function () { },
        onCollapse: function () { },
        onBeforeSelect: function () { },
        onSelect: function () { },
        onBeforeCancelSelect: function () { },
        onCancelselect: function () { },
        onCheck: function () { },
        onSuccess: function () { },
        onError: function () { },
        onClick: function () { },
        onDblclick: function () { }

    };

    $.leeUI.controls.Tree = function (element, options) {
        $.leeUI.controls.Tree.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.Tree.leeExtend($.leeUI.core.UIComponent, {
        _init: function () {
            $.leeUI.controls.Tree.base._init.call(this); //初始父类构造函数
            var g = this,
				p = this.options;
            if (p.single) p.autoCheckboxEven = false; //单选则取消级联
        },
        _render: function () {
            var g = this,
				p = this.options;
            g.set(p, true);
            g.tree = $(g.element);
            g.tree.addClass('lee-tree');
            g.toggleNodeCallbacks = [];
            g.sysAttribute = ['isexpand', 'ischecked', 'href', 'style', 'delay'];
            g.loading = $("<div class='lee-tree-loading'></div>");
            g.tree.after(g.loading);
            g.data = [];
            g.maxOutlineLevel = 1;
            g.treedataindex = 0;
            g._applyTree();
            g._setTreeEven();
            g.set(p, false);
        },
        _setDisabled: function (flag) {
        },
        _applyTree: function () { //初始化树
            var g = this,
				p = this.options;
            g.data = []; //g._getDataByTreeHTML(g.tree);
            var gridhtmlarr = g._getTreeHTMLByData(g.data, 1, [], true);
            gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
            g.tree.html(gridhtmlarr.join('')); //设置格式
            //g._upadteTreeWidth();
            //绑定hover事件
            $(".lee-body", g.tree).hover(function () {
                $(this).addClass("lee-over");
            }, function () {
                $(this).removeClass("lee-over");
            });
        },
        //增加节点集合
        //parm [newdata] 数据集合 Array
        //parm [parentNode] dom节点(li)、节点数据 或者节点 dataindex null 为根节点
        //parm [nearNode] 附加到节点的上方/下方(非必填)
        //parm [isAfter] 附加到节点的下方(非必填)
        append: function (parentNode, newdata, nearNode, isAfter) {
            var g = this,
				p = this.options;
            parentNode = g.getNodeDom(parentNode);
            if (g.trigger('beforeAppend', [parentNode, newdata]) == false) return false; //触发追加时间
            if (!newdata || !newdata.length) return false;
            if (p.idFieldName && p.parentIDFieldName)
                newdata = g.arrayToTree(newdata, p.idFieldName, p.parentIDFieldName); //格式化数据
            g._addTreeDataIndexToData(newdata);
            g._setTreeDataStatus(newdata, 'add');
            if (nearNode != null) {
                nearNode = g.getNodeDom(nearNode);
            }
            g.trigger('append', [parentNode, newdata])
            g._appendData(parentNode, newdata);
            if (parentNode == null) //增加到根节点
            {
                var gridhtmlarr = g._getTreeHTMLByData(newdata, 1, [], true);
                gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
                if (nearNode != null) {
                    $(nearNode)[isAfter ? 'after' : 'before'](gridhtmlarr.join(''));
                    g._updateStyle(parentNode ? $("ul:first", parentNode) : g.tree);
                } else {
                    //remove last node class
                    if ($("> li:last", g.tree).length > 0)
                        g._setTreeItem($("> li:last", g.tree)[0], { isLast: false });
                    g.tree.append(gridhtmlarr.join(''));
                }
                $(".lee-body", g.tree).hover(function () {
                    $(this).addClass("lee-over");
                }, function () {
                    $(this).removeClass("lee-over");
                });
                g._upadteTreeWidth();
                g.trigger('afterAppend', [parentNode, newdata])
                return;
            }
            var treeitem = $(parentNode);
            var outlineLevel = parseInt(treeitem.attr("outlinelevel"));

            var hasChildren = $("> ul", treeitem).length > 0;
            if (!hasChildren) {
                treeitem.append("<ul class='lee-children'></ul>");
                //设置为父节点
                g.upgrade(parentNode);
            }
            var isLast = [];
            for (var i = 1; i <= outlineLevel - 1; i++) {
                var currentParentTreeItem = $(g.getParentTreeItem(parentNode, i));
                isLast.push(currentParentTreeItem.hasClass("lee-last"));
            }
            isLast.push(treeitem.hasClass("lee-last"));
            var gridhtmlarr = g._getTreeHTMLByData(newdata, outlineLevel + 1, isLast, true);
            gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
            if (nearNode != null) {
                $(nearNode)[isAfter ? 'after' : 'before'](gridhtmlarr.join(''));
                g._updateStyle(parentNode ? $("ul:first", parentNode) : g.tree);
            } else {
                //remove last node class  
                if ($("> .lee-children > li:last", treeitem).length > 0)
                    g._setTreeItem($("> .lee-children > li:last", treeitem)[0], { isLast: false });
                $(">.lee-children", parentNode).append(gridhtmlarr.join(''));
            }
            g._upadteTreeWidth();
            $(">.lee-children .lee-body", parentNode).hover(function () {
                $(this).addClass("lee-over");
            }, function () {
                $(this).removeClass("lee-over");
            });
            g.trigger('afterAppend', [parentNode, newdata]);
        },
        loadData: function (node, url, param, e) {
            var g = this,
				p = this.options;
            e = $.extend({
                showLoading: function () {
                    g.loading.show();
                },
                success: function () { },
                error: function () { },
                hideLoading: function () {
                    g.loading.hide();
                }
            }, e || {});
            var ajaxtype = p.ajaxType;
            //解决树无法设置parms的问题
            param = $.extend(($.isFunction(p.parms) ? p.parms() : p.parms), param);
            if (p.ajaxContentType == "application/json" && typeof (param) != "string") {
                param = liger.toJSON(param);
            }
            var urlParms = $.isFunction(p.urlParms) ? p.urlParms.call(g) : p.urlParms;
            if (urlParms) {
                for (name in urlParms) {
                    url += url.indexOf('?') == -1 ? "?" : "&";
                    url += name + "=" + urlParms[name];
                }
            }
            var ajaxOp = {
                type: ajaxtype,
                url: url,
                data: param,
                dataType: 'json',
                beforeSend: function () {
                    e.showLoading();
                },
                success: function (data) {
                    if (!data) return;
                    if (p.idField && p.parentIDField) {
                        data = g.arrayToTree(data, p.idField, p.parentIDField);
                    }
                    e.hideLoading();
                    g.append(node, data); //加载数据 节点
                    g.trigger('success', [data]);
                    e.success(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    try {
                        e.hideLoading();
                        g.trigger('error', [XMLHttpRequest, textStatus, errorThrown]);
                        e.error(XMLHttpRequest, textStatus, errorThrown);
                    } catch (e) {

                    }
                }
            };
            if (p.ajaxContentType) {
                ajaxOp.contentType = p.ajaxContentType;
            }
            $.ajax(ajaxOp);
        },
        _setParms: function () {
            var g = this,
				p = this.options;
            if ($.isFunction(p.parms)) p.parms = p.parms();
        },
        _setTreeLine: function (value) {
            //虚线节点
            if (value) this.tree.removeClass("lee-tree-noline");
            else this.tree.addClass("lee-tree-noline");
        },
        _setUrl: function (url) {
            var g = this,
				p = this.options;
            if (url) {
                g.clear();
                g.loadData(null, url);
            }
        },
        _setData: function (data) {
            if (data) {
                this.clear();
                this.append(null, data); //追加数据
            }
        },
        //设置树的点击事件
        _setTreeEven: function () {
            var g = this,
				p = this.options;
            //单击
            g.tree.click(function (e) {
                //绑定树单击事件
                var obj = (e.target || e.srcElement);
                var treeitem = null;
                if (obj.tagName.toLowerCase() == "a" || obj.tagName.toLowerCase() == "span" || $(obj).hasClass("lee-box"))
                    treeitem = $(obj).parent().parent();
                else if ($(obj).hasClass("lee-body"))
                    treeitem = $(obj).parent();
                else
                    treeitem = $(obj);
                if (!treeitem) return;
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                var treeitembtn = $("div.lee-body:first", treeitem).find("div.lee-expandable-open:first,div.lee-expandable-close:first");
                var clickOnTreeItemBtn = $(obj).hasClass("lee-expandable-open") || $(obj).hasClass("lee-expandable-close");
                //是否点击的展开收起的加号
                if (!$(obj).hasClass("lee-checkbox") && !clickOnTreeItemBtn) {
                    if (!treeitem.hasClass("lee-unselectable")) {
                        if ($(">div:first", treeitem).hasClass("lee-selected") && p.needCancel) {
                            if (g.trigger('beforeCancelSelect', [{ data: treenodedata, target: treeitem[0] }]) == false)
                                return false;

                            $(">div:first", treeitem).removeClass("lee-selected");
                            g.trigger('cancelSelect', [{ data: treenodedata, target: treeitem[0] }]);
                        } else {
                            if (g.trigger('beforeSelect', [{ data: treenodedata, target: treeitem[0] }]) == false)
                                return false;
                            $(".lee-body", g.tree).removeClass("lee-selected");
                            $(">div:first", treeitem).addClass("lee-selected");
                            g.trigger('select', [{ data: treenodedata, target: treeitem[0] }])
                        }
                    }
                }
                //chekcbox even
                if ($(obj).hasClass("lee-checkbox")) {
                    if (p.autoCheckboxEven) {
                        //状态：未选中
                        if ($(obj).hasClass("lee-checkbox-unchecked")) {
                            $(obj).removeClass("lee-checkbox-unchecked").addClass("lee-checkbox-checked");
                            $(".lee-children .lee-checkbox", treeitem)
								.removeClass("lee-checkbox-incomplete lee-checkbox-unchecked")
								.addClass("lee-checkbox-checked");
                            g.trigger('check', [{ data: treenodedata, target: treeitem[0] }, true]);
                        }
                            //状态：选中
                        else if ($(obj).hasClass("lee-checkbox-checked")) {
                            $(obj).removeClass("lee-checkbox-checked").addClass("lee-checkbox-unchecked");
                            $(".lee-children .lee-checkbox", treeitem)
								.removeClass("lee-checkbox-incomplete lee-checkbox-checked")
								.addClass("lee-checkbox-unchecked");
                            g.trigger('check', [{ data: treenodedata, target: treeitem[0] }, false]);
                        }
                            //状态：未完全选中
                        else if ($(obj).hasClass("lee-checkbox-incomplete")) {
                            $(obj).removeClass("lee-checkbox-incomplete").addClass("lee-checkbox-checked");
                            $(".lee-children .lee-checkbox", treeitem)
								.removeClass("lee-checkbox-incomplete lee-checkbox-unchecked")
								.addClass("lee-checkbox-checked");
                            g.trigger('check', [{ data: treenodedata, target: treeitem[0] }, true]);
                        }
                        g._setParentCheckboxStatus(treeitem);
                    } else {
                        //状态：未选中
                        if ($(obj).hasClass("lee-checkbox-unchecked")) {
                            $(obj).removeClass("lee-checkbox-unchecked").addClass("lee-checkbox-checked");
                            //是否单选
                            if (p.single) {
                                $(".lee-checkbox", g.tree).not(obj).removeClass("lee-checkbox-checked").addClass("lee-checkbox-unchecked");
                            }
                            g.trigger('check', [{ data: treenodedata, target: treeitem[0] }, true]);
                        }
                            //状态：选中
                        else if ($(obj).hasClass("lee-checkbox-checked")) {
                            $(obj).removeClass("lee-checkbox-checked").addClass("lee-checkbox-unchecked");
                            g.trigger('check', [{ data: treenodedata, target: treeitem[0] }, false]);
                        }
                    }
                }
                    //状态：已经张开
                else if (treeitembtn.hasClass("lee-expandable-open") && (!p.btnClickToToggleOnly || clickOnTreeItemBtn)) {
                    if (g.trigger('beforeCollapse', [{ data: treenodedata, target: treeitem[0] }]) == false)
                        return false;
                    treeitembtn.removeClass("lee-expandable-open").addClass("lee-expandable-close");
                    if (p.slide)
                        $("> .lee-children", treeitem).slideToggle('fast');
                    else
                        $("> .lee-children", treeitem).hide();
                    $("> div ." + g._getParentNodeClassName(true), treeitem)
						.removeClass(g._getParentNodeClassName(true))
						.addClass(g._getParentNodeClassName());
                    g.trigger('collapse', [{ data: treenodedata, target: treeitem[0] }]);
                }
                    //状态：没有张开
                else if (treeitembtn.hasClass("lee-expandable-close") && (!p.btnClickToToggleOnly || clickOnTreeItemBtn)) {
                    if (g.trigger('beforeExpand', [{ data: treenodedata, target: treeitem[0] }]) == false)
                        return false;

                    $(g.toggleNodeCallbacks).each(function () {
                        if (this.data == treenodedata) {
                            this.callback(treeitem[0], treenodedata);
                        }
                    });
                    treeitembtn.removeClass("lee-expandable-close").addClass("lee-expandable-open");
                    var callback = function () {
                        g.trigger('expand', [{ data: treenodedata, target: treeitem[0] }]);
                    };
                    if (p.slide) {
                        $("> .lee-children", treeitem).slideToggle('fast', callback);
                    } else {
                        $("> .lee-children", treeitem).show();
                        callback();
                    }
                    $("> div ." + g._getParentNodeClassName(), treeitem)
						.removeClass(g._getParentNodeClassName())
						.addClass(g._getParentNodeClassName(true));
                }
                g.trigger('click', [{ data: treenodedata, target: treeitem[0] }]);
            });

          
            g.tree.dblclick(function (e) {
                var obj = (e.target || e.srcElement);
                var treeitem = null;
                if (obj.tagName.toLowerCase() == "a" || obj.tagName.toLowerCase() == "span" || $(obj).hasClass("lee-box"))
                    treeitem = $(obj).parent().parent();
                else if ($(obj).hasClass("lee-body"))
                    treeitem = $(obj).parent();
                else
                    treeitem = $(obj);
                if (!treeitem) return;
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                g.trigger('dblclick', [{ data: treenodedata, target: treeitem[0] }]);
            });

        },
        _getTreeHTMLByData: function (data, outlineLevel, isLast, isExpand) {
            var g = this,
				p = this.options;
            if (g.maxOutlineLevel < outlineLevel)
                g.maxOutlineLevel = outlineLevel;
            isLast = isLast || [];
            outlineLevel = outlineLevel || 1;
            var treehtmlarr = [];
            if (!isExpand) //如果默认不展开
                treehtmlarr.push('<ul class="lee-children" style="display:none">');
            else
                treehtmlarr.push("<ul class='lee-children'>");
            for (var i = 0; i < data.length; i++) {
                var o = data[i];
                var isFirst = i == 0;
                var isLastCurrent = i == data.length - 1;
                var delay = g._getDelay(o, outlineLevel);
                var isExpandCurrent = delay ? false : g._isExpand(o, outlineLevel);
                treehtmlarr.push('<li ');
                if (o.treedataindex != undefined)
                    treehtmlarr.push('treedataindex="' + o.treedataindex + '" ');

                if (o[p.idFieldName])
                    treehtmlarr.push('data-id="' + o[p.idFieldName] + '" ');
                if (isExpandCurrent)
                    treehtmlarr.push('isexpand=' + o.isexpand + ' ');
                treehtmlarr.push('outlinelevel=' + outlineLevel + ' ');
                //属性支持

                treehtmlarr.push('class="');
                isFirst && treehtmlarr.push('lee-first '); //首节点
                isLastCurrent && treehtmlarr.push('lee-last '); // 尾部
                isFirst && isLastCurrent && treehtmlarr.push('lee-onlychild '); //只有一个节点
                treehtmlarr.push('"');
                treehtmlarr.push('>');
                treehtmlarr.push('<div class="lee-body');
                //				if (p.selectable && p.selectable(o) == false)
                //              {
                //                  treehtmlarr.push(' lee-unselectable');
                //              }
                treehtmlarr.push('">');
                for (var k = 0; k <= outlineLevel - 2; k++) {
                    //if(isLast[k]) treehtmlarr.push('<div class="lee-box"></div>');
                    //else 
                    treehtmlarr.push('<div class="lee-box lee-line"></div>'); //占位tab 从第二级开始
                }
                if (g.hasChildren(o)) {
                    //是否展开的判断
                    if (isExpandCurrent) treehtmlarr.push('<div class="lee-box lee-expandable-open"></div>');
                    else treehtmlarr.push('<div class="lee-box lee-expandable-close"></div>');
                    //是否有复选框
                    if (p.checkbox) {
                        if (o.ischecked)
                            treehtmlarr.push('<div class="lee-box lee-checkbox lee-checkbox-checked"></div>');
                        else
                            treehtmlarr.push('<div class="lee-box lee-checkbox lee-checkbox-unchecked"></div>');
                    }
                    if (p.parentIcon) {
                        //node icon
                        treehtmlarr.push('<div class="lee-box lee-tree-icon '); //添加图标内容
                        treehtmlarr.push(g._getParentNodeClassName(isExpandCurrent ? true : false) + " ");

                        //添加没有图标样式
                        if (p.iconFieldName && o[p.iconFieldName]) {
                            treehtmlarr.push('lee-tree-icon-none');
                        } else if (p.iconClsFieldName && o[p.iconClsFieldName]) {

                            treehtmlarr.push('lee-tree-icon-none');
                        }

                        treehtmlarr.push('">');

                        if (p.iconFieldName && o[p.iconFieldName])
                            treehtmlarr.push('<img src="' + o[p.iconFieldName] + '" />');
                        else if (p.iconClsFieldName && o[p.iconClsFieldName])
                            treehtmlarr.push('<i class="icon-img  ' + o[p.iconClsFieldName] + '"></i>');
                        treehtmlarr.push('</div>');
                    }

                } else {
                    //如果是叶子节点
                    //添加同级最后一个节点css标记子节点
                    if (isLastCurrent) treehtmlarr.push('<div class="lee-box lee-node-last"></div>');
                    else treehtmlarr.push('<div class="lee-box lee-node"></div>');
                    //如果有checkbox
                    if (p.checkbox) {
                        if (o.ischecked)
                            treehtmlarr.push('<div class="lee-box lee-checkbox lee-checkbox-checked"></div>');
                        else
                            treehtmlarr.push('<div class="lee-box lee-checkbox lee-checkbox-unchecked"></div>');
                    }
                    if (p.childIcon) {
                        //node icon 
                        treehtmlarr.push('<div class="lee-box lee-tree-icon ');
                        treehtmlarr.push(g._getChildNodeClassName() + " ");
                        if ((p.iconFieldName && o[p.iconFieldName]) || p.iconClsFieldName && o[p.iconClsFieldName])
                            treehtmlarr.push('lee-tree-icon-none');

                        treehtmlarr.push('">');
                        if (p.iconFieldName && o[p.iconFieldName])
                            treehtmlarr.push('<img src="' + o[p.iconFieldName] + '" />');
                        else if (p.iconClsFieldName && o[p.iconClsFieldName])
                            treehtmlarr.push('<i class="icon-img  ' + o[p.iconClsFieldName] + '"></i>');
                        treehtmlarr.push('</div>');
                    }
                }

                //添加树形文字 如果有自定义渲染 那么则处理html
                if (p.render) {
                    treehtmlarr.push('<span>' + p.render(o, o[p.textFieldName]) + '</span>');
                } else {
                    treehtmlarr.push('<span>' + o[p.textFieldName] + '</span>');
                }
                treehtmlarr.push('</div>');

                if (g.hasChildren(o)) {
                    var isLastNew = [];
                    for (var k = 0; k < isLast.length; k++) {
                        isLastNew.push(isLast[k]);
                    }
                    isLastNew.push(isLastCurrent);
                    if (delay) {
                        if (delay == true) {
                            g.toggleNodeCallbacks.push({
                                data: o,
                                callback: function (dom, o) {
                                    var content = g._getTreeHTMLByData(o.children, outlineLevel + 1, isLastNew, isExpandCurrent).join('');
                                    $(dom).append(content);
                                    $(">.lee-children .lee-body", dom).hover(function () {
                                        $(this).addClass("lee-over");
                                    }, function () {
                                        $(this).removeClass("lee-over");
                                    });
                                    g._removeToggleNodeCallback(o);
                                }
                            });
                        } else if (delay.url) {
                            (function (o, url, parms) {
                                g.toggleNodeCallbacks.push({
                                    data: o,
                                    callback: function (dom, o) {
                                        g.loadData(dom, url, parms, {
                                            showLoading: function () {
                                                $("div.lee-expandable-close:first", dom).addClass("lee-box-loading");
                                            },
                                            hideLoading: function () {
                                                $("div.lee-box-loading:first", dom).removeClass("lee-box-loading");
                                            }
                                        });
                                        g._removeToggleNodeCallback(o);
                                    }
                                });
                            })(o, delay.url, delay.parms);
                        }
                    } else {
                        // 这里处理延时加载 to do
                        treehtmlarr.push(g._getTreeHTMLByData(o.children, outlineLevel + 1, isLastNew, isExpandCurrent).join(''));
                    }
                    //添加子集树Html
                }
                treehtmlarr.push('</li>');
            }
            treehtmlarr.push("</ul>");
            return treehtmlarr;
        },
        hasChildren: function (treenodedata) {
            if (this.options.isLeaf) return !this.options.isLeaf(treenodedata);
            //如果有自定义判断函数 则走自定义判断是否孩子节点函数 不然则判断children
            return treenodedata.children ? true : false;
        },
        //获取父节点 数据
        getParent: function (treenode, level) {
            var g = this;
            treenode = g.getNodeDom(treenode);
            var parentTreeNode = g.getParentTreeItem(treenode, level);
            if (!parentTreeNode) return null;
            var parentIndex = $(parentTreeNode).attr("treedataindex");
            return g._getDataNodeByTreeDataIndex(g.data, parentIndex);
        },
        //获取父节点
        getParentTreeItem: function (treenode, level) {
            var g = this;
            treenode = g.getNodeDom(treenode);
            var treeitem = $(treenode);
            if (treeitem.parent().hasClass("lee-tree"))
                return null;
            if (level == undefined) {
                if (treeitem.parent().parent("li").length == 0)
                    return null;
                return treeitem.parent().parent("li")[0];
            }
            var currentLevel = parseInt(treeitem.attr("outlinelevel"));
            var currenttreeitem = treeitem;
            for (var i = currentLevel - 1; i >= level; i--) {
                currenttreeitem = currenttreeitem.parent().parent("li");
            }
            return currenttreeitem[0];
        },
        getChecked: function () {
            var g = this, p = this.options;
            if (!this.options.checkbox) return null;
            var nodes = [];
            $(".lee-checkbox-checked", g.tree).parent().parent("li").each(function () {
                var treedataindex = parseInt($(this).attr("treedataindex"));
                nodes.push({ target: this, data: g._getDataNodeByTreeDataIndex(g.data, treedataindex) });
            });
            return nodes;
        },
        getCheckedData: function () {
            var g = this, p = this.options;
            if (!this.options.checkbox) return null;
            var nodes = [];
            $(".lee-checkbox-checked", g.tree).parent().parent("li").each(function () {
                var treedataindex = parseInt($(this).attr("treedataindex"));
                nodes.push(g._getDataNodeByTreeDataIndex(g.data, treedataindex));
            });
            return nodes;
        },



        //add by superzoc 12/24/2012 
        refreshTree: function () {
            var g = this, p = this.options;
            $.each(this.getChecked(), function (k, v) {
                g._setParentCheckboxStatus($(v.target));
            });
        },
        getSelected: function () {
            var g = this, p = this.options;
            var node = {};
            node.target = $(".lee-selected", g.tree).parent("li")[0];
            if (node.target) {
                var treedataindex = parseInt($(node.target).attr("treedataindex"));
                node.data = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                return node;
            }
            return null;
        },
        //升级为父节点级别
        upgrade: function (treeNode) {
            var g = this, p = this.options;
            $(".lee-note", treeNode).each(function () {
                $(this).removeClass("lee-note").addClass("lee-expandable-open");
            });
            $(".lee-note-last", treeNode).each(function () {
                $(this).removeClass("lee-note-last").addClass("lee-expandable-open");
            });
            $("." + g._getChildNodeClassName(), treeNode).each(function () {
                $(this)
                        .removeClass(g._getChildNodeClassName())
                        .addClass(g._getParentNodeClassName(true));
            });
        },
        //降级为叶节点级别
        demotion: function (treeNode) {
            var g = this, p = this.options;
            if (!treeNode && treeNode[0].tagName.toLowerCase() != 'li') return;
            var islast = $(treeNode).hasClass("lee-last");
            $(".lee-expandable-open", treeNode).each(function () {
                $(this).removeClass("lee-expandable-open")
                        .addClass(islast ? "lee-note-last" : "lee-note");
            });
            $(".lee-expandable-close", treeNode).each(function () {
                $(this).removeClass("lee-expandable-close")
                        .addClass(islast ? "lee-note-last" : "lee-note");
            });
            $("." + g._getParentNodeClassName(true), treeNode).each(function () {
                $(this)
                        .removeClass(g._getParentNodeClassName(true))
                        .addClass(g._getChildNodeClassName());
            });
        },
        collapseAll: function () {
            var g = this, p = this.options;
            $(".lee-expandable-open", g.tree).click();
        },
        expandAll: function () {
            var g = this, p = this.options;
            $(".lee-expandable-close", g.tree).click();
        },
        hide: function (treeNode) {
            var g = this, p = this.options;
            treeNode = g.getNodeDom(treeNode);
            if (treeNode) $(treeNode).hide();
        },
        show: function (treeNode) {
            var g = this, p = this.options;
            treeNode = g.getNodeDom(treeNode);
            if (treeNode) $(treeNode).show();
        },
        //parm [treeNode] dom节点(li)、节点数据 或者节点 dataindex
        remove: function (treeNode) {
            var g = this, p = this.options;
            treeNode = g.getNodeDom(treeNode);
            var treedataindex = parseInt($(treeNode).attr("treedataindex"));
            var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            if (treenodedata) g._setTreeDataStatus([treenodedata], 'delete');
            var parentNode = g.getParentTreeItem(treeNode);
            //复选框处理
            if (p.checkbox) {
                g._setParentCheckboxStatus($(treeNode));
            }
            $(treeNode).remove();
            g._updateStyle(parentNode ? $("ul:first", parentNode) : g.tree);
        },
        //parm [domnode] dom节点(li)、节点数据 或者节点 dataindex
        update: function (domnode, newnodedata) {
            var g = this, p = this.options;
            domnode = g.getNodeDom(domnode);
            var treedataindex = parseInt($(domnode).attr("treedataindex"));
            nodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            for (var attr in newnodedata) {
                nodedata[attr] = newnodedata[attr];
                if (attr == p.textFieldName) {
                    $("> .lee-body > span", domnode).text(newnodedata[attr]);
                }
            }
        },
        _getChildNodeClassName: function () {
            var g = this,
				p = this.options;
            nodeclassname = 'icon-img icon-document  ';
            // return 'lee-tree-icon-' + p.childIcon; //获取子节点的样式 图标
            return nodeclassname;
        },
        _getParentNodeClassName: function (isOpen) {
            var g = this,
				p = this.options;
            var nodeclassname = 'lee-tree-icon-' + p.parentIcon; //获取父节点的样式 图标

            //var nodeclassname = 'icon-img icon-folder';

            if (isOpen) {
                //nodeclassname += '-open';
                //nodeclassname = 'icon-img icon-folder-open';
            }

            return nodeclassname;
        },
        //判断节点是否展开状态,返回true/false
        _isExpand: function (o, level) {
            var g = this,
				p = this.options;
            var isExpand = o.isExpand != null ? o.isExpand : (o.isexpand != null ? o.isexpand : p.isExpand);
            if (isExpand == null) return true;
            if (typeof (isExpand) == "function") isExpand = p.isExpand({ data: o, level: level });
            if (typeof (isExpand) == "boolean") return isExpand;
            if (typeof (isExpand) == "string") return isExpand == "true";
            if (typeof (isExpand) == "number") return isExpand > level;
            return true;
        },
        //设置数据状态
        _setTreeDataStatus: function (data, status) {
            var g = this,
				p = this.options;
            $(data).each(function () {
                this[p.statusName] = status;
                if (this.children) {
                    g._setTreeDataStatus(this.children, status);
                }
            });
        },
        //根据数据索引获取数据
        _getDataNodeByTreeDataIndex: function (data, treedataindex) {
            var g = this,
				p = this.options;
            for (var i = 0; i < data.length; i++) {
                if (data[i].treedataindex == treedataindex)
                    return data[i];
                if (data[i].children) {
                    var targetData = g._getDataNodeByTreeDataIndex(data[i].children, treedataindex);
                    if (targetData) return targetData;
                }
            }
            return null;
        },
        //设置data 索引
        _addTreeDataIndexToData: function (data) {
            var g = this,
				p = this.options;
            $(data).each(function () {
                if (this.treedataindex != undefined) return;
                this.treedataindex = g.treedataindex++;
                if (this.children) {
                    g._addTreeDataIndexToData(this.children);
                }
            });
        },
        _appendData: function (treeNode, data) {
            var g = this,
				p = this.options;
            var treedataindex = parseInt($(treeNode).attr("treedataindex"));
            var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            if (g.treedataindex == undefined) g.treedataindex = 0;
            if (treenodedata && treenodedata.children == undefined) treenodedata.children = [];
            $(data).each(function (i, item) {
                if (treenodedata)
                    treenodedata.children[treenodedata.children.length] = item;
                else
                    g.data[g.data.length] = item;
                g._addToNodes(item);
            });
        },
        _addToNodes: function (data) {
            var g = this,
				p = this.options;
            g.nodes = g.nodes || [];
            g.nodes.push(data);
            if (!data.children) return;
            $(data.children).each(function (i, item) {
                g._addToNodes(item);
            });
        },
        //递归设置父节点的状态
        _setParentCheckboxStatus: function (treeitem) {

            var g = this,
				p = this.options;
            //当前同级别或低级别的节点是否都选中了
            var isCheckedComplete = $(".lee-checkbox-unchecked", treeitem.parent()).length == 0;
            //当前同级别或低级别的节点是否都没有选中
            var isCheckedNull = $(".lee-checkbox-checked", treeitem.parent()).length == 0;

            if (isCheckedNull) {
                treeitem.parent().prev().find("> .lee-checkbox")
					.removeClass("lee-checkbox-checked lee-checkbox-incomplete")
					.addClass("lee-checkbox-unchecked");
            } else {
                if (isCheckedComplete || !p.enabledCompleteCheckbox) {
                    treeitem.parent().prev().find(".lee-checkbox")
						.removeClass("lee-checkbox-unchecked lee-checkbox-incomplete")
						.addClass("lee-checkbox-checked");
                } else {
                    treeitem.parent().prev().find("> .lee-checkbox")
						.removeClass("lee-checkbox-unchecked lee-checkbox-checked")
						.addClass("lee-checkbox-incomplete");
                }
            }
            if (treeitem.parent().parent("li").length > 0)
                g._setParentCheckboxStatus(treeitem.parent().parent("li"));
        },
        _setTreeItem: function (treeNode, options) {
            var g = this,
				p = this.options;
            if (!options) return;
            treeNode = g.getNodeDom(treeNode);
            var treeItem = $(treeNode);
            var outlineLevel = parseInt(treeItem.attr("outlinelevel"));
            if (options.isLast != undefined) {
                if (options.isLast == true) {
                    treeItem.removeClass("lee-last").addClass("lee-last");
                    $("> div .lee-node", treeItem).removeClass("lee-node").addClass("lee-node-last");
                    $(".lee-children li", treeItem)
						.find(".lee-box:eq(" + (outlineLevel - 1) + ")")
						.removeClass("lee-line");
                } else if (options.isLast == false) {
                    treeItem.removeClass("lee-last");
                    $("> div .lee-node-last", treeItem).removeClass("lee-node-last").addClass("lee-node");

                    $(".lee-children li", treeItem)
						.find(".lee-box:eq(" + (outlineLevel - 1) + ")")
						.removeClass("lee-line")
						.addClass("lee-line");
                }
            }
        },
        _updateStyle: function (ul) {
            var g = this,
				p = this.options;
            var itmes = $(" > li", ul);
            var treeitemlength = itmes.length;
            if (!treeitemlength) return;
            //遍历设置子节点的样式
            itmes.each(function (i, item) {
                if (i == 0 && !$(this).hasClass("lee-first"))
                    $(this).addClass("lee-first");
                if (i == treeitemlength - 1 && !$(this).hasClass("lee-last"))
                    $(this).addClass("lee-last");
                if (i == 0 && i == treeitemlength - 1)
                    $(this).addClass("lee-onlychild");
                $("> div .lee-note,> div .lee-note-last", this)
					.removeClass("lee-note lee-note-last")
					.addClass(i == treeitemlength - 1 ? "lee-note-last" : "lee-note");
                g._setTreeItem(this, { isLast: i == treeitemlength - 1 });
            });
        },
        _upadteTreeWidth: function () {
            var g = this,
				p = this.options;
            if (p.width == "auto") {
                g.tree.width("auto");
                return;
            }
            var treeWidth = g.maxOutlineLevel * 22;
            if (p.checkbox) treeWidth += 22;
            if (p.parentIcon || p.childIcon) treeWidth += 22;
            treeWidth += p.nodeWidth;
            g.tree.width(treeWidth);

        },
        //获取节点的延迟加载状态,返回true/false (本地模式) 或者是object({url :'...',parms:null})(远程模式)
        _getDelay: function (o, level) {
            var g = this,
				p = this.options;
            var delay = o.delay != null ? o.delay : p.delay;
            if (delay == null) return false;
            if (typeof (delay) == "function") delay = delay({ data: o, level: level });
            if (typeof (delay) == "boolean") return delay;
            if (typeof (delay) == "string") return { url: delay };
            if (typeof (delay) == "number") delay = [delay];
            if ($.isArray(delay)) return $.inArray(level, delay) != -1;
            if (typeof (delay) == "object" && delay.url) return delay;
            return false;
        },
        _removeToggleNodeCallback: function (nodeData) {
            var g = this,
				p = this.options;
            for (var i = 0; i <= g.toggleNodeCallbacks.length; i++) {
                if (g.toggleNodeCallbacks[i] && g.toggleNodeCallbacks[i].data == nodeData) {
                    g.toggleNodeCallbacks.splice(i, 1); //删除节点事件
                    break;
                }
            }
        },
        getTextByID: function (id) {
            var g = this,
				p = this.options;
            var data = g.getDataByID(id);
            if (!data) return null;
            return data[p.textFieldName];
        },
        getDataByID: function (id) {
            var g = this,
				p = this.options;
            var data = null;

            if (g.data && g.data.length) {
                return find(g.data);
            }

            function find(items) {
                for (var i = 0; i < items.length; i++) {
                    var dataItem = items[i];
                    if (dataItem[p.idFieldName] == id) return dataItem;
                    if (dataItem.children && dataItem.children.length) {
                        var o = find(dataItem.children);
                        if (o) return o;
                    }
                }
                return null;
            }

            $("li", g.tree).each(function () {
                if (data) return;
                var treeitem = $(this);
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                if (treenodedata[p.idFieldName].toString() == id.toString()) {
                    data = treenodedata;
                }
            });
            return data;
        },
        arrayToTree: function (data, id, pid) {
            //将ID、ParentID这种数据格式转换为树格式
            var g = this,
				p = this.options;
            var childrenName = "children";
            if (!data || !data.length) return [];
            var targetData = []; //存储数据的容器(返回) 
            var records = {};
            var itemLength = data.length; //数据集合的个数
            for (var i = 0; i < itemLength; i++) {
                var o = data[i];
                var key = getKey(o[id]);
                records[key] = o;
            }
            for (var i = 0; i < itemLength; i++) {
                var currentData = data[i];
                var key = getKey(currentData[pid]);
                var parentData = records[key];
                if (!parentData) {
                    targetData.push(currentData);
                    continue;
                }
                parentData[childrenName] = parentData[childrenName] || [];
                parentData[childrenName].push(currentData);
            }
            return targetData;

            function getKey(key) {
                if (typeof (key) == "string") key = key.replace(/[.]/g, '').toLowerCase();
                return key;
            }
        },
        getNodeDom: function (nodeParm) {
            //根据节点参数获取树节点
            var g = this,
				p = this.options;
            if (nodeParm == null) return nodeParm;
            if (typeof (nodeParm) == "string" || typeof (nodeParm) == "number") {
                return $("li[treedataindex=" + nodeParm + "]", g.tree).get(0);
            } else if (typeof (nodeParm) == "object" && 'treedataindex' in nodeParm) //nodedata
            {
                return g.getNodeDom(nodeParm['treedataindex']);
            } else if (nodeParm.target && nodeParm.data) {
                return nodeParm.target;
            }
            return nodeParm;
        },
        setData: function (data) {
            this.set('data', data);
        },
        getData: function () {
            return this.data;
        },
        //parm [nodeParm] dom节点(li)、节点数据 或者节点 dataindex
        cancelSelect: function (nodeParm, isTriggerEvent) {
            var g = this,
				p = this.options;
            var domNode = g.getNodeDom(nodeParm);
            var treeitem = $(domNode);
            var treedataindex = parseInt(treeitem.attr("treedataindex"));
            var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            var treeitembody = $(">div:first", treeitem);
            if (p.checkbox)
                $(".lee-checkbox", treeitembody).removeClass("lee-checkbox-checked").addClass("lee-checkbox-unchecked");
            else
                treeitembody.removeClass("lee-selected");
            if (isTriggerEvent != false) {
                g.trigger('cancelSelect', [{ data: treenodedata, target: treeitem[0] }]);
            }
        },
        //选择节点(参数：条件函数、Dom节点或ID值)
        selectNode: function (selectNodeParm, isTriggerEvent) {
            var g = this,
				p = this.options;
            var clause = null;
            if (typeof (selectNodeParm) == "function") {
                clause = selectNodeParm;
            } else if (typeof (selectNodeParm) == "object") {
                var treeitem = $(selectNodeParm);
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                var treeitembody = $(">div:first", treeitem);
                if (!treeitembody.length) {
                    treeitembody = $("li[treedataindex=" + treedataindex + "] >div:first", g.tree);
                }
                if (p.checkbox) {
                    $(".lee-checkbox", treeitembody).removeClass("lee-checkbox-unchecked").addClass("lee-checkbox-checked");
                } else {
                    $("div.lee-selected", g.tree).removeClass("lee-selected");
                    treeitembody.addClass("lee-selected");
                }
                if (isTriggerEvent != false) {
                    g.trigger('select', [{ data: treenodedata, target: treeitembody.parent().get(0) }]);
                }
                return;
            } else {
                clause = function (data) {
                    if (!data[p.idFieldName] && data[p.idFieldName] != 0) return false;
                    return strTrim(data[p.idFieldName].toString()) == strTrim(selectNodeParm.toString());
                };
            }
            $("li", g.tree).each(function () {
                var treeitem = $(this);
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                if (clause(treenodedata, treedataindex)) {
                    g.selectNode(this, isTriggerEvent);
                } else {
                    //修复多选checkbox为true时调用该方法会取消已经选中节点的问题
                    if (!g.options.checkbox) {
                        g.cancelSelect(this, isTriggerEvent);
                    }
                }
            });
        },
        clear: function (node) {
            //清空树
            var g = this,
				p = this.options;
            if (!node) {
                g.toggleNodeCallbacks = [];
                g.data = null;
                g.data = [];
                g.nodes = null;
                g.tree.html("");
            } else {

                var nodeDom = g.getNodeDom(node);
                var nodeData = g._getDataNodeByTreeDataIndex(g.data, $(nodeDom).attr("treedataindex"));
                $(nodeDom).find("ul.lee-children").remove();
                if (nodeData) nodeData.children = [];
            }
        },
        reload: function (callback) {
            var g = this,
				p = this.options;
            g.clear();
            g.loadData(null, p.url, null, {
                success: callback
            });
        },
        //刷新节点
        reloadNode: function (node, data, callback) {
            var g = this,
				p = this.options;
            g.clear(node);
            if (typeof (data) == "string") {
                g.loadData(node, data, null, {
                    success: callback
                });
            } else {
                if (!data) return;
                if (p.idField && p.parentIDField) {
                    data = g.arrayToTree(data, p.idField, p.parentIDField);
                }
                g.append(node, data);
            }
        }

    });

    function strTrim(str) {
        if (!str) return str;
        return str.replace(/(^\s*)|(\s*$)/g, '');
    };
})(jQuery);