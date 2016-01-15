!function($){
	"use strict";
	var CLModal = function(container){
		this.$body = $(document.body);
		this.$container = $(container);
		this.$trigger = this.$container.find('.cl-modal-trigger');
		this.triggerType = this.$trigger.clMod('type');
		if (this.triggerType == 'load') {
			var delay = this.$trigger.data('delay') || 2;
			setTimeout(this.show.bind(this), delay * 1000);
		} else {
			this.$trigger.on('click', this.show.bind(this));
		}
		this.$box = this.$container.find('.cl-modal-box');
		this.$overlay = this.$container.find('.cl-modal-overlay');
		this.$overlay.on('click', this.hide.bind(this));

		this.timer = null;
		this._events = {
			afterShow: this.afterShow.bind(this),
			afterHide: this.afterHide.bind(this)
		};
	};
	CLModal.prototype = {
		show: function(){
			clearTimeout(this.timer);
			this.$overlay.appendTo(this.$body).show().removeClass('active');
			this.$box.appendTo(this.$body).show().removeClass('active');
			this.timer = setTimeout(this._events.afterShow, 25);
		},
		afterShow: function(){
			clearTimeout(this.timer);
			this.$overlay.addClass('active');
			this.$box.addClass('active');
		},
		hide: function(){
			clearTimeout(this.timer);
			var transitionEndEvent = (!!window.webkitURL) ? 'webkitTransitionEnd' : 'transitionend';
			this.$box.one(transitionEndEvent, this._events.afterHide);
			this.$overlay.removeClass('active');
			this.$box.removeClass('active');
			// Closing it anyway
			this.timer = setTimeout(this._events.afterHide, 1000);
		},
		afterHide: function(){
			clearTimeout(this.timer);
			this.$overlay.appendTo(this.$container).hide();
			this.$box.appendTo(this.$container).hide();
		}
	};
	$cl.elements['cl-modal'] = CLModal;
}(jQuery);
