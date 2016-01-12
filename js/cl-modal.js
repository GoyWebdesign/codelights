!function($){
	"use strict";
	var CLModal = function(container){
		this.$body = $(document.body);
		this.$container = $(container);
		this.$trigger = this.$container.find('.cl-modal-trigger');
		this.triggerType = this.$trigger.clMod('type');
		if (this.triggerType == 'load') {
			var delay = this.$trigger.data('delay') || 2;
			setTimeout(this.show.bind(this), delay * 1000);
		} else {
			this.$trigger.on('click', this.show.bind(this));
		}
		this.$box = this.$container.find('.cl-modal-box');
		this.$overlay = this.$container.find('.cl-modal-overlay');
		this.$overlay.on('click', this.hide.bind(this));
	};
	CLModal.prototype = {
		show: function(){
			this.$overlay.appendTo(this.$body).show();
			this.$box.appendTo(this.$body).show();
		},
		hide: function(){
			this.$overlay.appendTo(this.$container).hide();
			this.$box.appendTo(this.$container).hide();
		}
	};
	$cl.elements['cl-modal'] = CLModal;
}(jQuery);
