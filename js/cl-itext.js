/**
 * CodeLights: Interactive Text
 */
!function($){
	var CLItext = function(container){
		this.$container = $(container);
		var data = this.$container[0].onclick() || {};
		this.$container.removeAttr('onclick');
		this.type = this.$container.cssMod('type');
		this.duration = parseInt(data.duration) || 1000;
		this.delay = parseInt(data.delay) || 5000;
		this.$parts = this.$container.find('.cl-itext-part');
		if (this.$parts.length == 0) return; // No animated parts
		this.parts = [];
		this.partsStates = []; // part index => text states
		this.animateParts = []; // animation index => animated parts indexes
		this.$parts.each(function(partIndex, part){
			this.parts[partIndex] = $(part);
			this.partsStates[partIndex] = part.onclick() || [];
			this.parts[partIndex].removeAttr('onclick');
			$.map(part.className.match(/changesat_[0-9]+/g), function(elm){
				var animIndex = parseInt(elm.replace('changesat_', ''));
				if (this.animateParts[animIndex] === undefined) this.animateParts[animIndex] = [];
				this.animateParts[animIndex].push(partIndex);
			}.bind(this));
		}.bind(this));
		this.active = 0;
		this.maxActive = this.partsStates[0].length - 1;
		this._events = {
			preAnimate: this.preAnimate.bind(this),
			animate: this.animate.bind(this),
			postAnimate: this.postAnimate.bind(this)
		};
		// Start animation
		this.preAnimate();
	};
	CLItext.prototype = {
		preAnimate: function(){
			// Adding animation classes to the part that will change
			if (this.animateParts[this.active] === undefined) return;
			for (var i = 0; i < this.animateParts[this.active].length; i++) {
				this.parts[this.animateParts[this.active][i]].addClass('animated');
			}
			this.timer = setTimeout(this._events.animate, this.delay / 2);
		},
		animate: function(){
			var nextState = (this.active == this.maxActive) ? 0 : (this.active + 1);
			if (this.type == 'replace'){
				this.timer = setTimeout(function(){
					for (var i = 0; i < this.animateParts[this.active].length; i++){
						var partIndex = this.animateParts[this.active][i],
							newValue = this.partsStates[partIndex][nextState];
						this.parts[partIndex].html(newValue);
					}
					this.active = nextState;
					this.timer = setTimeout(this._events.postAnimate, this.duration / 2 + this.delay / 2);
				}.bind(this), this.duration / 2);
			}else if (this.type == 'terminal'){
			}else if (this.type == 'shortest'){
			}
		},
		postAnimate: function(){
			this.$parts.removeClass('animated');
			this.preAnimate();
		}
	};
	$.fn.clItext = function(){
		this.each(function(index, container){
			$(container).data('clItext', new CLItext(container));
		});
	};
	$(function(){
		$('.cl-itext').clItext();
	});
}(jQuery);
