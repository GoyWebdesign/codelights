!function($){
	"use strict";
	var CFlipbox = function(container){
		// Common dom elements
		this.$container = $(container);

		this.makeScalable({
			'.cl-flipbox-front': ['padding'],
			'.cl-flipbox-front-icon': ['width', 'height', 'line-height', 'font-size', 'border-width'],
			'.cl-flipbox-front-title': ['font-size', 'padding-top'],
			'.cl-flipbox-back': ['padding'],
			'.cl-flipbox-back-title': ['font-size'],
			'.cl-flipbox-back-text': ['font-size']
		});
	};
	CFlipbox.prototype = $cl.mutators.Scalable;
	$cl.elements['cl-flipbox'] = CFlipbox;
}(jQuery);
