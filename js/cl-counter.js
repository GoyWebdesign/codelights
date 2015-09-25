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
		this.textEditPaths = {};
		this.$container.find('.cl-counter-text-part').each(function(index, part){
			this.$parts[index] = $(part);
			this.now[index] = this.initials[index] = this.$parts[index].html() + '';
			this.finals[index] = this.$parts[index].data('final') + '';
			if (this.initials[index] == this.finals[index]) return;
			this.types[index] = this.$parts[index].cssMod('type');
			if (this.types[index] == 'number') {
				this.numberFormats[index] = this.getFormat(this.initials[index], this.finals[index]);
			} else if (this.types[index] == 'text') {
				this.textEditPaths[index] = this.getTextEditPath(this.initials[index], this.finals[index]);
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
		 * Slightly modified Wagner-Fischer algorithm to obtain the shortest edit distance with certain actions
		 * @param initial string The initial string
		 * @param final string The final string
		 * @returns {Array}
		 * @private
		 */
		getTextEditPath: function(initial, final){
			var dist = [],
				i, j;
			for (i = 0; i <= initial.length; i++) dist[i] = [i];
			for (j = 1; j <= final.length; j++) {
				dist[0][j] = j;
				for (i = 1; i <= initial.length; i++) {
					dist[i][j] = (initial[i - 1] === final[j - 1]) ? dist[i - 1][j - 1] : (Math.min(dist[i - 1][j], dist[i][j - 1], dist[i - 1][j - 1]) + 1);
				}
			}
			// Obtaining the list of the optimal actions
			var _actions = [];
			for (i = initial.length, j = final.length; i > 0 || j > 0;) {
				var min = Math.min.apply(Math, [dist[i - 1][j - 1], dist[i - 1][j], dist[i][j - 1]].filter(function(n){ return n != undefined; })),
					type = '';
				if (min < dist[i][j]) {
					type = 'M'; // Modify by default
					if (min == dist[i][j - 1]) {
						type = 'I'; // Insert
					} else if (min == dist[i - 1][j]) {
						type = 'R'; // Remove
					}
					_actions.unshift([type, i, j]);
				}
				if (type != 'I') i--;
				if (type != 'R') j--;
			}
			// Preparing a more detailed step-by-step guide
			var posDiff = 0,
				actions = [];
			for (i = 0; i < _actions.length; i++) {
				var pos = _actions[i][1] + posDiff + (_actions[i][0] != 'I' ? -1 : 0);
				actions[i] = [_actions[i][0], pos];
				if (_actions[i][0] != 'R') actions[i][2] = final.charAt(_actions[i][2] - 1);
				if (_actions[i][0] == 'R') posDiff--;
				if (_actions[i][0] == 'I') posDiff++;
			}
			return actions;
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
