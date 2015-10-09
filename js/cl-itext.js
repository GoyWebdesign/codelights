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
		this.dynamicColor = (data.dynamicColor || '');
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
			animate: this.animate.bind(this),
			postAnimate: this.postAnimate.bind(this)
		};
		// Preparing additional stuff
		if (this.type == 'replace') {
			this.$partsStates = [];
			for (var i = 0; i < this.parts.length; i++) {
				this.parts[i].empty().addClass('dynamic');
				this.$partsStates[i] = [];
				for (var j = 0; j < this.partsStates[i].length; j++) {
					// Checking if span for this state was already previously created
					var firstIndex = this.partsStates[i].indexOf(this.partsStates[i][j]);
					if (firstIndex < j) {
						this.$partsStates[i].push(this.$partsStates[i][firstIndex]);
					} else {
						var $partState = $('<span>' + this.partsStates[i][j] + '</span>');
						$partState.appendTo(this.parts[i]);
						$partState.data('width', $partState.width());
						if (j > 0) {
							$partState.addClass('part_hidden');
						} else {
							this.parts[i].css('width', $partState.data('width'));
						}
						this.$partsStates[i].push($partState);
					}
				}
				if ( ! this.parts[i].hasClass('changesat_0')) this.parts[i].removeClass('dynamic');
			}
		}
		// Start animation
		this.timer = setTimeout(this._events.animate, this.delay);
	};
	CLItext.prototype = {
		animate: function(){
			var nextState = (this.active == this.maxActive) ? 0 : (this.active + 1);
			if (this.type == 'replace') {
				for (var i = 0; i < this.parts.length; i++) {
					if (this.partsStates[i][this.active] == this.partsStates[i][nextState]){
						this.parts[i].removeClass('dynamic');
						continue;
					}
					this.parts[i].addClass('dynamic').css({
						width: this.$partsStates[i][nextState].data('width')
					});
					this.$partsStates[i][this.active].addClass('part_hidden');
					this.$partsStates[i][nextState].removeClass('part_hidden');
				}
				this.timer = setTimeout(this._events.postAnimate, this.duration);
			} else if (this.type == 'terminal') {
			} else if (this.type == 'shortest') {
			}
		},
		postAnimate: function(){
			this.active = (this.active == this.maxActive) ? 0 : (this.active + 1);
			this.timer = setTimeout(this._events.animate, this.delay);
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
