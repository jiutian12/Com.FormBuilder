(function($) {
	$.fn.leeDate = function() {
		return $.leeUI.run.call(this, "leeUIDate", arguments);
	};
	$.leeUIDefaults.Date = {
		format: "yyyy-MM-dd",
		width: null,
		showTime: false,
		onChangeDate: false,
		absolute: true,
		cancelable: true,
		readonly: false,
		skin: "",
		min: "1900-01-01 00:00:00",
		max: "2099-12-31 23:59:59",
		dayMessage: ["日", "一", "二", "三", "四", "五", "六"],
		monthMessage: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		todayMessage: "今天",
		closeMessage: "关闭"
	};
	$.leeUI.controls.Date = function(element, options) {
		$.leeUI.controls.Date.base.constructor.call(this, element, options);
	};

	$.leeUI.controls.Date.leeExtend($.leeUI.controls.Input, {
		__getType: function() {
			return 'Date';
		},
		__idPrev: function() {
			return 'Date';
		},
		_render: function() {
			var g = this,
				p = this.options;
			g.inputText = $(this.element);
			g.link = $('<div class="lee-right"><i class="lee-icon lee-angle-down dropdown"></i></div>');
			g.wrapper = g.inputText.wrap('<div class="lee-text lee-text-date"></div>').parent();
			g.wrapper.append(g.link);
			g.textwrapper = g.wrapper.wrap('<div class="lee-text-wrapper"></div>').parent(); //添加个包裹
			g.dateeditor = $(this._bulidDateWrapper());
			g.dateeditor.appendTo("body");

			g.inputText.addClass("lee-text-field");
			g.header = $(".lee-date-top", g.dateeditor);
			g.body = $(".lee-date-table", g.dateeditor);
			g.body.thead = $("thead", g.body);
			g.body.tbody = $("tbody", g.body);

			g.body.monthselector = $(".lee-mm-selector", g.body);
			g.body.yearselector = $(".lee-yy-selector", g.body);
			g.body.hourselector = $(".lee-hh-selector", g.body);
			g.body.minuteselector = $(".lee-mi-selector", g.body);
			g.body.secondselector = $(".lee-ss-elector", g.body);

			g.buttons = {
				btnPrevYear: $("", g.header),
				btnNextYear: $("", g.header),
				btnPrevMonth: $("", g.header),
				btnNextMonth: $("", g.header),
				btnYear: $("", g.header),
				btnMonth: $("", g.header),
				btnToday: $(".btn-today", g.dateeditor),
				btnClose: $(".btn-ok", g.dateeditor)
			};
			var nowDate = new Date();
			g.now = {
				year: nowDate.getFullYear(),
				month: nowDate.getMonth() + 1, //注意这里
				day: nowDate.getDay(),
				date: nowDate.getDate(),
				hour: nowDate.getHours(),
				minute: nowDate.getMinutes()
			};
			//当前的时间
			g.currentDate = {
				year: nowDate.getFullYear(),
				month: nowDate.getMonth() + 1,
				day: nowDate.getDay(),
				date: nowDate.getDate(),
				hour: nowDate.getHours(),
				minute: nowDate.getMinutes()
			};
			//选择的时间
			g.selectedDate = null;
			//使用的时间
			g.usedDate = null;
			//初始化数据
			//设置周日至周六
			$("td", g.body.thead).each(function(i, td) {
				$(td).html(p.dayMessage[i]);
			});
			//设置一月到十一二月
			$("li", g.body.monthselector).each(function(i, li) {
				$(li).html(p.monthMessage[i]);
			});
			g._bind();
			g.set(p);
			g._setContent();
			 

		},
		_viewYears: function(year) {

		},
		_viewDate: function(y, m, d) {

		},
		_toggle: function() {

		},
		_setWidth: function(value) {

			var g = this,
				p = this.options;

			if(value > 20) {
				g.wrapper.css({ width: value });
			}
		},
		_setContent: function() {
			var g = this,
				p = this.options;
			//当前月第一天星期
			var thismonthFirstDay = new Date(g.currentDate.year, g.currentDate.month - 1, 1).getDay();
			//当前月天数
			var nextMonth = g.currentDate.month;
			var nextYear = g.currentDate.year;
			if(++nextMonth == 13) {
				nextMonth = 1;
				nextYear++;
			}
			var monthDayNum = new Date(nextYear, nextMonth - 1, 0).getDate();
			//当前上个月天数
			var prevMonthDayNum = new Date(g.currentDate.year, g.currentDate.month - 1, 0).getDate();
			//设置年月的值
			//g.buttons.btnMonth.html(p.monthMessage[g.currentDate.month - 1]);
			//g.buttons.btnYear.html(g.currentDate.year);
			//g.toolbar.time.hour.html(g.currentDate.hour);
			//g.toolbar.time.minute.html(g.currentDate.minute);
			//if(g.toolbar.time.hour.html().length == 1)
			//g.toolbar.time.hour.html("0" + g.toolbar.time.hour.html());
			//if(g.toolbar.time.minute.html().length == 1)
			//g.toolbar.time.minute.html("0" + g.toolbar.time.minute.html());
			$("td", g.body.tbody).each(function() { this.className = "" });
			$("tr", g.body.tbody).each(function(i, tr) {
				$("td", tr).each(function(j, td) {
					var id = i * 7 + (j - thismonthFirstDay);
					var showDay = id + 1;
					if(g.selectedDate && g.currentDate.year == g.selectedDate.year &&
						g.currentDate.month == g.selectedDate.month &&
						id + 1 == g.selectedDate.date) {
						if(j == 0 || j == 6) {
							$(td).addClass("holiday")
						}
						$(td).addClass("selected");
						$(td).siblings().removeClass("selected");
					} else if(g.currentDate.year == g.now.year &&
						g.currentDate.month == g.now.month &&
						id + 1 == g.now.date) {
						if(j == 0 || j == 6) {
							$(td).addClass("holiday")
						}
						$(td).addClass("today");
					} else if(id < 0) {
						showDay = prevMonthDayNum + showDay;
						$(td).addClass("out")
							.removeClass("selected");
					} else if(id > monthDayNum - 1) {
						showDay = showDay - monthDayNum;
						$(td).addClass("out")
							.removeClass("selected");
					} else if(j == 0 || j == 6) {
						$(td).addClass("holiday")
							.removeClass("selected");

					} else {
						td.className = "";
					}

					$(td).html(showDay);
				});
			});
		},
		_updateSelectBoxPosition: function() {
			//todo//设置下拉框位置
		},
		showDate: function() {
			var g = this,
				p = this.options;
			if(!g.currentDate) return;
			g.currentDate.hour = parseInt(g.toolbar.time.hour.html(), 10);
			g.currentDate.minute = parseInt(g.toolbar.time.minute.html(), 10);
			var dateStr = g.currentDate.year + '/' + g.currentDate.month + '/' + g.currentDate.date + ' ' + g.currentDate.hour + ':' + g.currentDate.minute;
			var myDate = new Date(dateStr);
			dateStr = g.getFormatDate(myDate);
			g.inputText.val(dateStr);
			g.onTextChange();
		},
		_bulidContent: function() {
			var tableview = [];
			tableview.push("<table class='lee-date-table'>");
			tableview.push("  <thead>");
			tableview.push("    <tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>")
			tableview.push("  </thead>");
			tableview.push("  <tbody>");
			$.each(new Array(6), function(i) {
				tableview.push("  <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
			});
			tableview.push("  </tbody>");
			tableview.push("</table>");
			return tableview.join("");
		},
		_bulidDateWrapper: function() {
			var html = [];
			html.push("<div class='lee-date-box'>")
			
			//月份下拉菜单 begin
			html.push("  <div class='lee-date-month'>");
			$.each(new Array(12), function(i) {
				html.push('<span m="' + i + '">' + String(i + 1) + '月</span>')
			});
			html.push("  </div>");
			//年度下拉菜单 begin
			html.push("  <div class='lee-date-year'>");
			html.push("    <a class='tab top'><i></i></a>");
			html.push("    <ul class='lee-date-y-wrap'></ul>");
			html.push("    <a class='tab down'><i></i></a>");
			html.push("  </div>");
			/*日期时间选择区域*/
			html.push("  <div class='lee-date-time'>");
			html.push("    <div class='header'><span>×</span></div>");
			html.push("    <div class='wrap'></div>");
			html.push("  </div>");
			
			
			html.push("<div class='lee-date-top'>");
			html.push("  <div class='lee-date-ym lee-date-y'>");
			html.push("    <a class='choose prev'><i></i></a>");
			html.push("    <input class='year-text'><label></label>");
			html.push("    <a class='choose next'><i></i></a>");
			
			html.push("  </div>");

			html.push("  <div class='lee-date-ym lee-date-m'>");
			html.push("    <a class='choose prev'><i></i></a>");
			html.push("    <input class='month-text'><label></label>");
			html.push("    <a class='choose next'><i></i></a>");
			
			html.push("  </div>");
			html.push(" </div>");
			
			
			html.push(this._bulidContent());
			//这里处理table 日期

			//底部工具栏
			html.push("  <div class='lee-date-bottom'>");
			html.push("    <ul class='lee-date-hms'>");
			html.push("      <li class='time'>时间</li>");
			html.push("      <li><input readonly value='12'>:</li>");
			html.push("      <li><input readonly value='33'>:</li>");
			html.push("      <li><input readonly value='33'></li>");
			html.push("    </ul>");

			html.push("    <div class='lee-date-time-select'></div>");//这里显示时分秒选择区域
			html.push("    <div class='lee-date-btn'>");
			html.push("      <a class='btn-clear'>清空</a>");
			html.push("      <a class='btn-today'>今天</a>");
			html.push("      <a class='btn-ok'>确认</a>");
			html.push("    </div>");
			html.push("  </div>");
			//结束
			html.push("</div>");

			return html.join("");

		},
		_bind: function() {
			var g = this,
				p = this.options;
			g.link.hover(function() {
				if(p.disabled) return;
				$(this).addClass("lee-right-hover");
			}, function() {
				if(p.disabled) return;
				$(this).removeClass("lee-right-hover");
			}).mousedown(function() {
				if(p.disabled) return;
				$(this).addClass("lee-right-pressed");
			}).mouseup(function() {
				if(p.disabled) return;
				$(this).removeClass("lee-right-pressed");
			}).click(function() {
				if(p.disabled) return;
				g._setContent();
				g.toggleDateEditor(g.dateeditor.is(":visible"));
			});
		},
		_bulidDate: function(dateStr) {
			var g = this,
				p = this.options;
			var r = this._getMatch();
			if(!r) return null;
			var t = dateStr.match(r.reg);
			if(!t) return null;
			var tt = {
				y: r.position[0] == -1 ? 1900 : t[r.position[0]],
				M: r.position[1] == -1 ? 0 : parseInt(t[r.position[1]], 10) - 1,
				d: r.position[2] == -1 ? 1 : parseInt(t[r.position[2]], 10),
				h: r.position[3] == -1 ? 0 : parseInt(t[r.position[3]], 10),
				m: r.position[4] == -1 ? 0 : parseInt(t[r.position[4]], 10),
				s: r.position[5] == -1 ? 0 : parseInt(t[r.position[5]], 10)
			};
			if(tt.M < 0 || tt.M > 11 || tt.d < 0 || tt.d > 31) return null;
			var d = new Date(tt.y, tt.M, tt.d);
			if(p.showTime) {
				if(tt.m < 0 || tt.m > 59 || tt.h < 0 || tt.h > 23 || tt.s < 0 || tt.s > 59) return null;
				d.setHours(tt.h);
				d.setMinutes(tt.m);
				d.setSeconds(tt.s);
			}
			return d;
		},
		toggleDateEditor: function(isHide) {
			var g = this,
				p = this.options;
			g.editorToggling = true;
			if(isHide) {
				g.dateeditor.hide('fast', function() {
					g.editorToggling = false;
				});
			} else {
				g.dateeditor.slideDown('fast', function() {
					g.editorToggling = false;
				});
			}
		},
		showDate: function() {
			var g = this,
				p = this.options;
			if(!this.currentDate) return;
			this.currentDate.hour = parseInt(g.toolbar.time.hour.html(), 10);
			this.currentDate.minute = parseInt(g.toolbar.time.minute.html(), 10);
			var dateStr = this.currentDate.year + '/' + this.currentDate.month + '/' + this.currentDate.date + ' ' + this.currentDate.hour + ':' + this.currentDate.minute;
			var myDate = new Date(dateStr);
			dateStr = g.getFormatDate(myDate);
			this.inputText.val(dateStr);
			this.onTextChange();
		},
		isDateTime: function(dateStr) {
			var g = this,
				p = this.options;
			var r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
			if(r == null) return false;
			var d = new Date(r[1], r[3] - 1, r[4]);
			if(d == "NaN") return false;
			return(d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
		},
		isLongDateTime: function(dateStr) {
			var g = this,
				p = this.options;
			var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
			var r = dateStr.match(reg);
			if(r == null) return false;
			var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6]);
			if(d == "NaN") return false;
			return(d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6]);
		},
		getFormatDate: function(date) {
			if(date === null || date == "NaN") return null;
			var g = this,
				p = this.options;
			var format = p.format;
			var o = {
				"M+": date.getMonth() + 1,
				"d+": date.getDate(),
				"h+": date.getHours(),
				"m+": date.getMinutes(),
				"s+": date.getSeconds(),
				"q+": Math.floor((date.getMonth() + 3) / 3),
				"S": date.getMilliseconds()
			}
			if(/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (date.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
			}
			for(var k in o) {
				if(new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
						("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return format;
		},
		onTextChange: function() {

		},
		_setValue: function(value) {
			var g = this;
			if(!value) g.inputText.val('');
			if(typeof value == "string") {
				if(/^\/Date/.test(value)) {
					value = value.replace(/^\//, "new ").replace(/\/$/, "");
					eval("value = " + value);
				}
				g.inputText.val(value);
				g.usedDate = value;
			}
			if(typeof value == "object") {
				if(value instanceof Date) {
					g.inputText.val(g.getFormatDate(value));
					g.onTextChange();
				}
			}
		},
		_getValue: function() {
			return this.usedDate;
		},
		setEnabled: function() {
			var g = this,
				p = this.options;
			g.inputText.removeAttr("readonly");
			g.text.removeClass('lee-text-disabled');
			p.disabled = false;
		},
		setDisabled: function(flag) {
			var g = this,
				p = this.options;
			if (flag == false) {
			    this.setEnabled();
			}
			g.inputText.attr("readonly", "readonly");
			g.text.addClass('lee-text-disabled');
			p.disabled = true;
		}
	});
})(jQuery);