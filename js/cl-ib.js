/**
 * CodeLights: Interactive banner
 */
!function($){
	var CLIb = function(container){
		// Common dom elements
		this.$container = $(container);
		this.$title = this.$container.find('.cl-ib-title');
		this.$icon = this.$container.find('.cl-ib-icon');
		this.$text = this.$container.find('.cl-ib-text');
		this.$button = this.$container.find('.cl-ib-button');
		this.titleSize = parseFloat(this.$container.data('title_size')) / 100;
		this.textSize = parseFloat(this.$container.data('text_size')) / 100;
		// None of the resizes bound
		if (!this.titleSize && !this.textSize) return this;
		// Events
		this._events = {
			resize: this.resize.bind(this)
		};
		$(window).on('resize', this._events.resize);
		this.resize();
	};
	CLIb.prototype = {
		resize: function(){
			var width = this.$container.width();
			if (this.$title.length) this.$title.css('font-size', width * this.titleSize);
			if (this.$icon.length) this.$icon.css('font-size', width * this.titleSize);
			if (this.$text.length) this.$text.css('font-size', width * this.textSize);
			if (this.$button.length) this.$button.css('font-size', width * this.textSize);
		}
	};
	$.fn.clIb = function(){
		this.each(function(index, container){
			$(container).data('clIb', new CLIb(container));
		});
	};
	$(function(){
		$('.cl-ib').clIb();
	});
}(jQuery);
