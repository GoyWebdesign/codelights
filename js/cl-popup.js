/**
 * CodeLights: Modal Popup
 */
!function($){
	"use strict";
	var CLPopup = function(container){
		this.$body = $(document.body);
		this.$container = $(container);

		this._events = {
			show: this.show.bind(this),
			afterShow: this.afterShow.bind(this),
			hide: this.hide.bind(this),
			preventHide: function(e){
				e.stopPropagation();
			},
			afterHide: this.afterHide.bind(this)
		};

		// Event name for triggering CSS transition finish
		this.transitionEndEvent = (!!window.webkitURL) ? 'webkitTransitionEnd' : 'transitionend';

		this.$trigger = this.$container.find('.cl-popup-trigger');
		this.triggerType = this.$trigger.clMod('type');
		if (this.triggerType == 'load') {
			var delay = this.$trigger.data('delay') || 2;
			setTimeout(this.show.bind(this), delay * 1000);
		} else {
			this.$trigger.on('click', this._events.show);
		}
		this.$wrap = this.$container.find('.cl-popup-wrap');
		this.$box = this.$container.find('.cl-popup-box');
		this.$overlay = this.$container.find('.cl-popup-overlay');
		this.$wrap.on('click', this._events.hide);
		this.$box.on('click', this._events.preventHide);

		this.timer = null;
	};
	CLPopup.prototype = {
		show: function(){
			clearTimeout(this.timer);
			this.$overlay.appendTo(this.$body).show();
			this.$wrap.appendTo(this.$body).show();
			this.$body.addClass('with_cl_overlay');
			this.timer = setTimeout(this._events.afterShow, 25);
		},
		afterShow: function(){
			clearTimeout(this.timer);
			this.$overlay.addClass('active');
			this.$box.addClass('active');
		},
		hide: function(){
			clearTimeout(this.timer);
			this.$box.on(this.transitionEndEvent, this._events.afterHide);
			this.$overlay.removeClass('active');
			this.$box.removeClass('active');
			// Closing it anyway
			this.timer = setTimeout(this._events.afterHide, 1000);
		},
		afterHide: function(){
			clearTimeout(this.timer);
			this.$box.off(this.transitionEndEvent, this._events.afterHide);
			this.$overlay.appendTo(this.$container).hide();
			this.$wrap.appendTo(this.$container).hide();
			this.$body.removeClass('with_cl_overlay');
		}
	};
	if (window.$cl === undefined) window.$cl = {};
	if ($cl.elements === undefined) $cl.elements = {};
	$cl.elements['cl-popup'] = CLPopup;
	if ($cl.maybeInit !== undefined) $cl.maybeInit();
}(jQuery);
