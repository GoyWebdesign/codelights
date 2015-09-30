/**
 * CodeLights: Interactive Text
 */
!function($){
	var CLItext = function(container){
		this.$container = $(container);
		var data = this.$container[0].onclick() || {};
		this.texts = data.texts;
		if (this.texts === undefined || ! this.texts instanceof Array) return;
		// Getting the actual string parts
		var parts = [];
		for (var i = 0; i < this.texts.length; i++){
			parts[i] = this.texts[i].match(/(\w+|[^\w]+)/g);
		}
	};
	CLItext.prototype = {};
	$.fn.clItext = function(){
		this.each(function(index, container){
			$(container).data('clItext', new CLItext(container));
		});
	};
	$(function(){
		$('.cl-itext').clItext();
	});
}(jQuery);
