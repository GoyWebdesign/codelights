/**
 * CodeLights: Interactive banner
 */
!function($){
	var CLIb = function(container){
		// Common dom elements
		this.$container = $(container);

	};
	$.extend(CLIb.prototype, $cl.mutators.TouchHover);
	$cl.elements['cl-ib'] = CLIb;
}(jQuery);
