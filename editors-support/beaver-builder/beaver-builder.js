jQuery(function($){
	if (window.FLBuilder !== undefined && FLBuilder._lightbox !== undefined && FLBuilder._lightbox.setContent !== undefined){
		console.log('fn changed');
		var oldSetContent = FLBuilder._lightbox.setContent.bind(FLBuilder._lightbox);
		FLBuilder._lightbox.setContent = function(content){
			oldSetContent(content);
			var $eform = jQuery(content).find('.cl-eform:not(.inited)');
			if ($eform.length != 0) new $cl.EForm($eform);
		}.bind(FLBuilder._lightbox);
	}
});
