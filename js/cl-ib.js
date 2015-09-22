/**
 * CodeLights: Interactive banner
 */
!function($){
	var CLIb = function(container){
		// Common dom elements
		this.$container = $(container);
		this.$helper = this.$container.find('.cl-ib-h');
		// Events
		this._events = {
			resize: this.resize.bind(this)
		};
		$(window).on('resize', this._events.resize);
		this.resize();
	};
	CLIb.prototype = {
		resize: function(){
			var width = this.$container.width(),
				scale = width / 300;
			this.$helper.css({
				'-webkit-transform': 'scale('+scale+')',
				transform: 'scale('+scale+')'
			});
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
