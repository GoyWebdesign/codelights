/**
 * CodeLights: Counter
 */
!function($){
	var CLCounter = function(container){
		// Commonly used DOM elements
		this.$container = $(container);

		this.now = [];
		this.types = [];
		this.$parts = [];
		this.initials = [];
		this.finals = [];
		this.numberFormats = {};
		this.textStates = {};
		this.$container.find('.cl-counter-text-part').each(function(index, part){
			this.$parts[index] = $(part);
			this.now[index] = this.initials[index] = this.$parts[index].html() + '';
			this.finals[index] = this.$parts[index].data('final') + '';
			if (this.initials[index] == this.finals[index]) return;
			this.types[index] = this.$parts[index].cssMod('type');
			if (this.types[index] == 'number') {
				this.numberFormats[index] = this.getFormat(this.initials[index], this.finals[index]);
			} else if (this.types[index] == 'text') {
				this.textStates[index] = this.getTextStates(this.initials[index], this.finals[index]);
			}
		}.bind(this));
	};
	CLCounter.prototype = {

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
			// Group marks detector is more precise, so using it in controversary cases
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
			return format;
		},
		/**
		 * Slightly modified Wagner-Fischer algorithm to obtain the shortest edit distance with intermediate states
		 * @param initial string The initial string
		 * @param final string The final string
		 * @returns {Array}
		 * @private
		 */
		getTextStates: function(initial, final){
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
				if (i > 0) min = Math.min(min, dist[i - 1][j], dist[i - 1][j - 1] || min);
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
	$.fn.clCounter = function(){
		this.each(function(index, container){
			$(container).data('clCounter', new CLCounter(container));
		});
	};
	$(function(){
		$('.cl-counter').clCounter();
	});
}(jQuery);
