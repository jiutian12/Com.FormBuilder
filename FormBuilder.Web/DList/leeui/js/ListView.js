/**
 * ListView组件 用于瀑布流和 自定义模板展现
 */
(function ($) {

    $.fn.leeListView = function (options) {
        return $.leeUI.run.call(this, "leeUIListView", arguments);
    };

    $.leeUIDefaults.ListView = {
        temp: "<div></div>",
        render: null,
        waterflow: false,
        data: null,
        pager: true,
        method: "get",
        pagesize: 20,
        getParam: null,
        onFail: null,
        url: "data/listview.json",
        onAfterShowData: null
    };

    $.leeUI.controls.ListView = function (element, options) {
        $.leeUI.controls.ListView.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.ListView.leeExtend($.leeUI.core.UIComponent, {
        __getType: function () {
            return 'ListView';
        },
        __idPrev: function () {
            return 'ListView';
        },
        _extendMethods: function () {
            return [];
        },
        _render: function () {
            var g = this,
				p = this.options;
            g.Wrapper = $("<div class='lee-listivew'></div>");
            g.View = $("<div class='lee-listview-wrapper'></div>");
            g.Pager = $("<div class='lee-listview-pager'></div>");
            g.Wrapper.append(g.View);
            if (p.pager) {
                g.Wrapper.append(g.Pager);
                g.pageIndex = 0;
            }
            g.initLoading();
            g.initLayout();

            g.Wrapper.appendTo(g.element);
            //加载主区域
            //加载toolbar
            //获取数据 渲染
            g.set(p);
        },
        initLoading: function () {
            var g = this,
				p = this.options;
            g.loading = $("<div class='lee-loading'><div class='lee-grid-loading-inner'><div class='loader'></div><div class='message'>正在加载中...</div></div></div>");
            g.Wrapper.append(g.loading);
        },
        toggleLoading: function (show) {
            this.loading[show ? 'show' : 'hide']();
        },
        initLayout: function () {
            var g = this,
				p = this.options;
            if (p.data) {
                g.showView(p.data);
            } else if (p.url) {
                g.loadData(g.pageIndex);
            }
        },
        showView: function (data) {
            //显示所有数据

            var g = this,
				p = this.options;
            var htmlarr = [];
            $.each(data, function (i, row) {
                var html = g.getView(row, i);
                htmlarr.push(html);
            });
            g.View.empty().html(htmlarr.join(""));

        },
        addView: function () {
            //加载更多数据
        },
        getView: function (row, index) {
            //获取ListView模板信息
            var g = this,
				p = this.options;
            var html = "";
            if (p.render) {
                html = p.render.call(this, row, index);
            } else {
                html = p.temp;
            }

            for (var item in row) {
                html = html.replace("{" + item + "}", row[item] == null ? "" : row[item]);
            }
            return html;
        },
        setPager: function (totalcount) {
            //设置分页数据

            var g = this,
				p = this.options;
            g.Pager.leePager(totalcount, {
                num_edge_entries: 2,
                num_display_entries: 2,
                callback: $.proxy(g.pageselectCallback, g),
                items_per_page: 10,
                current_page: g.pageIndex,
                simple: false
            });

        },
        pageselectCallback: function (pageindex, jq) {
            var g = this,
				p = this.options;
            g.loadData(pageindex);
        },
        reload: function () {
            this.loadData(0);
        },
        loadData: function (page) {
            //远程加载数据
            var g = this,
				p = this.options;
            var data = {
                pagesize: p.pagesize,
                page: page + 1
            }
            if (p.getParam) {
                var res = p.getParam();
                $.each(res, function (i, obj) {
                    data[obj.name] = obj.value;
                });
                res = null;
            }
            var ajaxOptions = {
                type: p.method,
                url: p.url,
                data: data,
                async: true,
                dataType: 'json',
                beforeSend: function () {
                    g.toggleLoading(true);
                },
                success: function (data) {
                    if (data.error) {
                        g.trigger('fail', [data, g]);
                        return;
                    }

                    g.trigger('success', [data, g]);
                    g.trigger('aftershowdata', [data, g]);

                    g.pageIndex = page;

                    g.showView(data.Rows ? data.Rows : data.data);

                    g.setPager(data.Total);
                },
                complete: function () {
                    g.trigger('complete', [g]);
                    g.toggleLoading.leeDefer(g, 200, [false]);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    g.trigger('error', [XMLHttpRequest, textStatus, errorThrown]);
                    g.toggleLoading.leeDefer(g, 200, [false]);
                }
            };
            $.ajax(ajaxOptions);
        }

    });
})(jQuery);