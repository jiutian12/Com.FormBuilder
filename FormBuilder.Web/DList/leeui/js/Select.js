(function ($) {
    function noop() { }
    var isSafari = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') !== -1) {
            return ua.indexOf('chrome') > -1 ? false : true;
        }
    }();

    function throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        // 上次执行时间点
        var previous = 0;
        if (!options) options = {};
        // 延迟执行函数
        var later = function () {
            // 若设定了开始边界不执行选项，上次执行时间始终为0
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = new Date().getTime();
            // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
            if (!previous && options.leading === false) previous = now;
            // 延迟执行时间间隔
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
            // remaining大于时间窗口wait，表示客户端系统时间被调整过
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
                //如果延迟执行不存在，且没有设定结尾边界不执行选项
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }


    var KEY_CODE = {
        up: 38,
        down: 40,
        enter: 13
    };

    var EVENT_SPACE = {
        click: 'click.lee-dropdown',
        focus: 'focus.lee-dropdown',
        keydown: 'keydown.lee-ropdown',
        keyup: 'keyup.lee-dropdown'
    };


    $.fn.leeChoosen = function (options) {
        return $.leeUI.run.call(this, "leeUIChoosen", arguments);
    };

    $.fn.leeUIGetChoosenManager = function () {
        return $.leeUI.run.call(this, "leeUIGetChoosenManager", arguments);
    };
    $.leeUIDefaults.Choosen = {
        limitCount: 10,
        input: '<input type="text" maxLength="20" placeholder="搜索关键词或ID">',
        data: [],
        searchable: true,
        searchNoData: '<li style="color:#ddd">暂无查询结果</li>',
        init: noop,
        choice: noop,
        isMul: true,//是否多选
        labelMode: true,
        extendProps: []
    };


    $.leeUI.controls.Choosen = function (element, options) {
        $.leeUI.controls.Choosen.base.constructor.call(this, element, options);
    };
    $.leeUI.controls.Choosen.leeExtend($.leeUI.controls.Input, {
        __getType: function () {
            return 'Choosen';
        },
        _init: function () {
            $.leeUI.controls.Choosen.base._init.call(this);
            var p = this.options;
        },
        _render: function () {
            var g = this,
				p = this.options;
            g.$el = $(this.element);

            g.placeholder = this.$el.attr('placeholder');//初始化placeholder
            g.maxItemAlertTimer = null;//清空最大提示
            g.wrap = g.$el.wrap("<div class='lee-choosen'></div>").parent();
            g.$el.hide();
            g.wrap.addClass(p.isMul ? "dropdown-single" : p.labelMode ? 'dropdown-multiple-label' : 'dropdown-multiple');
            g.selectData = {};
            //var processResult =p._porcessResult(p.data);


            //g.$select.html(processResult[0]);
            g.renderSelect();
            g.bind();
            g.currentData = p.data;
            //初始复制

        },
        renderSelect: function (isUpdate, isCover) {
            var g = this, p = this.options;
            var processResult = g.getSelectOptions(p.data);
            var $li = processResult[0];
            g.name = processResult[1];
            g.selectAmount = processResult[2];
            var template;
            if (isUpdate)
                g.wrap.find("ul")[isCover ? 'html' : 'append']($li);
            else {
                //初始化下拉li选项
                template = g.createTemplate().replace('{{ul}}', '<ul>' + $li + '</ul>');
                g.wrap.append(template).find('ul').removeAttr('style class');
            }
            if (isCover) {
                g.name = [];
                g.wrap.find('.selected').remove();
                g.$el.val('');
            }
            g.$choseList = g.wrap.find('.dropdown-chose-list');

            if (!p.labelMode) {
                g.$choseList.html($('<span class="placeholder"></span>').text(g.placeholder));
            }
            if (g.name)
                g.$choseList.prepend(g.name.join(''))

        },
        bind: function () {
            var g = this, p = this.options;
            var openHandle = isSafari ? EVENT_SPACE.click : EVENT_SPACE.focus;
            g.wrap.on(EVENT_SPACE.click, function (event) {
                event.stopPropagation();
            });
            g.wrap.on(EVENT_SPACE.click, '.del', $.proxy(g.del, g));

            if (p.labelMode) {
                g.wrap.on(EVENT_SPACE.click, '.dropdown-display-label', function () {
                    g.wrap.find('input').focus();
                });

                g.wrap.on(EVENT_SPACE.focus, 'input', $.proxy(g.show, g));
                g.wrap.on(EVENT_SPACE.keydown, 'input', function (event) {
                    if (event.keyCode === 8 && this.value === '' && g.name.length) {
                        g.wrap.find('.del').eq(-1).trigger('click');
                    }
                });
            } else {
                g.wrap.on(openHandle, '.dropdown-display', $.proxy(g.show, g));
                g.wrap.on(openHandle, '.dropdown-clear-all', $.proxy(g.clearAll, g));
            }

            // 搜索
            g.wrap.on(EVENT_SPACE.keyup, 'input', $.proxy(g.search, g));

            // 按下enter键设置token
            g.wrap.on(EVENT_SPACE.keyup, function (event) {
                var keyCode = event.keyCode;
                var KC = KEY_CODE;
                if (keyCode === KC.enter) {
                    $.proxy(!p.isMul ? g.singleChoose : g.multiChoose, g, event)();
                }
            });

            // 按下上下键切换token
            g.wrap.on(EVENT_SPACE.keydown, $.proxy(g.control, g));

            g.wrap.on(EVENT_SPACE.click, '[tabindex]', $.proxy(!p.isMul ? g.singleChoose : g.multiChoose, g));
        },
        singleChoose: function (event) {
            var g = this, p = this.options;
            var $target = $(event.target);
            var value = $target.attr('data-value');
            var hasSelected = $target.hasClass('dropdown-chose');

            if ($target.hasClass('dropdown-chose') || $target.hasClass('dropdown-display')) {
                return false;
            }

            g.name = [];


            g.wrap.removeClass('active').find('li').not($target).removeClass('dropdown-chose');

            $target.toggleClass('dropdown-chose');
            g.selectData = {};
            if (!hasSelected) {

                g.selectData[value] = g.getItemById(value);
            }
            // 这里有可能是远程获取的数据结果 所以 ？如何处理
            //$.each(p.data, function (key, item) {
            //    // id 有可能是数字也有可能是字符串，强制全等有弊端 2017-03-20 22:19:21
            //    item.selected = false;
            //    if ('' + item.id === '' + value) {
            //        item.selected = hasSelected ? 0 : 1;
            //        g.selectData = {};
            //        if (item.selected) {
            //           // g.currentData[item.id] = item;
            //            g.selectData[item.id] = g.getItemById(value);
            //            g.name.push('<span class="dropdown-selected">' + item.name + '<i class="del" data-id="' + item.id + '"></i></span>');
            //        }

            //    }
            //});
            $.each(g.selectData, function (key, item) {

                //selectedName.push(item.name);
                //这里缓存选种值
                g.name.push('<span class="dropdown-selected">' + item.name + '<i class="del" data-id="' + item.id + '"></i></span>');

            });

            //$select.find('option[value="' + value + '"]').prop('selected', true);

            g.name.push('<span class="placeholder">' + g.placeholder + '</span>');
            g.$choseList.html(g.name.join(''));
            g.wrap.find('input').focus().val("");
            //_config.choice.call(_dropdown, event);
        },
        getItemById: function (value) {
            var g = this, p = this.options;
            var res = null;
            $.each(g.currentData, function (key, item) {
                if ('' + item.id === '' + value) {
                    res = item;
                    return res;
                }
            });
            return res;
        },
        multiChoose: function (event) {
            var g = this, p = this.options;
            var $target = $(event.target);
            var value = $target.attr('data-value');
            var hasSelected = $target.hasClass('dropdown-chose');
            var selectedName = [];
            var selectedProp;

            if ($target.hasClass('dropdown-display')) {
                return false;
            }
            if (hasSelected) {
                $target.removeClass('dropdown-chose');
                delete g.selectData[value];
                g.selectAmount--;
            } else {
                if (g.selectAmount < p.limitCount) {
                    $target.addClass('dropdown-chose');
                    //add
                    g.selectData[value] = g.getItemById(value);
                    g.selectAmount++;
                } else {
                    maxItemAlert.call(g);
                    return false;
                }
            }

            g.name = [];

            //$.each(p.data, function (key, item) {
            //    if ('' + item.id === '' + value) {
            //        selectedProp = item;
            //        item.selected = hasSelected ? false : true;
            //        g.currentData[item.id] = item;
            //    } else {
            //        delete g.currentData[item.id];
            //    }
            //    if (item.selected) {
            //        selectedName.push(item.name);

            //        //这里缓存选种值
            //        g.name.push('<span class="dropdown-selected">' + item.name + '<i class="del" data-id="' + item.id + '"></i></span>');
            //    } else {

            //        //这里清空选种
            //    }
            //});

            $.each(g.selectData, function (key, item) {

                selectedName.push(item.name);
                //这里缓存选种值
                g.name.push('<span class="dropdown-selected">' + item.name + '<i class="del" data-id="' + item.id + '"></i></span>');

            });

            //$select.find('option[value="' + value + '"]').prop('selected', hasSelected ? false : true);

            g.$choseList.find('.dropdown-selected').remove();
            g.$choseList.prepend(g.name.join(''));
            g.wrap.find('.dropdown-display').attr('title', selectedName.join(','));
            g.wrap.find('input').focus().val("");
            //_config.choice.call(_dropdown, event, selectedProp);
        },
        control: function (event) {
            var g = this, p = this.options;
            var keyCode = event.keyCode;
            var KC = KEY_CODE;
            var index = 0;
            var direct;
            var itemIndex;
            var $items;
            if (keyCode === KC.down || keyCode === KC.up) {
                // 方向
                direct = keyCode === KC.up ? -1 : 1;
                $items = g.wrap.find('[tabindex]');
                itemIndex = $items.index($(document.activeElement));
                // 初始
                if (itemIndex === -1) {
                    index = direct + 1 ? -1 : 0;
                } else {
                    index = itemIndex;
                }
                // 确认位序
                index = index + direct;
                // 最后位循环
                if (index === $items.length) {
                    index = 0;
                }
                $items.eq(index).focus();
                event.preventDefault();
            }
        },
        search: throttle(function (event) {
            var g = this, p = this.options;
            var $input = $(event.target);
            var intputValue = $input.val();
            var data = p.data;
            var result = [];
            if (event.keyCode > 36 && event.keyCode < 41) {
                return;
            }
            if (p.url) {
                $.ajax({
                    type: "post",
                    url: p.url,
                    data: { q: intputValue },
                    cache: false,
                    dataType: 'json',
                    success: function (result) {
                        var data = result;
                        g.currentData = data;
                        var res = g.getSelectOptions(data)[0];
                        g.wrap.find('ul').html(res || p.searchNoData);
                    },
                    error: function (XMLHttpRequest, textStatus) {

                    }
                });
            }
            else {
                $.each(data, function (key, value) {
                    if (value.name.toLowerCase().indexOf(intputValue) > -1 || '' + value.id === '' + intputValue) {
                        result.push(value);
                    }
                });
                var res = g.getSelectOptions(result)[0];
                g.wrap.find('ul').html(res || p.searchNoData);
            }
        }, 400),
        show: function (event) {
            var g = this, p = this.options;
            event.stopPropagation();
            $(document).trigger('click.dropdown');
            g.wrap.toggleClass('active');
        },
        clearAll: function (event) {
            var g = this, p = this.options;
            event.preventDefault();
            g.$choseList.find('.del').each(function (index, el) {
                $(el).trigger('click');
            });
            g.wrap.find('.dropdown-display').removeAttr('title');
            return false;
        },
        del: function (event) {
            var g = this, p = this.options;
            var $target = $(event.target);
            var id = $target.data('id');
            // 2017-03-23 15:58:50 测试
            // 10000条数据测试删除，耗时 ~3ms
            $.each(g.name, function (key, value) {
                if (value.indexOf('data-id="' + id + '"') !== -1) {
                    g.name.splice(key, 1);
                    return false;
                }
            });
            delete g.selectData[id];
            //$.each(p.data, function (key, item) {
            //    if ('' + item.id == '' + id) {
            //        item.selected = false;
            //        return false;
            //    }
            //});

            g.selectAmount--;
            g.wrap.find('[data-value="' + id + '"]').removeClass('dropdown-chose');
            g.wrap.find('[value="' + id + '"]').prop('selected', false).removeAttr('selected');
            $target.closest('.dropdown-selected').remove();

            return false;
        },
        createTemplate: function () {
            var g = this, p = this.options;
            var labelMode = p.labelMode;
            var searchable = p.searchable;
            var templateSearch = searchable ? '<span class="dropdown-search">' + p.input + '</span>' : '';

            return labelMode ? '<div class="dropdown-display-label"><div class="dropdown-chose-list">' + templateSearch + '</div></div><div class="dropdown-main">{{ul}}</div>' : '<a href="javascript:;" class="dropdown-display"><span class="dropdown-chose-list"></span><a href="javascript:;"  class="dropdown-clear-all">\xD7</a></a><div class="dropdown-main">' + templateSearch + '{{ul}}</div>';
        },
        getSelectOptions: function (data) {
            var g = this, p = this.options;
            var map = {};
            var result = '';
            var name = [];
            var selectAmount = 0;
            var extendProps = {};

            if (!data || !data.length) {
                return false;
            }

            $.each(data, function (index, val) {
                // disable 权重高于 selected
                var hasGroup = val.groupId;
                var isDisabled = val.disabled ? ' disabled' : '';
                var isSelected = g.selectData[val.id] && !isDisabled ? ' selected' : '';
                var extendAttr = ''
                $.each(extendProps, function (index, value) {
                    if (val[value]) {
                        extendAttr += 'data-' + value + '="' + val[value] + '" '
                    }
                })
                var temp = '<li  class="dropdown-option ' + (isSelected ? 'dropdown-chose' : '') + '"  tabindex="0"' + isDisabled + isSelected + ' data-value="' + val.id + '" ' + extendAttr + '>' + val.name + '</option>';
                if (isSelected) {
                    name.push('<span class="dropdown-selected">' + val.name + '<i class="del" data-id="' + val.id + '"></i></span>');
                    selectAmount++;
                }
                // 判断是否有分组
                if (hasGroup) {
                    if (map[val.groupId]) {
                        map[val.groupId] += temp;
                    } else {
                        //  &janking& just a separator
                        map[val.groupId] = val.groupName + '&janking&' + temp;
                    }
                } else {
                    map[index] = temp;
                }
            });

            $.each(map, function (index, val) {
                var option = val.split('&janking&');
                // 判断是否有分组
                if (option.length === 2) {
                    var groupName = option[0];
                    var items = option[1];
                    result += '<li class="dropdown-group" data-group-id= "' + index + '">' + groupName + '</li>';

                } else {
                    result += val;
                }
            });

            return [result, name, selectAmount];
        },
        destroy: function () {

        },
        clear: function () {

        },
        _setValue: function (value) {
            //赋值并初始化选中内容
            var g = this, p = this.options;
            g.selectData = {};
            if (value != "") {
                if (typeof value == "string") {
                    if (p.isMul) {
                        var arr = value.split(",");
                        for (var item in arr) {
                            g.selectData[arr[item]] = g.getItemById(arr[item]);
                        }
                    } else {
                        g.selectData[value] = g.getItemById(value);
                    }

                } else {
                    for (var item in value) {
                        g.selectData[value[item].id] = value[item];
                    }
                }
            }

            g.wrap.find('.dropdown-chose').removeClass('dropdown-chose');
            var selectedName = [];
            g.name = [];
            $.each(g.selectData, function (key, item) {

                selectedName.push(item.name);

                g.wrap.find('[data-value="' + item.id + '"]').addClass('dropdown-chose');
                //这里缓存选种值
                g.name.push('<span class="dropdown-selected">' + item.name + '<i class="del" data-id="' + item.id + '"></i></span>');

            });

            //$select.find('option[value="' + value + '"]').prop('selected', hasSelected ? false : true);

            g.$choseList.find('.dropdown-selected').remove();
            g.$choseList[p.isMul ? "prepend" : "html"](g.name.join(''));
            g.wrap.find('.dropdown-display').attr('title', selectedName.join(','));

            g.name.push('<span class="placeholder">' + g.placeholder + '</span>');

            g.wrap.find('input').focus().val("");
            //g.$choseList.html(g.name.join(''));

        },
        _getValue: function () {
            //返回选中值
            var g = this, p = this.options;
            var arr = [];
            for (var item in g.selectData) {
                arr.push(item);
            }

            return arr.join(",");

        }


    });

    $(document).on('click.dropdown', function () {
        $('.dropdown-single,.dropdown-multiple,.dropdown-multiple-label').removeClass('active');
    });
})(jQuery);