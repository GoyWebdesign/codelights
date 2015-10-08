/**
 * CodeLights: Interactive banner
 */
!function($){
	var CLIb = function(container){
		// Common dom elements
		this.$container = $(container);

		this.makeScalable({
			'.cl-ib-content': ['border-width', 'padding'],
			'.cl-ib-title': ['font-size'],
			'.cl-ib-text': ['font-size']
		});
	};
	CLIb.prototype = $cl.mutators.Scalable;
	$cl.elements['cl-ib'] = CLIb;
}(jQuery);
