!function($){
	if ($cl.isMobile) return;
	"use strict";
	var $wpOverlay = $('.wp-full-overlay'),
		$customizer = $('#customize-controls');
	$customizer.on('click keydown', '.accordion-section-title, .customize-section-back, .customize-panel-back', function(event){
		// Analog of backbone's isKeydownButNotEnterEvent function
		if ('keydown' === event.type && 13 !== event.which) return;
		var $this = $(this),
			inWidgets = ($this.hasClass('accordion-section-title') && ($this.closest('#accordion-panel-widgets > .accordion-sub-container').length > 0));
		$wpOverlay.toggleClass('wide', inWidgets);
	});
}(jQuery);
