/**
 * CodeLights: Interactive banner
 */
!function($){
	"use strict";
	var CLIb = function(container){
		// Common dom elements
		this.$container = $(container);
		this.enableTouchHover();
	};
	$.extend(CLIb.prototype, $cl.mutators.TouchHover);
	$cl.elements['cl-ib'] = CLIb;
}(jQuery);
