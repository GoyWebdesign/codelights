/**
 * CodeLights: Interactive banner
 */
!function($){
	var CLIb = function(container){
		// Common dom elements
		this.$container = $(container);

	};
	CLIb.prototype = $cl.mutators.Scalable;
	$cl.elements['cl-ib'] = CLIb;
}(jQuery);
