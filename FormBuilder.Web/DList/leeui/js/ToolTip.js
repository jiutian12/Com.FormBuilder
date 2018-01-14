(function ($) {
    //气泡,可以在制定位置显示
    $.fn.LeeToolTip = function (p) {
        return $.leeUI.run.call(this, "leeUIToolTip", arguments, {
            idAttrName: "tooltipid"
        });
    };
    $.leeUIDefaults = $.leeUIDefaults || {};
    //气泡
    $.leeUIDefaults.ToolTip = {
        animation: true,
        placement: 'right',
        selector: false,
        template: '<div class="lee-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: true,
        onEnter: null,
        viewport: {
            selector: 'body',
            padding: 0
        }
    };
    $.leeUI.controls.ToolTip = function (element, options) {
        $.leeUI.controls.ToolTip.base.constructor.call(this, element, options);
    };

    $.leeUI.controls.ToolTip.leeExtend($.leeUI.core.UIComponent, {
        __getType: function () {
            return 'ToolTip';
        },
        __idPrev: function () {
            return 'ToolTip';
        },
        _extendMethods: function () {
            return {};
        },

        _render: function () {
            var g = this,
				p = this.options;
            g.enabled = true;
            g.type = "tooltip";
            g.$element = $(this.element);
            g.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport));
            g.inState = { click: false, hover: false, focus: false };

            var triggers = p.trigger.split(' ')

            for (var i = triggers.length; i--;) {
                var trigger = triggers[i]

                if (trigger == 'click') {
                    g.$element.on('click.' + g.type, p.selector, $.proxy(g.toggle, this));
                } else if (trigger != 'manual') {
                    var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                    var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                    g.$element.on(eventIn + '.' + g.type, p.selector, $.proxy(this.enter, this))
                    g.$element.on(eventOut + '.' + g.type, p.selector, $.proxy(this.leave, this))
                }
            }
            p.selector ?
				(p = $.extend({}, p, { trigger: 'manual', selector: '' })) :
				g.fixTitle();
            g.set(p);
        },
        _setContent: function (content) {
            var $tip = this.tip();
            var title = this.getTitle();

            $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
            $tip.removeClass('fade in top bottom left right');
        },
        setNewTitle: function (title) {
            var $tip = this.tip();
            $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
        },
        getDelegateOptions: function () {
            var options = {};
            var defaults = $.leeUIDefaults.ToolTip;

            this._options && $.each(this._options, function (key, value) {
                if (defaults[key] != value) options[key] = value;
            })

            return options;
        },
        toggle: function (e) {
            var g = this,
				p = this.options;
            if (e) {
                //g = $(e.currentTarget).data('bs.' + this.type)
                if (!g) {
                    //g = new this.constructor(e.currentTarget, this.getDelegateOptions())
                    //$(e.currentTarget).data('bs.' + this.type, self)
                }
            }
            if (e) {
                g.inState.click = !g.inState.click;
                if (g.isInStateTrue()) g.enter(self);
                else g.leave(self);
            } else {
                g.tip().hasClass('in') ? g.leave(self) : g.enter(self);
            }
        },
        tip: function () {
            if (!this.$tip) {
                this.$tip = $(this.options.template)
                if (this.$tip.length != 1) {
                    throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
                }
            }
            console.log(this.$tip.hasClass("zoom-big-fast-enter-active"));
            return this.$tip;
        },
        getUID: function (prefix) {
            do prefix += ~~(Math.random() * 1000000);
            while (document.getElementById(prefix))
            return prefix;
        },
        enter: function (obj) {
            var self = this; //obj instanceof this.constructor ?
            //obj : $(obj.currentTarget).data('bs.' + this.type);

            /*if(!self) {
				self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
				$(obj.currentTarget).data('bs.' + this.type, self);
			}*/

            if (obj instanceof $.Event) {
                self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
            }

            if (self.tip().hasClass('in') || self.hoverState == 'in') {
                self.hoverState = 'in';
                return;
            }

            clearTimeout(self.timeout);

            self.hoverState = 'in';

            if (!self.options.delay || !self.options.delay.show) return self.show();

            self.timeout = setTimeout(function () {
                if (self.hoverState == 'in') self.show();
            }, self.options.delay.show);
        },
        leave: function (obj) {
            var self = this; //obj instanceof this.constructor ?
            //obj : $(obj.currentTarget).data('bs.' + this.type)

            /*if(!self) {
				self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
				$(obj.currentTarget).data('bs.' + this.type, self);
			}*/

            if (obj instanceof $.Event) {
                self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
            }

            if (self.isInStateTrue()) return;

            clearTimeout(self.timeout);

            self.hoverState = 'out';

            if (!self.options.delay || !self.options.delay.hide) return self.hide();

            self.timeout = setTimeout(function () {
                if (self.hoverState == 'out') self.hide();
            }, self.options.delay.hide)
        },
        hide: function (callback) {
            var g = this;
            var $tip = $(this.$tip);
            var e = $.Event('hide.bs.' + this.type)

            function complete() {
                if (g.hoverState != 'in') $tip.detach();
                if (g.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
                    g.$element.trigger('hidden.bs.' + g.type);
                }

                $tip.removeClass('zoom-big-leave zoom-big-leave-active in');
                $tip.removeClass('zoom-big-fast-enter zoom-big-fast-enter-active');
                $tip.removeClass('in');
                callback && callback();
            }

            this.$element.trigger(e);

            if (e.isDefaultPrevented()) return;

            $tip.addClass('zoom-big-leave zoom-big-leave-active');

            $.support.transition && $tip.hasClass('fade') ?
				$tip
				.one('bsTransitionEnd', complete)
				.emulateTransitionEnd(150) :
				complete();

            this.hoverState = null;

            return this;
        },
        show: function () {
            var g = this,
				p = this.options;
            var e = $.Event('show.bs.' + g.type);
            if (g.hasContent() && g.enabled) {
                g.$element.trigger(e);
                var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
                if (e.isDefaultPrevented() || !inDom) return;
                var $tip = g.tip(); //获取tip实例
                var tipId = g.getUID(g.type);
                g._setContent();
                $tip.attr('id', tipId);
                if (p.animation) $tip.addClass('fade'); //淡入css
                var placement = typeof this.options.placement == 'function' ?
					this.options.placement.call(this, $tip[0], this.$element[0]) :
					this.options.placement;
                var autoToken = /\s?auto?\s?/i;
                var autoPlace = autoToken.test(placement)
                if (autoPlace) placement = placement.replace(autoToken, '') || 'top';
                $tip
					.detach()
					.css({ top: 0, left: 0, display: 'block' })
					.addClass(placement)
					.data('bs.' + g.type, this);
                p.container ? $tip.appendTo("body") : $tip.insertAfter(g.$element)
                g.$element.trigger('inserted.bs.' + g.type);
                //获取位置信息
                var pos = this.getPosition();
                var actualWidth = $tip[0].offsetWidth;
                var actualHeight = $tip[0].offsetHeight;
                if (autoPlace) {
                    var orgPlacement = placement;
                    var viewportDim = this.getPosition(this.$viewport);

                    placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
						placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
						placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
						placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
						placement;

                    $tip
						.removeClass(orgPlacement)
						.addClass(placement);
                }
                var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
                this.applyPlacement(calculatedOffset, placement);
                var complete = function () {
                    var prevHoverState = g.hoverState
                    g.$element.trigger('shown.bs.' + g.type)
                    g.hoverState = null

                    if (prevHoverState == 'out') g.leave(that);
                }

                $.support.transition && g.$tip.hasClass('fade') ?
					$tip
					.one('bsTransitionEnd', complete)
					.emulateTransitionEnd(150) :
					complete();
            }
        },
        applyPlacement: function (offset, placement) {
            var $tip = this.tip();
            var width = $tip[0].offsetWidth;
            var height = $tip[0].offsetHeight;
            // manually read margins because getBoundingClientRect includes difference
            var marginTop = parseInt($tip.css('margin-top'), 10);
            var marginLeft = parseInt($tip.css('margin-left'), 10);
            // we must check for NaN for ie 8/9
            if (isNaN(marginTop)) marginTop = 0;
            if (isNaN(marginLeft)) marginLeft = 0;

            offset.top += marginTop;
            offset.left += marginLeft;

            // $.fn.offset doesn't round pixel values
            // so we use setOffset directly with our own function B-0
            $.offset.setOffset($tip[0], $.extend({
                using: function (props) {
                    $tip.css({
                        top: Math.round(props.top),
                        left: Math.round(props.left)
                    })
                }
            }, offset), 0);

            $tip.addClass('in');

            //return;
            // check to see if placing tip in new offset caused the tip to resize itself
            var actualWidth = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;

            if (placement == 'top' && actualHeight != height) {
                offset.top = offset.top + height - actualHeight;
            }

            var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

            if (delta.left) offset.left += delta.left;
            else offset.top += delta.top;

            var isVertical = /top|bottom/.test(placement);
            var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
            var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';
            console.log(offset);
            $tip.offset(offset);
            //$tip.css({ left: offset.left, top: offset.top });
            console.log($tip.offset());
            this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
            $tip.addClass("zoom-big-fast-enter zoom-big-fast-enter-active");
        },
        replaceArrow: function (delta, dimension, isVertical) {
            this.arrow()
				.css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
				.css(isVertical ? 'top' : 'left', '');
        },
        getCalculatedOffset: function (placement, pos, actualWidth, actualHeight) {
            return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } :
				placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
				placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
				/* placement == 'right' */
				{ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
        },
        getViewportAdjustedDelta: function (placement, pos, actualWidth, actualHeight) {
            var delta = { top: 0, left: 0 };
            if (!this.$viewport) return delta;

            var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
            var viewportDimensions = this.getPosition(this.$viewport);

            if (/right|left/.test(placement)) {
                var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
                var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
                if (topEdgeOffset < viewportDimensions.top) { // top overflow
                    delta.top = viewportDimensions.top - topEdgeOffset;
                } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                    delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
                }
            } else {
                var leftEdgeOffset = pos.left - viewportPadding;
                var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
                if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                    delta.left = viewportDimensions.left - leftEdgeOffset;
                } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                    delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
                }
            }

            return delta;
        },
        getPosition: function ($element) {
            $element = $element || this.$element

            var el = $element[0]
            var isBody = el.tagName == 'BODY'

            var elRect = el.getBoundingClientRect();
            if (elRect.width == null) {
                // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
                elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
            }
            var isSvg = window.SVGElement && el instanceof window.SVGElement;
            // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
            // See https://github.com/twbs/bootstrap/issues/20280
            var elOffset = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset());
            var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
            var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

            return $.extend({}, elRect, scroll, outerDims, elOffset);
        },
        hasContent: function () {
            return this.getTitle();
        },
        arrow: function () {
            return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'));
        },
        enable: function () {
            this.enabled = true;
        },
        disable: function () {
            this.enabled = false;
        },
        fixTitle: function () {
            var $e = this.$element
            if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
                $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
            }
        },
        isInStateTrue: function () {
            for (var key in this.inState) {
                if (this.inState[key]) return true;
            }
            return false;
        },
        getTitle: function () {
            var title;
            var $e = this.$element;
            var o = this.options;

            title = $e.attr('data-original-title') ||
				(typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

            return title;
        }

    });

})(jQuery);
(function ($) {
    $.fn.LeePopOver = function (p) {
        return $.leeUI.run.call(this, "PopOver", arguments, {
            idAttrName: "popoverid"
        });
    };

    $.leeUIDefaults.PopOver = $.extend({}, $.leeUIDefaults.ToolTip, {
        placement: 'right',
        trigger: 'click',
        content: '',
        contentLoad: null,//动态加载提示内容
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });

    $.leeUI.controls.PopOver = function (element, options) {
        $.leeUI.controls.PopOver.base.constructor.call(this, element, options);
    };

    $.leeUI.controls.PopOver.leeExtend($.leeUI.controls.ToolTip, {
        __getType: function () {
            return 'PopOver';
        },
        __idPrev: function () {
            return 'PopOver';
        },
        _setContent: function () {
            var $tip = this.tip();
            var title = this.getTitle();

            var content = this.getContent();
            $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
            $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
				this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
            ](content);
            $tip.removeClass('fade top bottom left right in')

            // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
            // this manually by checking the contents.
            if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();

        },
        hasContent: function () {
            return this.getTitle() || this.getContent();
        },
        getContent: function () {
            var $e = this.$element;
            var o = this.options;
            //alert(1);v

            var res = $e.attr('content') ||
				(typeof o.content == 'function' ?
					o.content.call($e[0]) :
					o.content);

            return res;
        },
        arrow: function () {
            return (this.$arrow = this.$arrow || this.tip().find('.arrow'));
        }
    });
})(jQuery);