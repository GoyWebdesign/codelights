/**
 * CodeLights: Counter
 */
!function($){
	/**
	 * Counter Number part animations
	 * @param container
	 * @constructor
	 */
	var CLCounterNumber = function(container){
		this.$container = $(container);
		this.initialString = this.$container.html() + '';
		this.finalString = this.$container.data('final') + '';
		this.format = this.getFormat(this.initialString, this.finalString);
		var pattern;
		if (this.format.decMark) {
			pattern = new RegExp('[^0-9\\' + this.format.decMark + ']+');
		} else {
			pattern = new RegExp('[^0-9]+');
		}
		this.initial = window[this.format.decMark ? 'parseFloat' : 'parseInt'](this.initialString.replace(pattern, ''));
		this.final = window[this.format.decMark ? 'parseFloat' : 'parseInt'](this.finalString.replace(pattern, ''));
	};
	CLCounterNumber.prototype = {
		/**
		 * Function to be called at each animation frame
		 * @param now float Relative state between 0 and 1
		 */
		step: function(now){
			var value = (1 - now) * this.initial + this.final * now;
			if (!this.format.decMark) {
				value = Math.round(value);
			}
			this.$container.html(value);
		},
		/**
		 * Get number format based on initial and final number strings
		 * @param initial string
		 * @param final string
		 * @returns {{groupMark, decMark, accounting, zerofill, indian}}
		 */
		getFormat: function(initial, final){
			var iFormat = this._getFormat(initial),
				fFormat = this._getFormat(final),
			// Final format has more priority
				format = $.extend({}, iFormat, fFormat);
			// Group marks detector is more precise, so using it in controversial cases
			if (format.groupMark == format.decMark) delete format.groupMark;
			return format;
		},
		/**
		 * Get number format based on a single number string
		 * @param str string
		 * @returns {{groupMark, decMark, accounting, zerofill, indian}}
		 * @private
		 */
		_getFormat: function(str){
			var marks = str.replace(/[0-9\(\)\-]+/g, ''),
				format = {};
			if (str.charAt(0) == '(') format.accounting = true;
			if (/^0[0-9]/.test(str)) format.zerofill = true;
			str = str.replace(/[\(\)\-]/g, '');
			if (marks.length == 0) return format;
			if (marks.length > 1) {
				format.groupMark = marks.charAt(0);
				if (marks.charAt(0) != marks.charAt(marks.length - 1)) format.decMark = marks.charAt(marks.length - 1);
				if (!format.decMark && str.split(format.groupMark)[1].length == 2) format.indian = true;
			} else/*if (marks.length == 1)*/ {
				if (str.indexOf(marks) == 1) {
					format[(str.length == 5) ? 'groupMark' : 'decMark'] = marks;
				} else {
					format.groupMark = marks;
				}
			}
			if (format.decMark) {
				format.decNumber = str.length - str.indexOf(format.decMark) - 1;
			}
			return format;
		}
	};

	/**
	 * Counter Number part animations
	 * @param container
	 * @constructor
	 */
	var CLCounterText = function(container){
		this.$container = $(container);
		this.initial = this.$container.html() + '';
		this.final = this.$container.data('final') + '';
		this.states = this.getStates(this.initial, this.final);
		this.len = 1 / (this.states.length - 1);
		// Text value won't be changed on each frame, so we'll update it only on demand
		this.curState = 0;
		this.duration = parseInt(this.$container.data('duration') || 10000);
	};
	CLCounterText.prototype = {
		/**
		 * Function to be called at each animation frame
		 * @param now float Relative state between 0 and 1
		 */
		step: function(now){
			var state = Math.round(Math.max(0, now / this.len));
			if (state == this.curState) return;
			this.$container.html(this.states[state]);
			this.curState = state;
		},
		/**
		 * Slightly modified Wagner-Fischer algorithm to obtain the shortest edit distance with intermediate states
		 * @param initial string The initial string
		 * @param final string The final string
		 * @returns {Array}
		 * @private
		 */
		getStates: function(initial, final){
			var dist = [],
				i, j;
			for (i = 0; i <= initial.length; i++) dist[i] = [i];
			for (j = 1; j <= final.length; j++) {
				dist[0][j] = j;
				for (i = 1; i <= initial.length; i++) {
					dist[i][j] = (initial[i - 1] === final[j - 1]) ? dist[i - 1][j - 1] : (Math.min(dist[i - 1][j], dist[i][j - 1], dist[i - 1][j - 1]) + 1);
				}
			}
			// Obtaining the intermediate states
			var states = [final],
				posDiff = 0;
			for (i = initial.length, j = final.length; i > 0 || j > 0; i--, j--) {
				var min = dist[i][j];
				if (i > 0) min = Math.min(min, dist[i - 1][j], (j > 0) ? dist[i - 1][j - 1] : min);
				if (j > 0) min = Math.min(min, dist[i][j - 1]);
				if (min >= dist[i][j]) continue;
				if (min == dist[i][j - 1]) {
					// Remove
					states.unshift(states[0].substring(0, j - 1) + states[0].substring(j));
					i++;
				} else if (min == dist[i - 1][j - 1]) {
					// Modify
					states.unshift(states[0].substring(0, j - 1) + initial[i - 1] + states[0].substring(j));
				} else if (min == dist[i - 1][j]) {
					// Insert
					states.unshift(states[0].substring(0, j) + initial[i - 1] + states[0].substring(j));
					j++;
				}
			}
			return states;
		}
	};

	/**
	 *
	 * @param container
	 * @constructor
	 */
	var CLCounter = function(container){
		// Commonly used DOM elements
		this.$container = $(container);
		this.parts = [];
		this.duration = this.$container.data('duration') || 2000;
		this.$container.find('.cl-counter-text-part').each(function(index, part){
			var $part = $(part);
			// Skipping the ones that won't be changed
			if ($part.html() + '' == $part.data('final') + '') return;
			var type = $part.cssMod('type');
			if (type == 'number') {
				this.parts.push(new CLCounterNumber($part));
			} else {
				this.parts.push(new CLCounterText($part));
			}
		}.bind(this));
		if (window.$cl !== undefined && window.$cl.scroll !== undefined){
			// Animate element when it becomes visible
			$cl.scroll.addWaypoint(this.$container, '15%', this.animate.bind(this));
		}else{
			// No waypoints available: animate right from the start
			this.animate();
		}
	};
	CLCounter.prototype = {
		animate: function(duration){
			this.$container.css('cl-counter', 0).animate({'cl-counter': 1}, {
				duration: this.duration,
				step: this.step.bind(this)
			});
		},
		/**
		 * Function to be called at each animation frame
		 * @param now float Relative state between 0 and 1
		 */
		step: function(now){
			for (var i = 0; i < this.parts.length; i++) {
				this.parts[i].step(now);
			}
		}
	};
	$.fn.clCounter = function(){
		this.each(function(index, container){
			$(container).data('clCounter', new CLCounter(container));
		});
	};
	$(function(){
		$('.cl-counter').clCounter();
	});
}(jQuery);
