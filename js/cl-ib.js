/**
 * CodeLights: Interactive banner
 */
!function($){
	var CLIb = function(container){
		// Common dom elements
		this.$container = $(container);
		// Some of the elements' properties cannot be set by percents, so we're checking: if they are set in pixels
		// initially, we'll resize them based on banner's new width.
		var scalableElms = ['.cl-ib-overlay', '.cl-ib-content', '.cl-ib-title', '.cl-ib-text', '.cl-ib-icon', '.cl-btn'],
			scalableProps = ['font-size', 'border-width', 'border-radius', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
		this.scalables = {};
		for (var i = 0; i < scalableElms.length; i++) {
			var selector = scalableElms[i],
				$elm = this.$container.find(selector);
			for (var j = 0; j < scalableProps.length; j++) {
				var prop = scalableProps[j],
					baseValue = $elm.css(prop);
				if (typeof baseValue == 'string' && baseValue.substring(baseValue.length - 2) == 'px' && parseInt(baseValue) != 0) {
					// Found some resizable property
					if (this.scalables[selector] === undefined) this.scalables[selector] = {$elm: $elm};
					this.scalables[selector][prop] = parseInt(baseValue);
				}
			}
		}
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
			for (var selector in this.scalables){
				if ( ! this.scalables.hasOwnProperty(selector)) continue;
				for (var prop in this.scalables[selector]){
					if ( ! this.scalables[selector].hasOwnProperty(prop)) continue;
					this.scalables[selector].$elm.css(prop, this.scalables[selector][prop] * scale);
				}
			}
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
