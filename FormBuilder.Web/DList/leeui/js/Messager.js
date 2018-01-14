(function($, window) {
	
	var id = 0;
	var tmpl = "";
	var defaults = {
		pos: "top-center", //
		status: "info",
		autoclose: "true",
		icon: null,
		title: "",
		message: null,
		timeout: "2000",
		icon: null,
		onClose: function() {}
	};
	var messages = {};
	var containers = {};
	var notify = function(options) {
		this.id = id++;
		this.options = $.extend({}, defaults, options);
		this.element = $("<div class='lee-alert'> <div></div></div>");
		this.content(this.getContent());
		if(this.options.status) {
			this.element.addClass(this.options.status);
			if(this.options.icon)
				this.element.addClass("hasicon");
			if(this.options.message)
				this.element.addClass("hasdesc");
			this.currentstatus = this.options.status;
		}
		if(!containers[this.options.pos]) {
			containers[this.options.pos] = $('<div class="lee-message lee-message-' + this.options.pos + '"></div>').appendTo("body");
		}
	};
	notify.prototype.getContent = function() {
		var html = [];
		var p = this.options;
		if(p.icon)
			html.push('<i class = "lee-icon lee-icon-' + p.icon + ' alert-icon"></i>');
		if(p.title) html.push('<span class = "alert-message" > ' + p.title + '</span>');
		if(p.message) html.push('<span class = "alert-description" >' + p.message + '</span>');
		if(p.showclose) html.push('<a class = "close" >< i class = "fa fa-remove" ></i></a>');

		return html.join("");
	}
	notify.prototype.show = function() {
		if(this.element.is(":visible")) return;
		var $this = this;
		containers[this.options.pos].show().prepend(this.element);
		var marginbottom = parseInt(this.element.css("margin-bottom"), 10);
		this.element.css({
			"opacity": 0,
			"margin-top": -1 * this.element.outerHeight(),
			"margin-bottom": 0
		}).

		animate({
			"opacity": 1,
			"margin-top": 0,
			"margin-bottom": marginbottom
		}, function() {

			if($this.options.timeout) {

				var closefn = function() {
					$this.close();
				};

				$this.timeout = setTimeout(closefn, $this.options.timeout);

				$this.element.hover(
					function() {
						clearTimeout($this.timeout);
					},
					function() {
						$this.timeout = setTimeout(closefn, $this.options.timeout);
					}
				);
			}

		});

		return this;
	};
	notify.prototype.close = function(instantly) {
		var $this = this,
			finalize = function() {
				$this.element.remove();

				if(!containers[$this.options.pos].children().length) {
					containers[$this.options.pos].hide();
				}

				$this.options.onClose.apply($this, []); //调用关闭事件
				//$this.element.trigger('close.uk.notify', [$this]);

				delete messages[$this.uuid];
			};

		if(this.timeout) clearTimeout(this.timeout);

		if(instantly) {
			finalize();
		} else {
			this.element.animate({
				"opacity": 0,
				"margin-top": -1 * this.element.outerHeight(),
				"margin-bottom": 0
			}, function() {
				finalize();
			});
		}
	};
	notify.prototype.content = function(html) {
		var container = this.element.find(">div");

		if(!html) {
			return container.html();
		}

		container.html(html);

		return this;
	};
	notify.prototype.status = function(status) {

		if(!status) {
			return this.currentstatus;
		}

		this.element.removeClass('ui-message-message-' + this.currentstatus).addClass('uk-notify-message-' + status);

		this.currentstatus = status;

		return this;
	}

	leeUI.Notify = function(options) {
		return(new notify(options)).show();
	};
	leeUI.Success = function(title, message, icon) {
		if(window.top != window && window.top.$.leeUI) {
			return window.top.leeUI.Success(title, message, icon);
		}
		return(new notify({
			status: "success",
			icon: "success",
			title: title,
			message: message
		})).show();
	};
	leeUI.Tip = function(title, message, icon) {
		if(window.top != window && window.top.$.leeUI) {
			return window.top.leeUI.Tip(title, message, icon);
		}
		return(new notify({
			status: "tip",
			title: title,
			icon: icon,
			message: message
		})).show();
	};
	leeUI.Tips = function(title, message, icon) {
		if(window.top != window && window.top.$.leeUI) {
			return window.top.leeUI.Tips(title, message, icon);
		}
		return(new notify({
			status: "tipblack",
			title: title,
			icon: icon,
			message: message
		})).show();
	};
	leeUI.Warning = function(title, message, icon) {
		if(window.top != window && window.top.$.leeUI) {
			return window.top.leeUI.Warning(title, message, icon);
		}
		icon = icon || "warn";
		return(new notify({
			status: "tip",
			title: title,
			icon: icon,
			message: message
		})).show();
	};
	leeUI.Error = function(title, message, icon) {
		if(window.top != window && window.top.$.leeUI) {
			return window.top.leeUI.Error(title, message, icon);
		}
		icon = icon || "error";
		return(new notify({
			status: "error",
			title: title,
			icon: icon,
			message: message
		})).show();
	};

}(jQuery, window));