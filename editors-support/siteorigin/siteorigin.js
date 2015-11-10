!function($){
	$(document).on('panels_setup', function(event, builderView){
		this.builderView = builderView;
		builderView.on('content_change display_builder', function(){
			$('.so-panels-dialog-wrapper').each(function(index, wrapper){
				var $wrapper = $(wrapper);
				if ($wrapper.data('cl-eform-inited')) return;
				$wrapper.data('view').on('form_loaded', function(){
					var $eform = $wrapper.find('.cl-eform');
					if ($eform.length > 0){
						new $cl.EForm($eform);
					}
				});
				$wrapper.data('cl-eform-inited', 1);
			});
		});
	});
}(jQuery);
