/**
 * CodeLights: Modal Popup
 */
!function($){
	"use strict";
	var CLPopup = function(container){
		this.$window = $(window);
		this.$html = $(document.documentElement);
		this.$body = $(document.body);
		this.$container = $(container);

		this._events = {
			show: this.show.bind(this),
			afterShow: this.afterShow.bind(this),
			hide: this.hide.bind(this),
			preventHide: function(e){
				e.stopPropagation();
			},
			afterHide: this.afterHide.bind(this),
			resize: this.resize.bind(this),
			keypress: function(e){
				if (e.keyCode == 27) this.hide();
			}.bind(this)
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
		this.$container.find('.cl-popup-closer, .cl-popup-box-closer').on('click', this._events.hide);
		this.$wrap.on('click', this._events.hide);
		this.$box.on('click', this._events.preventHide);
		this.size = this.$box.clMod('size');

		this.timer = null;
	};
	CLPopup.prototype = {
		show: function(){
			clearTimeout(this.timer);
			this.htmlHasScrollbar = (document.documentElement.scrollHeight > document.documentElement.clientHeight);
			this.$overlay.appendTo(this.$body).show();
			this.$wrap.appendTo(this.$body).show();
			if (this.size != 'f') {
				this.resize();
			}
			this.$body.on('keypress', this._events.keypress);
			this.timer = setTimeout(this._events.afterShow, 25);
		},
		afterShow: function(){
			clearTimeout(this.timer);
			this.$overlay.addClass('active');
			this.$box.addClass('active');
			if (this.size != 'f') {
				this.$window.on('resize', this._events.resize);
			}
			// UpSolution Themes Compatibility
			if (window.$us !== undefined && $us.canvas !== undefined && $us.canvas.$container !== undefined){
				$us.canvas.$container.trigger('contentChange');
			}
		},
		hide: function(){
			clearTimeout(this.timer);
			if (this.size != 'f') {
				this.$window.off('resize', this._events.resize);
			}
			this.$body.off('keypress', this._events.keypress);
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
			if (this.htmlHasScrollbar) {
				this.$html.removeClass('cl_overlay_scroll');
			}
		},
		resize: function(){
			var animation = this.$box.clMod('animation'),
				isActive = this.$box.hasClass('active'),
				padding = parseInt(this.$box.css('padding-top')),
				winHeight = this.$window.height(),
				popupHeight = this.$box.height();
			if (this.htmlHasScrollbar) {
				this.$html.toggleClass('cl_overlay_scroll', winHeight <= popupHeight);
			}
			this.$box.css('top', Math.max(0, (winHeight - popupHeight) / 2 - padding));
		}
	};
	if (window.$cl === undefined) window.$cl = {};
	if ($cl.elements === undefined) $cl.elements = {};
	$cl.elements['cl-popup'] = CLPopup;
	if ($cl.maybeInit !== undefined) $cl.maybeInit();
}(jQuery);
