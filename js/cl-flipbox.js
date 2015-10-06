!function($){
	"use strict";
	var CLFlipbox = function(container){
		// Common dom elements
		this.$container = $(container);
		this.$front = this.$container.find('.cl-flipbox-front');
		this.$frontH = this.$container.find('.cl-flipbox-front-h');
		this.$back = this.$container.find('.cl-flipbox-back');
		this.$backH = this.$container.find('.cl-flipbox-back-h');

		// For diagonal cube animations height should equal width (heometrical restriction)
		var animation = this.$container.cssMod('animation'),
			direction = this.$container.cssMod('direction');
		this.forceSquare = (animation == 'cubeflip' && ['ne', 'se', 'sw', 'nw'].indexOf(direction) != -1);

		// Container height is determined by the maximum content height
		this.autoSize = (container.style.height == '' && ! this.forceSquare);

		// Content is centered
		this.centerContent = (this.$container.cssMod('valign') == 'center');

		this._events = {
			resize: this.resize.bind(this)
		};
		if (this.centerContent || this.autoSize) {
			this.padding = parseInt(this.$front.css('padding-top'));
		}
		if (this.centerContent || this.forceSquare || this.autoSize) {
			$(window).bind('resize load', this._events.resize);
			this.resize();
		}
	};
	CLFlipbox.prototype = {
		resize: function(){
			var width = this.$container.width(),
				height;
			if (this.autoSize || this.centerContent){
				var frontContentHeight = this.$frontH.height(),
					backContentHeight = this.$backH.height();
			}
			// Changing the whole container height
			if (this.forceSquare || this.autoSize){
				height = this.forceSquare ? width : (Math.max(frontContentHeight, backContentHeight) + 2 * this.padding);
				this.$front.css('height', height + 'px');
			}else{
				height = this.$container.height();
			}
			if (this.centerContent) {
				this.$front.css('padding-top', Math.max(this.padding, (height - frontContentHeight) / 2));
				this.$back.css('padding-top', Math.max(this.padding, (height - backContentHeight) / 2));
			}
		}
	};
	$cl.elements['cl-flipbox'] = CLFlipbox;
}(jQuery);
