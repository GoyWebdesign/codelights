/**
 * CodeLights: Interactive banner
 */
!function($){
	"use strict";
	var CLIb = function(container){
		// Common dom elements
		this.$container = $(container);
		this.makeHoverable();
	};
	$.extend(CLIb.prototype, $cl.mutators.Hoverable);
	$cl.elements['cl-ib'] = CLIb;
}(jQuery);
